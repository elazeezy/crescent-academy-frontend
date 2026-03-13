// app/portals/dashboard/student/results/page.tsx
import { auth } from "@/auth"; 
import Result from "@/models/Result";
import Student from "@/models/Student";
import ReportCardDisplay from "@/components/ReportCardDisplay";
import dbConnect from "@/lib/dbConnect";
import { redirect } from "next/navigation";

export default async function StudentResultView() {
  await dbConnect();
  const session = await auth();

  if (!session || !session.user) {
    console.log("DEBUG: No session found");
    redirect("/login");
  }

  // --- LOGGING START ---
  console.log("DEBUG: Logged-in User ID:", session.user.id);
  
  const studentProfile = await Student.findOne({ user: session.user.id }).lean();
  console.log("DEBUG: Found Student Profile:", studentProfile);

  if (!studentProfile) {
    console.log("DEBUG: Failed to find Student profile for user ID:", session.user.id);
    return <div className="p-10 text-white">Student profile not linked.</div>;
  }

  const resultData = await Result.findOne({ student: studentProfile._id }).lean();
  console.log("DEBUG: Found Result Data:", resultData);
  // --- LOGGING END ---

  if (!resultData) {
    return <div className="p-10 text-white">No result found.</div>;
  }

  const result = JSON.parse(JSON.stringify(resultData));
  return <ReportCardDisplay result={result} />;
}