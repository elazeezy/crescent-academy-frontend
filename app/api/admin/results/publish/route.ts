import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import dbConnect from '@/lib/dbConnect';
import Result from '@/models/Result';

// POST /api/admin/results/publish
// Body: { resultId, publish: boolean }
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let body: any;
  try { body = await req.json(); } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const { resultId, publish } = body;
  if (!resultId || typeof publish !== 'boolean') {
    return NextResponse.json({ error: 'Missing resultId or publish flag' }, { status: 400 });
  }

  try {
    await dbConnect();
    const update: any = { published: publish };
    if (publish) update.publishedAt = new Date();

    const result = await Result.findByIdAndUpdate(resultId, update, { new: true });
    if (!result) return NextResponse.json({ error: 'Result not found' }, { status: 404 });

    return NextResponse.json({
      success: true,
      message: publish ? 'Result published to student portal' : 'Result unpublished',
      published: result.published,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed' }, { status: 500 });
  }
}
