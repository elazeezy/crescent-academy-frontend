import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import dbConnect from '@/lib/dbConnect';
import Exam from '@/models/Exam';
import ExamAttempt from '@/models/ExamAttempt';
import Student from '@/models/Student';

// GET /api/teacher/exams/[id]/attempts — every student's attempt, with correct answers shown
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user || session.user.role !== 'teacher') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  await dbConnect();

  const exam = await Exam.findOne({ _id: id, createdBy: session.user.id }).lean() as any;
  if (!exam) return NextResponse.json({ error: 'Exam not found' }, { status: 404 });

  const attempts = await ExamAttempt.find({ exam: id })
    .populate({ path: 'student', select: 'firstName lastName studentId currentClass' })
    .sort({ createdAt: 1 })
    .lean();

  // Students in the target class who haven't attempted yet
  const attemptedIds = new Set(attempts.map((a: any) => a.student?._id?.toString()));
  const classStudents = await Student.find({ section: exam.section, currentClass: exam.targetClass })
    .select('firstName lastName studentId currentClass')
    .lean();
  const notStarted = classStudents.filter((s: any) => !attemptedIds.has(s._id.toString()));

  return NextResponse.json({
    exam: { title: exam.title, subject: exam.subject, questions: exam.questions, objectiveCount: exam.objectiveCount, theoryMaxScore: exam.theoryMaxScore },
    attempts,
    notStarted,
  });
}
