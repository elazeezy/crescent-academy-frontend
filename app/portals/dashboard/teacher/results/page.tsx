import { auth } from '@/auth';
import dbConnect from '@/lib/dbConnect';
import Student from '@/models/Student';
import Result from '@/models/Result';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { ClipboardList, Eye, CheckCircle2, Clock, ChevronLeft, Users, Sheet, Building2, FlaskConical } from 'lucide-react';
import { CLASS_NAMES, SCIENCE_CLASS_NAMES } from '@/lib/subjects';

export const dynamic = 'force-dynamic';

// Loose match so "J.S.S. 1", "JSS1", "jss 1" all count as the same class.
const normalise = (s: string) => (s || '').replace(/[\s.]/g, '').toLowerCase();

const SECTION_META = {
  college: { label: 'Crescent College', icon: Building2, classes: CLASS_NAMES },
  science: { label: 'Crescent School of Science', icon: FlaskConical, classes: SCIENCE_CLASS_NAMES },
} as const;

export default async function TeacherResultsPage({
  searchParams,
}: {
  searchParams: Promise<{ section?: string; class?: string }>;
}) {
  const session = await auth();
  if (!session?.user || session.user.role !== 'teacher') redirect('/login');

  const sp = await searchParams;
  const selectedSection: '' | 'college' | 'science' =
    sp.section === 'science' ? 'science' : sp.section === 'college' ? 'college' : '';
  const selectedClass = sp.class ? decodeURIComponent(sp.class) : '';

  await dbConnect();

  // Every student in the school — any teacher can browse and edit any class.
  const allStudents = await Student.find({}, 'firstName lastName studentId currentClass section')
    .sort({ lastName: 1 })
    .lean() as any[];

  // ───────────────────────── CLASS BROWSER ─────────────────────────
  if (!selectedClass || !selectedSection) {
    const countFor = (sectionKey: 'college' | 'science', className: string) =>
      allStudents.filter(
        (s) => (s.section || 'college') === sectionKey && normalise(s.currentClass) === normalise(className),
      ).length;

    return (
      <div className="space-y-8 pb-16">
        <div>
          <Link href="/portals/dashboard/teacher" className="flex items-center gap-2 text-slate-500 hover:text-white text-sm font-medium mb-4 transition-colors w-fit">
            <ChevronLeft size={16} /> Back to Dashboard
          </Link>
          <h1 className="text-2xl font-black text-white">Results Management</h1>
          <p className="text-slate-400 text-sm mt-1">
            Pick any class in either section, then choose a student to enter or edit their results.
          </p>
        </div>

        {(['college', 'science'] as const).map((sectionKey) => {
          const meta = SECTION_META[sectionKey];
          const Icon = meta.icon;
          return (
            <div key={sectionKey}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/15 border border-emerald-500/20 flex items-center justify-center">
                  <Icon size={18} className="text-emerald-400" />
                </div>
                <h2 className="text-lg font-black text-white">{meta.label}</h2>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {meta.classes.map((cls) => {
                  const count = countFor(sectionKey, cls);
                  return (
                    <Link
                      key={cls}
                      href={`/portals/dashboard/teacher/results?section=${sectionKey}&class=${encodeURIComponent(cls)}`}
                      className="group bg-white/[0.03] border border-white/[0.07] rounded-2xl p-5 hover:bg-white/[0.06] hover:border-emerald-500/25 transition-all"
                    >
                      <div className="flex items-start justify-between">
                        <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/20 flex items-center justify-center text-xs font-black text-white">
                          {cls.replace(/[^A-Za-z0-9]/g, '').slice(0, 3).toUpperCase()}
                        </div>
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{count} student{count !== 1 ? 's' : ''}</span>
                      </div>
                      <p className="font-bold text-white mt-3 group-hover:text-emerald-300 transition-colors">{cls}</p>
                      <p className="text-xs text-emerald-400/70 mt-0.5">Open class →</p>
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  // ───────────────────────── STUDENT LIST FOR A CLASS ─────────────────────────
  const meta = SECTION_META[selectedSection];
  const students = allStudents.filter(
    (s) => (s.section || 'college') === selectedSection && normalise(s.currentClass) === normalise(selectedClass),
  );
  const studentIds = students.map((s) => s._id);
  const results = await Result.find({ student: { $in: studentIds } }).lean();
  const resultMap = new Map(results.map((r: any) => [r.student.toString(), r]));

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <Link
            href="/portals/dashboard/teacher/results"
            className="flex items-center gap-2 text-slate-500 hover:text-white text-sm font-medium mb-4 transition-colors w-fit"
          >
            <ChevronLeft size={16} /> All Classes
          </Link>
          <h1 className="text-2xl font-black text-white">{selectedClass}</h1>
          <p className="text-slate-400 text-sm mt-1">
            {meta.label} — {students.length} student{students.length !== 1 ? 's' : ''}
          </p>
        </div>
        <Link
          href={`/portals/dashboard/teacher/results/broadsheet?section=${selectedSection}&class=${encodeURIComponent(selectedClass)}`}
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2.5 rounded-xl text-sm font-bold transition-all active:scale-95"
        >
          <Sheet size={15} /> Broadsheet
        </Link>
      </div>

      {/* Summary strip */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {[
          { label: 'Total Students', value: students.length, icon: Users, color: 'text-sky-400', bg: 'bg-sky-500/10 border-sky-500/20' },
          { label: 'Results Entered', value: results.length, icon: CheckCircle2, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
          { label: 'Pending', value: Math.max(0, students.length - results.length), icon: Clock, color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20' },
        ].map((stat) => (
          <div key={stat.label} className={`rounded-2xl border p-4 ${stat.bg} flex items-center gap-3`}>
            <stat.icon size={20} className={stat.color} />
            <div>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">{stat.label}</p>
              <p className={`text-2xl font-black ${stat.color}`}>{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Student list */}
      {students.length === 0 ? (
        <div className="py-24 text-center rounded-4xl border border-dashed border-white/10 bg-white/2">
          <Users size={40} className="text-slate-600 mx-auto mb-4" />
          <p className="text-slate-400 font-semibold text-lg">No students in {selectedClass}</p>
          <p className="text-slate-600 text-sm mt-1">Contact the admin to enrol students.</p>
        </div>
      ) : (
        <div className="bg-white/3 border border-white/[0.07] rounded-[1.75rem] overflow-hidden">
          <div className="px-6 py-4 border-b border-white/6">
            <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">All Students</p>
          </div>
          <div className="divide-y divide-white/5">
            {students.map((student) => {
              const sid = student._id.toString();
              const result = resultMap.get(sid) as any;
              const done = !!result;
              return (
                <div key={sid} className="flex items-center gap-4 px-6 py-4 hover:bg-white/3 transition-colors">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/20 flex items-center justify-center text-sm font-black text-white shrink-0">
                    {student.firstName[0]}{student.lastName[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-white truncate">{student.firstName} {student.lastName}</p>
                    <p className="text-xs text-emerald-400/70 font-mono">{student.studentId}</p>
                  </div>
                  <span className={`hidden sm:inline text-[10px] font-bold px-2.5 py-1 rounded-full border shrink-0 ${
                    done ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/25' : 'bg-amber-500/15 text-amber-400 border-amber-500/25'
                  }`}>
                    {done ? `Avg: ${result.gpa?.toFixed(1)}` : 'Pending'}
                  </span>
                  <div className="flex items-center gap-2 shrink-0">
                    <Link
                      href={`/portals/dashboard/teacher/results/${sid}`}
                      className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-xl font-bold text-xs transition-all active:scale-95"
                    >
                      <ClipboardList size={14} />
                      {done ? 'Edit' : 'Enter'}
                    </Link>
                    {done && (
                      <Link
                        href={`/portals/dashboard/teacher/results/${sid}/view`}
                        className="flex items-center gap-1.5 bg-white/8 hover:bg-white/14 text-slate-300 px-4 py-2 rounded-xl font-bold text-xs transition-all border border-white/10"
                      >
                        <Eye size={14} />
                        View
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
