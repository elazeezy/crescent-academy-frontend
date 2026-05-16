import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import dbConnect from '@/lib/dbConnect';
import LearningMaterial from '@/models/LearningMaterial';
import cloudinary from '@/lib/cloudinary';

export const maxDuration = 60;

// GET /api/teacher/materials — list materials uploaded by this teacher
export async function GET() {
  const session = await auth();
  if (!session?.user || session.user.role !== 'teacher') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  await dbConnect();
  const materials = await LearningMaterial.find({ uploadedBy: session.user.id })
    .sort({ createdAt: -1 })
    .lean();
  return NextResponse.json({ materials: JSON.parse(JSON.stringify(materials)) });
}

// POST /api/teacher/materials — upload a new learning material
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user || session.user.role !== 'teacher') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const formData   = await req.formData();
    const file       = formData.get('file') as File | null;
    const title      = (formData.get('title') as string)?.trim();
    const subject    = (formData.get('subject') as string)?.trim();
    const targetClass = (formData.get('targetClass') as string)?.trim();
    const description = (formData.get('description') as string)?.trim() ?? '';

    if (!file || !title || !subject || !targetClass) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const bytes  = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploaded = await new Promise<{ secure_url: string; public_id: string }>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: 'crescent-college/materials',
          resource_type: 'raw',
          public_id: `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`,
          overwrite: false,
        },
        (err, result) => {
          if (err || !result) return reject(err ?? new Error('Upload failed'));
          resolve({ secure_url: result.secure_url, public_id: result.public_id });
        }
      );
      stream.end(buffer);
    });

    const ext = file.name.split('.').pop()?.toLowerCase() ?? 'file';

    await dbConnect();
    const material = await LearningMaterial.create({
      title,
      description,
      subject,
      targetClass,
      fileUrl:    uploaded.secure_url,
      fileType:   ext,
      fileName:   file.name,
      uploadedBy: session.user.id,
    });

    return NextResponse.json({ material: JSON.parse(JSON.stringify(material)) });
  } catch (err: any) {
    console.error('material upload error:', err);
    return NextResponse.json({ error: err.message || 'Upload failed' }, { status: 500 });
  }
}
