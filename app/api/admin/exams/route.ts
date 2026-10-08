import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import dbConnect from '@/lib/dbConnect';
import Exam from '@/models/Exam';
import { validateQuestions } from '@/lib/examQuestions';
import { validateExamWindow } from '@/lib/examWindow';

// GET /api/admin/exams — all exams across all teachers, optionally filtered by status
export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const status = searchParams.get('status');

  await dbConnect();
  const query: any = {};
  if (status) query.status = status;

  const exams = await Exam.find(query)
    .select('-questions.correctIndex')
    .populate('createdBy', 'name email')
    .sort({ createdAt: -1 })
    .lean();

  return NextResponse.json({ exams });
}

// POST /api/admin/exams — admin creates an exam directly (used by the CBT Testing sandbox,
// or to author a real exam on a teacher's behalf). Admin-created exams still go through
// the same pending_review -> live approval step as teacher-created ones, so the sandbox
// exercises the exact same path a real exam takes.
export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const { title, subject, section, targetClass, objectiveCount, durationMinutes, theoryMaxScore, questions, windowStart, windowEnd, term, session: termSession, assessmentSlot } = body;

  if (!title || !subject || !targetClass || !section) {
    return NextResponse.json({ error: 'title, subject, section, and targetClass are required' }, { status: 400 });
  }
  if (!['college', 'science'].includes(section)) {
    return NextResponse.json({ error: 'Invalid section' }, { status: 400 });
  }
  if (objectiveCount !== undefined && (!Number.isInteger(Number(objectiveCount)) || Number(objectiveCount) < 1)) return NextResponse.json({ error: 'Question count must be a positive whole number' }, { status: 400 });
  const duration = Number(durationMinutes);
  if (!duration || duration <= 0) {
    return NextResponse.json({ error: 'durationMinutes must be a positive number' }, { status: 400 });
  }
  const window = validateExamWindow(windowStart, windowEnd);
  if (window.error) {
    return NextResponse.json({ error: window.error }, { status: 400 });
  }

  const cleanedQuestions = validateQuestions(questions);
  if (cleanedQuestions.error) {
    return NextResponse.json({ error: cleanedQuestions.error }, { status: 400 });
  }

  await dbConnect();

  const exam = await Exam.create({
    title: String(title).trim(),
    subject: String(subject).trim(),
    section,
    targetClass: String(targetClass).trim(),
    objectiveCount: Math.max(1, cleanedQuestions.questions.length || Number(objectiveCount) || 1),
    term: term || '1st Term',
    session: termSession || '2026/2027',
    assessmentSlot: assessmentSlot || 'exam',
    durationMinutes: duration,
    theoryMaxScore: theoryMaxScore != null ? Math.min(100, Math.max(0, Number(theoryMaxScore))) : 40,
    questions: cleanedQuestions.questions,
    status: 'draft',
    windowStart: window.start,
    windowEnd: window.end,
    createdBy: session.user.id,
  });

  return NextResponse.json({ success: true, examId: exam._id.toString() });
}
