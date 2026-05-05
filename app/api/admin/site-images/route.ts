import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import dbConnect from '@/lib/dbConnect';
import SiteImage from '@/models/SiteImage';
import cloudinary from '@/lib/cloudinary';

export const maxDuration = 30;

// GET /api/admin/site-images — return all zones with current images
export async function GET() {
  try {
    await dbConnect();
    const images = await SiteImage.find({}).sort({ zoneId: 1 }).lean();
    return NextResponse.json({ images });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch images' }, { status: 500 });
  }
}

// POST /api/admin/site-images — upload image for a zone
export async function POST(req: NextRequest) {
  const [session] = await Promise.all([auth(), dbConnect()]);

  if (!session?.user || (session.user as any).role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file    = formData.get('file') as File | null;
    const zoneId  = formData.get('zoneId') as string;
    const zoneName = formData.get('zoneName') as string;

    if (!file || !zoneId || !zoneName) {
      return NextResponse.json({ error: 'Missing file, zoneId, or zoneName' }, { status: 400 });
    }

    // Delete old Cloudinary image if exists
    const existing = await SiteImage.findOne({ zoneId });
    if (existing?.publicId) {
      await cloudinary.uploader.destroy(existing.publicId).catch(() => null);
    }

    // Upload to Cloudinary
    const bytes  = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploaded = await new Promise<{ secure_url: string; public_id: string }>((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        { folder: 'crescent-college/site', public_id: `zone_${zoneId}`, overwrite: true },
        (err, result) => {
          if (err || !result) return reject(err ?? new Error('Upload failed'));
          resolve({ secure_url: result.secure_url, public_id: result.public_id });
        }
      ).end(buffer);
    });

    const record = await SiteImage.findOneAndUpdate(
      { zoneId },
      { zoneId, zoneName, publicId: uploaded.public_id, url: uploaded.secure_url },
      { upsert: true, new: true }
    );

    return NextResponse.json({ success: true, image: record });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Upload failed' }, { status: 500 });
  }
}
