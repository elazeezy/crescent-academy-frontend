'use client';

export default function ReportCardDisplay({ result }: { result: any }) {
  return (
    <>
      <style jsx global>{`
        @media print {
          body * { visibility: hidden; } /* Hide everything */
          .print-area, .print-area * { visibility: visible; } /* Show only this */
          .print-area { position: absolute; left: 0; top: 0; width: 100%; }
          .no-print { display: none !important; }
        }
      `}</style>

      <div className="print-area p-4">
        {/* Print Button - excluded from print */}
        <button 
          onClick={() => window.print()}
          className="no-print mb-6 bg-teal-700 text-white px-6 py-2 rounded hover:bg-teal-800"
        >
          Print Report Card
        </button>

        {/* The Card */}
        <div className="bg-white text-black p-8 border border-gray-300 shadow-lg max-w-4xl mx-auto">
          {/* Header to match PDF */}
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold uppercase">Crescent School of Science, Iwo</h1>
            <p className="text-sm">Address: Iwo Osun State | Email: Crescentschoolofscience@gmail.com</p>
            <h2 className="text-xl font-bold mt-4 underline">ACADEMIC REPORT CARD</h2>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6 border-b pb-4 text-sm">
            <p><strong>Student Name:</strong> {result.studentName}</p>
            <p><strong>Class:</strong> {result.studentClass}</p>
            <p><strong>Term:</strong> {result.term}</p>
            <p><strong>Session:</strong> {result.session}</p>
          </div>

          {/* Table */}
          <table className="w-full border-collapse mb-6 text-sm">
            <thead>
              <tr className="bg-teal-700 text-white">
                <th className="border p-2">Subject</th>
                <th className="border p-2">T1</th>
                <th className="border p-2">T2</th>
                <th className="border p-2">T3</th>
                <th className="border p-2">Exam</th>
                <th className="border p-2">Total</th>
                <th className="border p-2">Grade</th>
              </tr>
            </thead>
            <tbody>
              {result.subjects?.map((sub: any, idx: number) => (
                <tr key={idx} className="text-center border-b">
                  <td className="border p-2 text-left">{sub.subjectName}</td>
                  <td className="border p-2">{sub.test1}</td>
                  <td className="border p-2">{sub.test2}</td>
                  <td className="border p-2">{sub.test3}</td>
                  <td className="border p-2">{sub.examScore}</td>
                  <td className="border p-2 font-bold">{sub.total}</td>
                  <td className="border p-2">{sub.grade}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Footer */}
          <div className="grid grid-cols-2 gap-8 text-sm">
            <p><strong>Teacher Comment:</strong> {result.teacherComment}</p>
            <p><strong>Principal Comment:</strong> {result.principalComment || "Excellent performance"}</p>
            <p className="font-bold">GPA: {result.gpa?.toFixed(2)}</p>
          </div>
        </div>
      </div>
    </>
  );
}