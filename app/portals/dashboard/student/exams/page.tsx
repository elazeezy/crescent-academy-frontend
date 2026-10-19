'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { MonitorCheck, Clock, Loader2, PlayCircle, CheckCircle2, RotateCcw } from 'lucide-react';

interface ExamListItem {
  _id: string;
  title: string;
  subject: string;
  durationMinutes: number;
  objectiveCount: number;
  assessmentSlot?: string;
  term?: string;
  attemptStatus: 'not_started' | 'in_progress' | 'submitted' | 'auto_submitted' | null;
  reattemptAllowed?: boolean;
  windowStart?: string;
  windowEnd?: string;
}

export default function StudentExamsPage() {
  const [exams, setExams] = useState<ExamListItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchExams = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/student/exams');
      const data = await res.json();
      setExams(data.exams ?? []);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchExams(); }, [fetchExams]);

  const inProgress = exams.filter((e) => e.attemptStatus === 'in_progress');
  const reattempts = exams.filter(
    (e) => e.reattemptAllowed && (e.attemptStatus === 'submitted' || e.attemptStatus === 'auto_submitted'),
  );

  return (
    <div className="space-y-8 pb-16">
      <div>
        <h1 className="text-2xl font-black text-white">CBT Exams</h1>
        <p className="text-slate-400 text-sm mt-1">Assessments assigned to your class, including upcoming, in progress, and submitted work.</p>
      </div>

      {/* Resume banner — an exam you started but never submitted (e.g. network dropped). */}
      {inProgress.map((exam) => (
        <Link
          key={`resume-${exam._id}`}
          href={`/portals/dashboard/student/exams/${exam._id}`}
          className="flex items-center justify-between gap-4 rounded-2xl border border-sky-400/40 bg-sky-500/15 px-5 py-4 text-white hover:bg-sky-500/25 transition-colors"
        >
          <span className="min-w-0">
            <strong className="block text-sm md:text-base">Continue your exam: {exam.title}</strong>
            <span className="text-xs md:text-sm text-sky-200/90">You have an exam in progress. Your saved answers are waiting — pick up where you left off.</span>
          </span>
          <span className="shrink-0 inline-flex items-center gap-1.5 rounded-xl bg-sky-400 px-4 py-2 text-xs font-bold text-slate-950">
            <PlayCircle size={14} /> Continue
          </span>
        </Link>
      ))}

      {/* Re-attempt banner — a teacher/admin has reopened this exam for you. */}
      {reattempts.map((exam) => (
        <Link
          key={`reattempt-${exam._id}`}
          href={`/portals/dashboard/student/exams/${exam._id}`}
          className="flex items-center justify-between gap-4 rounded-2xl border border-emerald-400/40 bg-emerald-500/15 px-5 py-4 text-white hover:bg-emerald-500/25 transition-colors"
        >
          <span className="min-w-0">
            <strong className="block text-sm md:text-base">Re-attempt available: {exam.title}</strong>
            <span className="text-xs md:text-sm text-emerald-200/90">Your teacher has reopened this exam. Starting a re-attempt begins a fresh attempt.</span>
          </span>
          <span className="shrink-0 inline-flex items-center gap-1.5 rounded-xl bg-emerald-400 px-4 py-2 text-xs font-bold text-slate-950">
            <RotateCcw size={14} /> Re-attempt
          </span>
        </Link>
      ))}

      {loading ? (
        <div className="flex items-center justify-center py-24 text-slate-500 gap-2"><Loader2 size={20} className="animate-spin" /> Loading…</div>
      ) : exams.length === 0 ? (
        <div className="py-24 text-center rounded-[2rem] border border-dashed border-white/10 bg-white/[0.02]">
          <MonitorCheck size={40} className="text-slate-600 mx-auto mb-4" />
          <p className="text-slate-400 font-semibold text-lg">No exams yet</p>
          <p className="text-slate-600 text-sm mt-1">There are no CBT assessments assigned to your class right now.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {exams.map((exam) => {
            const submitted = (exam.attemptStatus === 'submitted' || exam.attemptStatus === 'auto_submitted') && !exam.reattemptAllowed;
            const canReattempt = exam.reattemptAllowed && (exam.attemptStatus === 'submitted' || exam.attemptStatus === 'auto_submitted');
            const upcoming = !!exam.windowStart && new Date(exam.windowStart) > new Date();
            const expired = !!exam.windowEnd && new Date(exam.windowEnd) < new Date();
            return (
              <div key={exam._id} className="bg-white/[0.03] border border-white/[0.07] rounded-[1.75rem] p-6">
                <h3 className="font-bold text-white">{exam.title}</h3>
                <p className="text-sky-400/70 text-xs font-mono mt-0.5">{exam.subject} · {exam.term} · {exam.assessmentSlot === 'ca1' ? 'C.A Test 1' : exam.assessmentSlot === 'ca2' ? 'C.A Test 2' : exam.assessmentSlot === 'testing' ? 'CBT Testing' : 'Exam'}</p>
                <div className="mt-4 flex items-center gap-4 text-xs text-slate-500 font-semibold">
                  <span className="flex items-center gap-1.5"><Clock size={12} />{exam.durationMinutes} min</span>
                  <span>{exam.objectiveCount} questions</span>
                </div>
                {upcoming && (
                  <p className="mt-2 text-xs font-semibold text-amber-400/80">
                    Opens {exam.windowStart ? new Date(exam.windowStart).toLocaleString() : 'soon'}
                  </p>
                )}
                <div className="mt-5">
                  {submitted ? (
                    <span className="flex items-center gap-2 text-emerald-400 text-sm font-bold">
                      <CheckCircle2 size={16} /> Submitted
                    </span>
                  ) : expired ? (
                    <span className="text-slate-500 text-sm font-bold">Assessment window closed</span>
                  ) : upcoming ? (
                    <span className="text-amber-300 text-sm font-bold">Upcoming assessment</span>
                  ) : (
                    <Link
                      href={`/portals/dashboard/student/exams/${exam._id}`}
                      className={`flex items-center justify-center gap-2 text-white py-2.5 rounded-xl text-sm font-bold transition-all active:scale-95 w-full ${canReattempt ? 'bg-emerald-600 hover:bg-emerald-500' : 'bg-sky-600 hover:bg-sky-500'}`}
                    >
                      {canReattempt
                        ? <><RotateCcw size={16} /> Re-attempt CBT</>
                        : <><PlayCircle size={16} /> {exam.attemptStatus === 'in_progress' ? 'Continue CBT' : 'Attempt CBT'}</>}
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
