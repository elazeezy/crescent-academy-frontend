import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import dbConnect from '@/lib/dbConnect';
import Exam from '@/models/Exam';
import ExamAttempt from '@/models/ExamAttempt';

// POST /api/admin/exams/[id]/reattempt-all — admin reopens a CBT for every student who
// already submitted it. See the teacher route for the full behaviour.
export async function POST(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  await dbConnect();

  const exam = await Exam.findById(id).select('_id').lean();
  if (!exam) return NextResponse.json({ error: 'Exam not found' }, { status: 404 });

  const result = await ExamAttempt.updateMany(
    { exam: id, status: { $in: ['submitted', 'auto_submitted'] } },
    { $set: { reattemptAllowed: true } },
  );

  return NextResponse.json({ success: true, reopenedFor: result.modifiedCount ?? 0 });
}
