import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import mongoose from 'mongoose';

export async function GET() {
  try {
    await dbConnect();
    const state = mongoose.connection.readyState;
    // 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting
    if (state === 1) {
      return NextResponse.json({ status: 'success', message: 'MongoDB connected OK!' });
    }
    return NextResponse.json(
      { status: 'error', message: `Unexpected connection state: ${state}` },
      { status: 500 }
    );
  } catch (error) {
    return NextResponse.json(
      { status: 'error', message: 'Failed to connect to MongoDB' },
      { status: 500 }
    );
  }
}
