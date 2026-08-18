import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import dbConnect from '@/lib/dbConnect';
import Exam from '@/models/Exam';
import ExamAttempt from '@/models/ExamAttempt';
import Student from '@/models/Student';

// GET /api/admin/exams/[id]/monitor — live progress while an exam is running.
// Deliberately does NOT expose correctness/score — only progress, so scoring
// stays hidden until grading, same rule that applies to teachers and students.
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  await dbConnect();

  const exam = await Exam.findById(id).lean() as any;
  if (!exam) return NextResponse.json({ error: 'Exam not found' }, { status: 404 });

  const [attempts, classStudents] = await Promise.all([
    ExamAttempt.find({ exam: id })
      .populate({ path: 'student', select: 'firstName lastName studentId' })
      .select('student answers status startedAt deadline lastSeenAt')
      .lean(),
    Student.find({ section: exam.section, currentClass: exam.targetClass })
      .select('firstName lastName studentId')
      .lean(),
  ]);

  const attemptedIds = new Set(attempts.map((a: any) => a.student?._id?.toString()));
  const notStarted = classStudents.filter((s: any) => !attemptedIds.has(s._id.toString()));

  const progress = attempts.map((a: any) => ({
    student: a.student,
    status: a.status,
    answeredCount: a.answers.filter((x: number | null) => x != null).length,
    totalQuestions: exam.questions.length,
    startedAt: a.startedAt,
    deadline: a.deadline,
    lastSeenAt: a.lastSeenAt,
  }));

  return NextResponse.json({
    exam: { title: exam.title, subject: exam.subject, status: exam.status, durationMinutes: exam.durationMinutes, questionCount: exam.questions.length },
    inProgress: progress.filter((p: any) => p.status === 'in_progress'),
    submitted: progress.filter((p: any) => p.status !== 'in_progress'),
    notStarted,
  });
}
