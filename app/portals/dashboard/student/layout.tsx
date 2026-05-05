'use client';

import { useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, FileText, LogOut,
  Bell, Search, Menu, X, GraduationCap, Home,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { icon: LayoutDashboard, label: 'Overview',     href: '/portals/dashboard/student' },
  { icon: FileText,        label: 'Report Cards', href: '/portals/dashboard/student/results' },
];

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname  = usePathname();
  const { data: session } = useSession();

  const user     = session?.user;
  const name     = user?.name ?? 'Student';
  const initials = name.split(' ').map((w: string) => w[0]).join('').slice(0, 2).toUpperCase();

  return (
    <div className="min-h-screen bg-[#0a1628] text-white font-sans flex overflow-hidden">

      {/* ── Ambient background ── */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-15%] right-[-8%] w-137.5 h-137.5 bg-sky-500/8 rounded-full blur-[140px]" />
        <div className="absolute bottom-[-10%] left-[-8%] w-112.5 h-112.5 bg-blue-700/8 rounded-full blur-[120px]" />
      </div>

      {/* ── Mobile overlay ── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setMobileOpen(false)}
            className="fixed inset-0 bg-black/65 backdrop-blur-sm z-60 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* ── SIDEBAR ── */}
      <aside className={`
        fixed inset-y-0 left-0 z-70 w-72
        bg-[#0d1f3c]/80 backdrop-blur-3xl
        border-r border-white/6
        flex flex-col transition-transform duration-300
        lg:translate-x-0 lg:static lg:flex
        ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>

        {/* Brand */}
        <div className="p-7 border-b border-white/6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-linear-to-br from-sky-400 to-blue-700 rounded-xl flex items-center justify-center shadow-lg shadow-sky-900/40">
              <GraduationCap size={22} className="text-white" />
            </div>
            <div>
              <h1 className="font-black text-lg tracking-tight">CRESCENT</h1>
              <p className="text-[9px] text-sky-400 font-bold tracking-[0.35em] uppercase">Academy</p>
            </div>
          </div>
          <button onClick={() => setMobileOpen(false)} className="lg:hidden text-slate-500 hover:text-white p-1">
            <X size={20} />
          </button>
        </div>

        {/* Role badge */}
        <div className="px-5 pt-5">
          <div className="bg-sky-500/10 border border-sky-500/20 rounded-xl px-4 py-2.5 flex items-center gap-2">
            <GraduationCap size={14} className="text-sky-400" />
            <span className="text-xs font-bold text-sky-300 tracking-wider uppercase">Student Portal</span>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-4 py-5 space-y-1 mt-2">
          <p className="text-[9px] text-slate-600 font-bold uppercase tracking-[0.3em] px-3 mb-4">Menu</p>
          {navItems.map((item) => {
            const isActive = item.href === '/portals/dashboard/student'
              ? pathname === item.href
              : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-200 group relative ${
                  isActive
                    ? 'bg-sky-500/15 text-white border border-sky-500/25 shadow-[0_0_20px_rgba(14,165,233,0.1)]'
                    : 'text-slate-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                {isActive && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 bg-sky-400 rounded-r-full" />
                )}
                <item.icon size={18} className={isActive ? 'text-sky-400' : 'text-slate-500 group-hover:text-sky-400 transition-colors'} />
                <span className="font-semibold text-sm">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Profile + logout */}
        <div className="p-4 border-t border-white/6 space-y-2">
          <div className="bg-white/4 rounded-2xl p-3 flex items-center gap-3 border border-white/5">
            <div className="w-9 h-9 rounded-xl bg-sky-500/20 flex items-center justify-center text-sky-400 font-black text-sm shrink-0">
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-slate-200 truncate">{name}</p>
              <p className="text-[10px] text-sky-400/70 font-medium capitalize">Student</p>
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

      {/* ── MAIN AREA ── */}
      <div className="flex-1 flex flex-col relative z-10 h-screen overflow-hidden w-full">

        {/* Header */}
        <header className="h-17.5 bg-[#0a1628]/90 backdrop-blur-xl border-b border-white/5 px-5 md:px-8 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden p-2.5 bg-white/5 rounded-xl border border-white/8 text-white"
            >
              <Menu size={19} />
            </button>
            <div className="relative max-w-xs w-full hidden sm:block group">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-sky-400 transition-colors" size={15} />
              <input
                placeholder="Search..."
                className="w-full bg-white/5 border border-white/8 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:ring-2 focus:ring-sky-500/20 focus:bg-white/8 outline-none transition-all text-white placeholder:text-slate-600"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 bg-sky-500/10 border border-sky-500/20 rounded-full px-4 py-1.5">
              <span className="w-1.5 h-1.5 bg-sky-400 rounded-full animate-pulse" />
              <span className="text-xs font-bold text-sky-300">Active</span>
            </div>
            <button className="p-2.5 rounded-xl bg-white/5 border border-white/8 hover:bg-white/10 transition-colors relative">
              <Bell size={18} className="text-slate-400" />
            </button>
          </div>
        </header>

        {/* Scrollable content */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-5 md:p-8 scrollbar-hide">
          <div className="max-w-5xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
