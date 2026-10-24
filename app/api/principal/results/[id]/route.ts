import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import dbConnect from '@/lib/dbConnect';
import Result from '@/models/Result';
import { calculateGrade } from '@/lib/grading';

const MAX_TOTAL = 100;

function clamp(n: any, min: number, max: number) {
  return Math.min(Math.max(Number(n) || 0, min), max);
}

// PATCH /api/principal/results/[id]
// Body: { subjects?, principalComment? }
// The principal may edit subject scores for any class and set the principal's
// comment on report cards — but may NOT publish/unpublish (admin-only).
export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (session?.user?.role !== 'principal') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;

  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const { subjects, principalComment } = body;

  const update: any = {};

  if (principalComment !== undefined) {
    update.principalComment = String(principalComment || '').trim();
  }

  if (subjects !== undefined) {
    if (!Array.isArray(subjects) || subjects.length === 0) {
      return NextResponse.json({ error: 'subjects must be a non-empty array' }, { status: 400 });
    }

    const processed = [];
    for (const sub of subjects) {
      if (!sub.subjectName || typeof sub.subjectName !== 'string') {
        return NextResponse.json({ error: 'Each subject must have a name' }, { status: 400 });
      }
      const test1 = clamp(sub.test1, 0, 10);
      const test2 = clamp(sub.test2, 0, 10);
      const test3 = clamp(sub.test3, 0, 10);

      if (sub.isCbt) {
        const objectiveScore = clamp(sub.objectiveScore, 0, 30);
        const theoryMax = clamp(sub.theoryMaxScore, 0, 100) || 40;
        const theoryScore = clamp(sub.theoryScore, 0, theoryMax);
        const total = test1 + test2 + test3 + objectiveScore + theoryScore;
        if (total > MAX_TOTAL) {
          return NextResponse.json({ error: `Total for ${sub.subjectName} exceeds ${MAX_TOTAL}` }, { status: 400 });
        }
        processed.push({
          subjectName: sub.subjectName, test1, test2, test3,
          examScore: clamp(objectiveScore + theoryScore, 0, 70), total, grade: calculateGrade(total),
          isCbt: true, cbtExamId: sub.cbtExamId || undefined, objectiveScore, theoryScore,
        });
        continue;
      }

      const examScore = clamp(sub.examScore, 0, 70);
      const total = test1 + test2 + test3 + examScore;
      if (total > MAX_TOTAL) {
        return NextResponse.json({ error: `Total for ${sub.subjectName} exceeds ${MAX_TOTAL}` }, { status: 400 });
      }
      processed.push({ subjectName: sub.subjectName, test1, test2, test3, examScore, total, grade: calculateGrade(total) });
    }

    const totalScore = processed.reduce((acc, s) => acc + s.total, 0);
    update.subjects = processed;
    update.gpa = processed.length > 0 ? totalScore / processed.length : 0;
  }

  if (Object.keys(update).length === 0) {
    return NextResponse.json({ error: 'Nothing to update' }, { status: 400 });
  }

  try {
    await dbConnect();
    const result = await Result.findByIdAndUpdate(id, update, { new: true });
    if (!result) return NextResponse.json({ error: 'Result not found' }, { status: 404 });
    return NextResponse.json({ success: true, result });
  } catch {
    return NextResponse.json({ error: 'Failed to update result' }, { status: 500 });
  }
}
