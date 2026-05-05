import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import dbConnect from '@/lib/dbConnect';
import Student from '@/models/Student';
import Teacher from '@/models/Teacher';
import Result from '@/models/Result';

export const maxDuration = 30;

export async function GET() {
  const [session] = await Promise.all([auth(), dbConnect()]);

  if (!session?.user || (session.user as any).role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const [studentCount, teacherCount, resultCount] = await Promise.all([
    Student.countDocuments(),
    Teacher.countDocuments(),
    Result.countDocuments(),
  ]);

  return NextResponse.json({ studentCount, teacherCount, resultCount });
}
