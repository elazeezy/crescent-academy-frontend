import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import dbConnect from '@/lib/dbConnect';
import ReattemptRequest from '@/models/ReattemptRequest';

// GET /api/admin/reattempt-requests — all re-attempt requests across the school.
export async function GET() {
  const session = await auth();
  if (!session?.user || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await dbConnect();

  const requests = await ReattemptRequest.find({})
    .sort({ status: 1, createdAt: -1 })
    .limit(150)
    .lean() as any[];

  const mapped = requests.map((r) => ({
    _id: r._id.toString(),
    examTitle: r.examTitle,
    studentName: r.studentName,
    reason: r.reason ?? '',
    status: r.status,
    createdAt: r.createdAt,
    decidedAt: r.decidedAt ?? null,
  }));

  return NextResponse.json({
    pending: mapped.filter((r) => r.status === 'pending'),
    decided: mapped.filter((r) => r.status !== 'pending').slice(0, 40),
  });
}
