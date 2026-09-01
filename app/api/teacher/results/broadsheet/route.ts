import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import dbConnect from '@/lib/dbConnect';
import { getSiteImages } from '@/lib/getSiteImages';
import { generateBroadsheet, VALID_BROADSHEET_TERMS, BroadsheetTerm } from '@/lib/broadsheet';

// GET /api/teacher/results/broadsheet?session=2025/2026&term=3rd Term|cumulative
// A teacher is locked to their own assigned class/section — no picker needed.
export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user || session.user.role !== 'teacher') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const targetClass = session.user.assignedClass;
  const section = (session.user.section || 'college') as 'college' | 'science';
  if (!targetClass) {
    return NextResponse.json({ error: 'You have no assigned class' }, { status: 400 });
  }

  const { searchParams } = new URL(req.url);
  const academicSession = searchParams.get('session');
  const term = searchParams.get('term') as BroadsheetTerm | null;

  if (!academicSession || !term) {
    return NextResponse.json({ error: 'session and term are required' }, { status: 400 });
  }
  if (!VALID_BROADSHEET_TERMS.includes(term)) {
    return NextResponse.json({ error: 'Invalid term' }, { status: 400 });
  }

  await dbConnect();
  const [data, siteImages] = await Promise.all([
    generateBroadsheet({ section, targetClass, academicSession, term }),
    getSiteImages(),
  ]);

  return NextResponse.json({ ...data, schoolLogo: siteImages['school-logo'] || null });
}
