import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import cloudinary from '@/lib/cloudinary';

const FOLDER = 'crescent-college/gallery';

// POST /api/admin/gallery/sign — mints a signed Cloudinary upload so the browser can
// upload the file directly to Cloudinary (large videos included) without the bytes
// ever passing through our serverless function, which has a small request-body limit.
export async function POST() {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const timestamp = Math.round(Date.now() / 1000);
  const signature = cloudinary.utils.api_sign_request(
    { timestamp, folder: FOLDER },
    process.env.CLOUDINARY_API_SECRET as string
  );

  return NextResponse.json({
    signature,
    timestamp,
    apiKey: process.env.CLOUDINARY_API_KEY,
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    folder: FOLDER,
  });
}
