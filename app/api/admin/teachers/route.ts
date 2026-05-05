import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import dbConnect from '@/lib/dbConnect';
import Teacher from '@/models/Teacher';

export const maxDuration = 30;

export async function GET() {
  const [session] = await Promise.all([auth(), dbConnect()]);

  if ((session?.user as any)?.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const teachers = await Teacher.find({})
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ teachers });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch teachers' }, { status: 500 });
  }
}
