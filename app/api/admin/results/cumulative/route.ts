import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import dbConnect from '@/lib/dbConnect';
import Student from '@/models/Student';
import Result from '@/models/Result';
import { calculateGrade } from '@/lib/grading';
import { classNameRegex, getSubjectsForClass } from '@/lib/subjects';

const TERMS = ['1st Term', '2nd Term', '3rd Term'];

// GET /api/admin/results/cumulative?session=2025/2026&section=college&class=S.S. 2
// Averages a student's three terms together into one cumulative percentage,
// grade, and class position — a session-end broadsheet, not a stored record.
export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const academicSession = searchParams.get('session');
  const section = searchParams.get('section');
  const targetClass = searchParams.get('class');

  if (!academicSession || !section || !targetClass) {
    return NextResponse.json({ error: 'session, section, and class are required' }, { status: 400 });
  }
  if (!['college', 'science'].includes(section)) {
    return NextResponse.json({ error: 'Invalid section' }, { status: 400 });
  }

  await dbConnect();

  const students = await Student.find({
    section,
    currentClass: { $regex: classNameRegex(targetClass), $options: 'i' },
  })
    .select('firstName lastName studentId')
    .sort({ firstName: 1 })
    .lean();

  if (students.length === 0) {
    return NextResponse.json({ subjects: [], students: [] });
  }

  const studentIds = students.map((s: any) => s._id);
  const results = await Result.find({
    student: { $in: studentIds },
    session: academicSession,
    term: { $in: TERMS },
  }).lean() as any[];

  const resultsByStudent = new Map<string, any[]>();
  for (const r of results) {
    const key = r.student.toString();
    if (!resultsByStudent.has(key)) resultsByStudent.set(key, []);
    resultsByStudent.get(key)!.push(r);
  }

  const canonicalSubjects = getSubjectsForClass(targetClass);
  const extraSubjects = new Set<string>();
  for (const r of results) {
    for (const sub of r.subjects) {
      if (!canonicalSubjects.includes(sub.subjectName)) extraSubjects.add(sub.subjectName);
    }
  }
  const subjects = [...canonicalSubjects, ...extraSubjects];

  const rows = students.map((s: any) => {
    const studentResults = resultsByStudent.get(s._id.toString()) ?? [];
    const termsCovered = TERMS.filter((t) => studentResults.some((r) => r.term === t));

    const perSubject: Record<string, number | null> = {};
    for (const subjectName of subjects) {
      const totals: number[] = [];
      for (const r of studentResults) {
        const match = r.subjects.find((sub: any) => sub.subjectName === subjectName);
        if (match) totals.push(match.total);
      }
      perSubject[subjectName] = totals.length ? totals.reduce((a, b) => a + b, 0) / totals.length : null;
    }

    const availableAverages = Object.values(perSubject).filter((v): v is number => v !== null);
    const cumulativePercentage = availableAverages.length
      ? availableAverages.reduce((a, b) => a + b, 0) / availableAverages.length
      : null;

    const termGpas: Record<string, number | null> = {};
    for (const t of TERMS) {
      const r = studentResults.find((res) => res.term === t);
      termGpas[t] = r ? r.gpa : null;
    }

    return {
      studentId: s._id.toString(),
      admissionNo: s.studentId,
      name: `${s.firstName} ${s.lastName}`,
      termsCovered,
      termGpas,
      perSubject,
      cumulativePercentage,
      cumulativeGrade: cumulativePercentage !== null ? calculateGrade(cumulativePercentage) : null,
      position: null as number | null,
    };
  });

  // Standard competition ranking (ties share a position; next position skips accordingly).
  // Students with no results at all sort last and get no position.
  const ranked = [...rows].sort((a, b) => (b.cumulativePercentage ?? -1) - (a.cumulativePercentage ?? -1));
  let rank = 0;
  let prevScore: number | null | undefined = undefined;
  let seen = 0;
  for (const row of ranked) {
    if (row.cumulativePercentage === null) continue;
    seen++;
    if (prevScore === undefined || row.cumulativePercentage !== prevScore) {
      rank = seen;
      prevScore = row.cumulativePercentage;
    }
    row.position = rank;
  }

  return NextResponse.json({ session: academicSession, section, class: targetClass, subjects, students: ranked });
}
