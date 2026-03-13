'use client';

import { useState } from 'react';
import { calculateGrade } from '@/lib/grading';
import { use } from 'react'; // Import 'use' to unwrap params

export default function ResultEntry({ params }: { params: Promise<{ studentId: string }> }) {
  // Unwrap params safely
  const { studentId } = use(params);
  
  const subjects = ['Mathematics', 'English', 'Basic Science', 'Yoruba'];
  const [results, setResults] = useState<any>({});

  const handleScoreChange = (subject: string, field: string, value: string) => {
    const numValue = parseFloat(value) || 0;
    const currentSubject = results[subject] || { test1: 0, test2: 0, test3: 0, exam: 0 };
    
    const updatedSubject = { ...currentSubject, [field]: numValue };
    const total = updatedSubject.test1 + updatedSubject.test2 + updatedSubject.test3 + updatedSubject.exam;
    
    setResults({
      ...results,
      [subject]: {
        ...updatedSubject,
        total,
        grade: calculateGrade(total)
      }
    });
  };

  const saveResults = async () => {
    const formattedSubjects = Object.keys(results).map(sub => ({
      subjectName: sub,
      test1: results[sub].test1 || 0,
      test2: results[sub].test2 || 0,
      test3: results[sub].test3 || 0,
      examScore: results[sub].exam || 0, // Ensure this matches your API expectation
      total: results[sub].total,
      grade: results[sub].grade
    }));

    const response = await fetch('/api/teacher/save-result', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        studentId: studentId,
        term: "1st Term",
        session: "2025/2026",
        subjects: formattedSubjects,
        teacherComment: "Excellent performance throughout the term."
      }),
    });

    if (response.ok) {
      alert("Results saved successfully!");
    } else {
      const errorData = await response.json();
      alert(`Error: ${errorData.error || 'Failed to save'}`);
    }
  };

  return (
    <div className="p-8 text-white max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Input Results: {studentId}</h1>
      
      <div className="bg-slate-800 p-6 rounded-xl space-y-4">
        <div className="grid grid-cols-7 gap-2 font-bold border-b border-slate-600 pb-2 text-sm">
          <span className="col-span-2">Subject</span>
          <span>T1</span><span>T2</span><span>T3</span><span>Exam</span>
          <span>Total</span>
        </div>

        {subjects.map((sub) => (
          <div key={sub} className="grid grid-cols-7 gap-2 items-center border-b border-slate-700 pb-2">
            <span className="col-span-2 font-semibold">{sub}</span>
            <input type="number" className="w-16 p-1 bg-slate-900 rounded" onChange={(e) => handleScoreChange(sub, 'test1', e.target.value)} />
            <input type="number" className="w-16 p-1 bg-slate-900 rounded" onChange={(e) => handleScoreChange(sub, 'test2', e.target.value)} />
            <input type="number" className="w-16 p-1 bg-slate-900 rounded" onChange={(e) => handleScoreChange(sub, 'test3', e.target.value)} />
            <input type="number" className="w-16 p-1 bg-slate-900 rounded" onChange={(e) => handleScoreChange(sub, 'exam', e.target.value)} />
            <div className="text-emerald-400 font-bold text-center">
              {results[sub]?.total || 0} ({results[sub]?.grade || '-'})
            </div>
          </div>
        ))}
      </div>
      
      <button 
        onClick={saveResults}
        className="mt-8 bg-sky-600 px-8 py-3 rounded-lg w-full font-bold hover:bg-sky-500 transition-colors"
      >
        Save & Generate Report Card
      </button>
    </div>
  );
}