import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import dbConnect from '@/lib/dbConnect';
import Exam from '@/models/Exam';
import ExamAttempt from '@/models/ExamAttempt';
import Student from '@/models/Student';

// POST /api/student/exams/[id]/start — begins (or resumes) an attempt.
// Timer is server-stamped; questions are returned WITHOUT correctIndex.
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user || session.user.role !== 'student') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  await dbConnect();

  const student = await Student.findOne({ user: session.user.id }).lean() as any;
  if (!student) return NextResponse.json({ error: 'Student profile not found' }, { status: 404 });

  const exam = await Exam.findById(id).lean() as any;
  if (!exam) return NextResponse.json({ error: 'Exam not found' }, { status: 404 });

  if (exam.section !== student.section || exam.targetClass !== student.currentClass) {
    return NextResponse.json({ error: 'This exam is not available for your class' }, { status: 403 });
  }
  if (exam.status !== 'live') {
    return NextResponse.json({ error: 'This exam is not currently open' }, { status: 403 });
  }
  const now = new Date();
  if (exam.windowStart && now < new Date(exam.windowStart)) {
    return NextResponse.json({ error: 'This exam has not opened yet' }, { status: 403 });
  }
  if (exam.windowEnd && now > new Date(exam.windowEnd)) {
    return NextResponse.json({ error: 'This exam window has closed' }, { status: 403 });
  }

  let attempt = await ExamAttempt.findOne({ exam: id, student: student._id });

  if (attempt && (attempt.status === 'submitted' || attempt.status === 'auto_submitted')) {
    return NextResponse.json({ error: 'You have already submitted this exam' }, { status: 403 });
  }

  if (!attempt) {
    const startedAt = now;
    const deadline = new Date(startedAt.getTime() + exam.durationMinutes * 60 * 1000);
    attempt = await ExamAttempt.create({
      exam: id,
      student: student._id,
      answers: new Array(exam.questions.length).fill(null),
      startedAt,
      deadline,
      lastSeenAt: now,
      status: 'in_progress',
    });
  } else {
    // Resuming — auto-submit if the deadline has already passed while they were away
    if (now > attempt.deadline) {
      attempt.status = 'auto_submitted';
      await attempt.save();
      return NextResponse.json({ error: 'Time expired while you were disconnected. Your exam was auto-submitted.' }, { status: 403 });
    }
    attempt.lastSeenAt = now;
    await attempt.save();
  }

  const questionsForStudent = exam.questions.map((q: any) => ({ text: q.text, options: q.options }));

  return NextResponse.json({
    attemptId: attempt._id.toString(),
    title: exam.title,
    subject: exam.subject,
    questions: questionsForStudent,
    answers: attempt.answers,
    deadline: attempt.deadline,
    serverNow: now,
  });
}
