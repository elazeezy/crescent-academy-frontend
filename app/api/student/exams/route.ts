import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import dbConnect from '@/lib/dbConnect';
import Exam from '@/models/Exam';
import ExamAttempt from '@/models/ExamAttempt';
import Student from '@/models/Student';

// GET /api/student/exams — exams currently open for this student's section/class
export async function GET() {
  const session = await auth();
  if (!session?.user || session.user.role !== 'student') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await dbConnect();

  const student = await Student.findOne({ user: session.user.id }).lean() as any;
  if (!student) return NextResponse.json({ error: 'Student profile not found' }, { status: 404 });

  const exams = await Exam.find({
    section: student.section,
    targetClass: student.currentClass,
    status: 'live',
  })
    .select('title subject durationMinutes objectiveCount windowStart windowEnd')
    .sort({ createdAt: -1 })
    .lean();

  const attempts = await ExamAttempt.find({ student: student._id, exam: { $in: exams.map((e: any) => e._id) } })
    .select('exam status')
    .lean();
  const attemptStatusByExam = new Map(attempts.map((a: any) => [a.exam.toString(), a.status]));

  const result = exams.map((e: any) => ({
    ...e,
    attemptStatus: attemptStatusByExam.get(e._id.toString()) ?? null,
  }));

  return NextResponse.json({ exams: result });
}
