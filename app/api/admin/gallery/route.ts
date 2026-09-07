import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import dbConnect from '@/lib/dbConnect';
import GalleryItem from '@/models/GalleryItem';
import { GALLERY_CATEGORIES } from '@/lib/gallery';
import { migrateLegacyGalleryZonesIfNeeded } from '@/lib/galleryMigration';

// GET /api/admin/gallery — every photo/video for the admin management grid
export async function GET() {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await dbConnect();
  await migrateLegacyGalleryZonesIfNeeded();

  const items = await GalleryItem.find({}).sort({ createdAt: -1 }).lean();
  return NextResponse.json({ items });
}

// POST /api/admin/gallery — save the metadata for a file the browser already
// uploaded straight to Cloudinary via the signed /sign endpoint.
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const { url, publicId, type, caption, category } = body;
  if (!url || !publicId || !['image', 'video'].includes(type)) {
    return NextResponse.json({ error: 'url, publicId, and a valid type are required' }, { status: 400 });
  }
  if (category && !GALLERY_CATEGORIES.includes(category)) {
    return NextResponse.json({ error: 'Invalid category' }, { status: 400 });
  }

  await dbConnect();
  const item = await GalleryItem.create({
    type,
    url,
    publicId,
    caption: caption ? String(caption).trim() : '',
    category: category || 'Events',
  });

  return NextResponse.json({ success: true, item });
}
