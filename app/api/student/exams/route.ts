import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import dbConnect from '@/lib/dbConnect';
import Exam from '@/models/Exam';
import ExamAttempt from '@/models/ExamAttempt';
import Student from '@/models/Student';

// GET /api/student/exams — this student's live class assessments plus prior attempts.
export async function GET() {
  const session = await auth();
  if (!session?.user || session.user.role !== 'student') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await dbConnect();

  const student = await Student.findOne({ user: session.user.id }).lean() as any;
  if (!student) return NextResponse.json({ error: 'Student profile not found' }, { status: 404 });

  const attempts = await ExamAttempt.find({ student: student._id })
    .select('exam status reattemptAllowed')
    .sort({ createdAt: -1 })
    .lean();

  const exams = await Exam.find({
    $or: [
      { _id: { $in: attempts.map((a: any) => a.exam) } },
      { section: student.section, targetClass: student.currentClass, status: 'live' },
    ],
  })
    .select('title subject assessmentSlot term session durationMinutes questions objectiveCount windowStart windowEnd status')
    .lean();
  const attemptByExam = new Map(attempts.map((a: any) => [a.exam.toString(), a]));

  const result = exams.map((exam: any) => {
    const attempt: any = attemptByExam.get(exam._id.toString());
    const { questions, ...safeExam } = exam;
    return { ...safeExam, objectiveCount: questions?.length ?? exam.objectiveCount, attemptStatus: attempt?.status ?? 'not_started', reattemptAllowed: !!attempt?.reattemptAllowed };
  }).sort((a: any, b: any) => new Date(b.windowStart ?? b.createdAt).getTime() - new Date(a.windowStart ?? a.createdAt).getTime());

  return NextResponse.json({ exams: result });
}
