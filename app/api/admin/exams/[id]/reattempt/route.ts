import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import dbConnect from '@/lib/dbConnect';
import ExamAttempt from '@/models/ExamAttempt';

// POST /api/admin/exams/[id]/reattempt — admin grants (or revokes) a re-attempt for one
// student. The attempt itself is only reset when the student next starts the exam, so no
// in-progress work is destroyed by granting. Body: { studentId, allow?: boolean }.
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user || session.user.role !== 'admin') {
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

  const attempt = await ExamAttempt.findOne({ exam: id, student: studentId });
  if (!attempt) return NextResponse.json({ error: 'No attempt found for this student' }, { status: 404 });

  if (allow && attempt.status === 'in_progress') {
    return NextResponse.json({ error: 'This student is still taking the exam. A re-attempt can only be granted after they submit.' }, { status: 409 });
  }

  attempt.reattemptAllowed = !!allow;
  await attempt.save();

  return NextResponse.json({ success: true, reattemptAllowed: attempt.reattemptAllowed });
}
