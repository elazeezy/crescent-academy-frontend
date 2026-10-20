import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import dbConnect from '@/lib/dbConnect';
import Exam from '@/models/Exam';
import ExamAttempt from '@/models/ExamAttempt';

// POST /api/teacher/exams/[id]/reattempt-all — reopen a CBT for EVERY student who has
// already submitted it (e.g. a system fault zeroed the whole class). Flips reattemptAllowed
// on each submitted attempt; the start route lets those students retake even if the exam's
// window/due date has passed, and each new submission overrides the old grade.
export async function POST(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user || session.user.role !== 'teacher') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  await dbConnect();

  // Only the teacher who created the exam may reopen it for the class.
  const exam = await Exam.findOne({ _id: id, createdBy: session.user.id }).select('_id').lean();
  if (!exam) return NextResponse.json({ error: 'Exam not found' }, { status: 404 });

  const result = await ExamAttempt.updateMany(
    { exam: id, status: { $in: ['submitted', 'auto_submitted'] } },
    { $set: { reattemptAllowed: true } },
  );

  return NextResponse.json({
    success: true,
    reopenedFor: result.modifiedCount ?? 0,
  });
}
