import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import dbConnect from '@/lib/dbConnect';
import Exam from '@/models/Exam';
import { validateQuestions } from '../route';

const VALID_OBJECTIVE_COUNTS = [30, 60, 100];

// GET /api/teacher/exams/[id] — full exam detail (includes correct answers, teacher-only)
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user || session.user.role !== 'teacher') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  await dbConnect();

  const exam = await Exam.findOne({ _id: id, createdBy: session.user.id }).lean();
  if (!exam) return NextResponse.json({ error: 'Exam not found' }, { status: 404 });

  return NextResponse.json({ exam });
}

// PATCH /api/teacher/exams/[id] — edit exam fields, questions, status, or window
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
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

  await dbConnect();

  const exam = await Exam.findOne({ _id: id, createdBy: session.user.id });
  if (!exam) return NextResponse.json({ error: 'Exam not found' }, { status: 404 });

  const { title, subject, targetClass, objectiveCount, durationMinutes, theoryMaxScore, questions, status, windowStart, windowEnd } = body;

  if (title !== undefined) exam.title = String(title).trim();
  if (subject !== undefined) exam.subject = String(subject).trim();
  if (targetClass !== undefined) exam.targetClass = String(targetClass).trim();

  if (objectiveCount !== undefined) {
    if (!VALID_OBJECTIVE_COUNTS.includes(Number(objectiveCount))) {
      return NextResponse.json({ error: 'objectiveCount must be 30, 60, or 100' }, { status: 400 });
    }
    exam.objectiveCount = Number(objectiveCount);
  }
  if (durationMinutes !== undefined) {
    const duration = Number(durationMinutes);
    if (!duration || duration <= 0) {
      return NextResponse.json({ error: 'durationMinutes must be a positive number' }, { status: 400 });
    }
    exam.durationMinutes = duration;
  }
  if (theoryMaxScore !== undefined) {
    exam.theoryMaxScore = Math.min(100, Math.max(0, Number(theoryMaxScore)));
  }
  if (questions !== undefined) {
    const result = validateQuestions(questions);
    if (result.error) return NextResponse.json({ error: result.error }, { status: 400 });
    exam.questions = result.questions as any;
  }
  if (status !== undefined) {
    if (!['draft', 'scheduled', 'live', 'closed'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }
    if ((status === 'scheduled' || status === 'live') && exam.questions.length !== exam.objectiveCount) {
      return NextResponse.json(
        { error: `Exam needs exactly ${exam.objectiveCount} questions before it can be scheduled or opened (currently ${exam.questions.length}).` },
        { status: 400 }
      );
    }
    exam.status = status;
  }
  if (windowStart !== undefined) exam.windowStart = windowStart ? new Date(windowStart) : undefined;
  if (windowEnd !== undefined) exam.windowEnd = windowEnd ? new Date(windowEnd) : undefined;

  await exam.save();

  return NextResponse.json({ success: true });
}

// DELETE /api/teacher/exams/[id]
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user || session.user.role !== 'teacher') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  await dbConnect();

  const result = await Exam.deleteOne({ _id: id, createdBy: session.user.id });
  if (result.deletedCount === 0) return NextResponse.json({ error: 'Exam not found' }, { status: 404 });

  return NextResponse.json({ success: true });
}
