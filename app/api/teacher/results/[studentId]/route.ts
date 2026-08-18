import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import dbConnect from '@/lib/dbConnect';
import Result from '@/models/Result';
import Student from '@/models/Student';
import Teacher from '@/models/Teacher';
import { classNameRegex } from '@/lib/subjects';

// GET /api/teacher/results/[studentId]?term=...&session=...
// Returns the existing result for one of this teacher's own students, if any —
// used to merge a single subject's score in without wiping the others.
export async function GET(req: NextRequest, { params }: { params: Promise<{ studentId: string }> }) {
  const session = await auth();
  if (!session?.user || session.user.role !== 'teacher') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { studentId } = await params;
  const { searchParams } = new URL(req.url);
  const term = searchParams.get('term');
  const termSession = searchParams.get('session');
  if (!term || !termSession) {
    return NextResponse.json({ error: 'term and session query params are required' }, { status: 400 });
  }

  await dbConnect();

  const [teacher, student] = await Promise.all([
    Teacher.findOne({ user: session.user.id }).lean() as any,
    Student.findById(studentId).lean() as any,
  ]);
  if (!student) return NextResponse.json({ error: 'Student not found' }, { status: 404 });

  const classRegex = classNameRegex(teacher?.assignedClass || '');
  const sameClass = new RegExp(classRegex, 'i').test(student.currentClass || '');
  const sameSection = (teacher?.section || 'college') === (student.section || 'college');
  if (!sameClass || !sameSection) {
    return NextResponse.json({ error: 'Not your student' }, { status: 403 });
  }

  const result = await Result.findOne({ student: studentId, term, session: termSession }).lean();
  return NextResponse.json({ result });
}
