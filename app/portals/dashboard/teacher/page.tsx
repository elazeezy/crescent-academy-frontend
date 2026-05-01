import { auth } from "@/auth";
import dbConnect from "@/lib/dbConnect";
import Student from "@/models/Student";
import Result from "@/models/Result";
import Teacher from "@/models/Teacher";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  Users, ClipboardList, Eye, CheckCircle2,
  Clock, TrendingUp, BookOpen, GraduationCap, ChevronRight,
} from "lucide-react";

export default async function TeacherDashboard() {
  const session = await auth();
  if (!session?.user || session.user.role !== "teacher") redirect("/login");

  await dbConnect();

  const assignedClass = session.user.assignedClass || "";

  const students = await Student.find({
    currentClass: { $regex: assignedClass, $options: "i" },
  }).sort({ lastName: 1 }).lean();

  const studentIds = students.map((s: any) => s._id);

  // Count students that have results saved
  const resultsCount = await Result.countDocuments({
    student: { $in: studentIds },
  });

  // Get GPA for each student (latest result)
  const results = await Result.find({ student: { $in: studentIds } }).lean();
  const resultMap = new Map(results.map((r: any) => [r.student.toString(), r]));

  const classGpa =
    results.length > 0
      ? results.reduce((sum: number, r: any) => sum + (r.gpa || 0), 0) / results.length
      : null;

  const pending = students.length - resultsCount;

  // Get teacher's name from DB
  const teacher = await Teacher.findOne({ user: session.user.id })
    .populate("user", "name")
    .lean() as any;
  const teacherName: string = teacher?.user?.name || session.user.name || "Teacher";
  const firstName = teacherName.split(" ").at(-1) || teacherName;

  // Greeting
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <div className="space-y-10 pb-12">

      {/* ── HERO BANNER ── */}
      <section className="relative rounded-[2rem] overflow-hidden bg-gradient-to-br from-emerald-600/20 via-teal-700/10 to-transparent border border-emerald-500/15 p-8 md:p-10">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMiI+PHBhdGggZD0iTTM2IDM0djZoNnYtNmgtNnptNiA2djZoNnYtNmgtNnptLTEyIDBoNnY2aC02di02em0wLTEyaDZ2NmgtNnYtNnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-40" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <p className="text-emerald-400 font-bold text-sm tracking-widest uppercase mb-2">
              {greeting} 👋
            </p>
            <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">
              {firstName}
            </h1>
            <p className="text-slate-400 mt-2 text-base">
              You are managing&nbsp;
              <span className="text-emerald-400 font-bold">{assignedClass}</span>
              &nbsp;— {students.length} student{students.length !== 1 ? "s" : ""} enrolled this session.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
              <GraduationCap size={32} className="text-emerald-400" />
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wider font-bold">Your Class</p>
              <p className="text-2xl font-black text-white">{assignedClass}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS GRID ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Total Students",
            value: students.length.toString(),
            icon: Users,
            color: "text-sky-400",
            bg: "bg-sky-500/10 border-sky-500/20",
            glow: "shadow-sky-900/20",
          },
          {
            label: "Results Published",
            value: resultsCount.toString(),
            icon: CheckCircle2,
            color: "text-emerald-400",
            bg: "bg-emerald-500/10 border-emerald-500/20",
            glow: "shadow-emerald-900/20",
          },
          {
            label: "Pending Results",
            value: pending.toString(),
            icon: Clock,
            color: "text-amber-400",
            bg: "bg-amber-500/10 border-amber-500/20",
            glow: "shadow-amber-900/20",
          },
          {
            label: "Class Average",
            value: classGpa !== null ? classGpa.toFixed(1) : "—",
            icon: TrendingUp,
            color: "text-purple-400",
            bg: "bg-purple-500/10 border-purple-500/20",
            glow: "shadow-purple-900/20",
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className={`relative rounded-2xl border p-5 ${stat.bg} shadow-lg ${stat.glow} overflow-hidden`}
          >
            <div className={`w-10 h-10 rounded-xl ${stat.bg} border flex items-center justify-center mb-4`}>
              <stat.icon size={20} className={stat.color} />
            </div>
            <p className="text-xs text-slate-500 uppercase tracking-widest font-bold">{stat.label}</p>
            <p className={`text-3xl font-black mt-1 ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* ── SECTION TITLE ── */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-1 h-7 bg-emerald-400 rounded-full" />
          <h2 className="text-xl font-black text-white">Your Students</h2>
        </div>
        <span className="text-sm text-slate-500 font-medium">{students.length} enrolled</span>
      </div>

      {/* ── STUDENT GRID ── */}
      {students.length === 0 ? (
        <div className="py-24 text-center rounded-[2rem] border border-dashed border-white/10 bg-white/[0.02]">
          <BookOpen size={40} className="text-slate-600 mx-auto mb-4" />
          <p className="text-slate-400 font-semibold text-lg">No students enrolled yet</p>
          <p className="text-slate-600 text-sm mt-1">Contact the admin to enrol students in {assignedClass}.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {students.map((student: any) => {
            const sid = student._id.toString();
            const result = resultMap.get(sid) as any;
            const hasResult = !!result;

            return (
              <div
                key={sid}
                className="group relative bg-white/[0.03] border border-white/[0.07] rounded-[1.75rem] p-6 hover:bg-white/[0.06] hover:border-emerald-500/20 transition-all duration-300 overflow-hidden"
              >
                {/* Glow on hover */}
                <div className="absolute -top-12 -right-12 w-36 h-36 bg-emerald-500/5 rounded-full blur-3xl group-hover:bg-emerald-500/10 transition-colors pointer-events-none" />

                {/* Top row */}
                <div className="flex items-start gap-4 relative z-10">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-600/30 to-teal-700/30 border border-emerald-500/20 flex items-center justify-center text-lg font-black text-white shrink-0">
                    {student.firstName[0]}{student.lastName[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-white truncate group-hover:text-emerald-300 transition-colors">
                      {student.firstName} {student.lastName}
                    </h3>
                    <p className="text-emerald-400/70 text-xs font-mono tracking-wider mt-0.5">
                      {student.studentId}
                    </p>
                  </div>

                  {/* Status badge */}
                  <span className={`shrink-0 text-[10px] font-bold px-2.5 py-1 rounded-full border ${
                    hasResult
                      ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/25'
                      : 'bg-amber-500/15 text-amber-400 border-amber-500/25'
                  }`}>
                    {hasResult ? 'Done' : 'Pending'}
                  </span>
                </div>

                {/* GPA strip */}
                {hasResult && (
                  <div className="mt-4 bg-white/[0.04] rounded-xl p-3 flex items-center justify-between relative z-10">
                    <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Avg Score</span>
                    <span className="text-sm font-black text-emerald-400">{result.gpa?.toFixed(1)}</span>
                  </div>
                )}

                {/* Actions */}
                <div className="mt-4 flex gap-2.5 relative z-10">
                  <Link
                    href={`/portals/dashboard/teacher/results/${sid}`}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg shadow-emerald-900/30"
                  >
                    <ClipboardList size={16} />
                    {hasResult ? 'Edit Results' : 'Input Results'}
                  </Link>
                  <Link
                    href={`/portals/dashboard/teacher/results/${sid}/view`}
                    className="bg-white/[0.08] hover:bg-white/[0.14] text-slate-300 px-4 py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all active:scale-95 border border-white/[0.08]"
                  >
                    <Eye size={16} />
                    View
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── QUICK INFO BANNER ── */}
      <div className="rounded-2xl bg-white/[0.02] border border-white/[0.06] p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="w-10 h-10 rounded-xl bg-sky-500/15 border border-sky-500/25 flex items-center justify-center shrink-0">
          <BookOpen size={18} className="text-sky-400" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-bold text-slate-300">Report cards update the student portal in real-time.</p>
          <p className="text-xs text-slate-600 mt-0.5">Once you save results, students can immediately view their report card in their portal.</p>
        </div>
        <Link
          href="/portals/dashboard/teacher/results"
          className="shrink-0 flex items-center gap-2 text-sm font-bold text-emerald-400 hover:text-emerald-300 transition-colors"
        >
          Manage All <ChevronRight size={16} />
        </Link>
      </div>

    </div>
  );
}
