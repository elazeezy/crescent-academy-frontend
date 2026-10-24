import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import dbConnect from '@/lib/dbConnect';
import Result from '@/models/Result';

// GET /api/principal/results — every result across both sections, for the principal's
// performance overview and report-card editing. Read-only listing (no publish control).
export async function GET() {
  const session = await auth();
  if (session?.user?.role !== 'principal') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await dbConnect();
    const results = await Result.find({})
      .populate({
        path: 'student',
        select: 'firstName lastName currentClass section studentId',
        populate: { path: 'user', select: 'name email' },
      })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ results });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch results' }, { status: 500 });
  }
}
