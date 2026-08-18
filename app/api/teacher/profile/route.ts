import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import dbConnect from '@/lib/dbConnect';
import Teacher from '@/models/Teacher';

// GET /api/teacher/profile — the logged-in teacher's own assignedClass/subjects/section
export async function GET() {
  const session = await auth();
  if (!session?.user || session.user.role !== 'teacher') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await dbConnect();
  const teacher = await Teacher.findOne({ user: session.user.id }).lean() as any;
  if (!teacher) return NextResponse.json({ error: 'Teacher profile not found' }, { status: 404 });

  return NextResponse.json({
    assignedClass: teacher.assignedClass,
    subjects: teacher.subjects ?? [],
    section: teacher.section,
  });
}
