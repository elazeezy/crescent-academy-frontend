'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  Plus, MonitorCheck, Clock, Loader2, Circle, Trash2, Pencil, CalendarClock,
  Activity, CheckCircle2, XCircle, FlaskConical, AlertCircle, Trophy, BellRing,
} from 'lucide-react';

interface Exam {
  _id: string;
  title: string;
  subject: string;
  targetClass: string;
  section: string;
  objectiveCount: number;
  assessmentSlot?: string;
  durationMinutes: number;
  status: 'draft' | 'pending_review' | 'rejected' | 'live' | 'closed';
  questions: any[];
  createdBy?: { name: string; email: string };
  rejectionReason?: string;
  windowStart?: string;
  windowEnd?: string;
}

const STATUS_STYLE: Record<string, string> = {
  draft:           'bg-slate-500/15 text-slate-400 border-slate-500/25',
  pending_review:  'bg-amber-500/15 text-amber-400 border-amber-500/25',
  rejected:        'bg-red-500/15 text-red-400 border-red-500/25',
  live:            'bg-emerald-500/15 text-emerald-400 border-emerald-500/25',
  closed:          'bg-slate-600/15 text-slate-500 border-slate-600/25',
};


export default function AdminExamsPage() {
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);
  const [rejectId, setRejectId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [notifyMsg, setNotifyMsg] = useState<Record<string, string>>({});

  const fetchExams = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/exams');
      const data = await res.json();
      setExams(data.exams ?? []);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchExams(); }, [fetchExams]);

  const approve = async (id: string) => {
    setBusy(id); setError('');
    try {
      const res = await fetch(`/api/admin/exams/${id}/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ approve: true }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? 'Failed to approve'); return; }
      fetchExams();
    } finally { setBusy(null); }
  };

  const reject = async () => {
    if (!rejectId) return;
    setBusy(rejectId); setError('');
    try {
      const res = await fetch(`/api/admin/exams/${rejectId}/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ approve: false, reason: rejectReason }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? 'Failed to reject'); return; }
      setRejectId(null); setRejectReason('');
      fetchExams();
    } finally { setBusy(null); }
  };

  const closeExam = async (id: string) => {
    setBusy(id);
    try {
      await fetch(`/api/admin/exams/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'closed' }),
      });
      fetchExams();
    } finally { setBusy(null); }
  };

  const notifyClass = async (id: string) => {
    setBusy(id);
    setNotifyMsg((m) => ({ ...m, [id]: '' }));
    try {
      const res = await fetch(`/api/admin/exams/${id}/notify`, { method: 'POST' });
      const data = await res.json();
      setNotifyMsg((m) => ({ ...m, [id]: res.ok ? 'Class notified!' : (data.error ?? 'Failed to notify') }));
    } catch {
      setNotifyMsg((m) => ({ ...m, [id]: 'Network error.' }));
    } finally {
      setBusy(null);
      setTimeout(() => setNotifyMsg((m) => ({ ...m, [id]: '' })), 4000);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setBusy(deleteId);
    try {
      await fetch(`/api/admin/exams/${deleteId}`, { method: 'DELETE' });
      setDeleteId(null);
      fetchExams();
    } finally { setBusy(null); }
  };

  const pending = exams.filter((e) => e.status === 'pending_review');
  const live = exams.filter((e) => e.status === 'live');
  const sandbox = exams.filter((e) => e.assessmentSlot === 'testing');
  const others = exams.filter((e) => e.assessmentSlot !== 'testing' && e.status !== 'pending_review' && e.status !== 'live');

  return (
    <div className="space-y-10 max-w-6xl">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-100">CBT Exams</h1>
          <p className="text-slate-500 text-sm mt-1">Review and approve teacher exams, monitor live sittings, and try the system yourself in the testing sandbox.</p>
        </div>
        <Link
          href="/portals/dashboard/admin/exams/new?demo=1"
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2.5 rounded-xl text-sm font-bold transition-all active:scale-95"
        >
          <FlaskConical size={16} /> New Testing Exam
        </Link>
      </div>

      {error && (
        <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl px-4 py-3 text-sm font-semibold">
          <AlertCircle size={16} /> {error}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-24 text-slate-500 gap-2"><Loader2 size={20} className="animate-spin" /> Loading…</div>
      ) : (
        <>
          {/* ── CBT TESTING SANDBOX ── */}
          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <FlaskConical size={16} className="text-indigo-400" />
              <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest">CBT Testing Sandbox</h2>
            </div>
            <p className="text-xs text-slate-500 -mt-2">
              Network and flow checks. Submissions are recorded as attempts but never written into student results.
            </p>
            {sandbox.length === 0 ? (
              <div className="bg-white/[0.02] border border-dashed border-white/10 rounded-2xl p-6 text-center text-slate-500 text-sm">
                No testing exams yet — create one to try the full flow end-to-end.
              </div>
            ) : (
              <ExamGrid exams={sandbox} busy={busy} onApprove={approve} onReject={setRejectId} onClose={closeExam} onDelete={setDeleteId} onNotify={notifyClass} notifyMsg={notifyMsg} />
            )}
          </section>

          {/* ── PENDING APPROVAL ── */}
          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <Clock size={16} className="text-amber-400" />
              <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Pending Approval ({pending.length})</h2>
            </div>
            {pending.length === 0 ? (
              <div className="bg-white/[0.02] border border-dashed border-white/10 rounded-2xl p-6 text-center text-slate-500 text-sm">
                Nothing waiting on review right now.
              </div>
            ) : (
              <ExamGrid exams={pending} busy={busy} onApprove={approve} onReject={setRejectId} onClose={closeExam} onDelete={setDeleteId} onNotify={notifyClass} notifyMsg={notifyMsg} />
            )}
          </section>

          {/* ── LIVE / MONITORING ── */}
          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <Activity size={16} className="text-emerald-400" />
              <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Live Now ({live.length})</h2>
            </div>
            {live.length === 0 ? (
              <div className="bg-white/[0.02] border border-dashed border-white/10 rounded-2xl p-6 text-center text-slate-500 text-sm">
                No exam is currently open to students.
              </div>
            ) : (
              <ExamGrid exams={live} busy={busy} onApprove={approve} onReject={setRejectId} onClose={closeExam} onDelete={setDeleteId} onNotify={notifyClass} notifyMsg={notifyMsg} showMonitor />
            )}
          </section>

          {/* ── EVERYTHING ELSE ── */}
          {others.length > 0 && (
            <section className="space-y-4">
              <div className="flex items-center gap-2">
                <MonitorCheck size={16} className="text-slate-500" />
                <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest">All Other Exams</h2>
              </div>
              <ExamGrid exams={others} busy={busy} onApprove={approve} onReject={setRejectId} onClose={closeExam} onDelete={setDeleteId} onNotify={notifyClass} notifyMsg={notifyMsg} />
            </section>
          )}
        </>
      )}

      {/* Reject modal */}
      {rejectId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white text-slate-900 rounded-2xl shadow-2xl w-full max-w-md p-6">
            <h3 className="font-bold text-slate-900 mb-2">Reject this exam?</h3>
            <p className="text-slate-500 text-sm mb-4">Optionally tell the teacher what needs fixing.</p>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              rows={3}
              className="w-full text-sm text-slate-900 bg-white border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-400/30 focus:border-red-400"
              placeholder="e.g. Question 12 has two correct-looking options"
            />
            <div className="flex gap-3 mt-4">
              <button onClick={reject} disabled={busy === rejectId} className="flex-1 flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white py-2.5 rounded-xl text-sm font-bold disabled:opacity-40">
                {busy === rejectId ? <Loader2 size={15} className="animate-spin" /> : <XCircle size={15} />} Reject
              </button>
              <button onClick={() => { setRejectId(null); setRejectReason(''); }} className="px-5 py-2.5 rounded-xl text-sm font-bold text-slate-500 hover:bg-slate-100">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete modal */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white text-slate-900 rounded-2xl shadow-2xl w-full max-w-sm p-6">
            <h3 className="font-bold text-slate-900 mb-2">Delete this exam?</h3>
            <p className="text-slate-500 text-sm mb-4">This permanently deletes the exam and its questions.</p>
            <div className="flex gap-3">
              <button onClick={handleDelete} disabled={busy === deleteId} className="flex-1 flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white py-2.5 rounded-xl text-sm font-bold disabled:opacity-40">
                {busy === deleteId ? <Loader2 size={15} className="animate-spin" /> : <Trash2 size={15} />} Delete
              </button>
              <button onClick={() => setDeleteId(null)} className="px-5 py-2.5 rounded-xl text-sm font-bold text-slate-500 hover:bg-slate-100">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ExamGrid({
  exams, busy, onApprove, onReject, onClose, onDelete, onNotify, notifyMsg, showMonitor,
}: {
  exams: Exam[]; busy: string | null;
  onApprove: (id: string) => void; onReject: (id: string) => void;
  onClose: (id: string) => void; onDelete: (id: string) => void;
  onNotify: (id: string) => void; notifyMsg: Record<string, string>;
  showMonitor?: boolean;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      {exams.map((exam) => (
        <div key={exam._id} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h3 className="font-bold text-slate-900 truncate">{exam.title}</h3>
              <p className="text-slate-500 text-xs mt-0.5">{exam.subject} — {exam.targetClass} ({exam.section === 'science' ? 'Science' : 'College'})</p>
              {exam.createdBy && <p className="text-slate-400 text-[11px] mt-0.5">by {exam.createdBy.name}</p>}
            </div>
            <span className={`shrink-0 text-[10px] font-bold px-2.5 py-1 rounded-full border capitalize ${STATUS_STYLE[exam.status]}`}>
              {exam.status.replace('_', ' ')}
            </span>
          </div>

          {exam.status === 'rejected' && exam.rejectionReason && (
            <p className="mt-2 text-xs text-red-500 bg-red-50 rounded-lg px-2.5 py-1.5">{exam.rejectionReason}</p>
          )}

          <div className="mt-3 flex items-center gap-4 text-xs text-slate-500 font-semibold">
            <span className="flex items-center gap-1.5"><Circle size={11} className={exam.questions.length === exam.objectiveCount ? 'text-emerald-500' : 'text-amber-500'} />{exam.questions.length}/{exam.objectiveCount} questions</span>
            <span className="flex items-center gap-1.5"><Clock size={11} />{exam.durationMinutes} min</span>
          </div>

          <div className="mt-1.5 flex items-center gap-1.5 text-xs font-semibold">
            <CalendarClock size={11} className={exam.windowStart ? 'text-indigo-500' : 'text-red-400'} />
            {exam.windowStart ? (
              <span className="text-slate-500">
                Opens {new Date(exam.windowStart).toLocaleString()}{exam.windowEnd ? ` — locks ${new Date(exam.windowEnd).toLocaleString()}` : ''}
              </span>
            ) : (
              <span className="text-red-500">No start time set — cannot go live</span>
            )}
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <Link href={`/portals/dashboard/admin/exams/${exam._id}/build`} className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-lg font-bold text-xs">
              <Pencil size={12} /> View / Edit
            </Link>

            {exam.status === 'pending_review' && (
              <>
                <button onClick={() => onApprove(exam._id)} disabled={busy === exam._id} className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-lg font-bold text-xs disabled:opacity-40">
                  {busy === exam._id ? <Loader2 size={12} className="animate-spin" /> : <CheckCircle2 size={12} />} Approve
                </button>
                <button onClick={() => onReject(exam._id)} className="flex items-center gap-1.5 bg-red-50 hover:bg-red-100 text-red-600 px-3 py-1.5 rounded-lg font-bold text-xs">
                  <XCircle size={12} /> Reject
                </button>
              </>
            )}

            {exam.status === 'live' && (
              <>
                {showMonitor && (
                  <Link href={`/portals/dashboard/admin/exams/${exam._id}/monitor`} className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-lg font-bold text-xs">
                    <Activity size={12} /> Watch Live
                  </Link>
                )}
                <button onClick={() => onNotify(exam._id)} disabled={busy === exam._id} className="flex items-center gap-1.5 bg-amber-50 hover:bg-amber-100 text-amber-700 px-3 py-1.5 rounded-lg font-bold text-xs disabled:opacity-40">
                  {busy === exam._id ? <Loader2 size={12} className="animate-spin" /> : <BellRing size={12} />} Notify Class
                </button>
                <button onClick={() => onClose(exam._id)} disabled={busy === exam._id} className="flex items-center gap-1.5 bg-red-50 hover:bg-red-100 text-red-600 px-3 py-1.5 rounded-lg font-bold text-xs disabled:opacity-40">
                  Close Exam
                </button>
                {notifyMsg[exam._id] && (
                  <span className={`text-[11px] font-bold self-center ${notifyMsg[exam._id].includes('Failed') || notifyMsg[exam._id].includes('error') ? 'text-red-500' : 'text-emerald-600'}`}>
                    {notifyMsg[exam._id]}
                  </span>
                )}
              </>
            )}

            {(exam.status === 'live' || exam.status === 'closed') && (
              <Link href={`/portals/dashboard/admin/exams/${exam._id}/results`} className="flex items-center gap-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 px-3 py-1.5 rounded-lg font-bold text-xs">
                <Trophy size={12} /> View Scores
              </Link>
            )}

            <button onClick={() => onDelete(exam._id)} className="flex items-center gap-1.5 bg-red-50 hover:bg-red-100 text-red-600 px-3 py-1.5 rounded-lg font-bold text-xs ml-auto">
              <Trash2 size={12} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
