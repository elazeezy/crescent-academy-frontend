import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import dbConnect from '@/lib/dbConnect';
import Teacher from '@/models/Teacher';
import User from '@/models/User';

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (session?.user?.role !== 'admin') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  const body = await req.json();
  const { name, assignedClass, subjects } = body;

  try {
    await dbConnect();
    const teacher = await Teacher.findByIdAndUpdate(
      id,
      {
        assignedClass,
        subjects: Array.isArray(subjects)
          ? subjects
          : String(subjects).split(',').map((s: string) => s.trim()).filter(Boolean),
      },
      { new: true }
    );
    if (!teacher) return NextResponse.json({ error: 'Teacher not found' }, { status: 404 });

    if (name) await User.findByIdAndUpdate(teacher.user, { name });

    return NextResponse.json({ success: true, teacher });
  } catch {
    return NextResponse.json({ error: 'Failed to update teacher' }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (session?.user?.role !== 'admin') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;

  try {
    await dbConnect();
    const teacher = await Teacher.findByIdAndDelete(id);
    if (!teacher) return NextResponse.json({ error: 'Teacher not found' }, { status: 404 });

    await User.findByIdAndDelete(teacher.user);

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to delete teacher' }, { status: 500 });
  }
}
