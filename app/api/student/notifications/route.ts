import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import dbConnect from '@/lib/dbConnect';
import Notification from '@/models/Notification';
import Student from '@/models/Student';

// GET /api/student/notifications — announcements for everyone, plus anything
// targeted at this student's specific class (e.g. a live CBT exam alert)
export async function GET() {
  const session = await auth();
  if (!session?.user || session.user.role !== 'student') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await dbConnect();

  const student = await Student.findOne({ user: session.user.id }).lean() as any;
  if (!student) return NextResponse.json({ error: 'Student profile not found' }, { status: 404 });

  const notifications = await Notification.find({
    $or: [
      { targetRole: 'all' },
      { targetRole: 'student', targetClass: { $exists: false } },
      { targetRole: 'student', targetClass: student.currentClass, targetSection: student.section },
    ],
  })
    .sort({ createdAt: -1 })
    .lean() as any[];

  const userId = session.user.id;
  const mapped = notifications.map((n) => ({
    _id: n._id.toString(),
    title: n.title,
    message: n.message,
    link: n.link ?? null,
    createdAt: n.createdAt,
    isRead: n.readBy?.some((rid: any) => rid.toString() === userId),
  }));

  return NextResponse.json({ notifications: mapped });
}

// PATCH /api/student/notifications — mark one notification as read
export async function PATCH(req: Request) {
  const session = await auth();
  if (!session?.user || session.user.role !== 'student') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { notificationId } = await req.json();
  if (!notificationId) return NextResponse.json({ error: 'Missing id' }, { status: 400 });

  await dbConnect();
  await Notification.findByIdAndUpdate(notificationId, {
    $addToSet: { readBy: session.user.id },
  });
  return NextResponse.json({ ok: true });
}
