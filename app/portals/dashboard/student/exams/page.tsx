'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { MonitorCheck, Clock, Loader2, PlayCircle, CheckCircle2 } from 'lucide-react';

interface ExamListItem {
  _id: string;
  title: string;
  subject: string;
  durationMinutes: number;
  objectiveCount: number;
  attemptStatus: 'in_progress' | 'submitted' | 'auto_submitted' | null;
}

export default function StudentExamsPage() {
  const [exams, setExams] = useState<ExamListItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchExams = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/student/exams');
      const data = await res.json();
      setExams(data.exams ?? []);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchExams(); }, [fetchExams]);

  return (
    <div className="space-y-8 pb-16">
      <div>
        <h1 className="text-2xl font-black text-white">CBT Exams</h1>
        <p className="text-slate-400 text-sm mt-1">Exams currently open for your class.</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-24 text-slate-500 gap-2"><Loader2 size={20} className="animate-spin" /> Loading…</div>
      ) : exams.length === 0 ? (
        <div className="py-24 text-center rounded-[2rem] border border-dashed border-white/10 bg-white/[0.02]">
          <MonitorCheck size={40} className="text-slate-600 mx-auto mb-4" />
          <p className="text-slate-400 font-semibold text-lg">No exams open right now</p>
          <p className="text-slate-600 text-sm mt-1">Check back when your teacher opens one.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {exams.map((exam) => {
            const submitted = exam.attemptStatus === 'submitted' || exam.attemptStatus === 'auto_submitted';
            return (
              <div key={exam._id} className="bg-white/[0.03] border border-white/[0.07] rounded-[1.75rem] p-6">
                <h3 className="font-bold text-white">{exam.title}</h3>
                <p className="text-sky-400/70 text-xs font-mono mt-0.5">{exam.subject}</p>
                <div className="mt-4 flex items-center gap-4 text-xs text-slate-500 font-semibold">
                  <span className="flex items-center gap-1.5"><Clock size={12} />{exam.durationMinutes} min</span>
                  <span>{exam.objectiveCount} questions</span>
                </div>
                <div className="mt-5">
                  {submitted ? (
                    <span className="flex items-center gap-2 text-emerald-400 text-sm font-bold">
                      <CheckCircle2 size={16} /> Submitted
                    </span>
                  ) : (
                    <Link
                      href={`/portals/dashboard/student/exams/${exam._id}`}
                      className="flex items-center justify-center gap-2 bg-sky-600 hover:bg-sky-500 text-white py-2.5 rounded-xl text-sm font-bold transition-all active:scale-95 w-full"
                    >
                      <PlayCircle size={16} /> {exam.attemptStatus === 'in_progress' ? 'Continue Exam' : 'Start Exam'}
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
