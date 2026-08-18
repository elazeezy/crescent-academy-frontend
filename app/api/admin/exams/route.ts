import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import dbConnect from '@/lib/dbConnect';
import Exam from '@/models/Exam';
import { ALL_OBJECTIVE_COUNTS, validateQuestions } from '@/lib/examQuestions';

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

  const { title, subject, section, targetClass, objectiveCount, durationMinutes, theoryMaxScore, questions } = body;

  if (!title || !subject || !targetClass || !section) {
    return NextResponse.json({ error: 'title, subject, section, and targetClass are required' }, { status: 400 });
  }
  if (!['college', 'science'].includes(section)) {
    return NextResponse.json({ error: 'Invalid section' }, { status: 400 });
  }
  if (!ALL_OBJECTIVE_COUNTS.includes(Number(objectiveCount))) {
    return NextResponse.json({ error: `objectiveCount must be one of: ${ALL_OBJECTIVE_COUNTS.join(', ')}` }, { status: 400 });
  }
  const duration = Number(durationMinutes);
  if (!duration || duration <= 0) {
    return NextResponse.json({ error: 'durationMinutes must be a positive number' }, { status: 400 });
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
    objectiveCount: Number(objectiveCount),
    durationMinutes: duration,
    theoryMaxScore: theoryMaxScore != null ? Math.min(100, Math.max(0, Number(theoryMaxScore))) : 40,
    questions: cleanedQuestions.questions,
    status: 'draft',
    createdBy: session.user.id,
  });

  return NextResponse.json({ success: true, examId: exam._id.toString() });
}
