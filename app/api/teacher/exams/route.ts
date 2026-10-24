import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import dbConnect from '@/lib/dbConnect';
import Exam from '@/models/Exam';
import Teacher from '@/models/Teacher';
import { validateQuestions } from '@/lib/examQuestions';
import { validateExamWindow } from '@/lib/examWindow';


// GET /api/teacher/exams — list this teacher's own exams
export async function GET() {
  const session = await auth();
  if (!session?.user || session.user.role !== 'teacher') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await dbConnect();
  const exams = await Exam.find({ createdBy: session.user.id })
    .select('-questions.correctIndex')
    .sort({ createdAt: -1 })
    .lean();

  return NextResponse.json({ exams });
}

// POST /api/teacher/exams — create a new exam (draft)
export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user || session.user.role !== 'teacher') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const { title, subject, targetClass, section, objectiveCount, durationMinutes, theoryMaxScore, questions, windowStart, windowEnd, term, session: termSession, assessmentSlot } = body;

  if (!title || !subject || !targetClass) {
    return NextResponse.json({ error: 'title, subject, and targetClass are required' }, { status: 400 });
  }
  if (section !== undefined && !['college', 'science'].includes(section)) {
    return NextResponse.json({ error: 'Choose a valid section' }, { status: 400 });
  }
  if (objectiveCount !== undefined && (!Number.isInteger(Number(objectiveCount)) || Number(objectiveCount) < 1)) return NextResponse.json({ error: 'Question count must be a positive whole number' }, { status: 400 });
  if (!['ca1', 'ca2', 'exam', 'testing'].includes(assessmentSlot ?? 'exam')) return NextResponse.json({ error: 'Choose a valid result slot' }, { status: 400 });
  const duration = Number(durationMinutes);
  if (!duration || duration <= 0) {
    return NextResponse.json({ error: 'durationMinutes must be a positive number' }, { status: 400 });
  }
  const window = validateExamWindow(windowStart, windowEnd);
  if (window.error) {
    return NextResponse.json({ error: window.error }, { status: 400 });
  }

  await dbConnect();

  const teacher = await Teacher.findOne({ user: session.user.id }).lean() as any;
  if (!teacher) return NextResponse.json({ error: 'Teacher profile not found' }, { status: 404 });

  // Questions are optional at creation (teacher can build in stages) but must be valid if present
  const cleanedQuestions = validateQuestions(questions);
  if (cleanedQuestions.error) {
    return NextResponse.json({ error: cleanedQuestions.error }, { status: 400 });
  }

  const exam = await Exam.create({
    title: String(title).trim(),
    subject: String(subject).trim(),
    // A teacher may set a CBT assessment for any class in either section (req. 2);
    // the section defaults to their own when not specified.
    section: section || teacher.section,
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
