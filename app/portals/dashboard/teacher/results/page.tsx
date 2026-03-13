// app/portals/dashboard/teacher/results/page.tsx
import Link from 'next/link';
import Student from '@/models/Student';
import dbConnect from '@/lib/dbConnect';

export default async function ResultsHub() {
  await dbConnect();
  const students = await Student.find({}).lean();

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Class Results Management</h1>
      <div className="space-y-4">
        {students.map((student: any) => (
          <div key={student._id} className="flex items-center justify-between p-4 bg-slate-800 rounded-lg">
            <span>{student.firstName} {student.lastName}</span>
            <div className="space-x-2">
              <Link href={`/portals/dashboard/teacher/results/${student._id}`} className="bg-blue-600 px-4 py-2 rounded">
                Input Scores
              </Link>
              <Link href={`/portals/dashboard/teacher/results/${student._id}/view`} className="bg-teal-600 px-4 py-2 rounded">
                View Report
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}