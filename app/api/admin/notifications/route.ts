import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import dbConnect from '@/lib/dbConnect';
import Notification from '@/models/Notification';

// GET /api/admin/notifications — list all notifications sent
export async function GET() {
  const session = await auth();
  if (!session?.user || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  await dbConnect();
  const notifications = await Notification.find()
    .sort({ createdAt: -1 })
    .populate('sentBy', 'name')
    .lean();
  return NextResponse.json({ notifications: JSON.parse(JSON.stringify(notifications)) });
}

// POST /api/admin/notifications — send a new notification to teachers
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();
  const { title, message, targetRole = 'teacher' } = body;

  if (!title?.trim() || !message?.trim()) {
    return NextResponse.json({ error: 'Title and message are required' }, { status: 400 });
  }

  await dbConnect();
  const notification = await Notification.create({
    title:      title.trim(),
    message:    message.trim(),
    targetRole,
    sentBy:     session.user.id,
    readBy:     [],
  });

  return NextResponse.json({ notification: JSON.parse(JSON.stringify(notification)) });
}
