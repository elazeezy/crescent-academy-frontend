import { auth } from '@/auth';
import dbConnect from '@/lib/dbConnect';
import Student from '@/models/Student';
import Result from '@/models/Result';
import Exam from '@/models/Exam';
import ExamAttempt from '@/models/ExamAttempt';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import {
  FileText, TrendingUp, Calendar, BookOpen,
  CheckCircle, Clock, Award, ChevronRight, User,
} from 'lucide-react';

export default async function StudentDashboard() {
  await dbConnect();
  const session = await auth();

  if (!session?.user || session.user.role !== 'student') redirect('/login');

  const studentProfile = await Student.findOne({ user: session.user.id }).lean() as any;

  type ExamLite = { _id: { toString(): string }; title?: string; windowStart?: Date; windowEnd?: Date };

  const liveAssessments = studentProfile ? await Exam.find({
    section: studentProfile.section,
    targetClass: studentProfile.currentClass,
    status: 'live',
  }).select('_id title assessmentSlot windowStart windowEnd').lean() as ExamLite[] : [];

  // All of the student's attempts — not just on live exams — so an in-progress or a
  // re-attempt that was granted after the exam closed still surfaces here.
  const allAttempts = studentProfile
    ? await ExamAttempt.find({ student: studentProfile._id }).select('exam status reattemptAllowed').lean() as { exam: { toString(): string }; status: string; reattemptAllowed?: boolean }[]
    : [];
  const attemptByExam = new Map(allAttempts.map((a) => [a.exam.toString(), a]));
  const attemptedExamIds = new Set(allAttempts.map((a) => a.exam.toString()));

  // Fetch titles for any attempted exam that isn't already in liveAssessments
  // (e.g. a reopened exam whose window/status has since closed).
  const liveIds = new Set(liveAssessments.map((e) => e._id.toString()));
  const extraExamIds = allAttempts
    .filter((a) => {
      const reopened = a.reattemptAllowed && (a.status === 'submitted' || a.status === 'auto_submitted');
      return (reopened || a.status === 'in_progress') && !liveIds.has(a.exam.toString());
    })
    .map((a) => a.exam);
  const extraExams = studentProfile && extraExamIds.length
    ? await Exam.find({ _id: { $in: extraExamIds } }).select('_id title windowStart windowEnd').lean() as ExamLite[]
    : [];
  const examById = new Map<string, ExamLite>([...liveAssessments, ...extraExams].map((e) => [e._id.toString(), e]));

  const windowOpen = (e: { windowStart?: Date; windowEnd?: Date }) =>
    (!e.windowStart || new Date(e.windowStart) <= new Date()) && (!e.windowEnd || new Date(e.windowEnd) >= new Date());
  const cbtToAttend = liveAssessments.filter((e) => !attemptedExamIds.has(e._id.toString()) && windowOpen(e));
  const cbtInProgress = Array.from(examById.values()).filter((e) => attemptByExam.get(e._id.toString())?.status === 'in_progress');
  // Re-attempt shows regardless of the due date — a reopened exam is intentional.
  const cbtReattempt = Array.from(examById.values()).filter((e) => {
    const a = attemptByExam.get(e._id.toString());
    return a?.reattemptAllowed && (a.status === 'submitted' || a.status === 'auto_submitted');
  });

  const latestResult = studentProfile
    ? await Result.findOne({ student: studentProfile._id, published: true })
        .sort({ createdAt: -1 })
        .lean() as any
    : null;

  const gpa         = typeof latestResult?.gpa === 'number' ? latestResult.gpa : null;
  const subjectCount = latestResult?.subjects?.length ?? 0;
  const attendance   = latestResult?.attendance;
  const attendancePct = attendance?.daysOpened
    ? Math.round((attendance.daysPresent / attendance.daysOpened) * 100)
    : null;

  const name       = studentProfile
    ? `${studentProfile.firstName} ${studentProfile.lastName}`
    : session.user.name ?? 'Student';
  const initials   = name.split(' ').map((w: string) => w[0]).join('').slice(0, 2).toUpperCase();
  const hasResults = !!latestResult;

  // Best subject
  const bestSubject = latestResult?.subjects
    ? [...latestResult.subjects].sort((a: any, b: any) => b.total - a.total)[0]
    : null;

  return (
    <div className="space-y-8 pb-16">

      {/* Resume: an exam started but not yet submitted (e.g. the network dropped mid-exam). */}
      {cbtInProgress.map((e) => (
        <Link key={`resume-${e._id.toString()}`} href={`/portals/dashboard/student/exams/${e._id.toString()}`} className="flex items-center justify-between gap-4 rounded-2xl border border-sky-400/50 bg-sky-500 px-5 py-4 text-white shadow-lg hover:bg-sky-400 transition-colors">
          <span className="min-w-0"><strong className="block text-sm md:text-base">Continue your exam{e.title ? `: ${e.title}` : ''}.</strong><span className="text-xs md:text-sm text-sky-50/90">You have an exam in progress. Your answers were saved — pick up where you left off.</span></span>
          <span className="shrink-0 rounded-xl bg-slate-950 px-4 py-2 text-xs font-bold text-white">Continue</span>
        </Link>
      ))}

      {/* Re-attempt: a teacher/admin reopened a submitted exam for this student. */}
      {cbtReattempt.map((e) => (
        <Link key={`reattempt-${e._id.toString()}`} href={`/portals/dashboard/student/exams/${e._id.toString()}`} className="flex items-center justify-between gap-4 rounded-2xl border border-emerald-400/50 bg-emerald-500 px-5 py-4 text-white shadow-lg hover:bg-emerald-400 transition-colors">
          <span className="min-w-0"><strong className="block text-sm md:text-base">You have to re-attempt{e.title ? `: ${e.title}` : ''} — start now.</strong><span className="text-xs md:text-sm text-emerald-50/90">Your teacher has reopened this exam for you. Starting it begins a fresh attempt and replaces your previous score.</span></span>
          <span className="shrink-0 rounded-xl bg-slate-950 px-4 py-2 text-xs font-bold text-white">Start now</span>
        </Link>
      ))}

      {cbtToAttend.length > 0 && (
        <Link href="/portals/dashboard/student/exams" className="flex items-center justify-between gap-4 rounded-2xl border border-amber-400/40 bg-amber-300 px-5 py-4 text-slate-950 shadow-lg hover:bg-amber-200 transition-colors">
          <span><strong className="block text-sm md:text-base">You have {cbtToAttend.length === 1 ? 'a CBT to attend' : `${cbtToAttend.length} CBTs to attend`}.</strong><span className="text-xs md:text-sm">Click the notification bell or open this alert to attempt your assigned CBT.</span></span>
          <span className="shrink-0 rounded-xl bg-slate-950 px-4 py-2 text-xs font-bold text-white">Attempt CBT</span>
        </Link>
      )}

      {/* ── PROFILE HERO ── */}
      <section className="glass-card p-6 md:p-10 relative overflow-hidden">
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start gap-6 md:gap-8">
          {/* Avatar */}
          <div className="w-24 h-24 md:w-32 md:h-32 rounded-3xl bg-gradient-to-br from-sky-500/30 to-blue-700/30 border border-sky-500/30 flex items-center justify-center text-3xl md:text-4xl font-black text-white shadow-2xl shrink-0">
            {studentProfile?.photo
              ? <img src={studentProfile.photo} alt={name} className="w-full h-full object-cover rounded-3xl" />
              : initials
            }
          </div>

          {/* Info */}
          <div className="flex-1 text-center sm:text-left">
            <p className="text-sky-400 text-xs font-bold uppercase tracking-widest mb-1">Student Profile</p>
            <h1 className="text-2xl md:text-4xl font-black text-white tracking-tight">{name}</h1>
            <div className="flex flex-wrap gap-2 mt-3 justify-center sm:justify-start">
              <Badge color="sky">{studentProfile?.studentId ?? 'N/A'}</Badge>
              <Badge color="slate">{studentProfile?.currentClass ?? 'Class N/A'}</Badge>
              <Badge color="slate">{studentProfile?.section === 'science' ? 'Crescent School of Science' : 'Crescent College'}</Badge>
              <Badge color="slate">{studentProfile?.gender === 'male' ? 'Male' : studentProfile?.gender === 'female' ? 'Female' : '—'}</Badge>
              {latestResult && <Badge color="emerald">{latestResult.term} · {latestResult.session}</Badge>}
            </div>
          </div>

          {/* CTA */}
          <Link
            href="/portals/dashboard/student/results"
            className="shrink-0 flex items-center gap-2 bg-white text-slate-900 font-black px-6 py-3.5 rounded-2xl hover:scale-105 transition-all shadow-xl text-sm"
          >
            <FileText size={18} /> View Report Card
          </Link>
        </div>
      </section>

      {/* ── STATS GRID ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={TrendingUp}
          label="Average Score"
          value={gpa !== null ? `${gpa.toFixed(1)}` : '—'}
          sub={gpa !== null ? gradeLabel(gpa) : 'No results yet'}
          color="sky"
        />
        <StatCard
          icon={BookOpen}
          label="Subjects"
          value={subjectCount > 0 ? subjectCount.toString() : '—'}
          sub={subjectCount > 0 ? `${latestResult.term}` : 'Pending'}
          color="purple"
        />
        <StatCard
          icon={CheckCircle}
          label="Attendance"
          value={attendancePct !== null ? `${attendancePct}%` : '—'}
          sub={attendance ? `${attendance.daysPresent}/${attendance.daysOpened} days` : 'Not recorded'}
          color={attendancePct !== null && attendancePct >= 75 ? 'emerald' : 'amber'}
        />
        <StatCard
          icon={Award}
          label="Best Subject"
          value={bestSubject ? bestSubject.grade : '—'}
          sub={bestSubject ? bestSubject.subjectName.split(' ').slice(0, 2).join(' ') : 'No results yet'}
          color="yellow"
        />
      </div>

      {/* ── SUBJECT PERFORMANCE ── */}
      {hasResults && latestResult.subjects?.length > 0 && (
        <div className="glass-card p-6 md:p-8 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-black text-white text-lg flex items-center gap-2">
              <BookOpen size={18} className="text-sky-400" /> Subject Performance
            </h2>
            <span className="text-xs text-slate-500 font-medium">{latestResult.term} · {latestResult.session}</span>
          </div>

          <div className="space-y-3">
            {latestResult.subjects.map((sub: any, i: number) => {
              const pct = sub.total;
              const grade = sub.grade;
              const barColor = grade.startsWith('A') ? 'bg-emerald-500'
                : grade.startsWith('B') ? 'bg-sky-500'
                : grade.startsWith('C') ? 'bg-yellow-500'
                : 'bg-red-500';
              return (
                <div key={i} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-300 font-medium truncate max-w-[60%]">{sub.subjectName}</span>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-slate-400 font-medium">{sub.total}/100</span>
                      <span className={`text-xs font-black px-2 py-0.5 rounded-md ${
                        grade.startsWith('A') ? 'bg-emerald-500/20 text-emerald-400'
                        : grade.startsWith('B') ? 'bg-sky-500/20 text-sky-400'
                        : grade.startsWith('C') ? 'bg-yellow-500/20 text-yellow-400'
                        : 'bg-red-500/20 text-red-400'
                      }`}>{grade}</span>
                    </div>
                  </div>
                  <div className="w-full bg-white/5 rounded-full h-1.5">
                    <div
                      className={`h-1.5 rounded-full ${barColor} transition-all duration-1000`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── ATTENDANCE + COMMENTS ── */}
      {hasResults && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          {/* Attendance card */}
          {attendance && (
            <div className="glass-card p-6 space-y-4">
              <h3 className="font-black text-white flex items-center gap-2 text-base">
                <Calendar size={16} className="text-sky-400" /> Attendance Summary
              </h3>
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="bg-white/5 rounded-xl p-3">
                  <p className="text-2xl font-black text-white">{attendance.daysOpened ?? '—'}</p>
                  <p className="text-[10px] text-slate-500 uppercase tracking-wider font-bold mt-1">Days Opened</p>
                </div>
                <div className="bg-emerald-500/10 rounded-xl p-3 border border-emerald-500/20">
                  <p className="text-2xl font-black text-emerald-400">{attendance.daysPresent ?? '—'}</p>
                  <p className="text-[10px] text-slate-500 uppercase tracking-wider font-bold mt-1">Present</p>
                </div>
                <div className="bg-red-500/10 rounded-xl p-3 border border-red-500/20">
                  <p className="text-2xl font-black text-red-400">{attendance.daysAbsent ?? '—'}</p>
                  <p className="text-[10px] text-slate-500 uppercase tracking-wider font-bold mt-1">Absent</p>
                </div>
              </div>
            </div>
          )}

          {/* Teacher comment */}
          {latestResult?.teacherComment && (
            <div className="glass-card p-6 space-y-3">
              <h3 className="font-black text-white flex items-center gap-2 text-base">
                <User size={16} className="text-emerald-400" /> Academic Adviser's Comment
              </h3>
              <p className="text-slate-300 text-sm leading-relaxed italic">
                "{latestResult.teacherComment}"
              </p>
              {latestResult.formMasterComment && (
                <>
                  <hr className="border-white/5" />
                  <p className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Form Master's Comment</p>
                  <p className="text-slate-300 text-sm leading-relaxed italic">
                    "{latestResult.formMasterComment}"
                  </p>
                </>
              )}
            </div>
          )}
        </div>
      )}

      {/* ── NO RESULTS STATE ── */}
      {!hasResults && (
        <div className="glass-card p-10 text-center space-y-4">
          <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto">
            <Clock size={28} className="text-slate-500" />
          </div>
          <p className="text-lg font-bold text-slate-300">Results not published yet</p>
          <p className="text-slate-500 text-sm max-w-sm mx-auto">
            Your teacher hasn't submitted your results for this term. Check back soon.
          </p>
        </div>
      )}

      {/* ── VIEW FULL REPORT ── */}
      {hasResults && (
        <Link
          href="/portals/dashboard/student/results"
          className="flex items-center justify-between glass-card p-5 hover:border-sky-500/30 transition-all group"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-sky-500/15 border border-sky-500/25 rounded-xl flex items-center justify-center">
              <FileText size={20} className="text-sky-400" />
            </div>
            <div>
              <p className="font-bold text-white text-sm">View Full Report Card</p>
              <p className="text-xs text-slate-500">Printable A4 format with all subject details</p>
            </div>
          </div>
          <ChevronRight size={20} className="text-slate-500 group-hover:text-sky-400 group-hover:translate-x-1 transition-all" />
        </Link>
      )}

    </div>
  );
}

/* ── helpers ── */

function gradeLabel(score: number): string {
  if (score >= 75) return 'Excellent';
  if (score >= 65) return 'Very Good';
  if (score >= 55) return 'Good';
  if (score >= 45) return 'Average';
  return 'Below Average';
}

function Badge({ children, color }: { children: React.ReactNode; color: string }) {
  const styles: Record<string, string> = {
    sky:     'bg-sky-500/15 text-sky-300 border-sky-500/25',
    slate:   'bg-white/5 text-slate-400 border-white/10',
    emerald: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/25',
  };
  return (
    <span className={`px-3 py-1 rounded-lg text-xs font-bold border ${styles[color] ?? styles.slate}`}>
      {children}
    </span>
  );
}

function StatCard({ icon: Icon, label, value, sub, color }: {
  icon: any; label: string; value: string; sub: string; color: string;
}) {
  const styles: Record<string, string> = {
    sky:     'bg-sky-500/10 border-sky-500/20 text-sky-400',
    purple:  'bg-purple-500/10 border-purple-500/20 text-purple-400',
    emerald: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
    amber:   'bg-amber-500/10 border-amber-500/20 text-amber-400',
    yellow:  'bg-yellow-500/10 border-yellow-500/20 text-yellow-400',
  };
  const cls = styles[color] ?? styles.sky;
  return (
    <div className={`glass-card p-5 border ${cls.split(' ')[1]}`}>
      <div className={`w-9 h-9 rounded-xl border flex items-center justify-center mb-3 ${cls}`}>
        <Icon size={18} />
      </div>
      <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">{label}</p>
      <p className={`text-2xl font-black mt-1 ${cls.split(' ')[2]}`}>{value}</p>
      <p className="text-[10px] text-slate-600 font-medium mt-0.5">{sub}</p>
    </div>
  );
}
