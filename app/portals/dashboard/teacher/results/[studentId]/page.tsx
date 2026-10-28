import { auth } from "@/auth";
import dbConnect from "@/lib/dbConnect";
import Student from "@/models/Student";
import Result from "@/models/Result";
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

  // Any teacher can edit any student in any class, so no class-ownership gate here.

  // Load existing result for pre-populating the form
  const existingResult = await Result.findOne({
    student: studentId,
  })
    .sort({ createdAt: -1 })
    .lean() as any;

  // Full subject list for the student's class/level (not the editing teacher's own
  // subjects) so any teacher can edit any subject.
  const subjects = getSubjectsForClass(student.currentClass);

  const safeStudent = JSON.parse(JSON.stringify(student));
  const safeResult  = existingResult ? JSON.parse(JSON.stringify(existingResult)) : null;

  return (
    <ResultEntryForm
      studentId={studentId}
      student={safeStudent}
      existingResult={safeResult}
      subjects={subjects}
      resultId={safeResult?._id?.toString()}
    />
  );
}
