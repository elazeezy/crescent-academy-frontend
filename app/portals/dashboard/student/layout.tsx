'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, BookOpen, FileText, Calendar, CreditCard, 
  LogOut, Bell, Search, Menu, X 
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  const navItems = [
    { icon: LayoutDashboard, label: 'Overview', href: '/portals/dashboard/student' },
    { icon: FileText, label: 'Report Cards', href: '/portals/dashboard/student/results' },
    { icon: BookOpen, label: 'Coursework', href: '#' },
    { icon: Calendar, label: 'Schedule', href: '#' },
    { icon: CreditCard, label: 'Finances', href: '#' },
  ];

  return (
    <div className="min-h-screen bg-[#0f172a] text-white font-sans flex overflow-hidden">
      {/* Cinematic Background Orbs */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-sky-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-[100px]" />
      </div>

      {/* Sidebar Overlay for Mobile */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-[70] w-72 bg-[#1E3A8A]/20 backdrop-blur-3xl border-r border-white/10 transform transition-transform duration-300 lg:translate-x-0 lg:static lg:block ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        } flex flex-col`}
      >
        {/* Brand */}
        <div className="p-8 border-b border-white/5 flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-sky-400 to-blue-700 rounded-xl flex items-center justify-center shadow-lg">
            <span className="text-2xl font-black italic">C</span>
          </div>
          <div>
            <h2 className="font-bold text-xl tracking-tight">CRESCENT</h2>
            <p className="text-[10px] text-sky-400 uppercase tracking-widest font-bold">Academy</p>
          </div>
        </div>

        {/* Nav Links */}
        <nav className="p-4 space-y-1.5 flex-grow mt-4">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-4 px-5 py-3.5 rounded-xl transition-all duration-200 group ${
                  isActive 
                    ? 'bg-sky-500/20 text-white border border-sky-500/30 shadow-[0_0_20px_rgba(14,165,233,0.15)]' 
                    : 'text-slate-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                <item.icon size={20} className={isActive ? 'text-sky-400' : 'group-hover:text-sky-400'} />
                <span className="font-semibold text-sm tracking-wide">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Profile Card */}
        <div className="p-4 border-t border-white/5 bg-white/5">
          <div className="flex items-center gap-3 p-2 bg-white/5 rounded-2xl border border-white/5">
            <div className="w-10 h-10 rounded-xl bg-sky-500 flex items-center justify-center font-bold text-sm shadow-inner">AM</div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-xs truncate uppercase tracking-tighter">Abdullah M.</p>
              <p className="text-[10px] text-sky-400 font-medium">JSS 3 Gold</p>
            </div>
            <LogOut size={16} className="text-slate-500 hover:text-red-400 cursor-pointer transition-colors" />
          </div>
        </div>
      </aside>

      {/* Main Viewport */}
      <div className="flex-1 flex flex-col relative z-10 w-full overflow-hidden h-screen">
        
        {/* Responsive Header */}
        <header className="h-20 bg-[#0f172a]/80 backdrop-blur-md border-b border-white/5 px-4 md:px-8 flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-4 flex-1">
            <button 
              onClick={() => setMobileOpen(true)}
              className="lg:hidden p-2.5 bg-white/5 rounded-xl border border-white/10 text-white active:scale-95 transition-transform"
            >
              <Menu size={20} />
            </button>
            <div className="relative max-w-sm w-full hidden sm:block group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-sky-400" size={16} />
              <input
                placeholder="Search..."
                className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-11 text-sm focus:ring-2 focus:ring-sky-500/20 focus:bg-white/10 outline-none transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden md:flex flex-col items-end mr-2">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Student Status</span>
              <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" /> Active
              </span>
            </div>
            <button className="p-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors relative">
              <Bell size={20} className="text-slate-300" />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-[#0f172a]" />
            </button>
          </div>
        </header>

        {/* Scrollable Content Area */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-8 lg:p-10 scrollbar-hide">
          <div className="max-w-7xl mx-auto space-y-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}