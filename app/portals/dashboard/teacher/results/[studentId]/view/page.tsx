import { auth } from "@/auth";
import dbConnect from "@/lib/dbConnect";
import Result from "@/models/Result";
import Student from "@/models/Student";
import ReportCardDisplay from "@/components/ReportCardDisplay";
import { redirect } from "next/navigation";

export default async function ViewReportCard({
  params,
}: {
  params: Promise<{ studentId: string }>;
}) {
  const { studentId } = await params;
  const session = await auth();
  if (!session?.user || session.user.role !== "teacher") redirect("/login");

  await dbConnect();

  // Student profile
  const student = await Student.findById(studentId).lean() as any;
  if (!student) {
    return <div className="p-10 text-center text-slate-400">Student not found.</div>;
  }

  // This student's result
  const resultDoc = await Result.findOne({ student: studentId })
    .sort({ createdAt: -1 })
    .lean() as any;

  if (!resultDoc) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-10">
        <p className="text-xl font-bold text-slate-300">No results saved yet</p>
        <p className="text-slate-500 mt-2 text-sm">
          Go back and input results for {student.firstName} {student.lastName} first.
        </p>
      </div>
    );
  }

  // All students in same class (for class stats)
  const classmates = await Student.find({
    currentClass: { $regex: student.currentClass, $options: "i" },
  }).lean() as any[];

  const classmateIds = classmates.map((s: any) => s._id.toString());

  // All results for this class / same term & session
  const allResults = await Result.find({
    student: { $in: classmateIds },
    term:    resultDoc.term,
    session: resultDoc.session,
  }).lean() as any[];

  // ── Compute class statistics ──────────────────────────────────
  const totalStudentsInClass = classmates.length;

  // Per-subject stats
  const subjectStats: Record<string, { scores: number[] }> = {};
  for (const r of allResults) {
    for (const sub of r.subjects) {
      if (!subjectStats[sub.subjectName]) subjectStats[sub.subjectName] = { scores: [] };
      subjectStats[sub.subjectName].scores.push(sub.total);
    }
  }

  const subjectStatsComputed: Record<string, {
    classAvg: number; highest: number; lowest: number; position: number;
  }> = {};

  for (const r of resultDoc.subjects) {
    const stats = subjectStats[r.subjectName];
    if (!stats) continue;
    const sorted = [...stats.scores].sort((a, b) => b - a);
    subjectStatsComputed[r.subjectName] = {
      classAvg: stats.scores.reduce((a, b) => a + b, 0) / stats.scores.length,
      highest:  sorted[0] ?? 0,
      lowest:   sorted[sorted.length - 1] ?? 0,
      position: sorted.indexOf(r.total) + 1,
    };
  }

  // Class-level GPA ranking (position in class)
  const gpas = allResults.map((r: any) => r.gpa).sort((a: number, b: number) => b - a);
  const positionInClass = gpas.indexOf(resultDoc.gpa) + 1;
  const classAvgScore   = allResults.length > 0
    ? allResults.reduce((sum: number, r: any) => sum + r.gpa, 0) / allResults.length
    : 0;
  const highestAvg = gpas[0] ?? 0;
  const lowestAvg  = gpas[gpas.length - 1] ?? 0;

  const safeResult  = JSON.parse(JSON.stringify(resultDoc));
  const safeStudent = JSON.parse(JSON.stringify(student));

  return (
    <ReportCardDisplay
      result={safeResult}
      student={safeStudent}
      classStats={{
        totalStudents:   totalStudentsInClass,
        positionInClass,
        classAvgScore,
        highestAvg,
        lowestAvg,
        subjectStats:    subjectStatsComputed,
      }}
    />
  );
}
