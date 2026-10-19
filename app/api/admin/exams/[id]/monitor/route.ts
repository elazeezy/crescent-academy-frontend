import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
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

  // Compute answeredCount in the database (via $size/$filter) instead of shipping every
  // student's full answer array to the server on each 10s poll — the single biggest
  // payload saving when a class of hundreds is sitting the exam.
  const [attempts, classStudents] = await Promise.all([
    ExamAttempt.aggregate([
      { $match: { exam: new mongoose.Types.ObjectId(id) } },
      {
        $project: {
          student: 1, status: 1, startedAt: 1, deadline: 1, lastSeenAt: 1,
          reattemptAllowed: 1, attemptNumber: 1,
          answeredCount: {
            $size: { $filter: { input: { $ifNull: ['$answers', []] }, cond: { $ne: ['$$this', null] } } },
          },
        },
      },
      { $lookup: { from: 'students', localField: 'student', foreignField: '_id', as: 'student' } },
      { $unwind: '$student' },
      {
        $project: {
          status: 1, startedAt: 1, deadline: 1, lastSeenAt: 1, reattemptAllowed: 1, attemptNumber: 1, answeredCount: 1,
          'student._id': 1, 'student.firstName': 1, 'student.lastName': 1, 'student.studentId': 1,
        },
      },
    ]),
    Student.find({ section: exam.section, currentClass: exam.targetClass })
      .select('firstName lastName studentId')
      .lean(),
  ]);

  const attemptedIds = new Set(attempts.map((a: any) => a.student?._id?.toString()));
  const notStarted = classStudents.filter((s: any) => !attemptedIds.has(s._id.toString()));

  const progress = attempts.map((a: any) => ({
    student: a.student,
    status: a.status,
    answeredCount: a.answeredCount,
    totalQuestions: exam.questions.length,
    startedAt: a.startedAt,
    deadline: a.deadline,
    lastSeenAt: a.lastSeenAt,
    reattemptAllowed: !!a.reattemptAllowed,
    attemptNumber: a.attemptNumber ?? 1,
  }));

  return NextResponse.json({
    exam: { title: exam.title, subject: exam.subject, status: exam.status, durationMinutes: exam.durationMinutes, questionCount: exam.questions.length },
    inProgress: progress.filter((p: any) => p.status === 'in_progress'),
    submitted: progress.filter((p: any) => p.status !== 'in_progress'),
    notStarted,
  });
}
