import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import dbConnect from '@/lib/dbConnect';
import { getSiteImages } from '@/lib/getSiteImages';
import { generateBroadsheet, VALID_BROADSHEET_TERMS, BroadsheetTerm } from '@/lib/broadsheet';

// GET /api/admin/results/broadsheet?session=2025/2026&section=college&class=S.S. 2&term=3rd Term|cumulative
// Admin can pull the broadsheet for any class/section/term.
export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const academicSession = searchParams.get('session');
  const section = searchParams.get('section');
  const targetClass = searchParams.get('class');
  const term = searchParams.get('term') as BroadsheetTerm | null;

  if (!academicSession || !section || !targetClass || !term) {
    return NextResponse.json({ error: 'session, section, class, and term are required' }, { status: 400 });
  }
  if (!['college', 'science'].includes(section)) {
    return NextResponse.json({ error: 'Invalid section' }, { status: 400 });
  }
  if (!VALID_BROADSHEET_TERMS.includes(term)) {
    return NextResponse.json({ error: 'Invalid term' }, { status: 400 });
  }

  await dbConnect();
  const [data, siteImages] = await Promise.all([
    generateBroadsheet({ section: section as 'college' | 'science', targetClass, academicSession, term }),
    getSiteImages(),
  ]);

  return NextResponse.json({ ...data, schoolLogo: siteImages['school-logo'] || null });
}
