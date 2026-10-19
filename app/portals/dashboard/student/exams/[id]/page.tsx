'use client';

import { useState, useEffect, useRef, useCallback, use } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, AlertCircle, CheckCircle2, Clock, Cloud, CloudOff, RefreshCw } from 'lucide-react';

interface Question { text: string; options: string[]; }

type SyncStatus = 'saved' | 'saving' | 'offline';

// localStorage key holding this attempt's answers, so a reload/offline tab never
// loses what the student has picked. Namespaced per exam.
const storageKey = (id: string) => `ca-exam-answers-${id}`;

function readLocalAnswers(id: string): (number | null)[] | null {
  try {
    const raw = localStorage.getItem(storageKey(id));
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed as (number | null)[];
    return null;
  } catch {
    return null;
  }
}

function writeLocalAnswers(id: string, answers: (number | null)[]) {
  try {
    localStorage.setItem(storageKey(id), JSON.stringify(answers));
  } catch {
    // storage full / unavailable (private mode) — server autosave still covers us
  }
}

function clearLocalAnswers(id: string) {
  try {
    localStorage.removeItem(storageKey(id));
  } catch {
    /* ignore */
  }
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

// Exponential backoff with random jitter, capped — the jitter is what de-synchronises a
// crowd of students who all pressed Start at the same second.
function backoffMs(attempt: number): number {
  const base = Math.min(6000, 700 * 2 ** (attempt - 1));
  return base + Math.floor(Math.random() * 1200);
}

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
  const [syncStatus, setSyncStatus] = useState<SyncStatus>('saved');

  const submittingRef = useRef(false);
  const heartbeatRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const flushTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const flushDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Always-current mirror of answers (avoids stale closures inside timers/listeners).
  const answersRef = useRef<(number | null)[]>([]);
  // Question indices whose latest value has NOT been confirmed saved on the server.
  const pendingRef = useRef<Set<number>>(new Set());
  // Guards against overlapping flush runs.
  const flushingRef = useRef(false);

  const setAnswerLocal = useCallback((next: (number | null)[]) => {
    answersRef.current = next;
    setAnswers(next);
    writeLocalAnswers(id, next);
  }, [id]);

  // Pushes every pending answer to the server, retrying until the queue drains.
  // Safe to call repeatedly (reconnect, heartbeat, interval, before submit).
  const flushPending = useCallback(async () => {
    if (flushingRef.current) return;
    if (pendingRef.current.size === 0) {
      setSyncStatus('saved');
      setError((e) => (e && answersRef.current.length > 0 ? '' : e)); // clear any stale offline notice
      return;
    }
    flushingRef.current = true;
    setSyncStatus('saving');
    try {
      // Snapshot the queue and send every pending answer in ONE batched request —
      // far fewer database writes on a shared cluster than one request per tap.
      const indices = Array.from(pendingRef.current);
      const answersPayload = indices
        .map((qIndex) => ({ questionIndex: qIndex, optionIndex: answersRef.current[qIndex] }))
        .filter((u) => u.optionIndex != null);

      if (answersPayload.length === 0) {
        pendingRef.current.clear();
      } else {
        const res = await fetch(`/api/student/exams/${id}/answer`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ answers: answersPayload }),
        });
        if (res.ok) {
          // Clear only what we just sent; a tap made mid-request stays queued.
          answersPayload.forEach((u) => pendingRef.current.delete(u.questionIndex));
        } else if (res.status === 403) {
          // Expired / no longer in progress — terminal for autosave.
          pendingRef.current.clear();
        } else {
          // 503 / transient — keep everything queued for the next retry.
          throw new Error('retry-later');
        }
      }
      if (pendingRef.current.size === 0) {
        setSyncStatus('saved');
        setError((e) => (e && answersRef.current.length > 0 ? '' : e)); // reconnected & synced — clear notice
      } else {
        setSyncStatus('offline');
      }
    } catch {
      // Network still down — keep whatever is left queued and show offline.
      setSyncStatus('offline');
    } finally {
      flushingRef.current = false;
    }
  }, [id]);

  const doSubmit = useCallback(async () => {
    if (submittingRef.current) return;
    submittingRef.current = true;
    setSubmitting(true);
    try {
      // Make sure every picked answer has reached the server before grading. Cancel any
      // debounced flush and drain the queue, retrying a couple of times in case a
      // background flush was mid-flight (the guard would have skipped our first call).
      if (flushDebounceRef.current) clearTimeout(flushDebounceRef.current);
      for (let i = 0; i < 3 && pendingRef.current.size > 0; i++) {
        await flushPending();
        if (pendingRef.current.size > 0) await sleep(400);
      }
      if (pendingRef.current.size > 0) {
        throw new Error('Some answers haven\'t saved yet. Reconnect and try again — your answers are safe.');
      }
      const res = await fetch(`/api/student/exams/${id}/submit`, { method: 'POST' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Could not record your submission. Please try again.');
      setError('');
      clearLocalAnswers(id);
      setSubmitted(true);
    } catch (e: any) {
      setError(e?.message ?? 'Could not record your submission. Please try again.');
      submittingRef.current = false;
    } finally {
      setSubmitting(false);
      if (submittingRef.current) {
        if (heartbeatRef.current) clearInterval(heartbeatRef.current);
        if (tickRef.current) clearInterval(tickRef.current);
        if (flushTimerRef.current) clearInterval(flushTimerRef.current);
        if (flushDebounceRef.current) clearTimeout(flushDebounceRef.current);
      }
    }
  }, [id, flushPending]);

  // Start / resume attempt — merges server answers with anything saved locally so
  // offline picks and pre-disconnect answers are both restored, then syncs up.
  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        // Retry with backoff + jitter so a shared-cluster "busy" (503) or a transient
        // network blip rides itself out — and so 100s of simultaneous starts spread out
        // instead of hitting the database all at once.
        let res: Response | undefined;
        let data: any = null;
        const maxAttempts = 6;
        for (let attempt = 1; attempt <= maxAttempts; attempt++) {
          try {
            res = await fetch(`/api/student/exams/${id}/start`, { method: 'POST' });
          } catch (netErr) {
            if (attempt < maxAttempts) { setError('Connecting… retrying automatically.'); await sleep(backoffMs(attempt)); continue; }
            throw netErr;
          }
          if (res.status === 503 && attempt < maxAttempts) {
            setError('The server is busy with other students — retrying automatically…');
            await sleep(backoffMs(attempt));
            continue;
          }
          data = await res.json().catch(() => null);
          break;
        }

        if (!res || !res.ok) {
          if (res && res.status === 503) {
            setError('The server is very busy right now. Please wait a moment and reload — your answers are safe.');
          } else if ((data?.error ?? '').includes('auto-submitted')) {
            const submitRes = await fetch(`/api/student/exams/${id}/submit`, { method: 'POST' });
            if (submitRes.ok) { clearLocalAnswers(id); setSubmitted(true); }
            else setError('Your time expired. We could not save the result yet; retry when your connection is back.');
          } else setError(data?.error ?? 'Could not start exam');
          return;
        }
        setError(''); // connected successfully — clear any "retrying" notice
        setTitle(data.title);
        setQuestions(data.questions ?? []);
        const serverAnswers: (number | null)[] = data.answers ?? [];

        // Merge: keep a locally-saved pick wherever the server has none (or an
        // older value), so nothing the student did on this device is lost.
        const local = readLocalAnswers(id);
        const merged = serverAnswers.map((srv, i) => {
          const loc = local?.[i];
          return loc != null ? loc : srv;
        });
        setAnswerLocal(merged);

        // Queue any answer that differs from what the server currently holds, then push it up.
        merged.forEach((val, i) => {
          if (val != null && val !== serverAnswers[i]) pendingRef.current.add(i);
        });
        setDeadline(new Date(data.deadline));
        if (pendingRef.current.size > 0) flushPending();
      } catch {
        // Offline at open: fall back to locally-saved answers if we have any.
        const local = readLocalAnswers(id);
        if (local && local.length) {
          setAnswerLocal(local);
          setError('You appear to be offline. Your saved answers are shown below — reconnect to continue and submit.');
        } else {
          setError('Network error. Please check your connection and reload. Your answers are saved and will reappear.');
        }
      } finally {
        setLoading(false);
      }
    })();
  }, [id, setAnswerLocal, flushPending]);

  // Clear the debounce timer on unmount (pending answers remain in localStorage and
  // resync when the student returns).
  useEffect(() => () => { if (flushDebounceRef.current) clearTimeout(flushDebounceRef.current); }, []);

  // Flush the queue the moment the browser reports it's back online.
  useEffect(() => {
    const onOnline = () => flushPending();
    const onOffline = () => setSyncStatus('offline');
    window.addEventListener('online', onOnline);
    window.addEventListener('offline', onOffline);
    return () => {
      window.removeEventListener('online', onOnline);
      window.removeEventListener('offline', onOffline);
    };
  }, [flushPending]);

  // Periodic safety-net flush (covers cases the `online` event misses).
  useEffect(() => {
    if (submitted) return;
    flushTimerRef.current = setInterval(() => { flushPending(); }, 10000);
    return () => { if (flushTimerRef.current) clearInterval(flushTimerRef.current); };
  }, [submitted, flushPending]);

  // Heartbeat — reconciles the deadline after a disconnect, and flushes pending answers.
  useEffect(() => {
    if (!deadline || submitted) return;
    heartbeatRef.current = setInterval(async () => {
      try {
        const res = await fetch(`/api/student/exams/${id}/heartbeat`, { method: 'POST' });
        const data = await res.json();
        if (data.status === 'auto_submitted') {
          doSubmit();
          return;
        }
        if (data.deadline) setDeadline(new Date(data.deadline));
        flushPending();
      } catch {
        setSyncStatus('offline');
      }
    }, 20000);
    return () => { if (heartbeatRef.current) clearInterval(heartbeatRef.current); };
  }, [id, deadline, submitted, doSubmit, flushPending]);

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

  const selectAnswer = (qIndex: number, oIndex: number) => {
    const next = answersRef.current.map((v, i) => (i === qIndex ? oIndex : v));
    setAnswerLocal(next);          // instant local backup — survives reload/offline
    pendingRef.current.add(qIndex); // queue for the server
    setSyncStatus('saving');
    // Debounce: coalesce rapid taps into a single batched write (~2.5s after the last
    // selection). The heartbeat and the 10s safety-net interval also flush, so nothing
    // sits unsynced for long, and localStorage covers the gap regardless.
    if (flushDebounceRef.current) clearTimeout(flushDebounceRef.current);
    flushDebounceRef.current = setTimeout(() => { flushPending(); }, 2500);
  };

  const answeredCount = answers.filter((a) => a != null).length;
  const mm = String(Math.floor(remainingSeconds / 60)).padStart(2, '0');
  const ss = String(remainingSeconds % 60).padStart(2, '0');

  if (loading) {
    return <div className="flex items-center justify-center py-24 text-slate-500 gap-2"><Loader2 size={20} className="animate-spin" /> Loading exam…</div>;
  }

  if (error && questions.length === 0) {
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
        <p className="text-slate-400 mt-2">Your submission has been recorded.</p>
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
      <div className="sticky top-0 z-30 bg-[#0a1628]/95 backdrop-blur-xl -mx-5 md:-mx-8 px-5 md:px-8 py-4 border-b border-white/10 flex items-center justify-between gap-3">
        <div className="min-w-0">
          <h1 className="font-bold text-white text-sm truncate">{title}</h1>
          <p className="text-slate-500 text-xs">{answeredCount}/{questions.length} answered</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <SyncBadge status={syncStatus} />
          <div className={`flex items-center gap-2 px-4 py-2 rounded-xl font-mono font-bold text-sm ${remainingSeconds < 60 ? 'bg-red-500/15 text-red-400 border border-red-500/25' : 'bg-sky-500/15 text-sky-300 border border-sky-500/25'}`}>
            <Clock size={15} /> {mm}:{ss}
          </div>
        </div>
      </div>

      {/* Inline connection notice (answers stay safe) */}
      {error && (
        <div className="flex items-start gap-2 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-amber-200 text-xs font-medium">
          <AlertCircle size={15} className="shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

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

function SyncBadge({ status }: { status: SyncStatus }) {
  if (status === 'offline') {
    return (
      <span className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-amber-500/15 text-amber-300 border border-amber-500/25" title="You're offline. Your answers are saved on this device and will sync when the connection returns.">
        <CloudOff size={14} /> Offline
      </span>
    );
  }
  if (status === 'saving') {
    return (
      <span className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-sky-500/15 text-sky-300 border border-sky-500/25" title="Saving your answers…">
        <RefreshCw size={14} className="animate-spin" /> Saving
      </span>
    );
  }
  return (
    <span className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/25" title="All answers saved.">
      <Cloud size={14} /> Saved
    </span>
  );
}
