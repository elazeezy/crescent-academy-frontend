import { auth } from '@/auth';
import dbConnect from '@/lib/dbConnect';
import Student from '@/models/Student';
import Result from '@/models/Result';
import Teacher from '@/models/Teacher';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { ClipboardList, Eye, CheckCircle2, Clock, ChevronLeft, Users } from 'lucide-react';

export default async function TeacherResultsPage() {
  const session = await auth();
  if (!session?.user || session.user.role !== 'teacher') redirect('/login');

  await dbConnect();

  const assignedClass = session.user.assignedClass || '';
  const normalised    = assignedClass.replace(/[\s.]/g, '');
  const flexPattern   = normalised.split('').join('[\\s.]*');
  const classRegex    = normalised.length > 0 ? flexPattern : assignedClass;

  const [students, teacher] = await Promise.all([
    Student.find({ currentClass: { $regex: classRegex, $options: 'i' } })
      .sort({ lastName: 1 }).lean(),
    Teacher.findOne({ user: session.user.id }).lean() as any,
  ]);

  const studentIds = students.map((s: any) => s._id);
  const results    = await Result.find({ student: { $in: studentIds } }).lean();
  const resultMap  = new Map(results.map((r: any) => [r.student.toString(), r]));

  return (
    <div className="space-y-8 pb-16">

      {/* Header */}
      <div>
        <Link
          href="/portals/dashboard/teacher"
          className="flex items-center gap-2 text-slate-500 hover:text-white text-sm font-medium mb-4 transition-colors w-fit"
        >
          <ChevronLeft size={16} /> Back to Dashboard
        </Link>
        <h1 className="text-2xl font-black text-white">Results Management</h1>
        <p className="text-slate-400 text-sm mt-1">
          <span className="text-emerald-400 font-bold">{assignedClass}</span>
          &nbsp;— {students.length} student{students.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Summary strip */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {[
          { label: 'Total Students', value: students.length, icon: Users, color: 'text-sky-400', bg: 'bg-sky-500/10 border-sky-500/20' },
          { label: 'Results Entered', value: results.length, icon: CheckCircle2, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
          { label: 'Pending', value: students.length - results.length, icon: Clock, color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20' },
        ].map(stat => (
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
          <p className="text-slate-400 font-semibold text-lg">No students in {assignedClass}</p>
          <p className="text-slate-600 text-sm mt-1">Contact the admin to enrol students.</p>
        </div>
      ) : (
        <div className="bg-white/3 border border-white/[0.07] rounded-[1.75rem] overflow-hidden">
          <div className="px-6 py-4 border-b border-white/6">
            <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">All Students</p>
          </div>
          <div className="divide-y divide-white/5">
            {(students as any[]).map((student) => {
              const sid    = student._id.toString();
              const result = resultMap.get(sid) as any;
              const done   = !!result;

              return (
                <div key={sid} className="flex items-center gap-4 px-6 py-4 hover:bg-white/3 transition-colors">
                  {/* Avatar */}
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/20 flex items-center justify-center text-sm font-black text-white shrink-0">
                    {student.firstName[0]}{student.lastName[0]}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-white truncate">{student.firstName} {student.lastName}</p>
                    <p className="text-xs text-emerald-400/70 font-mono">{student.studentId}</p>
                  </div>

                  {/* Status */}
                  <span className={`hidden sm:inline text-[10px] font-bold px-2.5 py-1 rounded-full border shrink-0 ${
                    done
                      ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/25'
                      : 'bg-amber-500/15 text-amber-400 border-amber-500/25'
                  }`}>
                    {done ? `Avg: ${result.gpa?.toFixed(1)}` : 'Pending'}
                  </span>

                  {/* Actions */}
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
