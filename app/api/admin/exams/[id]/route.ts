import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import dbConnect from '@/lib/dbConnect';
import Exam from '@/models/Exam';
import { validateQuestions } from '@/lib/examQuestions';
import { validateExamWindow } from '@/lib/examWindow';

// GET /api/admin/exams/[id] — full exam detail (includes correct answers), any exam
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  await dbConnect();

  const exam = await Exam.findById(id).populate('createdBy', 'name email').lean();
  if (!exam) return NextResponse.json({ error: 'Exam not found' }, { status: 404 });

  return NextResponse.json({ exam });
}

// PATCH /api/admin/exams/[id] — admin can edit any field, including moving to live/closed/draft
// (used both for editing sandbox/demo exams and for building an exam admin authored directly)
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
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

  await dbConnect();

  const exam = await Exam.findById(id);
  if (!exam) return NextResponse.json({ error: 'Exam not found' }, { status: 404 });

  const { title, subject, section, targetClass, objectiveCount, durationMinutes, theoryMaxScore, questions, status, windowStart, windowEnd, term, session: termSession, assessmentSlot } = body;

  if (title !== undefined) exam.title = String(title).trim();
  if (subject !== undefined) exam.subject = String(subject).trim();
  if (section !== undefined) {
    if (!['college', 'science'].includes(section)) return NextResponse.json({ error: 'Invalid section' }, { status: 400 });
    exam.section = section;
  }
  if (targetClass !== undefined) exam.targetClass = String(targetClass).trim();

  if (objectiveCount !== undefined) {
    if (!Number.isInteger(Number(objectiveCount)) || Number(objectiveCount) < 1) return NextResponse.json({ error: 'Enter at least one question' }, { status: 400 });
    exam.objectiveCount = Number(objectiveCount);
  }
  if (term !== undefined) exam.term = String(term);
  if (termSession !== undefined) exam.session = String(termSession);
  if (assessmentSlot !== undefined && ['ca1', 'ca2', 'exam', 'testing'].includes(assessmentSlot)) exam.assessmentSlot = assessmentSlot;
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
    if (result.questions.length > 0) exam.objectiveCount = result.questions.length;
  }
  if (windowStart !== undefined || windowEnd !== undefined) {
    const newStart = windowStart !== undefined ? windowStart : exam.windowStart;
    const newEnd = windowEnd !== undefined ? windowEnd : exam.windowEnd;
    const window = validateExamWindow(newStart, newEnd || undefined);
    if (window.error) {
      return NextResponse.json({ error: window.error }, { status: 400 });
    }
    exam.windowStart = window.start;
    exam.windowEnd = window.end;
  }
  if (status !== undefined) {
    if (!['draft', 'pending_review', 'rejected', 'live', 'closed'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }
    if (status === 'live' && exam.questions.length < 1) {
      return NextResponse.json(
        { error: 'Add at least one question before opening this assessment.' },
        { status: 400 }
      );
    }
    if (status === 'live' && !exam.windowStart) {
      return NextResponse.json(
        { error: 'Set a start date & time before opening this exam.' },
        { status: 400 }
      );
    }
    exam.status = status;
    if (status === 'live') {
      exam.approvedBy = session.user.id as any;
      exam.approvedAt = new Date();
      exam.rejectionReason = '';
    }
  }

  await exam.save();

  return NextResponse.json({ success: true });
}

// DELETE /api/admin/exams/[id]
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  await dbConnect();

  const result = await Exam.findByIdAndDelete(id);
  if (!result) return NextResponse.json({ error: 'Exam not found' }, { status: 404 });

  return NextResponse.json({ success: true });
}
