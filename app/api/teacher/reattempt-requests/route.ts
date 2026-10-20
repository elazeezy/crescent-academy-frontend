import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import dbConnect from '@/lib/dbConnect';
import ReattemptRequest from '@/models/ReattemptRequest';

// GET /api/teacher/reattempt-requests — re-attempt requests for exams this teacher created.
export async function GET() {
  const session = await auth();
  if (!session?.user || session.user.role !== 'teacher') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await dbConnect();

  const requests = await ReattemptRequest.find({ teacher: session.user.id })
    .sort({ status: 1, createdAt: -1 }) // pending (p < r) surfaces first-ish; UI also groups
    .limit(100)
    .lean() as any[];

  const mapped = requests.map((r) => ({
    _id: r._id.toString(),
    exam: r.exam?.toString(),
    student: r.student?.toString(),
    examTitle: r.examTitle,
    studentName: r.studentName,
    reason: r.reason ?? '',
    status: r.status,
    createdAt: r.createdAt,
    decidedAt: r.decidedAt ?? null,
  }));

  return NextResponse.json({
    pending: mapped.filter((r) => r.status === 'pending'),
    decided: mapped.filter((r) => r.status !== 'pending').slice(0, 30),
  });
}
