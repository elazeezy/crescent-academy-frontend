// app/api/test-db/route.ts
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb'; // adjust path if your lib folder is named differently

export async function GET() 
  try {
    await dbConnect();
    return NextResponse.json({ status: 'success', message: 'MongoDB connected OK!' });
  } catch (error) {
    console.error('DB connection error:', error);
    return NextResponse.json(
      { status: 'error', message: 'Failed to connect to MongoDB' },
      { status: 500 }
    );
  }
