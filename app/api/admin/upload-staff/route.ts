import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import Teacher from '@/models/Teacher';
import { auth } from '@/auth';

const REQUIRED_FIELDS = ['name', 'email', 'assignedClass'] as const;

export async function POST(req: Request) {
  const session = await auth();
  if (!session || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let staffList: any[];
  try {
    const body = await req.json();
    staffList = body?.staffList;
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  if (!Array.isArray(staffList) || staffList.length === 0) {
    return NextResponse.json({ error: 'No staff records provided' }, { status: 400 });
  }

  // Validate that every row has the required fields
  for (let i = 0; i < staffList.length; i++) {
    for (const field of REQUIRED_FIELDS) {
      if (!staffList[i][field] || String(staffList[i][field]).trim() === '') {
        return NextResponse.json(
          { error: `Row ${i + 1} is missing required field: "${field}"` },
          { status: 400 }
        );
      }
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(String(staffList[i].email).trim())) {
      return NextResponse.json(
        { error: `Row ${i + 1} has an invalid email address: "${staffList[i].email}"` },
        { status: 400 }
      );
    }
  }

  try {
    await dbConnect();

    const results = await Promise.all(
      staffList.map(async (data: any) => {
        const email = String(data.email).trim().toLowerCase();

        const existingUser = await User.findOne({ email });
        if (existingUser) return { status: 'skipped', email, reason: 'Duplicate' };

        const newUser = await User.create({
          name: String(data.name).trim(),
          email,
          password: 'Crescent123', // hashed by User pre-save hook
          role: 'teacher',
        });

        await Teacher.create({
          user: newUser._id,
          assignedClass: String(data.assignedClass).trim(),
          subjects: data.subjects
            ? String(data.subjects)
                .split(',')
                .map((s: string) => s.trim())
                .filter(Boolean)
            : [],
        });

        return { status: 'success', email };
      })
    );

    const added = results.filter((r) => r.status === 'success').length;
    const skipped = results.filter((r) => r.status === 'skipped').length;

    return NextResponse.json({
      success: true,
      message: `Processed ${staffList.length} staff members.`,
      added,
      skipped,
    });
  } catch {
    return NextResponse.json({ error: 'Failed to process staff list' }, { status: 500 });
  }
}
