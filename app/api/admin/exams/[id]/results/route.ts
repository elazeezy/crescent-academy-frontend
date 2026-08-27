import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import dbConnect from '@/lib/dbConnect';
import Exam from '@/models/Exam';
import ExamAttempt from '@/models/ExamAttempt';
import Student from '@/models/Student';

// GET /api/admin/exams/[id]/results — read-only view of every attempt's auto-graded
// objective score and answer breakdown. Admin can only see scores here, never write
// them anywhere — CBT scoring is fully automatic and is not recorded into report cards.
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  await dbConnect();

  const exam = await Exam.findById(id).lean() as any;
  if (!exam) return NextResponse.json({ error: 'Exam not found' }, { status: 404 });

  const attempts = await ExamAttempt.find({ exam: id })
    .populate({ path: 'student', select: 'firstName lastName studentId currentClass' })
    .sort({ objectiveScore: -1, createdAt: 1 })
    .lean();

  const attemptedIds = new Set(attempts.map((a: any) => a.student?._id?.toString()));
  const classStudents = await Student.find({ section: exam.section, currentClass: exam.targetClass })
    .select('firstName lastName studentId')
    .lean();
  const notStarted = classStudents.filter((s: any) => !attemptedIds.has(s._id.toString()));

  return NextResponse.json({
    exam: { title: exam.title, subject: exam.subject, questions: exam.questions, objectiveCount: exam.objectiveCount },
    attempts,
    notStarted,
  });
}
