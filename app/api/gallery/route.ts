import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import GalleryItem from '@/models/GalleryItem';
import { migrateLegacyGalleryZonesIfNeeded } from '@/lib/galleryMigration';

// GET /api/gallery — public, no auth. Everything the school has uploaded via the
// admin gallery manager, newest first.
export async function GET() {
  try {
    await dbConnect();
    await migrateLegacyGalleryZonesIfNeeded();

    const items = await GalleryItem.find({})
      .select('type url caption category')
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ items });
  } catch {
    return NextResponse.json({ items: [] });
  }
}
