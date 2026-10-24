import { auth } from '@/auth';
import dbConnect from '@/lib/dbConnect';
import Student from '@/models/Student';
import Result from '@/models/Result';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import {
  Users, ClipboardList, CheckCircle2, TrendingUp, ShieldCheck,
  ChevronRight, Building2, FlaskConical,
} from 'lucide-react';
import { getOverallPerformance } from '@/lib/subjects';

export const dynamic = 'force-dynamic';

export default async function PrincipalDashboard() {
  const session = await auth();
  if (!session?.user || session.user.role !== 'principal') redirect('/login');

  await dbConnect();

  const [totalStudents, results] = await Promise.all([
    Student.countDocuments({}),
    Result.find({})
      .populate({ path: 'student', select: 'currentClass section' })
      .lean() as any,
  ]);

  const publishedCount = results.filter((r: any) => r.published).length;
  const schoolAvg = results.length
    ? results.reduce((sum: number, r: any) => sum + (r.gpa || 0), 0) / results.length
    : null;

  // Per-section split
  const sectionAgg: Record<string, { count: number; sum: number }> = {
    college: { count: 0, sum: 0 },
    science: { count: 0, sum: 0 },
  };
  // Per-class averages
  const classAgg: Record<string, { section: string; count: number; sum: number }> = {};

  for (const r of results) {
    const sec = (r.student?.section || 'college') as string;
    const cls = r.student?.currentClass || 'Unknown';
    if (!sectionAgg[sec]) sectionAgg[sec] = { count: 0, sum: 0 };
    sectionAgg[sec].count += 1;
    sectionAgg[sec].sum += r.gpa || 0;
    const key = `${sec}|${cls}`;
    if (!classAgg[key]) classAgg[key] = { section: sec, count: 0, sum: 0 };
    classAgg[key].count += 1;
    classAgg[key].sum += r.gpa || 0;
  }

  const classRows = Object.entries(classAgg)
    .map(([key, v]) => ({
      key,
      className: key.split('|')[1],
      section: v.section,
      count: v.count,
      avg: v.count ? v.sum / v.count : 0,
    }))
    .sort((a, b) => (a.section === b.section ? a.className.localeCompare(b.className) : a.section.localeCompare(b.section)));

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  const principalName = session.user.name || 'Principal';
  const firstName = principalName.split(' ').at(-1) || principalName;

  const stats = [
    { label: 'Total Students', value: totalStudents.toString(), icon: Users, color: 'text-sky-400', bg: 'bg-sky-500/10 border-sky-500/20' },
    { label: 'Results Recorded', value: results.length.toString(), icon: ClipboardList, color: 'text-indigo-400', bg: 'bg-indigo-500/10 border-indigo-500/20' },
    { label: 'Published', value: publishedCount.toString(), icon: CheckCircle2, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
    { label: 'School Average', value: schoolAvg !== null ? schoolAvg.toFixed(1) : '—', icon: TrendingUp, color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/20' },
  ];

  const sections = [
    { key: 'college', label: 'Crescent College', icon: Building2 },
    { key: 'science', label: 'Crescent School of Science', icon: FlaskConical },
  ];

  return (
    <div className="space-y-10 pb-12">

      {/* HERO */}
      <section className="relative rounded-[2rem] overflow-hidden bg-gradient-to-br from-indigo-600/20 via-purple-700/10 to-transparent border border-indigo-500/15 p-8 md:p-10">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <p className="text-indigo-400 font-bold text-sm tracking-widest uppercase mb-2">{greeting} 👋</p>
            <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">{firstName}</h1>
            <p className="text-slate-400 mt-2 text-base">
              School-wide oversight across <span className="text-indigo-400 font-bold">both sections</span> —
              review performance, edit results, and comment on report cards.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-16 h-16 rounded-2xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center">
              <ShieldCheck size={32} className="text-indigo-400" />
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className={`relative rounded-2xl border p-5 ${stat.bg} overflow-hidden`}>
            <div className={`w-10 h-10 rounded-xl ${stat.bg} border flex items-center justify-center mb-4`}>
              <stat.icon size={20} className={stat.color} />
            </div>
            <p className="text-xs text-slate-500 uppercase tracking-widest font-bold">{stat.label}</p>
            <p className={`text-3xl font-black mt-1 ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* SECTION SPLIT */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {sections.map((s) => {
          const agg = sectionAgg[s.key] ?? { count: 0, sum: 0 };
          const avg = agg.count ? agg.sum / agg.count : null;
          return (
            <div key={s.key} className="rounded-2xl border border-white/[0.07] bg-white/[0.03] p-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-indigo-500/15 border border-indigo-500/20 flex items-center justify-center shrink-0">
                <s.icon size={22} className="text-indigo-400" />
              </div>
              <div className="flex-1">
                <p className="font-bold text-white">{s.label}</p>
                <p className="text-xs text-slate-500">{agg.count} result{agg.count !== 1 ? 's' : ''} recorded</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-black text-indigo-400">{avg !== null ? avg.toFixed(1) : '—'}</p>
                <p className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Avg</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* CLASS PERFORMANCE */}
      <div>
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-1 h-7 bg-indigo-400 rounded-full" />
            <h2 className="text-xl font-black text-white">Class Performance</h2>
          </div>
          <Link
            href="/portals/dashboard/principal/results"
            className="shrink-0 flex items-center gap-2 text-sm font-bold text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            Manage Results <ChevronRight size={16} />
          </Link>
        </div>

        {classRows.length === 0 ? (
          <div className="py-20 text-center rounded-[2rem] border border-dashed border-white/10 bg-white/[0.02]">
            <ClipboardList size={40} className="text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400 font-semibold text-lg">No results recorded yet</p>
            <p className="text-slate-600 text-sm mt-1">Class averages appear here once teachers record results.</p>
          </div>
        ) : (
          <div className="bg-white/[0.03] border border-white/[0.07] rounded-[1.75rem] overflow-hidden">
            <div className="divide-y divide-white/5">
              {classRows.map((row) => (
                <div key={row.key} className="flex items-center gap-4 px-6 py-4 hover:bg-white/[0.03] transition-colors">
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/15 border border-indigo-500/20 flex items-center justify-center text-xs font-black text-white shrink-0">
                    {row.className.replace(/[^A-Za-z0-9]/g, '').slice(0, 3).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-white truncate">{row.className}</p>
                    <p className="text-xs text-slate-500">
                      {row.section === 'science' ? 'Crescent School of Science' : 'Crescent College'} · {row.count} student{row.count !== 1 ? 's' : ''}
                    </p>
                  </div>
                  <span className="hidden sm:inline text-[11px] font-bold px-2.5 py-1 rounded-full border bg-white/5 text-slate-300 border-white/10">
                    {getOverallPerformance(row.avg)}
                  </span>
                  <span className={`text-lg font-black shrink-0 ${row.avg >= 70 ? 'text-emerald-400' : row.avg >= 50 ? 'text-amber-400' : 'text-red-400'}`}>
                    {row.avg.toFixed(1)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
