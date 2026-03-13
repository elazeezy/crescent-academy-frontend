import { NextResponse } from 'next/server';
import { auth } from "@/auth";
import dbConnect from "@/lib/dbConnect";
import Result from "@/models/Result";
import { calculateGrade } from "@/lib/grading";

export async function POST(req: Request) {
  try {
    const session = await auth();
    // 1. Security: Only teachers can save results
    if (!session || session.user.role !== "teacher") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { studentId, term, session: termSession, subjects, teacherComment } = body;

    await dbConnect();

    // 2. Logic: Process subjects to include totals and grades
const processedSubjects = subjects.map((sub: any) => {
  // Summing the four distinct fields
  const total = Number(sub.test1) + Number(sub.test2) + Number(sub.test3) + Number(sub.examScore);
  return {
    subjectName: sub.subjectName,
    test1: sub.test1,
    test2: sub.test2,
    test3: sub.test3,
    examScore: sub.examScore,
    total: total,
    grade: calculateGrade(total)
  };
});

    // 3. Calculation: Calculate GPA (Simple average of subject totals / 100)
    const totalScore = processedSubjects.reduce((acc: number, curr: any) => acc + curr.total, 0);
    const gpa = totalScore / processedSubjects.length;

    // 4. Persistence: Update existing or create new result
    const newResult = await Result.findOneAndUpdate(
      { student: studentId, term: term, session: termSession },
      {
        student: studentId,
        term,
        session: termSession,
        subjects: processedSubjects,
        teacherComment,
        gpa
      },
      { upsert: true, new: true } // Creates new if doesn't exist, updates if it does
    );

    return NextResponse.json({ message: "Result saved successfully", data: newResult });
  } catch (error) {
    console.error("Save Result Error:", error);
    return NextResponse.json({ error: "Failed to save result" }, { status: 500 });
  }
}