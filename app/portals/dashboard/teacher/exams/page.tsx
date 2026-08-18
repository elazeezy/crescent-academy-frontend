'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Plus, MonitorCheck, Clock, Users, Loader2, Circle, Trash2, Pencil, ClipboardCheck } from 'lucide-react';

interface Exam {
  _id: string;
  title: string;
  subject: string;
  targetClass: string;
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

  return (
    <div className="space-y-8 pb-16">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-black text-white">CBT Exams</h1>
          <p className="text-slate-400 text-sm mt-1">Build objective exams for your subjects — theory marks are added separately when grading.</p>
        </div>
        <Link
          href="/portals/dashboard/teacher/exams/new"
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2.5 rounded-xl text-sm font-bold transition-all active:scale-95"
        >
          <Plus size={16} /> New Exam
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
          <p className="text-slate-600 text-sm mt-1">Create your first CBT exam to get started.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {exams.map((exam) => (
            <div key={exam._id} className="bg-white/[0.03] border border-white/[0.07] rounded-[1.75rem] p-6 hover:border-emerald-500/20 transition-all">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="font-bold text-white truncate">{exam.title}</h3>
                  <p className="text-emerald-400/70 text-xs font-mono mt-0.5">{exam.subject} — {exam.targetClass}</p>
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
