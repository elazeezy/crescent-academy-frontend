import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import dbConnect from '@/lib/dbConnect';
import Result from '@/models/Result';

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (session?.user?.role !== 'admin') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  const { principalComment } = await req.json();

  if (typeof principalComment !== 'string' || !principalComment.trim()) {
    return NextResponse.json({ error: 'Principal comment cannot be empty' }, { status: 400 });
  }

  try {
    await dbConnect();
    const result = await Result.findByIdAndUpdate(
      id,
      { principalComment: principalComment.trim() },
      { new: true }
    );
    if (!result) return NextResponse.json({ error: 'Result not found' }, { status: 404 });

    return NextResponse.json({ success: true, result });
  } catch {
    return NextResponse.json({ error: 'Failed to update comment' }, { status: 500 });
  }
}
