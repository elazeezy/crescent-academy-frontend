import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import dbConnect from '@/lib/dbConnect';
import ExamAttempt from '@/models/ExamAttempt';
import ReattemptRequest from '@/models/ReattemptRequest';

// POST /api/admin/reattempt-requests/[id] — admin approves/rejects any request.
// Body: { decision: 'approve' | 'reject' }.
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user || session.user.role !== 'admin') {
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

  const request = await ReattemptRequest.findById(id);
  if (!request) return NextResponse.json({ error: 'Request not found' }, { status: 404 });
  if (request.status !== 'pending') {
    return NextResponse.json({ error: 'This request has already been decided.' }, { status: 409 });
  }

  if (decision === 'approve') {
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
