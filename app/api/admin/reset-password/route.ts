import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';

export async function POST(req: Request) {
  const session = await auth();
  if (session?.user?.role !== 'admin') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { userId, password } = await req.json();
  if (!userId) return NextResponse.json({ error: 'userId is required' }, { status: 400 });

  // Use admin-provided password if given, otherwise generate a readable temporary one
  const finalPassword = password?.trim() || `Crescent@${Math.floor(1000 + Math.random() * 9000)}`;

  try {
    await dbConnect();
    const user = await User.findById(userId);
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    // Setting password triggers the pre-save bcrypt hook
    user.password = finalPassword;
    await user.save();

    return NextResponse.json({ success: true, tempPassword: finalPassword });
  } catch {
    return NextResponse.json({ error: 'Failed to reset password' }, { status: 500 });
  }
}
