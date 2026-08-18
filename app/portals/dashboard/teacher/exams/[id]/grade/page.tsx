'use client';

import { useState, useEffect, useCallback, use } from 'react';
import Link from 'next/link';
import { ChevronLeft, Loader2, ChevronDown, ChevronUp, Save, CheckCircle, AlertCircle, Circle } from 'lucide-react';

interface Question { text: string; options: string[]; correctIndex: number; }
interface Attempt {
  _id: string;
  student: { _id: string; firstName: string; lastName: string; studentId: string; currentClass: string };
  answers: (number | null)[];
  status: string;
  correctCount?: number;
  objectiveScore?: number;
}
interface NotStarted { _id: string; firstName: string; lastName: string; studentId: string; }

export default function GradeExamPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [examMeta, setExamMeta] = useState<{ title: string; subject: string; questions: Question[]; objectiveCount: number; theoryMaxScore: number } | null>(null);
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [notStarted, setNotStarted] = useState<NotStarted[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);

  const [term, setTerm] = useState('1st Term');
  const [termSession, setTermSession] = useState('2025/2026');
  const [theoryScores, setTheoryScores] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState<string | null>(null);
  const [saveMsg, setSaveMsg] = useState<Record<string, string>>({});

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/teacher/exams/${id}/attempts`);
      const data = await res.json();
      if (res.ok) {
        setExamMeta(data.exam);
        setAttempts(data.attempts ?? []);
        setNotStarted(data.notStarted ?? []);
      }
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const saveTheoryAndTotal = async (attempt: Attempt) => {
    if (!examMeta) return;
    const studentId = attempt.student._id;
    const theoryScore = Number(theoryScores[attempt._id] ?? 0);
    setSaving(attempt._id);
    setSaveMsg((m) => ({ ...m, [attempt._id]: '' }));
    try {
      // Load any existing result for this term/session so other subjects aren't wiped
      const existingRes = await fetch(`/api/teacher/results/${studentId}?term=${encodeURIComponent(term)}&session=${encodeURIComponent(termSession)}`).catch(() => null);
      const existing = existingRes && existingRes.ok ? await existingRes.json() : null;
      const existingSubjects = (existing?.result?.subjects ?? []).filter((s: any) => s.subjectName !== examMeta.subject);

      const subjectEntry = {
        subjectName: examMeta.subject,
        test1: 0, test2: 0, test3: 0,
        isCbt: true,
        cbtExamId: id,
        objectiveScore: attempt.objectiveScore ?? 0,
        theoryScore,
        theoryMaxScore: examMeta.theoryMaxScore,
      };

      const res = await fetch('/api/teacher/save-result', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId,
          term,
          session: termSession,
          subjects: [...existingSubjects, subjectEntry],
        }),
      });
      const data = await res.json();
      if (!res.ok) { setSaveMsg((m) => ({ ...m, [attempt._id]: data.error ?? 'Failed to save' })); return; }
      setSaveMsg((m) => ({ ...m, [attempt._id]: 'Saved to result.' }));
    } catch {
      setSaveMsg((m) => ({ ...m, [attempt._id]: 'Network error.' }));
    } finally {
      setSaving(null);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center py-24 text-slate-500 gap-2"><Loader2 size={20} className="animate-spin" /> Loading…</div>;
  }
  if (!examMeta) {
    return <div className="p-10 text-center text-slate-400">Exam not found.</div>;
  }

  return (
    <div className="max-w-4xl space-y-6 pb-16">
      <Link href="/portals/dashboard/teacher/exams" className="flex items-center gap-2 text-slate-500 hover:text-white text-sm font-medium w-fit transition-colors">
        <ChevronLeft size={16} /> Back to Exams
      </Link>

      <div>
        <h1 className="text-2xl font-black text-white">Grading — {examMeta.title}</h1>
        <p className="text-slate-400 text-sm mt-1">{examMeta.subject} — objective auto-graded /30, theory entered manually /{examMeta.theoryMaxScore}</p>
      </div>

      <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-4 flex flex-wrap gap-4 items-center">
        <div>
          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Term</label>
          <select value={term} onChange={(e) => setTerm(e.target.value)} className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white">
            <option>1st Term</option><option>2nd Term</option><option>3rd Term</option>
          </select>
        </div>
        <div>
          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Session</label>
          <input value={termSession} onChange={(e) => setTermSession(e.target.value)} className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white w-32" />
        </div>
        <p className="text-xs text-slate-500 ml-auto">This subject&apos;s score in the report card will be replaced by objective + theory (+ any tests you enter separately).</p>
      </div>

      {attempts.length === 0 ? (
        <div className="py-16 text-center rounded-2xl border border-dashed border-white/10 bg-white/[0.02]">
          <p className="text-slate-400 font-semibold">No submissions yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {attempts.map((a) => {
            const isOpen = expanded === a._id;
            const submitted = a.status === 'submitted' || a.status === 'auto_submitted';
            return (
              <div key={a._id} className="bg-white/[0.03] border border-white/[0.07] rounded-2xl overflow-hidden">
                <button onClick={() => setExpanded(isOpen ? null : a._id)} className="w-full flex items-center justify-between gap-4 p-4 text-left hover:bg-white/[0.02] transition-colors">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-xl bg-emerald-500/15 border border-emerald-500/20 flex items-center justify-center text-xs font-black text-white shrink-0">
                      {a.student.firstName[0]}{a.student.lastName[0]}
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-white text-sm truncate">{a.student.firstName} {a.student.lastName}</p>
                      <p className="text-emerald-400/70 text-xs font-mono">{a.student.studentId}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${submitted ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/25' : 'bg-amber-500/15 text-amber-400 border-amber-500/25'}`}>
                      {a.status.replace('_', ' ')}
                    </span>
                    {submitted && <span className="text-xs font-bold text-slate-300">{a.correctCount}/{examMeta.objectiveCount} correct — {a.objectiveScore}/30</span>}
                    {isOpen ? <ChevronUp size={16} className="text-slate-500" /> : <ChevronDown size={16} className="text-slate-500" />}
                  </div>
                </button>

                {isOpen && (
                  <div className="border-t border-white/5 p-4 space-y-4">
                    <div className="max-h-72 overflow-y-auto space-y-2.5 pr-1">
                      {examMeta.questions.map((q, qi) => {
                        const studentAnswer = a.answers[qi];
                        const correct = studentAnswer === q.correctIndex;
                        return (
                          <div key={qi} className="text-xs bg-black/20 rounded-lg p-3">
                            <p className="font-semibold text-slate-300 mb-1.5">{qi + 1}. {q.text}</p>
                            <div className="flex flex-wrap gap-x-4 gap-y-1">
                              {q.options.map((opt, oi) => (
                                <span key={oi} className={
                                  oi === q.correctIndex ? 'text-emerald-400 font-bold' :
                                  oi === studentAnswer ? 'text-red-400 font-bold line-through' : 'text-slate-500'
                                }>
                                  {String.fromCharCode(65 + oi)}. {opt}
                                </span>
                              ))}
                            </div>
                            <p className={`mt-1 flex items-center gap-1 ${correct ? 'text-emerald-500' : studentAnswer == null ? 'text-slate-600' : 'text-red-500'}`}>
                              <Circle size={8} className="fill-current" />
                              {studentAnswer == null ? 'Not answered' : correct ? 'Correct' : 'Incorrect'}
                            </p>
                          </div>
                        );
                      })}
                    </div>

                    {submitted && (
                      <div className="flex items-end gap-3 pt-2 border-t border-white/5">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Theory Score (/{examMeta.theoryMaxScore})</label>
                          <input
                            type="number" min={0} max={examMeta.theoryMaxScore}
                            value={theoryScores[a._id] ?? ''}
                            onChange={(e) => setTheoryScores((t) => ({ ...t, [a._id]: e.target.value }))}
                            className="w-28 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white"
                          />
                        </div>
                        <button
                          onClick={() => saveTheoryAndTotal(a)}
                          disabled={saving === a._id}
                          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-xl text-sm font-bold disabled:opacity-40"
                        >
                          {saving === a._id ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />} Save to Result
                        </button>
                        {saveMsg[a._id] && (
                          <span className={`text-xs font-semibold flex items-center gap-1 ${saveMsg[a._id].includes('error') || saveMsg[a._id].includes('Failed') ? 'text-red-400' : 'text-emerald-400'}`}>
                            {saveMsg[a._id].includes('error') || saveMsg[a._id].includes('Failed') ? <AlertCircle size={13} /> : <CheckCircle size={13} />}
                            {saveMsg[a._id]}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {notStarted.length > 0 && (
        <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-4">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Not Yet Attempted ({notStarted.length})</p>
          <div className="flex flex-wrap gap-2">
            {notStarted.map((s) => (
              <span key={s._id} className="text-xs bg-white/5 text-slate-400 px-2.5 py-1 rounded-lg">{s.firstName} {s.lastName}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
