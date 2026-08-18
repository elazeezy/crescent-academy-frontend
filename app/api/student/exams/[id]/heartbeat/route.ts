import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import dbConnect from '@/lib/dbConnect';
import ExamAttempt from '@/models/ExamAttempt';
import Student from '@/models/Student';
import { creditDisconnectGap } from '@/lib/examTiming';

// POST /api/student/exams/[id]/heartbeat — pinged every ~15s while the exam page is open.
// A gap since the last ping (tab closed, network drop) gets credited back to the deadline,
// capped per attempt so it can't be gamed by idling.
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user || session.user.role !== 'student') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  await dbConnect();

  const student = await Student.findOne({ user: session.user.id }).lean() as any;
  if (!student) return NextResponse.json({ error: 'Student profile not found' }, { status: 404 });

  const attempt = await ExamAttempt.findOne({ exam: id, student: student._id });
  if (!attempt) return NextResponse.json({ error: 'Attempt not found' }, { status: 404 });
  if (attempt.status !== 'in_progress') {
    return NextResponse.json({ status: attempt.status, deadline: attempt.deadline });
  }

  const now = new Date();

  if (now > attempt.deadline) {
    attempt.status = 'auto_submitted';
    await attempt.save();
    return NextResponse.json({ status: 'auto_submitted', deadline: attempt.deadline });
  }

  const gapSeconds = (now.getTime() - attempt.lastSeenAt.getTime()) / 1000;
  const alreadyCredited = attempt.disconnectLog.reduce((sum: number, d: any) => sum + d.creditedSeconds, 0);
  const { creditedSeconds, newDeadline } = creditDisconnectGap(gapSeconds, attempt.deadline, alreadyCredited);

  if (creditedSeconds > 0) {
    attempt.disconnectLog.push({ gapSeconds: Math.round(gapSeconds), creditedSeconds, at: now });
    attempt.deadline = newDeadline;
  }

  attempt.lastSeenAt = now;
  await attempt.save();

  return NextResponse.json({ status: 'in_progress', deadline: attempt.deadline, creditedSeconds });
}
