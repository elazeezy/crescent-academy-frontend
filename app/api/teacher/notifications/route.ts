import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import dbConnect from '@/lib/dbConnect';
import Notification from '@/models/Notification';

// GET /api/teacher/notifications — list notifications for teachers
export async function GET() {
  const session = await auth();
  if (!session?.user || session.user.role !== 'teacher') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await dbConnect();
  const notifications = await Notification.find({ targetRole: { $in: ['teacher', 'all'] } })
    .sort({ createdAt: -1 })
    .lean() as any[];

  const userId = session.user.id;
  const mapped = notifications.map(n => ({
    ...n,
    _id:    n._id.toString(),
    sentBy: n.sentBy?.toString(),
    readBy: n.readBy?.map((id: any) => id.toString()),
    isRead: n.readBy?.some((id: any) => id.toString() === userId),
  }));

  return NextResponse.json({ notifications: mapped });
}

// PATCH /api/teacher/notifications — mark a notification as read
export async function PATCH(req: Request) {
  const session = await auth();
  if (!session?.user || session.user.role !== 'teacher') {
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
