import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import Student from '@/models/Student';
import { auth } from '@/auth';

const REQUIRED_FIELDS = ['firstName', 'lastName', 'class'] as const;

export async function POST(req: Request) {
  const session = await auth();
  if (session?.user?.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let students: any[];
  try {
    const body = await req.json();
    students = body?.students;
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  if (!Array.isArray(students) || students.length === 0) {
    return NextResponse.json({ error: 'No student records provided' }, { status: 400 });
  }

  // Validate that every row has the required fields
  for (let i = 0; i < students.length; i++) {
    for (const field of REQUIRED_FIELDS) {
      if (!students[i][field] || String(students[i][field]).trim() === '') {
        return NextResponse.json(
          { error: `Row ${i + 1} is missing required field: "${field}"` },
          { status: 400 }
        );
      }
    }
  }

  try {
    await dbConnect();

    const results = await Promise.all(
      students.map(async (data: any) => {
        const studentId = `STU-2026-${Math.floor(1000 + Math.random() * 9000)}`;
        const email =
          data.email?.trim().toLowerCase() ||
          `${studentId.toLowerCase()}@crescent.edu.ng`;

        const existingUser = await User.findOne({ email });
        if (existingUser) return null;

        const newUser = await User.create({
          email,
          password: 'Crescent123', // hashed by User pre-save hook
          role: 'student',
          name: `${String(data.firstName).trim()} ${String(data.lastName).trim()}`,
        });

        return await Student.create({
          user: newUser._id,
          studentId,
          firstName: String(data.firstName).trim(),
          lastName: String(data.lastName).trim(),
          gender: String(data.gender || 'male').toLowerCase(),
          currentClass: String(data.class).trim(),
          parentPhone: String(data.parentPhone || '0000000000').trim(),
        });
      })
    );

    const count = results.filter((r) => r !== null).length;
    const skipped = results.length - count;
    return NextResponse.json({ success: true, count, skipped });
  } catch {
    return NextResponse.json({ error: 'Failed to process student list' }, { status: 500 });
  }
}
