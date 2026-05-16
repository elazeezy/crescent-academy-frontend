'use client';

import { useState, useEffect } from 'react';
import {
  Bell, Send, Loader2, CheckCircle, Clock, ArrowLeft, Plus, X,
} from 'lucide-react';
import Link from 'next/link';

interface Notification {
  _id: string;
  title: string;
  message: string;
  targetRole: string;
  readBy: string[];
  createdAt: string;
  sentBy?: { name: string };
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

export default function AdminNotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading,   setLoading]   = useState(true);
  const [sending,   setSending]   = useState(false);
  const [showForm,  setShowForm]  = useState(false);
  const [title,     setTitle]     = useState('');
  const [message,   setMessage]   = useState('');
  const [target,    setTarget]    = useState<'teacher' | 'all'>('teacher');
  const [feedback,  setFeedback]  = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const res  = await fetch('/api/admin/notifications');
      const data = await res.json();
      setNotifications(data.notifications ?? []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchNotifications(); }, []);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) return;
    setSending(true);
    setFeedback(null);
    try {
      const res  = await fetch('/api/admin/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: title.trim(), message: message.trim(), targetRole: target }),
      });
      const data = await res.json();
      if (res.ok) {
        setNotifications(prev => [data.notification, ...prev]);
        setShowForm(false);
        setTitle(''); setMessage('');
        setFeedback({ type: 'success', text: 'Notification sent to all teachers.' });
      } else {
        setFeedback({ type: 'error', text: data.error || 'Failed to send.' });
      }
    } catch {
      setFeedback({ type: 'error', text: 'Network error. Try again.' });
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="max-w-4xl space-y-6">

      {/* Header */}
      <div className="flex items-center gap-3">
        <Link href="/portals/dashboard/admin" className="text-slate-400 hover:text-slate-600 transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-extrabold text-slate-900">Notifications</h1>
          <p className="text-slate-500 text-sm">Send announcements to teachers.</p>
        </div>
        <button
          onClick={() => setShowForm(v => !v)}
          className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-all shadow-md"
        >
          {showForm ? <><X size={15} /> Cancel</> : <><Plus size={15} /> New Notification</>}
        </button>
      </div>

      {/* Feedback */}
      {feedback && (
        <div className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold border ${
          feedback.type === 'success'
            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
            : 'bg-red-50 text-red-700 border-red-200'
        }`}>
          <CheckCircle size={15} />
          {feedback.text}
        </div>
      )}

      {/* Compose form */}
      {showForm && (
        <form
          onSubmit={handleSend}
          className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-5"
        >
          <h2 className="font-bold text-slate-800 flex items-center gap-2">
            <Bell size={16} className="text-purple-600" /> Compose Notification
          </h2>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Title *</label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g. Staff Meeting — Friday 2pm"
              required
              className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400/30 focus:border-purple-400"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Message *</label>
            <textarea
              value={message}
              onChange={e => setMessage(e.target.value)}
              placeholder="Type your announcement here…"
              rows={4}
              required
              className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400/30 focus:border-purple-400 resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Send To</label>
            <div className="flex gap-3">
              {(['teacher', 'all'] as const).map(role => (
                <button
                  key={role}
                  type="button"
                  onClick={() => setTarget(role)}
                  className={`px-4 py-2 rounded-xl text-sm font-bold border transition-all capitalize ${
                    target === role
                      ? 'bg-purple-600 text-white border-purple-600'
                      : 'bg-white text-slate-600 border-slate-200 hover:border-purple-300'
                  }`}
                >
                  {role === 'teacher' ? 'Teachers Only' : 'Everyone'}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={sending || !title.trim() || !message.trim()}
            className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-40 disabled:cursor-not-allowed text-white px-7 py-2.5 rounded-xl font-bold text-sm transition-all"
          >
            {sending ? <><Loader2 size={15} className="animate-spin" /> Sending…</> : <><Send size={15} /> Send Notification</>}
          </button>
        </form>
      )}

      {/* Notification history */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="font-bold text-slate-800 text-sm">Sent Notifications ({notifications.length})</h2>
        </div>

        {loading ? (
          <div className="py-20 flex items-center justify-center gap-2 text-slate-400">
            <Loader2 size={18} className="animate-spin" /> Loading…
          </div>
        ) : notifications.length === 0 ? (
          <div className="py-20 text-center text-slate-400">
            <Bell size={36} className="mx-auto mb-3 opacity-30" />
            <p className="font-semibold text-sm">No notifications sent yet.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {notifications.map(n => (
              <div key={n._id} className="px-5 py-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-bold text-slate-800 text-sm">{n.title}</p>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border capitalize ${
                        n.targetRole === 'teacher'
                          ? 'bg-blue-50 text-blue-600 border-blue-200'
                          : 'bg-purple-50 text-purple-600 border-purple-200'
                      }`}>
                        {n.targetRole === 'teacher' ? 'Teachers' : 'Everyone'}
                      </span>
                    </div>
                    <p className="text-sm text-slate-500 leading-relaxed">{n.message}</p>
                  </div>
                  <div className="shrink-0 text-right">
                    <div className="flex items-center gap-1 text-[10px] text-slate-400 justify-end">
                      <Clock size={10} />
                      {timeAgo(n.createdAt)}
                    </div>
                    <p className="text-[10px] text-emerald-600 font-semibold mt-1">
                      {n.readBy?.length ?? 0} read
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
