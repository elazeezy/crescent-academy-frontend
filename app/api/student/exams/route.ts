import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import dbConnect from '@/lib/dbConnect';
import Exam from '@/models/Exam';
import ExamAttempt from '@/models/ExamAttempt';
import Student from '@/models/Student';

// GET /api/student/exams — exams this student has already started or submitted.
// Deliberately does NOT list every live exam for the class — a student only ever
// reaches a new exam via the direct link sent in a notification, never by browsing.
export async function GET() {
  const session = await auth();
  if (!session?.user || session.user.role !== 'student') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await dbConnect();

  const student = await Student.findOne({ user: session.user.id }).lean() as any;
  if (!student) return NextResponse.json({ error: 'Student profile not found' }, { status: 404 });

  const attempts = await ExamAttempt.find({ student: student._id })
    .select('exam status')
    .sort({ createdAt: -1 })
    .lean();

  const exams = await Exam.find({ _id: { $in: attempts.map((a: any) => a.exam) } })
    .select('title subject durationMinutes objectiveCount')
    .lean();
  const examById = new Map(exams.map((e: any) => [e._id.toString(), e]));

  const result = attempts
    .map((a: any) => {
      const exam = examById.get(a.exam.toString());
      if (!exam) return null;
      return { ...exam, attemptStatus: a.status };
    })
    .filter(Boolean);

  return NextResponse.json({ exams: result });
}
