import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import dbConnect from '@/lib/dbConnect';
import Result from '@/models/Result';
import cloudinary from '@/lib/cloudinary';

export const maxDuration = 30;

// POST /api/teacher/upload-signature
// Body: multipart/form-data with fields: file, resultId, type (formMasterSignature | principalSignature | schoolStamp)
export async function POST(req: NextRequest) {
  const [session] = await Promise.all([auth(), dbConnect()]);
  if (!session?.user || (session.user as any).role !== 'teacher') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file     = formData.get('file') as File | null;
    const resultId = formData.get('resultId') as string;
    const type     = formData.get('type') as string;

    const allowed = ['formMasterSignature', 'principalSignature', 'schoolStamp'];
    if (!file || !resultId || !allowed.includes(type)) {
      return NextResponse.json({ error: 'Missing or invalid fields' }, { status: 400 });
    }

    const bytes  = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploaded = await new Promise<{ secure_url: string; public_id: string }>((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          folder: 'crescent-college/signatures',
          public_id: `${resultId}_${type}`,
          overwrite: true,
        },
        (err, result) => {
          if (err || !result) return reject(err ?? new Error('Upload failed'));
          resolve({ secure_url: result.secure_url, public_id: result.public_id });
        }
      ).end(buffer);
    });

    await Result.findByIdAndUpdate(resultId, { [type]: uploaded.secure_url });

    return NextResponse.json({ url: uploaded.secure_url });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Upload failed' }, { status: 500 });
  }
}
