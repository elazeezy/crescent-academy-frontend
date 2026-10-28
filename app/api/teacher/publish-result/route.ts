import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import dbConnect from '@/lib/dbConnect';
import Result from '@/models/Result';

// POST /api/teacher/publish-result
// Body: { resultId, publish: boolean }
// Any teacher may publish/unpublish any class's result (portal-wide capacity).
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user || session.user.role !== 'teacher') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { resultId, publish } = await req.json();
  if (!resultId) return NextResponse.json({ error: 'Missing resultId' }, { status: 400 });

  await dbConnect();

  const result = await Result.findById(resultId).lean() as any;
  if (!result) return NextResponse.json({ error: 'Result not found' }, { status: 404 });

  await Result.findByIdAndUpdate(resultId, {
    published:   !!publish,
    publishedAt: publish ? new Date() : undefined,
  });

  return NextResponse.json({
    published: !!publish,
    message:   publish ? 'Result published to student portal.' : 'Result unpublished.',
  });
}
