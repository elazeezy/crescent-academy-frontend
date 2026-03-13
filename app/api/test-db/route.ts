import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb'; // Ensure this points to your clientPromise

export async function GET() {
  try {
    // 1. Call the function (wait for it to resolve)
    const client = await dbConnect(); 
    
    // 2. Now access the database from the client
    const db = client.db(); 
    
    return NextResponse.json({ status: 'success', message: 'MongoDB connected OK!' });
  } catch (error) {
    console.error('DB connection error:', error);
    return NextResponse.json(
      { status: 'error', message: 'Failed to connect to MongoDB' },
      { status: 500 }
    );
  }
}