import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import dbConnect from '@/lib/dbConnect';
import Exam from '@/models/Exam';
import ExamAttempt from '@/models/ExamAttempt';
import Student from '@/models/Student';
import { scaleObjectiveScore } from '@/lib/grading';

// POST /api/student/exams/[id]/submit — grades server-side, never reveals the score to the student
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

  if (attempt.status === 'submitted' || attempt.status === 'auto_submitted') {
    return NextResponse.json({ message: 'Submitted successfully. Good luck in your result.' });
  }

  const exam = await Exam.findById(id).lean() as any;
  if (!exam) return NextResponse.json({ error: 'Exam not found' }, { status: 404 });

  let correctCount = 0;
  for (let i = 0; i < exam.questions.length; i++) {
    if (attempt.answers[i] === exam.questions[i].correctIndex) correctCount++;
  }

  attempt.correctCount = correctCount;
  attempt.objectiveScore = scaleObjectiveScore(correctCount, exam.objectiveCount);
  attempt.status = 'submitted';
  attempt.submittedAt = new Date();
  await attempt.save();

  return NextResponse.json({ message: 'Submitted successfully. Good luck in your result.' });
}
