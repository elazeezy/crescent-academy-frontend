import Link from 'next/link';
import { Users, Briefcase, GraduationCap, FileText, ArrowRight, TrendingUp, Globe } from 'lucide-react';
import dbConnect from '@/lib/dbConnect';
import Student from '@/models/Student';
import Teacher from '@/models/Teacher';
import Result from '@/models/Result';

export default async function AdminDashboardPage() {
  await dbConnect();

  const [studentCount, teacherCount, resultCount] = await Promise.all([
    Student.countDocuments(),
    Teacher.countDocuments(),
    Result.countDocuments(),
  ]);

  const stats = [
    { label: 'Total Students', value: studentCount, icon: <Users size={22} />, color: 'text-sky-600', bg: 'bg-sky-50', border: 'border-sky-100' },
    { label: 'Total Staff', value: teacherCount, icon: <Briefcase size={22} />, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100' },
    { label: 'Results Submitted', value: resultCount, icon: <FileText size={22} />, color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-100' },
  ];

  const actions = [
    {
      href: '/portals/dashboard/admin/student',
      icon: <Users size={26} />,
      label: 'Student Management',
      desc: 'View all students, upload in bulk via Excel',
      color: 'text-sky-600',
      bg: 'bg-sky-50',
      hover: 'hover:border-sky-300 hover:shadow-sky-100',
    },
    {
      href: '/portals/dashboard/admin/teacher',
      icon: <Briefcase size={26} />,
      label: 'Staff Management',
      desc: 'View all teachers, assign classes via Excel',
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
      hover: 'hover:border-emerald-300 hover:shadow-emerald-100',
    },
    {
      href: '/portals/dashboard/admin/results',
      icon: <GraduationCap size={26} />,
      label: 'Academic Results',
      desc: 'Review, add principal comment, and publish report cards',
      color: 'text-purple-600',
      bg: 'bg-purple-50',
      hover: 'hover:border-purple-300 hover:shadow-purple-100',
    },
    {
      href: '/portals/dashboard/admin/website',
      icon: <Globe size={26} />,
      label: 'Website Images',
      desc: 'Upload and manage images shown on the public website',
      color: 'text-indigo-600',
      bg: 'bg-indigo-50',
      hover: 'hover:border-indigo-300 hover:shadow-indigo-100',
    },
  ];

  return (
    <div className="space-y-10 max-w-6xl">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Admin Overview</h1>
        <p className="text-slate-500 text-sm mt-1">Manage your school's students, staff, and academic records.</p>
      </div>

      {/* Live Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {stats.map((s) => (
          <div key={s.label} className={`bg-white border ${s.border} rounded-2xl p-6 flex items-center gap-5 shadow-sm`}>
            <div className={`${s.bg} ${s.color} p-3 rounded-xl`}>{s.icon}</div>
            <div>
              <p className="text-2xl font-black text-slate-900">{s.value}</p>
              <p className="text-xs text-slate-500 font-semibold mt-0.5">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div>
        <div className="flex items-center gap-2 mb-5">
          <TrendingUp size={16} className="text-slate-400" />
          <h2 className="text-sm font-bold text-slate-500 uppercase tracking-widest">Quick Actions</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {actions.map((a) => (
            <Link
              key={a.label}
              href={a.href}
              className={`group bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-lg ${a.hover} transition-all duration-200`}
            >
              <div className={`${a.bg} ${a.color} w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200`}>
                {a.icon}
              </div>
              <h3 className="font-bold text-slate-800 text-base">{a.label}</h3>
              <p className="text-xs text-slate-500 mt-1">{a.desc}</p>
              <div className={`flex items-center gap-1 mt-4 text-xs font-bold ${a.color}`}>
                Open <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          )
          )}
        </div>
      </div>
    </div>
  );
}
