import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import dbConnect from '@/lib/dbConnect';
import SiteImage from '@/models/SiteImage';
import cloudinary from '@/lib/cloudinary';

// DELETE /api/admin/site-images/[zoneId] — remove image for a zone
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ zoneId: string }> }
) {
  const session = await auth();
  if (!session?.user || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { zoneId } = await params;

  try {
    await dbConnect();
    const record = await SiteImage.findOne({ zoneId });
    if (!record) return NextResponse.json({ error: 'Zone not found' }, { status: 404 });

    if (record.publicId) {
      await cloudinary.uploader.destroy(record.publicId).catch(() => null);
    }

    await SiteImage.deleteOne({ zoneId });
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Delete failed' }, { status: 500 });
  }
}
