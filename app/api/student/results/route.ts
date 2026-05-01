import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import dbConnect from '@/lib/dbConnect';
import Student from '@/models/Student';
import Result from '@/models/Result';

// GET /api/student/results
// Returns: list of published term options + student profile
export async function GET() {
  const session = await auth();
  if (!session?.user || session.user.role !== 'student') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await dbConnect();
    const student = await Student.findOne({ user: session.user.id }).lean() as any;
    if (!student) {
      return NextResponse.json({ error: 'Student profile not found. Contact the admin.' }, { status: 404 });
    }

    // Only return published results, newest first
    const results = await Result.find({
      student: student._id,
      published: true,
    })
      .sort({ session: -1, term: -1, createdAt: -1 })
      .select('_id term session')
      .lean() as any[];

    const termOptions = results.map(r => ({
      resultId: r._id.toString(),
      term:     r.term,
      session:  r.session,
      label:    `${r.term} — ${r.session}`,
    }));

    return NextResponse.json({
      student: JSON.parse(JSON.stringify(student)),
      termOptions,
    });
  } catch {
    return NextResponse.json({ error: 'Failed to load results' }, { status: 500 });
  }
}
