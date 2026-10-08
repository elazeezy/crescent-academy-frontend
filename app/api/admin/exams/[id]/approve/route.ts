import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import dbConnect from '@/lib/dbConnect';
import Exam from '@/models/Exam';

// POST /api/admin/exams/[id]/approve — Body: { approve: boolean, reason?: string }
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const { approve, reason } = await req.json();

  await dbConnect();

  const exam = await Exam.findById(id);
  if (!exam) return NextResponse.json({ error: 'Exam not found' }, { status: 404 });

  if (exam.status !== 'pending_review') {
    return NextResponse.json({ error: 'This exam is not awaiting review' }, { status: 400 });
  }

  if (approve) {
    if (exam.questions.length < 1) {
      return NextResponse.json(
        { error: 'Add at least one question before approving this assessment.' },
        { status: 400 }
      );
    }
    if (!exam.windowStart) {
      return NextResponse.json(
        { error: 'This exam has no start date & time. Edit it to set one before approving.' },
        { status: 400 }
      );
    }
    exam.status = 'live';
    exam.approvedBy = session.user.id as any;
    exam.approvedAt = new Date();
    exam.rejectionReason = '';
  } else {
    exam.status = 'rejected';
    exam.rejectionReason = (reason || '').trim();
    exam.approvedBy = undefined;
    exam.approvedAt = undefined;
  }

  await exam.save();

  return NextResponse.json({ success: true, status: exam.status });
}
