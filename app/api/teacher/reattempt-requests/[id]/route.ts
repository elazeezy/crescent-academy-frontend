import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import dbConnect from '@/lib/dbConnect';
import ExamAttempt from '@/models/ExamAttempt';
import ReattemptRequest from '@/models/ReattemptRequest';

// POST /api/teacher/reattempt-requests/[id] — approve or reject a request.
// Body: { decision: 'approve' | 'reject' }. Approving flips the attempt's
// reattemptAllowed so the student can retake; their new submission overrides the old grade.
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user || session.user.role !== 'teacher') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  let decision: string;
  try {
    ({ decision } = await req.json());
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
  if (decision !== 'approve' && decision !== 'reject') {
    return NextResponse.json({ error: 'decision must be "approve" or "reject"' }, { status: 400 });
  }

  await dbConnect();

  // Only the teacher who owns the exam (recorded on the request) may decide it.
  const request = await ReattemptRequest.findOne({ _id: id, teacher: session.user.id });
  if (!request) return NextResponse.json({ error: 'Request not found' }, { status: 404 });
  if (request.status !== 'pending') {
    return NextResponse.json({ error: 'This request has already been decided.' }, { status: 409 });
  }

  if (decision === 'approve') {
    // Grant the re-attempt on the attempt itself (idempotent). The student's next start
    // resets the attempt; re-submission overrides the previous grade.
    const attempt = await ExamAttempt.findOne({ exam: request.exam, student: request.student });
    if (!attempt) return NextResponse.json({ error: 'The student\'s attempt no longer exists.' }, { status: 404 });
    attempt.reattemptAllowed = true;
    await attempt.save();
  }

  request.status = decision === 'approve' ? 'approved' : 'rejected';
  request.decidedBy = session.user.id as any;
  request.decidedAt = new Date();
  await request.save();

  return NextResponse.json({ success: true, status: request.status });
}
