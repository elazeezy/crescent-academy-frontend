'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Plus, MonitorCheck, Clock, Users, Loader2, Circle, Trash2, Pencil, ClipboardCheck, RotateCcw, CheckCircle2 } from 'lucide-react';

interface Exam {
  _id: string;
  title: string;
  subject: string;
  targetClass: string;
  term?: string;
  session?: string;
  assessmentSlot?: string;
  objectiveCount: number;
  durationMinutes: number;
  status: 'draft' | 'pending_review' | 'rejected' | 'live' | 'closed';
  questions: any[];
  rejectionReason?: string;
}

const STATUS_STYLE: Record<string, string> = {
  draft:          'bg-slate-500/15 text-slate-400 border-slate-500/25',
  pending_review: 'bg-amber-500/15 text-amber-400 border-amber-500/25',
  rejected:       'bg-red-500/15 text-red-400 border-red-500/25',
  live:           'bg-emerald-500/15 text-emerald-400 border-emerald-500/25',
  closed:         'bg-slate-600/15 text-slate-500 border-slate-600/25',
};

export default function TeacherExamsPage() {
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [reattemptExam, setReattemptExam] = useState<Exam | null>(null);
  const [reattemptLoading, setReattemptLoading] = useState(false);
  const [reattemptResult, setReattemptResult] = useState<string | null>(null);

  const fetchExams = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/teacher/exams');
      const data = await res.json();
      setExams(data.exams ?? []);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchExams(); }, [fetchExams]);

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleteLoading(true);
    try {
      await fetch(`/api/teacher/exams/${deleteId}`, { method: 'DELETE' });
      setDeleteId(null);
      fetchExams();
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleReattemptAll = async () => {
    if (!reattemptExam) return;
    setReattemptLoading(true);
    setReattemptResult(null);
    try {
      const res = await fetch(`/api/teacher/exams/${reattemptExam._id}/reattempt-all`, { method: 'POST' });
      const data = await res.json();
      if (!res.ok) { setReattemptResult(data.error ?? 'Could not reopen the exam.'); return; }
      setReattemptResult(
        data.reopenedFor > 0
          ? `Reopened for ${data.reopenedFor} student${data.reopenedFor === 1 ? '' : 's'}. They'll see a "re-attempt now" prompt in their portal.`
          : 'No submitted attempts to reopen yet.',
      );
    } catch {
      setReattemptResult('Network error. Please try again.');
    } finally {
      setReattemptLoading(false);
    }
  };

  return (
    <div className="space-y-8 pb-16">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-black text-white">CBT Assessments</h1>
          <p className="text-slate-400 text-sm mt-1">Create C.A tests or exams, assign each to the right term and result slot, and add as many questions as needed.</p>
        </div>
        <Link
          href="/portals/dashboard/teacher/exams/new"
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2.5 rounded-xl text-sm font-bold transition-all active:scale-95"
        >
          <Plus size={16} /> New CBT Assessment
        </Link>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-24 text-slate-500 gap-2">
          <Loader2 size={20} className="animate-spin" /> Loading…
        </div>
      ) : exams.length === 0 ? (
        <div className="py-24 text-center rounded-[2rem] border border-dashed border-white/10 bg-white/[0.02]">
          <MonitorCheck size={40} className="text-slate-600 mx-auto mb-4" />
          <p className="text-slate-400 font-semibold text-lg">No exams yet</p>
          <p className="text-slate-600 text-sm mt-1">Create a C.A test, exam, or separate network test to get started.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {exams.map((exam) => (
            <div key={exam._id} className="bg-white/[0.03] border border-white/[0.07] rounded-[1.75rem] p-6 hover:border-emerald-500/20 transition-all">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="font-bold text-white truncate">{exam.title}</h3>
                  <p className="text-emerald-400/70 text-xs font-mono mt-0.5">{exam.subject} — {exam.targetClass} · {exam.term} · {exam.assessmentSlot === 'ca1' ? 'C.A Test 1' : exam.assessmentSlot === 'ca2' ? 'C.A Test 2' : exam.assessmentSlot === 'testing' ? 'CBT Testing' : 'Exam'}</p>
                </div>
                <span className={`shrink-0 text-[10px] font-bold px-2.5 py-1 rounded-full border capitalize ${STATUS_STYLE[exam.status]}`}>
                  {exam.status.replace('_', ' ')}
                </span>
              </div>

              {exam.status === 'rejected' && exam.rejectionReason && (
                <p className="mt-2 text-xs text-red-400 bg-red-500/10 rounded-lg px-2.5 py-1.5">{exam.rejectionReason}</p>
              )}

              <div className="mt-4 flex items-center gap-4 text-xs text-slate-500 font-semibold">
                <span className="flex items-center gap-1.5"><Circle size={12} className={exam.questions.length === exam.objectiveCount ? 'text-emerald-400' : 'text-amber-400'} />{exam.questions.length}/{exam.objectiveCount} questions</span>
                <span className="flex items-center gap-1.5"><Clock size={12} />{exam.durationMinutes} min</span>
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                <Link
                  href={`/portals/dashboard/teacher/exams/${exam._id}/build`}
                  className="flex items-center gap-1.5 bg-white/[0.06] hover:bg-white/[0.12] text-slate-200 px-3.5 py-2 rounded-xl font-bold text-xs transition-all border border-white/10"
                >
                  <Pencil size={13} /> Build / Edit
                </Link>
                <Link
                  href={`/portals/dashboard/teacher/exams/${exam._id}/grade`}
                  className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white px-3.5 py-2 rounded-xl font-bold text-xs transition-all"
                >
                  <ClipboardCheck size={13} /> Grade
                </Link>
                <button
                  onClick={() => { setReattemptExam(exam); setReattemptResult(null); }}
                  className="flex items-center gap-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 px-3.5 py-2 rounded-xl font-bold text-xs transition-all border border-amber-500/25"
                  title="Reopen this exam for every student who already submitted — even if the due date has passed."
                >
                  <RotateCcw size={13} /> Make them re-attempt
                </button>
                <button
                  onClick={() => setDeleteId(exam._id)}
                  className="flex items-center gap-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 px-3.5 py-2 rounded-xl font-bold text-xs transition-all border border-red-500/20"
                >
                  <Trash2 size={13} /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {reattemptExam && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[#0d1f3c] text-white rounded-2xl shadow-2xl w-full max-w-md border border-white/10 p-6">
            <h3 className="font-bold text-white mb-2 flex items-center gap-2"><RotateCcw size={18} className="text-amber-400" /> Make the class re-attempt?</h3>
            {reattemptResult ? (
              <>
                <div className={`mt-2 flex items-start gap-2 rounded-xl px-4 py-3 text-sm font-semibold ${reattemptResult.startsWith('Reopened') ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/25' : 'bg-amber-500/10 text-amber-300 border border-amber-500/25'}`}>
                  <CheckCircle2 size={16} className="shrink-0 mt-0.5" /> {reattemptResult}
                </div>
                <div className="flex justify-end mt-5">
                  <button onClick={() => { setReattemptExam(null); setReattemptResult(null); }} className="px-5 py-2.5 rounded-xl text-sm font-bold bg-white/10 hover:bg-white/15 text-white">Done</button>
                </div>
              </>
            ) : (
              <>
                <p className="text-slate-400 text-sm mb-5">
                  This reopens <strong className="text-white">{reattemptExam.title}</strong> for <strong className="text-white">every student who already submitted it</strong>, even if the due date has passed. Each will see a “re-attempt now” prompt, start fresh, and their new score will replace the old one. Students who haven’t submitted are unaffected.
                </p>
                <div className="flex gap-3">
                  <button onClick={handleReattemptAll} disabled={reattemptLoading} className="flex-1 flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-950 py-2.5 rounded-xl text-sm font-bold disabled:opacity-40">
                    {reattemptLoading ? <Loader2 size={15} className="animate-spin" /> : <RotateCcw size={15} />} Reopen for the class
                  </button>
                  <button onClick={() => setReattemptExam(null)} className="px-5 py-2.5 rounded-xl text-sm font-bold text-slate-400 hover:bg-white/5">Cancel</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[#0d1f3c] text-white rounded-2xl shadow-2xl w-full max-w-sm border border-white/10 p-6">
            <h3 className="font-bold text-white mb-2">Delete this exam?</h3>
            <p className="text-slate-400 text-sm mb-5">This permanently deletes the exam and all its questions. Student attempts already submitted are not affected.</p>
            <div className="flex gap-3">
              <button onClick={handleDelete} disabled={deleteLoading} className="flex-1 flex items-center justify-center gap-2 bg-red-600 hover:bg-red-500 text-white py-2.5 rounded-xl text-sm font-bold disabled:opacity-40">
                {deleteLoading ? <Loader2 size={15} className="animate-spin" /> : <Trash2 size={15} />} Delete
              </button>
              <button onClick={() => setDeleteId(null)} className="px-5 py-2.5 rounded-xl text-sm font-bold text-slate-400 hover:bg-white/5">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
