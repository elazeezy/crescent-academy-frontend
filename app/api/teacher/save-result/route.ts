import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import dbConnect from '@/lib/dbConnect';
import Result from '@/models/Result';
import { calculateGrade } from '@/lib/grading';

const MAX_TOTAL = 100;

function clamp(n: number, min: number, max: number) {
  return Math.min(Math.max(Number(n) || 0, min), max);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session || session.user.role !== 'teacher') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const {
    studentId,
    term,
    session: termSession,
    subjects,
    affectiveTraits,
    psychomotorSkills,
    attendance,
    nextTermBegins,
    termEnded,
    teacherComment,
    formMasterComment,
    principalComment,
  } = body;

  if (!studentId || !term || !termSession || !Array.isArray(subjects) || subjects.length === 0) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  // Process subjects
  const processedSubjects = [];
  for (const sub of subjects) {
    if (!sub.subjectName || typeof sub.subjectName !== 'string') {
      return NextResponse.json({ error: 'Each subject must have a name' }, { status: 400 });
    }
    const test1    = clamp(sub.test1,    0, 10);
    const test2    = clamp(sub.test2,    0, 10);
    const test3    = clamp(sub.test3,    0, 10);
    const examScore = clamp(sub.examScore, 0, 70);
    const total    = test1 + test2 + test3 + examScore;

    if (total > MAX_TOTAL) {
      return NextResponse.json(
        { error: `Total for ${sub.subjectName} exceeds ${MAX_TOTAL}` },
        { status: 400 }
      );
    }
    processedSubjects.push({ subjectName: sub.subjectName, test1, test2, test3, examScore, total, grade: calculateGrade(total) });
  }

  const totalScore = processedSubjects.reduce((acc, s) => acc + s.total, 0);
  const gpa = processedSubjects.length > 0 ? totalScore / processedSubjects.length : 0;

  // Sanitize trait ratings (1–5, 0 means not set)
  const sanitizeRatings = (obj: Record<string, any> = {}) => {
    const out: Record<string, number> = {};
    for (const [k, v] of Object.entries(obj)) {
      const n = Number(v);
      if (!isNaN(n)) out[k] = clamp(n, 0, 5);
    }
    return out;
  };

  // Sanitize attendance
  const att = attendance || {};
  const sanitizedAttendance = {
    daysOpened:  clamp(att.daysOpened  ?? 0, 0, 999),
    daysPresent: clamp(att.daysPresent ?? 0, 0, 999),
    daysAbsent:  clamp(att.daysAbsent  ?? 0, 0, 999),
  };

  try {
    await dbConnect();

    const result = await Result.findOneAndUpdate(
      { student: studentId, term, session: termSession },
      {
        student: studentId,
        term,
        session: termSession,
        subjects: processedSubjects,
        affectiveTraits:   sanitizeRatings(affectiveTraits),
        psychomotorSkills: sanitizeRatings(psychomotorSkills),
        attendance:        sanitizedAttendance,
        nextTermBegins:    nextTermBegins || '',
        termEnded:         termEnded     || '',
        teacherComment:    (teacherComment    || '').trim(),
        formMasterComment: (formMasterComment || '').trim(),
        principalComment:  (principalComment  || '').trim(),
        gpa,
        // Never auto-publish on save — admin must publish explicitly
        // (published flag untouched on upsert if already set)
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    return NextResponse.json({ message: 'Result saved successfully', data: result });
  } catch (err: any) {
    console.error('save-result error:', err);
    return NextResponse.json({ error: 'Failed to save result' }, { status: 500 });
  }
}
