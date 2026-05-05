'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import {
  LayoutDashboard,
  Users,
  Briefcase,
  GraduationCap,
  LogOut,
  ChevronRight,
  FileText,
  BookOpen,
  ShieldPlus,
  Globe,
  Home,
} from 'lucide-react';

interface NavItem {
  href: string;
  icon: React.ReactNode;
  label: string;
}

const adminNav: NavItem[] = [
  { href: '/portals/dashboard/admin', icon: <LayoutDashboard size={18} />, label: 'Dashboard' },
  { href: '/portals/dashboard/admin/student', icon: <Users size={18} />, label: 'Students' },
  { href: '/portals/dashboard/admin/teacher', icon: <Briefcase size={18} />, label: 'Staff' },
  { href: '/portals/dashboard/admin/results', icon: <FileText size={18} />, label: 'Results' },
  { href: '/portals/dashboard/admin/website', icon: <Globe size={18} />, label: 'Website Images' },
  { href: '/portals/dashboard/admin/create-admin', icon: <ShieldPlus size={18} />, label: 'Create Admin' },
];

const teacherNav: NavItem[] = [
  { href: '/portals/dashboard/teacher', icon: <LayoutDashboard size={18} />, label: 'Dashboard' },
  { href: '/portals/dashboard/teacher/results', icon: <FileText size={18} />, label: 'Results' },
];

const studentNav: NavItem[] = [
  { href: '/portals/dashboard/student', icon: <LayoutDashboard size={18} />, label: 'Dashboard' },
  { href: '/portals/dashboard/student/results', icon: <BookOpen size={18} />, label: 'My Results' },
];

function getNav(role: string) {
  if (role === 'admin') return adminNav;
  if (role === 'teacher') return teacherNav;
  return studentNav;
}

export default function Sidebar({ user }: { user: any }) {
  const pathname = usePathname();
  const navItems = getNav(user?.role);

  return (
    <aside className="w-64 bg-[#0f172a] border-r border-white/5 hidden md:flex flex-col min-h-screen sticky top-0">
      {/* Brand */}
      <div className="px-6 py-7 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-linear-to-br from-sky-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-sky-500/20">
            <GraduationCap className="text-white" size={20} />
          </div>
          <div>
            <h1 className="text-slate-100 font-black tracking-tighter text-lg leading-none">CRESCENT</h1>
            <p className="text-[9px] text-emerald-400 font-bold tracking-[0.3em] uppercase mt-0.5">Academy</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-5 space-y-1">
        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest px-3 mb-3">
          {user?.role === 'admin' ? 'Admin Menu' : user?.role === 'teacher' ? 'Teacher Menu' : 'Student Menu'}
        </p>

        {navItems.map((item) => {
          const isActive =
            item.href === '/portals/dashboard/admin'
              ? pathname === item.href
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center justify-between px-3 py-2.5 rounded-xl transition-all duration-200 group ${
                isActive
                  ? 'bg-linear-to-r from-sky-600/20 to-transparent text-sky-400 border-l-2 border-sky-500'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-white/5'
              }`}
            >
              <div className="flex items-center gap-3 text-sm font-semibold">
                <span className={isActive ? 'text-sky-400' : 'text-slate-500 group-hover:text-sky-400 transition-colors'}>
                  {item.icon}
                </span>
                {item.label}
              </div>
              {isActive && <ChevronRight size={14} className="text-sky-400" />}
            </Link>
          );
        })}
      </nav>

      {/* User card + logout */}
      <div className="px-3 py-4 border-t border-white/5 space-y-2">
        <div className="bg-white/5 rounded-xl px-3 py-3 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-sky-500/20 flex items-center justify-center text-sky-400 font-bold text-xs shrink-0">
            {user?.name?.[0]?.toUpperCase() ?? 'U'}
          </div>
          <div className="min-w-0">
            <p className="text-xs font-bold text-slate-200 truncate">{user?.name ?? 'User'}</p>
            <p className="text-[10px] text-slate-500 capitalize">{user?.role}</p>
          </div>
        </div>

        <Link
          href="/"
          className="w-full flex items-center gap-3 px-3 py-2.5 text-slate-500 hover:text-slate-200 hover:bg-white/5 rounded-xl transition-all duration-200 text-sm font-semibold"
        >
          <Home size={18} />
          Back to Website
        </Link>
        <button
          onClick={() => signOut({ callbackUrl: window.location.origin + '/login' })}
          className="w-full flex items-center gap-3 px-3 py-2.5 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-all duration-200 text-sm font-semibold group"
        >
          <LogOut size={18} className="group-hover:-translate-x-0.5 transition-transform" />
          Logout
        </button>
      </div>
    </aside>
  );
}
