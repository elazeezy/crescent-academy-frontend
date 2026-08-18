import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import dbConnect from '@/lib/dbConnect';
import Exam from '@/models/Exam';
import Teacher from '@/models/Teacher';

const VALID_OBJECTIVE_COUNTS = [30, 60, 100];

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

  const { title, subject, targetClass, objectiveCount, durationMinutes, theoryMaxScore, questions } = body;

  if (!title || !subject || !targetClass) {
    return NextResponse.json({ error: 'title, subject, and targetClass are required' }, { status: 400 });
  }
  if (!VALID_OBJECTIVE_COUNTS.includes(Number(objectiveCount))) {
    return NextResponse.json({ error: 'objectiveCount must be 30, 60, or 100' }, { status: 400 });
  }
  const duration = Number(durationMinutes);
  if (!duration || duration <= 0) {
    return NextResponse.json({ error: 'durationMinutes must be a positive number' }, { status: 400 });
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
    section: teacher.section,
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

export function validateQuestions(questions: any): { questions: any[]; error?: string } {
  if (!questions) return { questions: [] };
  if (!Array.isArray(questions)) return { questions: [], error: 'questions must be an array' };

  const cleaned = [];
  for (let i = 0; i < questions.length; i++) {
    const q = questions[i];
    if (!q?.text || typeof q.text !== 'string' || !q.text.trim()) {
      return { questions: [], error: `Question ${i + 1} is missing text` };
    }
    if (!Array.isArray(q.options) || q.options.length < 2 || q.options.length > 6) {
      return { questions: [], error: `Question ${i + 1} must have 2–6 options` };
    }
    const correctIndex = Number(q.correctIndex);
    if (isNaN(correctIndex) || correctIndex < 0 || correctIndex >= q.options.length) {
      return { questions: [], error: `Question ${i + 1} has an invalid correct answer` };
    }
    cleaned.push({
      text: String(q.text).trim(),
      options: q.options.map((o: any) => String(o).trim()),
      correctIndex,
    });
  }
  return { questions: cleaned };
}
