import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import dbConnect from '@/lib/dbConnect';
import GalleryItem from '@/models/GalleryItem';
import cloudinary from '@/lib/cloudinary';
import { GALLERY_CATEGORIES } from '@/lib/gallery';

// PATCH /api/admin/gallery/[id] — edit caption and/or category
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const body = await req.json().catch(() => ({}));
  const { caption, category } = body;

  if (category && !GALLERY_CATEGORIES.includes(category)) {
    return NextResponse.json({ error: 'Invalid category' }, { status: 400 });
  }

  const update: Record<string, string> = {};
  if (typeof caption === 'string') update.caption = caption.trim();
  if (typeof category === 'string') update.category = category;

  await dbConnect();
  const item = await GalleryItem.findByIdAndUpdate(id, update, { new: true });
  if (!item) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  return NextResponse.json({ success: true, item });
}

// DELETE /api/admin/gallery/[id] — remove the Cloudinary asset and the record
export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  await dbConnect();

  const item = await GalleryItem.findById(id);
  if (!item) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  await cloudinary.uploader.destroy(item.publicId, { resource_type: item.type === 'video' ? 'video' : 'image' }).catch(() => null);
  await item.deleteOne();

  return NextResponse.json({ success: true });
}
