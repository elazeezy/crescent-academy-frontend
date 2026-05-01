import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import dbConnect from '@/lib/dbConnect';
import Student from '@/models/Student';
import User from '@/models/User';

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (session?.user?.role !== 'admin') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  const body = await req.json();
  const { firstName, lastName, currentClass, gender, parentPhone } = body;

  try {
    await dbConnect();
    const student = await Student.findByIdAndUpdate(
      id,
      { firstName, lastName, currentClass, gender, parentPhone },
      { new: true }
    );
    if (!student) return NextResponse.json({ error: 'Student not found' }, { status: 404 });

    // Keep User.name in sync
    await User.findByIdAndUpdate(student.user, { name: `${firstName} ${lastName}` });

    return NextResponse.json({ success: true, student });
  } catch {
    return NextResponse.json({ error: 'Failed to update student' }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (session?.user?.role !== 'admin') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;

  try {
    await dbConnect();
    const student = await Student.findByIdAndDelete(id);
    if (!student) return NextResponse.json({ error: 'Student not found' }, { status: 404 });

    // Also delete the linked User account
    await User.findByIdAndDelete(student.user);

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to delete student' }, { status: 500 });
  }
}
