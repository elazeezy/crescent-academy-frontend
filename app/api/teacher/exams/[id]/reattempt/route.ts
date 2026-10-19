import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import dbConnect from '@/lib/dbConnect';
import Exam from '@/models/Exam';
import ExamAttempt from '@/models/ExamAttempt';

// POST /api/teacher/exams/[id]/reattempt — the exam's own teacher grants (or revokes) a
// re-attempt for one student. The attempt resets only when the student next starts, so no
// in-progress work is destroyed. Body: { studentId, allow?: boolean }.
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user || session.user.role !== 'teacher') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
  const { studentId, allow = true } = body;
  if (typeof studentId !== 'string' || !studentId) {
    return NextResponse.json({ error: 'studentId is required' }, { status: 400 });
  }

  await dbConnect();

  // Only the teacher who created the exam may reopen it.
  const exam = await Exam.findOne({ _id: id, createdBy: session.user.id }).select('_id').lean();
  if (!exam) return NextResponse.json({ error: 'Exam not found' }, { status: 404 });

  const attempt = await ExamAttempt.findOne({ exam: id, student: studentId });
  if (!attempt) return NextResponse.json({ error: 'No attempt found for this student' }, { status: 404 });

  if (allow && attempt.status === 'in_progress') {
    return NextResponse.json({ error: 'This student is still taking the exam. A re-attempt can only be granted after they submit.' }, { status: 409 });
  }

  attempt.reattemptAllowed = !!allow;
  await attempt.save();

  return NextResponse.json({ success: true, reattemptAllowed: attempt.reattemptAllowed });
}
