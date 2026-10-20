'use client';

import { useState, useEffect, useCallback } from 'react';
import { Bell, CheckCircle, Clock, Loader2, RotateCcw, Check, X } from 'lucide-react';

interface Notification {
  _id: string;
  title: string;
  message: string;
  createdAt: string;
  isRead: boolean;
}

interface ReattemptReq {
  _id: string;
  examTitle: string;
  studentName: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

function timeAgo(date: string) {
  const diff = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

export default function TeacherNotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading,       setLoading]       = useState(true);
  const [marking,       setMarking]       = useState<string | null>(null);
  const [reattempts,    setReattempts]    = useState<ReattemptReq[]>([]);
  const [deciding,      setDeciding]      = useState<string | null>(null);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const res  = await fetch('/api/teacher/notifications');
      const data = await res.json();
      setNotifications(data.notifications ?? []);
    } finally {
      setLoading(false);
    }
  };

  const fetchReattempts = useCallback(async () => {
    try {
      const res = await fetch('/api/teacher/reattempt-requests');
      const data = await res.json();
      setReattempts(data.pending ?? []);
    } catch { /* non-fatal */ }
  }, []);

  useEffect(() => { fetchNotifications(); fetchReattempts(); }, [fetchReattempts]);

  const decide = async (id: string, decision: 'approve' | 'reject') => {
    setDeciding(id);
    try {
      const res = await fetch(`/api/teacher/reattempt-requests/${id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ decision }),
      });
      const data = await res.json();
      if (!res.ok) { alert(data.error ?? 'Could not update the request.'); return; }
      setReattempts((prev) => prev.filter((r) => r._id !== id));
    } catch {
      alert('Network error. Please try again.');
    } finally {
      setDeciding(null);
    }
  };

  const markRead = async (id: string) => {
    setMarking(id);
    try {
      await fetch('/api/teacher/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notificationId: id }),
      });
      setNotifications(prev =>
        prev.map(n => n._id === id ? { ...n, isRead: true } : n)
      );
    } finally {
      setMarking(null);
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="space-y-8 pb-16">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-3">
            <Bell size={22} className="text-emerald-400" />
            Notifications
          </h1>
          <p className="text-slate-400 text-sm mt-1">Messages from the school administration.</p>
        </div>
        {unreadCount > 0 && (
          <span className="bg-emerald-500 text-white text-xs font-black px-3 py-1 rounded-full">
            {unreadCount} unread
          </span>
        )}
      </div>

      {/* ── Re-attempt requests (action required) ── */}
      {reattempts.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-sm font-black text-amber-300 uppercase tracking-wider flex items-center gap-2">
            <RotateCcw size={15} /> Re-attempt requests ({reattempts.length})
          </h2>
          {reattempts.map((r) => (
            <div key={r._id} className="rounded-2xl p-5 border border-amber-500/30 bg-amber-500/[0.07]">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="min-w-0">
                  <p className="font-bold text-white text-sm">
                    {r.studentName} wants to re-attempt <span className="text-amber-200">{r.examTitle}</span>.
                  </p>
                  {r.reason && <p className="text-slate-300 text-sm mt-1 italic">“{r.reason}”</p>}
                  <div className="flex items-center gap-1 mt-2 text-[10px] text-slate-500 font-medium">
                    <Clock size={11} /> {timeAgo(r.createdAt)}
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => decide(r._id, 'approve')}
                    disabled={deciding === r._id}
                    className="flex items-center gap-1.5 text-xs font-bold px-4 py-2 rounded-lg bg-emerald-500 text-white hover:bg-emerald-400 transition-all disabled:opacity-50"
                  >
                    {deciding === r._id ? <Loader2 size={13} className="animate-spin" /> : <Check size={14} />} Approve
                  </button>
                  <button
                    onClick={() => decide(r._id, 'reject')}
                    disabled={deciding === r._id}
                    className="flex items-center gap-1.5 text-xs font-bold px-4 py-2 rounded-lg bg-white/5 text-red-300 border border-red-500/30 hover:bg-red-500/10 transition-all disabled:opacity-50"
                  >
                    <X size={14} /> Reject
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {loading ? (
        <div className="py-24 flex items-center justify-center gap-2 text-slate-400">
          <Loader2 size={20} className="animate-spin" /> Loading notifications…
        </div>
      ) : notifications.length === 0 ? (
        <div className="py-24 text-center rounded-[2rem] border border-dashed border-white/10">
          <Bell size={40} className="text-slate-600 mx-auto mb-4" />
          <p className="text-slate-400 font-semibold">No notifications yet.</p>
          <p className="text-slate-600 text-sm mt-1">The admin will send announcements here.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map(n => (
            <div
              key={n._id}
              className={`rounded-2xl p-5 border transition-all ${
                n.isRead
                  ? 'bg-white/[0.02] border-white/[0.06]'
                  : 'bg-emerald-500/5 border-emerald-500/20 shadow-[0_0_20px_rgba(16,185,129,0.05)]'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 flex-1">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                    n.isRead ? 'bg-white/5' : 'bg-emerald-500/20 border border-emerald-500/30'
                  }`}>
                    <Bell size={14} className={n.isRead ? 'text-slate-500' : 'text-emerald-400'} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className={`font-bold text-sm ${n.isRead ? 'text-slate-300' : 'text-white'}`}>
                        {n.title}
                      </p>
                      {!n.isRead && (
                        <span className="w-2 h-2 bg-emerald-400 rounded-full shrink-0" />
                      )}
                    </div>
                    <p className="text-sm text-slate-400 leading-relaxed">{n.message}</p>
                    <div className="flex items-center gap-1 mt-2 text-[10px] text-slate-600 font-medium">
                      <Clock size={11} />
                      {timeAgo(n.createdAt)}
                    </div>
                  </div>
                </div>

                {!n.isRead && (
                  <button
                    onClick={() => markRead(n._id)}
                    disabled={marking === n._id}
                    className="shrink-0 flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500/25 border border-emerald-500/25 transition-all disabled:opacity-50"
                  >
                    {marking === n._id
                      ? <Loader2 size={12} className="animate-spin" />
                      : <CheckCircle size={12} />}
                    Mark read
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
