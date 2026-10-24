import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import dbConnect from '@/lib/dbConnect';
import Result from '@/models/Result';
import Student from '@/models/Student';
import Teacher from '@/models/Teacher';
import Exam from '@/models/Exam';
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

  // A teacher may read this result if the student is in their own class, OR if the
  // teacher set a CBT assessment targeting the student's class/section (so a subject
  // teacher can merge/record a score for a class they don't form-master — see req. 1).
  let setsExamForClass = false;
  if (!sameClass || !sameSection) {
    const studentClassRegex = classNameRegex(student.currentClass || '');
    const examForClass = await Exam.exists({
      createdBy: session.user.id,
      section: student.section || 'college',
      targetClass: { $regex: studentClassRegex, $options: 'i' },
    });
    setsExamForClass = !!examForClass;
  }

  if (!(sameClass && sameSection) && !setsExamForClass) {
    return NextResponse.json({ error: 'Not your student' }, { status: 403 });
  }

  const result = await Result.findOne({ student: studentId, term, session: termSession }).lean();
  return NextResponse.json({ result });
}
