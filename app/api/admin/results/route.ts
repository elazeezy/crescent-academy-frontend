import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import dbConnect from '@/lib/dbConnect';
import Result from '@/models/Result';

export async function GET() {
  const session = await auth();
  if (session?.user?.role !== 'admin') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    await dbConnect();
    const results = await Result.find({})
      .populate({
        path: 'student',
        select: 'firstName lastName currentClass studentId',
        populate: { path: 'user', select: 'name email' },
      })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ results });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch results' }, { status: 500 });
  }
}
