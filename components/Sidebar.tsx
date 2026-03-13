import Link from "next/link";
import { 
  LayoutDashboard, 
  Users, 
  LogOut, 
  ChevronRight, 
  Settings, 
  GraduationCap 
} from "lucide-react";

export default function Sidebar({ user }: { user: any }) {
  return (
    <aside className="w-72 bg-[#0f172a] border-r border-white/5 hidden md:flex flex-col min-h-screen sticky top-0">
      
      {/* Brand Section */}
      <div className="p-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-sky-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-sky-500/20">
            <GraduationCap className="text-white" size={24} />
          </div>
          <div>
            <h1 className="text-slate-100 font-black tracking-tighter text-xl leading-none">
              CRESCENT
            </h1>
            <p className="text-[10px] text-emerald-400 font-bold tracking-[0.3em] uppercase mt-1">
              Academy
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-4 space-y-1.5">
        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest px-4 mb-4">
          Main Menu
        </p>
        
        <SidebarLink 
          href="/portals" 
          icon={<LayoutDashboard size={20} />} 
          label="Dashboard" 
          active 
        />

        {user.role === 'admin' && (
          <SidebarLink 
            href="/portals/admin/users" 
            icon={<Users size={20} />} 
            label="Manage Users" 
          />
        )}

        <SidebarLink 
          href="/portals/settings" 
          icon={<Settings size={20} />} 
          label="Account Settings" 
        />
      </nav>

      {/* User Quick Profile & Logout */}
      <div className="p-4 mt-auto border-t border-white/5">
        <div className="bg-white/5 rounded-2xl p-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-sky-500/20 flex items-center justify-center text-sky-400 font-bold text-xs">
              {user.name?.[0] || 'U'}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-slate-200 truncate">{user.name || 'User'}</p>
              <p className="text-[10px] text-slate-500 capitalize">{user.role}</p>
            </div>
          </div>
        </div>

        <Link 
          href="/api/auth/signout" 
          className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-all duration-300 font-semibold text-sm group"
        >
          <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" />
          Logout
        </Link>
      </div>
    </aside>
  );
}

// Sub-component for clean code and hover states
function SidebarLink({ href, icon, label, active = false }: { href: string, icon: any, label: string, active?: boolean }) {
  return (
    <Link 
      href={href} 
      className={`
        flex items-center justify-between px-4 py-3.5 rounded-xl transition-all duration-300 group
        ${active 
          ? 'bg-gradient-to-r from-sky-600/20 to-transparent text-sky-400 border-l-2 border-sky-500 shadow-lg shadow-sky-900/10' 
          : 'text-slate-400 hover:text-slate-100 hover:bg-white/5'}
      `}
    >
      <div className="flex items-center gap-3 font-semibold text-sm">
        <span className={`${active ? 'text-sky-400' : 'text-slate-500 group-hover:text-sky-400'} transition-colors`}>
          {icon}
        </span>
        {label}
      </div>
      <ChevronRight 
        size={14} 
        className={`${active ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'} transition-all duration-300`} 
      />
    </Link>
  );
}