'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import {
  LayoutDashboard, ClipboardList,
  LogOut, Bell, Menu, X, GraduationCap, BookOpen, Home,
} from 'lucide-react';

const navItems = [
  { href: '/portals/dashboard/teacher',         icon: LayoutDashboard, label: 'Dashboard'   },
  { href: '/portals/dashboard/teacher/results', icon: ClipboardList,   label: 'Results'     },
];

export default function TeacherPortalLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const { data: session } = useSession();
  const teacherName = session?.user?.name ?? 'Teacher';
  const teacherInitial = teacherName[0]?.toUpperCase() ?? 'T';

  return (
    <div className="min-h-screen bg-[#060d18] text-white font-sans flex overflow-hidden">

      {/* Ambient background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-15%] right-[-10%] w-[600px] h-[600px] bg-emerald-500/8 rounded-full blur-[140px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[450px] h-[450px] bg-teal-600/8 rounded-full blur-[120px]" />
        <div className="absolute top-1/2 left-1/3 w-[300px] h-[300px] bg-sky-500/5 rounded-full blur-[100px]" />
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-60 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside className={`
        fixed inset-y-0 left-0 z-70 w-72
        bg-[#0a1628]/80 backdrop-blur-3xl border-r border-white/6
        flex flex-col transition-transform duration-300
        lg:translate-x-0 lg:static lg:flex
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Brand */}
        <div className="p-7 border-b border-white/6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-linear-to-br from-emerald-400 to-teal-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-900/40">
              <GraduationCap size={22} className="text-white" />
            </div>
            <div>
              <h1 className="font-black text-lg tracking-tight text-white">CRESCENT</h1>
              <p className="text-[9px] text-emerald-400 font-bold tracking-[0.35em] uppercase">Academy</p>
            </div>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-slate-500 hover:text-white">
            <X size={20} />
          </button>
        </div>

        {/* Role badge */}
        <div className="px-5 pt-5">
          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-4 py-2.5 flex items-center gap-2">
            <BookOpen size={14} className="text-emerald-400" />
            <span className="text-xs font-bold text-emerald-300 tracking-wider uppercase">Teacher Portal</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-5 space-y-1 mt-2">
          <p className="text-[9px] text-slate-600 font-bold uppercase tracking-[0.3em] px-3 mb-4">Menu</p>
          {navItems.map((item) => {
            const isActive = item.href === '/portals/dashboard/teacher'
              ? pathname === item.href
              : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-200 group relative ${
                  isActive
                    ? 'bg-emerald-500/15 text-white border border-emerald-500/25 shadow-[0_0_20px_rgba(16,185,129,0.1)]'
                    : 'text-slate-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                {isActive && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 bg-emerald-400 rounded-r-full" />
                )}
                <item.icon size={18} className={isActive ? 'text-emerald-400' : 'text-slate-500 group-hover:text-emerald-400 transition-colors'} />
                <span className="font-semibold text-sm">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Profile + logout */}
        <div className="p-4 border-t border-white/6 space-y-2">
          <div className="bg-white/4 rounded-2xl p-3 flex items-center gap-3 border border-white/5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold text-sm shrink-0">
              {teacherInitial}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-slate-200 truncate">{teacherName}</p>
              <p className="text-[10px] text-emerald-400/70 font-medium">Active Session</p>
            </div>
          </div>
          <Link
            href="/"
            className="w-full flex items-center gap-3 px-3 py-2.5 text-slate-500 hover:text-slate-200 hover:bg-white/5 rounded-xl transition-all text-sm font-semibold"
          >
            <Home size={17} />
            Back to Website
          </Link>
          <button
            onClick={() => signOut({ callbackUrl: window.location.origin + '/login' })}
            className="w-full flex items-center gap-3 px-3 py-2.5 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-all text-sm font-semibold group"
          >
            <LogOut size={17} className="group-hover:-translate-x-0.5 transition-transform" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* MAIN AREA */}
      <div className="flex-1 flex flex-col relative z-10 h-screen overflow-hidden w-full">

        {/* Header */}
        <header className="h-17.5 bg-[#060d18]/90 backdrop-blur-xl border-b border-white/5 px-5 md:px-8 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2.5 bg-white/5 rounded-xl border border-white/8 text-white"
            >
              <Menu size={19} />
            </button>
            <div className="hidden sm:block">
              <p className="text-[10px] text-slate-600 font-bold uppercase tracking-[0.25em]">Crescent Academy</p>
              <p className="text-sm font-bold text-slate-300">Teacher Management Portal</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-4 py-1.5">
              <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
              <span className="text-xs font-bold text-emerald-300">Live</span>
            </div>
            <button className="p-2.5 rounded-xl bg-white/5 border border-white/8 hover:bg-white/10 transition-colors relative">
              <Bell size={18} className="text-slate-400" />
            </button>
          </div>
        </header>

        {/* Scrollable content */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-5 md:p-8 lg:p-10 scrollbar-hide">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
