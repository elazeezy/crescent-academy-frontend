'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import { Bell, Clock, PlayCircle } from 'lucide-react';

interface Notification {
  _id: string;
  title: string;
  message: string;
  link: string | null;
  createdAt: string;
  isRead: boolean;
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

export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  const fetchNotifications = useCallback(async () => {
    try {
      const res = await fetch('/api/student/notifications');
      const data = await res.json();
      if (res.ok) setNotifications(data.notifications ?? []);
    } catch {
      // silent — the bell just stays as-is until the next poll
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
    const poll = setInterval(fetchNotifications, 30000);
    return () => clearInterval(poll);
  }, [fetchNotifications]);

  useEffect(() => {
    if (!open) return;
    const onClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, [open]);

  const markRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n._id === id ? { ...n, isRead: true } : n)));
    fetch('/api/student/notifications', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ notificationId: id }),
    }).catch(() => {});
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div ref={containerRef} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Notifications"
        className="p-2.5 rounded-xl bg-white/5 border border-white/8 hover:bg-white/10 transition-colors relative"
      >
        <Bell size={18} className="text-slate-400" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-emerald-500 text-white text-[10px] font-black w-4.5 h-4.5 rounded-full flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 max-h-96 overflow-y-auto bg-[#0d1f3c] border border-white/10 rounded-2xl shadow-2xl z-50">
          <div className="px-4 py-3 border-b border-white/6">
            <p className="font-bold text-white text-sm">Notifications</p>
          </div>
          {notifications.length === 0 ? (
            <p className="text-center text-slate-500 text-sm py-10 px-4">Nothing yet — exam alerts and announcements will show up here.</p>
          ) : (
            <div className="divide-y divide-white/5">
              {notifications.map((n) => {
                const content = (
                  <div className={`px-4 py-3.5 transition-colors ${n.isRead ? 'hover:bg-white/[0.03]' : 'bg-emerald-500/5 hover:bg-emerald-500/10'}`}>
                    <div className="flex items-center gap-2">
                      <p className={`font-bold text-sm ${n.isRead ? 'text-slate-300' : 'text-white'}`}>{n.title}</p>
                      {!n.isRead && <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full shrink-0" />}
                    </div>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">{n.message}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="flex items-center gap-1 text-[10px] text-slate-600 font-medium">
                        <Clock size={10} /> {timeAgo(n.createdAt)}
                      </span>
                      {n.link && (
                        <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-bold">
                          <PlayCircle size={11} /> Open
                        </span>
                      )}
                    </div>
                  </div>
                );
                return n.link ? (
                  <Link key={n._id} href={n.link} onClick={() => { markRead(n._id); setOpen(false); }}>
                    {content}
                  </Link>
                ) : (
                  <button key={n._id} onClick={() => markRead(n._id)} className="w-full text-left">
                    {content}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
