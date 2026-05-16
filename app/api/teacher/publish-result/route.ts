import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import dbConnect from '@/lib/dbConnect';
import Result from '@/models/Result';
import Student from '@/models/Student';
import Teacher from '@/models/Teacher';

// POST /api/teacher/publish-result
// Body: { resultId, publish: boolean }
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user || session.user.role !== 'teacher') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { resultId, publish } = await req.json();
  if (!resultId) return NextResponse.json({ error: 'Missing resultId' }, { status: 400 });

  await dbConnect();

  // Verify the result belongs to a student in this teacher's class
  const teacher = await Teacher.findOne({ user: session.user.id }).lean() as any;
  const result  = await Result.findById(resultId).populate('student').lean() as any;

  if (!result) return NextResponse.json({ error: 'Result not found' }, { status: 404 });

  // Ensure teacher owns this class
  const student = await Student.findById(result.student?._id ?? result.student).lean() as any;
  if (!student) return NextResponse.json({ error: 'Student not found' }, { status: 404 });

  const normalise = (s: string) => s?.replace(/[\s.]/g, '').toLowerCase();
  if (teacher?.assignedClass && normalise(student.currentClass) !== normalise(teacher.assignedClass)) {
    return NextResponse.json({ error: 'Not your student' }, { status: 403 });
  }

  await Result.findByIdAndUpdate(resultId, {
    published:   !!publish,
    publishedAt: publish ? new Date() : undefined,
  });

  return NextResponse.json({
    published: !!publish,
    message:   publish ? 'Result published to student portal.' : 'Result unpublished.',
  });
}
