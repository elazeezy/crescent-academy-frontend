import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect"; 
import User from "@/models/User";
import Student from "@/models/Student";
import bcrypt from "bcryptjs";
import { auth } from "@/auth";


export async function POST(req: Request) {
  const session = await auth();
  if (session?.user?.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await dbConnect();
    const { students } = await req.json();

    const results = await Promise.all(students.map(async (data: any) => {
      const existingUser = await User.findOne({ email: data.email });
      if (existingUser) return null; 

      const studentId = `STU-2026-${Math.floor(1000 + Math.random() * 9000)}`;
      
      // FIX: Remove manual hashing. 
      // The Mongoose pre('save') hook in models/User.ts will handle this.
      const plainPassword = "Crescent123"; 

      // Create User
      const newUser = await User.create({
        email: data.email || `${studentId.toLowerCase()}@crescent.edu.ng`,
        password: plainPassword, // Send plain text here
        role: "student",
        name: `${data.firstName} ${data.lastName}`
      });

      // Create Student Linked to User
      return await Student.create({
        user: newUser._id,
        studentId: studentId,
        firstName: data.firstName,
        lastName: data.lastName,
        gender: (data.gender || 'male').toLowerCase(),
        currentClass: data.class,
        parentPhone: data.parentPhone || "0000000000",
      });
    }));

    const finalCount = results.filter(r => r !== null).length;
    return NextResponse.json({ success: true, count: finalCount });
  } catch (error) {
    console.error("Bulk Import Error:", error);
    return NextResponse.json({ error: "Failed to process student list" }, { status: 500 });
  }
}