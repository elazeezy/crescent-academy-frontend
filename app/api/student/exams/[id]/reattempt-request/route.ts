import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import dbConnect from '@/lib/dbConnect';
import Exam from '@/models/Exam';
import ExamAttempt from '@/models/ExamAttempt';
import Student from '@/models/Student';
import ReattemptRequest from '@/models/ReattemptRequest';

// POST /api/student/exams/[id]/reattempt-request — the student asks to retake a CBT they
// already submitted. Creates a pending request for the exam's teacher to approve/reject.
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user || session.user.role !== 'student') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  let reason = '';
  try {
    const body = await req.json();
    if (typeof body?.reason === 'string') reason = body.reason.slice(0, 500);
  } catch {
    // reason is optional
  }

  try {
    await dbConnect();

    const student = await Student.findOne({ user: session.user.id }).lean() as any;
    if (!student) return NextResponse.json({ error: 'Student profile not found' }, { status: 404 });

    const exam = await Exam.findById(id).select('title createdBy').lean() as any;
    if (!exam) return NextResponse.json({ error: 'Exam not found' }, { status: 404 });

    const attempt = await ExamAttempt.findOne({ exam: id, student: student._id }).lean() as any;
    if (!attempt) return NextResponse.json({ error: 'You have not attempted this exam yet' }, { status: 400 });
    if (attempt.status === 'in_progress') {
      return NextResponse.json({ error: 'This exam is still in progress' }, { status: 400 });
    }
    if (attempt.reattemptAllowed) {
      return NextResponse.json({ error: 'A re-attempt has already been approved — just open the exam to retake it.' }, { status: 409 });
    }

    const existingPending = await ReattemptRequest.findOne({ exam: id, student: student._id, status: 'pending' }).lean();
    if (existingPending) {
      return NextResponse.json({ error: 'You already have a pending re-attempt request for this exam.' }, { status: 409 });
    }

    await ReattemptRequest.create({
      exam: id,
      student: student._id,
      teacher: exam.createdBy,
      examTitle: exam.title,
      studentName: `${student.firstName} ${student.lastName}`,
      reason,
      status: 'pending',
    });

    return NextResponse.json({ success: true, message: 'Request sent. Your teacher will review it.' });
  } catch {
    return NextResponse.json({ error: 'Server busy, please try again shortly.' }, { status: 503 });
  }
}
