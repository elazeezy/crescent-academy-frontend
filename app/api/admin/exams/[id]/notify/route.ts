import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import dbConnect from '@/lib/dbConnect';
import Exam from '@/models/Exam';
import Notification from '@/models/Notification';

// POST /api/admin/exams/[id]/notify — pings the exam's class with a direct link the
// moment it's time to sit the exam. This is the only way students learn an exam
// exists — there is no browsable exam list on the student portal.
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  await dbConnect();

  const exam = await Exam.findById(id).lean() as any;
  if (!exam) return NextResponse.json({ error: 'Exam not found' }, { status: 404 });
  if (exam.status !== 'live') {
    return NextResponse.json({ error: 'Only a live exam can be announced to its class' }, { status: 400 });
  }

  const notification = await Notification.create({
    title: `New CBT Exam: ${exam.title}`,
    message: `${exam.subject} is now open for ${exam.targetClass}. You have ${exam.durationMinutes} minutes once you begin — tap to start.`,
    targetRole: 'student',
    targetSection: exam.section,
    targetClass: exam.targetClass,
    link: `/portals/dashboard/student/exams/${exam._id}`,
    sentBy: session.user.id,
    readBy: [],
  });

  return NextResponse.json({ success: true, notification: JSON.parse(JSON.stringify(notification)) });
}
