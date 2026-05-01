import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import Student from '@/models/Student';
import Teacher from '@/models/Teacher';

export async function POST(req: Request) {
  const session = await auth();
  if (session?.user?.role !== 'admin') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const { role, name, email, password, firstName, lastName, currentClass, gender, parentPhone, assignedClass, subjects } = body;

  if (!role || !email || !name) {
    return NextResponse.json({ error: 'role, name, and email are required' }, { status: 400 });
  }

  const validRoles = ['student', 'teacher', 'admin', 'principal'];
  if (!validRoles.includes(role)) {
    return NextResponse.json({ error: `Invalid role. Must be one of: ${validRoles.join(', ')}` }, { status: 400 });
  }

  try {
    await dbConnect();

    const existing = await User.findOne({ email: email.trim().toLowerCase() });
    if (existing) return NextResponse.json({ error: 'Email already registered' }, { status: 409 });

    const finalPassword = password?.trim() || 'Crescent123';

    const newUser = await User.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password: finalPassword,
      role,
    });

    if (role === 'student') {
      if (!firstName || !lastName || !currentClass || !gender) {
        await User.findByIdAndDelete(newUser._id);
        return NextResponse.json({ error: 'Student requires: firstName, lastName, currentClass, gender' }, { status: 400 });
      }
      const studentId = `STU-2026-${Math.floor(1000 + Math.random() * 9000)}`;
      await Student.create({
        user: newUser._id,
        studentId,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        gender: gender.toLowerCase(),
        currentClass: currentClass.trim(),
        parentPhone: parentPhone?.trim() || '0000000000',
      });
    }

    if (role === 'teacher') {
      if (!assignedClass) {
        await User.findByIdAndDelete(newUser._id);
        return NextResponse.json({ error: 'Teacher requires: assignedClass' }, { status: 400 });
      }
      await Teacher.create({
        user: newUser._id,
        assignedClass: assignedClass.trim(),
        subjects: subjects
          ? String(subjects).split(',').map((s: string) => s.trim()).filter(Boolean)
          : [],
      });
    }

    return NextResponse.json({ success: true, userId: newUser._id.toString() });
  } catch {
    return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
  }
}
