'use client';

import { useState, useEffect, useRef, useCallback, use } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, AlertCircle, CheckCircle2, Clock } from 'lucide-react';

interface Question { text: string; options: string[]; }

export default function TakeExamPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [title, setTitle] = useState('');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [deadline, setDeadline] = useState<Date | null>(null);
  const [remainingSeconds, setRemainingSeconds] = useState(0);
  const [current, setCurrent] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const submittingRef = useRef(false);
  const heartbeatRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const doSubmit = useCallback(async () => {
    if (submittingRef.current) return;
    submittingRef.current = true;
    setSubmitting(true);
    try {
      await fetch(`/api/student/exams/${id}/submit`, { method: 'POST' });
    } finally {
      setSubmitted(true);
      setSubmitting(false);
      if (heartbeatRef.current) clearInterval(heartbeatRef.current);
      if (tickRef.current) clearInterval(tickRef.current);
    }
  }, [id]);

  // Start / resume attempt
  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/student/exams/${id}/start`, { method: 'POST' });
        const data = await res.json();
        if (!res.ok) { setError(data.error ?? 'Could not start exam'); return; }
        setTitle(data.title);
        setQuestions(data.questions ?? []);
        setAnswers(data.answers ?? []);
        setDeadline(new Date(data.deadline));
      } catch {
        setError('Network error. Please check your connection and reload.');
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  // Heartbeat — also reconciles the deadline if a disconnect gap gets credited server-side
  useEffect(() => {
    if (!deadline || submitted) return;
    heartbeatRef.current = setInterval(async () => {
      try {
        const res = await fetch(`/api/student/exams/${id}/heartbeat`, { method: 'POST' });
        const data = await res.json();
        if (data.status === 'auto_submitted') {
          setSubmitted(true);
          if (heartbeatRef.current) clearInterval(heartbeatRef.current);
          if (tickRef.current) clearInterval(tickRef.current);
          return;
        }
        if (data.deadline) setDeadline(new Date(data.deadline));
      } catch {
        // offline — will retry on next tick, gap gets credited once connection returns
      }
    }, 15000);
    return () => { if (heartbeatRef.current) clearInterval(heartbeatRef.current); };
  }, [id, deadline, submitted]);

  // Countdown display + auto-submit at deadline (server also enforces this independently)
  useEffect(() => {
    if (!deadline || submitted) return;
    tickRef.current = setInterval(() => {
      const secs = Math.max(0, Math.floor((deadline.getTime() - Date.now()) / 1000));
      setRemainingSeconds(secs);
      if (secs <= 0) doSubmit();
    }, 1000);
    return () => { if (tickRef.current) clearInterval(tickRef.current); };
  }, [deadline, submitted, doSubmit]);

  const selectAnswer = async (qIndex: number, oIndex: number) => {
    setAnswers((a) => a.map((v, i) => (i === qIndex ? oIndex : v)));
    try {
      await fetch(`/api/student/exams/${id}/answer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ questionIndex: qIndex, optionIndex: oIndex }),
      });
    } catch {
      // autosave failed silently — will retry via heartbeat reconnect; answer stays in local state
    }
  };

  const answeredCount = answers.filter((a) => a != null).length;
  const mm = String(Math.floor(remainingSeconds / 60)).padStart(2, '0');
  const ss = String(remainingSeconds % 60).padStart(2, '0');

  if (loading) {
    return <div className="flex items-center justify-center py-24 text-slate-500 gap-2"><Loader2 size={20} className="animate-spin" /> Loading exam…</div>;
  }

  if (error) {
    return (
      <div className="max-w-md mx-auto py-24 text-center">
        <AlertCircle size={40} className="text-red-400 mx-auto mb-4" />
        <p className="text-white font-bold">{error}</p>
        <button onClick={() => router.push('/portals/dashboard/student/exams')} className="mt-6 text-sky-400 font-semibold text-sm hover:underline">
          Back to Exams
        </button>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="max-w-md mx-auto py-24 text-center">
        <CheckCircle2 size={48} className="text-emerald-400 mx-auto mb-5" />
        <h2 className="text-xl font-black text-white">Submitted successfully.</h2>
        <p className="text-slate-400 mt-2">Good luck in your result.</p>
        <button onClick={() => router.push('/portals/dashboard/student/exams')} className="mt-8 bg-sky-600 hover:bg-sky-500 text-white px-6 py-2.5 rounded-xl text-sm font-bold transition-all active:scale-95">
          Back to Exams
        </button>
      </div>
    );
  }

  const q = questions[current];

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-16">
      {/* Sticky timer header */}
      <div className="sticky top-0 z-30 bg-[#0a1628]/95 backdrop-blur-xl -mx-5 md:-mx-8 px-5 md:px-8 py-4 border-b border-white/10 flex items-center justify-between">
        <div className="min-w-0">
          <h1 className="font-bold text-white text-sm truncate">{title}</h1>
          <p className="text-slate-500 text-xs">{answeredCount}/{questions.length} answered</p>
        </div>
        <div className={`flex items-center gap-2 px-4 py-2 rounded-xl font-mono font-bold text-sm shrink-0 ${remainingSeconds < 60 ? 'bg-red-500/15 text-red-400 border border-red-500/25' : 'bg-sky-500/15 text-sky-300 border border-sky-500/25'}`}>
          <Clock size={15} /> {mm}:{ss}
        </div>
      </div>

      {/* Question nav dots */}
      <div className="flex flex-wrap gap-1.5">
        {questions.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`w-7 h-7 rounded-lg text-[11px] font-bold transition-all ${
              i === current ? 'bg-sky-500 text-white' :
              answers[i] != null ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
              'bg-white/5 text-slate-500 border border-white/10'
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>

      {q && (
        <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-6">
          <p className="text-xs font-bold text-sky-400 mb-2">Question {current + 1} of {questions.length}</p>
          <p className="text-white font-semibold mb-5">{q.text}</p>
          <div className="space-y-2.5">
            {q.options.map((opt, oi) => (
              <button
                key={oi}
                onClick={() => selectAnswer(current, oi)}
                className={`w-full text-left px-4 py-3 rounded-xl border transition-all text-sm font-medium ${
                  answers[current] === oi
                    ? 'bg-sky-500/15 border-sky-500/40 text-white'
                    : 'bg-white/[0.02] border-white/10 text-slate-300 hover:bg-white/[0.05]'
                }`}
              >
                <span className="font-bold text-sky-400 mr-2">{String.fromCharCode(65 + oi)}.</span>{opt}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="flex items-center justify-between gap-3">
        <button
          onClick={() => setCurrent((c) => Math.max(0, c - 1))}
          disabled={current === 0}
          className="px-4 py-2.5 rounded-xl text-sm font-bold text-slate-400 bg-white/5 hover:bg-white/10 disabled:opacity-30"
        >
          Previous
        </button>
        {current < questions.length - 1 ? (
          <button
            onClick={() => setCurrent((c) => Math.min(questions.length - 1, c + 1))}
            className="px-4 py-2.5 rounded-xl text-sm font-bold text-white bg-white/10 hover:bg-white/15"
          >
            Next
          </button>
        ) : (
          <button
            onClick={doSubmit}
            disabled={submitting}
            className="px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 flex items-center gap-2"
          >
            {submitting ? <Loader2 size={15} className="animate-spin" /> : null} Submit Exam
          </button>
        )}
      </div>
    </div>
  );
}
