import { auth } from "@/auth";
import dbConnect from "@/lib/dbConnect";
import Student from "@/models/Student";
import Result from "@/models/Result";
import Teacher from "@/models/Teacher";
import { redirect } from "next/navigation";
import { getSubjectsForClass } from "@/lib/subjects";
import ResultEntryForm from "@/components/teacher/ResultEntryForm";

export default async function ResultEntryPage({
  params,
}: {
  params: Promise<{ studentId: string }>;
}) {
  const { studentId } = await params;
  const session = await auth();
  if (!session?.user || session.user.role !== "teacher") redirect("/login");

  await dbConnect();

  const student = await Student.findById(studentId).lean() as any;
  if (!student) {
    return (
      <div className="p-10 text-center text-slate-400">
        Student not found. The ID may be invalid.
      </div>
    );
  }

  // Load existing result for pre-populating the form
  const existingResult = await Result.findOne({
    student: studentId,
  })
    .sort({ createdAt: -1 })
    .lean() as any;

  // Determine subjects list
  const teacher = await Teacher.findOne({ user: session.user.id }).lean() as any;
  const subjects = getSubjectsForClass(
    student.currentClass,
    teacher?.subjects
  );

  const safeStudent = JSON.parse(JSON.stringify(student));
  const safeResult  = existingResult ? JSON.parse(JSON.stringify(existingResult)) : null;

  return (
    <ResultEntryForm
      studentId={studentId}
      student={safeStudent}
      existingResult={safeResult}
      subjects={subjects}
    />
  );
}
