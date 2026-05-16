import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import dbConnect from '@/lib/dbConnect';
import Student from '@/models/Student';
import LearningMaterial from '@/models/LearningMaterial';

// GET /api/student/materials — returns materials for this student's class
export async function GET() {
  const session = await auth();
  if (!session?.user || session.user.role !== 'student') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await dbConnect();
  const student = await Student.findOne({ user: session.user.id }).lean() as any;
  if (!student) return NextResponse.json({ error: 'Student not found' }, { status: 404 });

  const materials = await LearningMaterial.find({
    $or: [
      { targetClass: student.currentClass },
      { targetClass: 'All Classes' },
    ],
  })
    .sort({ createdAt: -1 })
    .lean();

  return NextResponse.json({ materials: JSON.parse(JSON.stringify(materials)) });
}
