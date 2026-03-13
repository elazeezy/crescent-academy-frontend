import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import Teacher from "@/models/Teacher";
import { auth } from "@/auth";

export async function POST(req: Request) {
  // 1. Security Check: Only Admins can upload staff
  const session = await auth();
  console.log("DEBUG: Current session user:", session?.user);
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await dbConnect();
    const { staffList } = await req.json();

    if (!staffList || !Array.isArray(staffList)) {
      return NextResponse.json({ error: "Invalid staff list format" }, { status: 400 });
    }

    const results = await Promise.all(
      staffList.map(async (data: any) => {
        // Normalize email
        const email = data.email.trim().toLowerCase();

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) return { status: "skipped", email, reason: "Duplicate" };

        // 2. Create the User (Login Credentials)
        // Note: The 'pre-save' hook in your User model will automatically hash this password
        const newUser = await User.create({
          name: data.name,
          email: email,
          password: "Crescent123", // Default password for new staff
          role: "teacher",
        });

        // 3. Create the Teacher Profile (Professional Details)
        // This links the user ID to the specific class they manage
        await Teacher.create({
          user: newUser._id,
          assignedClass: data.assignedClass, // e.g., "JSS 3 Gold"
          subjects: data.subjects ? data.subjects.split(',').map((s: string) => s.trim()) : [],
        });

        return { status: "success", email };
      })
    );

    const successCount = results.filter((r) => r.status === "success").length;
    const skipCount = results.filter((r) => r.status === "skipped").length;

    return NextResponse.json({
      success: true,
      message: `Processed ${staffList.length} staff members.`,
      added: successCount,
      skipped: skipCount,
    });

  } catch (error) {
    console.error("Staff Bulk Import Error:", error);
    return NextResponse.json(
      { error: "Failed to process staff list. Check server logs." },
      { status: 500 }
    );
  }
}