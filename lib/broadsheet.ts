import Student from '@/models/Student';
import Result from '@/models/Result';
import { calculateGrade } from '@/lib/grading';
import { classNameRegex, getSubjectsForClass, getGradeRemark } from '@/lib/subjects';

export type BroadsheetTerm = '1st Term' | '2nd Term' | '3rd Term' | 'cumulative';
export const REAL_TERMS: BroadsheetTerm[] = ['1st Term', '2nd Term', '3rd Term'];
export const VALID_BROADSHEET_TERMS: BroadsheetTerm[] = [...REAL_TERMS, 'cumulative'];

export interface BroadsheetStudentRow {
  studentId: string;
  admissionNo: string;
  name: string;
  perSubject: Record<string, number | null>;
  totalScore: number | null;
  maxObtainable: number;
  averageScore: number | null;
  averagePercent: number | null;
  position: number | null;
  grade: string | null;
  remark: string | null;
}

export interface BroadsheetData {
  section: 'college' | 'science';
  class: string;
  session: string;
  term: BroadsheetTerm;
  subjects: string[];
  totalStudents: number;
  classAverage: number | null;
  students: BroadsheetStudentRow[];
}

// Shared by the admin (any class) and teacher (their own assigned class) broadsheet
// endpoints. A single real term averages that term's subject totals; 'cumulative'
// averages 1st–3rd term together per subject before computing the rest.
export async function generateBroadsheet({
  section, targetClass, academicSession, term,
}: {
  section: 'college' | 'science';
  targetClass: string;
  academicSession: string;
  term: BroadsheetTerm;
}): Promise<BroadsheetData> {
  const students = await Student.find({
    section,
    currentClass: { $regex: classNameRegex(targetClass), $options: 'i' },
  })
    .select('firstName lastName studentId')
    .sort({ firstName: 1 })
    .lean();

  if (students.length === 0) {
    return { section, class: targetClass, session: academicSession, term, subjects: [], totalStudents: 0, classAverage: null, students: [] };
  }

  const studentIds = students.map((s: any) => s._id);
  const termsToFetch = term === 'cumulative' ? REAL_TERMS : [term];
  const results = await Result.find({
    student: { $in: studentIds },
    session: academicSession,
    term: { $in: termsToFetch },
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
  const subjectCount = subjects.length;

  const rows: BroadsheetStudentRow[] = students.map((s: any) => {
    const studentResults = resultsByStudent.get(s._id.toString()) ?? [];

    const perSubject: Record<string, number | null> = {};
    for (const subjectName of subjects) {
      const totals: number[] = [];
      for (const r of studentResults) {
        const match = r.subjects.find((sub: any) => sub.subjectName === subjectName);
        if (match) totals.push(match.total);
      }
      perSubject[subjectName] = totals.length ? totals.reduce((a, b) => a + b, 0) / totals.length : null;
    }

    const availableScores = Object.values(perSubject).filter((v): v is number => v !== null);
    const totalScore = availableScores.length ? availableScores.reduce((a, b) => a + b, 0) : null;
    const averageScore = availableScores.length ? totalScore! / subjectCount : null;

    const grade = averageScore !== null ? calculateGrade(averageScore) : null;

    return {
      studentId: s._id.toString(),
      admissionNo: s.studentId,
      name: `${s.firstName} ${s.lastName}`,
      perSubject,
      totalScore,
      maxObtainable: subjectCount * 100,
      averageScore,
      // Mirrors averageScore — every subject is scored out of 100, so the average
      // score IS the percentage. Kept as its own field because the school's paper
      // broadsheet prints both columns side by side.
      averagePercent: averageScore,
      position: null,
      grade,
      remark: grade ? getGradeRemark(grade) : null,
    };
  });

  // Standard competition ranking (ties share a position; next position skips accordingly).
  // Students with no result at all sort last and get no position.
  const ranked = [...rows].sort((a, b) => (b.averageScore ?? -1) - (a.averageScore ?? -1));
  let rank = 0;
  let prevScore: number | null | undefined;
  let seen = 0;
  for (const row of ranked) {
    if (row.averageScore === null) continue;
    seen++;
    if (prevScore === undefined || row.averageScore !== prevScore) {
      rank = seen;
      prevScore = row.averageScore;
    }
    row.position = rank;
  }

  const scored = ranked.filter((r): r is BroadsheetStudentRow & { averageScore: number } => r.averageScore !== null);
  const classAverage = scored.length ? scored.reduce((a, r) => a + r.averageScore, 0) / scored.length : null;

  return {
    section, class: targetClass, session: academicSession, term,
    subjects, totalStudents: students.length, classAverage, students: ranked,
  };
}
