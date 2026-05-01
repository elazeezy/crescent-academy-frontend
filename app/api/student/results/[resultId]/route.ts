import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import dbConnect from '@/lib/dbConnect';
import Student from '@/models/Student';
import Result from '@/models/Result';

// GET /api/student/results/[resultId]
// Returns: full result + computed classStats (only if published)
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ resultId: string }> }
) {
  const session = await auth();
  if (!session?.user || session.user.role !== 'student') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { resultId } = await params;

  try {
    await dbConnect();

    const student = await Student.findOne({ user: session.user.id }).lean() as any;
    if (!student) return NextResponse.json({ error: 'Profile not found' }, { status: 404 });

    const resultData = await Result.findOne({
      _id:      resultId,
      student:  student._id,
      published: true,           // students can only fetch published results
    }).lean() as any;

    if (!resultData) {
      return NextResponse.json({ error: 'Result not found or not yet published.' }, { status: 404 });
    }

    // ── Class stats ────────────────────────────────────────────
    const classmates = await Student.find({
      currentClass: { $regex: student.currentClass, $options: 'i' },
    }).lean() as any[];

    const classmateIds = classmates.map((s: any) => s._id.toString());

    const allResults = await Result.find({
      student:   { $in: classmateIds },
      term:      resultData.term,
      session:   resultData.session,
      published: true,
    }).lean() as any[];

    // Per-subject aggregation
    const subjectScoreMap: Record<string, number[]> = {};
    for (const r of allResults) {
      for (const sub of r.subjects) {
        if (!subjectScoreMap[sub.subjectName]) subjectScoreMap[sub.subjectName] = [];
        subjectScoreMap[sub.subjectName].push(sub.total);
      }
    }

    const subjectStats: Record<string, { classAvg: number; highest: number; lowest: number; position: number }> = {};
    for (const sub of resultData.subjects) {
      const scores = subjectScoreMap[sub.subjectName];
      if (!scores?.length) continue;
      const sorted = [...scores].sort((a, b) => b - a);
      subjectStats[sub.subjectName] = {
        classAvg: scores.reduce((a, b) => a + b, 0) / scores.length,
        highest:  sorted[0],
        lowest:   sorted[sorted.length - 1],
        position: sorted.indexOf(sub.total) + 1,
      };
    }

    // Class position by GPA
    const gpas = allResults.map((r: any) => r.gpa).sort((a: number, b: number) => b - a);
    const positionInClass = gpas.indexOf(resultData.gpa) + 1;

    return NextResponse.json({
      result:  JSON.parse(JSON.stringify(resultData)),
      student: JSON.parse(JSON.stringify(student)),
      classStats: {
        totalStudents:   classmates.length,
        positionInClass,
        classAvgScore:   allResults.length ? allResults.reduce((s: number, r: any) => s + r.gpa, 0) / allResults.length : 0,
        highestAvg:      gpas[0] ?? 0,
        lowestAvg:       gpas[gpas.length - 1] ?? 0,
        subjectStats,
      },
    });
  } catch {
    return NextResponse.json({ error: 'Failed to load report card' }, { status: 500 });
  }
}
