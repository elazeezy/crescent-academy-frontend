'use client';

import { useState, useEffect, useCallback, use } from 'react';
import Link from 'next/link';
import { ChevronLeft, Loader2, Activity, Clock, CheckCircle2, Users } from 'lucide-react';

interface StudentRef { _id: string; firstName: string; lastName: string; studentId: string; }
interface ProgressRow {
  student: StudentRef;
  status: string;
  answeredCount: number;
  totalQuestions: number;
  startedAt: string;
  deadline: string;
  lastSeenAt: string;
}

export default function MonitorExamPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [examMeta, setExamMeta] = useState<{ title: string; subject: string; status: string; durationMinutes: number; questionCount: number } | null>(null);
  const [inProgress, setInProgress] = useState<ProgressRow[]>([]);
  const [submitted, setSubmitted] = useState<ProgressRow[]>([]);
  const [notStarted, setNotStarted] = useState<StudentRef[]>([]);
  const [loading, setLoading] = useState(true);
  const [now, setNow] = useState(Date.now());

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch(`/api/admin/exams/${id}/monitor`);
      const data = await res.json();
      if (res.ok) {
        setExamMeta(data.exam);
        setInProgress(data.inProgress ?? []);
        setSubmitted(data.submitted ?? []);
        setNotStarted(data.notStarted ?? []);
      }
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchData();
    const poll = setInterval(fetchData, 5000);
    const tick = setInterval(() => setNow(Date.now()), 1000);
    return () => { clearInterval(poll); clearInterval(tick); };
  }, [fetchData]);

  const timeLeft = (deadline: string) => {
    const secs = Math.max(0, Math.floor((new Date(deadline).getTime() - now) / 1000));
    const m = String(Math.floor(secs / 60)).padStart(2, '0');
    const s = String(secs % 60).padStart(2, '0');
    return `${m}:${s}`;
  };

  if (loading) {
    return <div className="flex items-center justify-center py-24 text-slate-400 gap-2"><Loader2 size={20} className="animate-spin" /> Loading…</div>;
  }
  if (!examMeta) {
    return <div className="p-10 text-center text-slate-400">Exam not found.</div>;
  }

  return (
    <div className="max-w-4xl space-y-6">
      <Link href="/portals/dashboard/admin/exams" className="flex items-center gap-2 text-slate-400 hover:text-slate-600 text-sm font-medium w-fit transition-colors">
        <ChevronLeft size={16} /> Back to CBT Exams
      </Link>

      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
            <Activity size={20} className="text-emerald-500" /> {examMeta.title}
          </h1>
          <p className="text-slate-500 text-sm mt-1">{examMeta.subject} — live progress, refreshes every 5 seconds. Scores stay hidden until grading.</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
          <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">In Progress</p>
          <p className="text-2xl font-black text-amber-500">{inProgress.length}</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
          <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Submitted</p>
          <p className="text-2xl font-black text-emerald-500">{submitted.length}</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
          <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Not Started</p>
          <p className="text-2xl font-black text-slate-400">{notStarted.length}</p>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="px-5 py-3 border-b border-slate-100 flex items-center gap-2">
          <Activity size={14} className="text-amber-500" />
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Currently Taking the Exam</p>
        </div>
        {inProgress.length === 0 ? (
          <p className="text-center text-slate-400 text-sm py-8">No one is currently in the exam.</p>
        ) : (
          <div className="divide-y divide-slate-100">
            {inProgress.map((p) => (
              <div key={p.student._id} className="flex items-center gap-4 px-5 py-3">
                <div className="w-8 h-8 rounded-lg bg-amber-50 border border-amber-100 flex items-center justify-center text-xs font-black text-amber-600 shrink-0">
                  {p.student.firstName[0]}{p.student.lastName[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-slate-800 text-sm truncate">{p.student.firstName} {p.student.lastName}</p>
                  <p className="text-slate-400 text-xs font-mono">{p.student.studentId}</p>
                </div>
                <span className="text-xs font-bold text-slate-500">{p.answeredCount}/{p.totalQuestions} answered</span>
                <span className="flex items-center gap-1.5 text-xs font-mono font-bold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-lg">
                  <Clock size={12} /> {timeLeft(p.deadline)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="px-5 py-3 border-b border-slate-100 flex items-center gap-2">
          <CheckCircle2 size={14} className="text-emerald-500" />
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Submitted</p>
        </div>
        {submitted.length === 0 ? (
          <p className="text-center text-slate-400 text-sm py-8">No submissions yet.</p>
        ) : (
          <div className="divide-y divide-slate-100">
            {submitted.map((p) => (
              <div key={p.student._id} className="flex items-center gap-4 px-5 py-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center text-xs font-black text-emerald-600 shrink-0">
                  {p.student.firstName[0]}{p.student.lastName[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-slate-800 text-sm truncate">{p.student.firstName} {p.student.lastName}</p>
                  <p className="text-slate-400 text-xs font-mono">{p.student.studentId}</p>
                </div>
                <span className="text-xs font-bold text-emerald-600 capitalize">{p.status.replace('_', ' ')}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {notStarted.length > 0 && (
        <div className="bg-white/60 border border-slate-200 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Users size={14} className="text-slate-400" />
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Not Yet Started ({notStarted.length})</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {notStarted.map((s) => (
              <span key={s._id} className="text-xs bg-slate-100 text-slate-500 px-2.5 py-1 rounded-lg">{s.firstName} {s.lastName}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
