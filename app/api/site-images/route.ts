import { NextResponse } from 'next/server';
import { getSiteImages } from '@/lib/getSiteImages';

// Public endpoint — no auth required, read-only
export async function GET() {
  const images = await getSiteImages();
  return NextResponse.json({ images });
}
