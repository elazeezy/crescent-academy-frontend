import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import dbConnect from '@/lib/dbConnect';
import LearningMaterial from '@/models/LearningMaterial';

// DELETE /api/teacher/materials/[id]
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user || session.user.role !== 'teacher') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { id } = await params;
  await dbConnect();
  const material = await LearningMaterial.findOne({ _id: id, uploadedBy: session.user.id });
  if (!material) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  await material.deleteOne();
  return NextResponse.json({ ok: true });
}
