import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import dbConnect from '@/lib/dbConnect';
import ExamAttempt from '@/models/ExamAttempt';
import Student from '@/models/Student';

// POST /api/student/exams/[id]/answer — autosave a single answer as the student selects it
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user || session.user.role !== 'student') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
  const { questionIndex, optionIndex } = body;
  if (typeof questionIndex !== 'number' || typeof optionIndex !== 'number') {
    return NextResponse.json({ error: 'questionIndex and optionIndex are required' }, { status: 400 });
  }

  await dbConnect();

  const student = await Student.findOne({ user: session.user.id }).lean() as any;
  if (!student) return NextResponse.json({ error: 'Student profile not found' }, { status: 404 });

  const attempt = await ExamAttempt.findOne({ exam: id, student: student._id });
  if (!attempt) return NextResponse.json({ error: 'Attempt not found' }, { status: 404 });
  if (attempt.status !== 'in_progress') {
    return NextResponse.json({ error: 'This exam is no longer in progress' }, { status: 403 });
  }
  if (new Date() > attempt.deadline) {
    attempt.status = 'auto_submitted';
    await attempt.save();
    return NextResponse.json({ error: 'Time has expired' }, { status: 403 });
  }
  if (questionIndex < 0 || questionIndex >= attempt.answers.length) {
    return NextResponse.json({ error: 'Invalid question index' }, { status: 400 });
  }

  attempt.answers[questionIndex] = optionIndex;
  attempt.lastSeenAt = new Date();
  await attempt.save();

  return NextResponse.json({ success: true });
}
