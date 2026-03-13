// app/portals/dashboard/teacher/results/[studentId]/view/page.tsx
import dbConnect from "@/lib/dbConnect";
import Result from "@/models/Result";
import ReportCardDisplay from "@/components/ReportCardDisplay";

export default async function ViewReportCard({ params }: { params: Promise<{ studentId: string }> }) {
  const { studentId } = await params;
  await dbConnect();

  // Fetch the result for the student
  const data = await Result.findOne({ student: studentId }).lean();

  if (!data) return <div className="p-10 text-center">No results found for this student.</div>;

  return (
    <div className="p-8">
      <ReportCardDisplay result={data} />
    </div>
  );
}