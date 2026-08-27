'use client';

import { useState, useEffect, useCallback, use } from 'react';
import Link from 'next/link';
import { ChevronLeft, Loader2, ChevronDown, ChevronUp, Circle, Trophy, Users } from 'lucide-react';

interface Question { text: string; options: string[]; correctIndex: number; }
interface Attempt {
  _id: string;
  student: { _id: string; firstName: string; lastName: string; studentId: string; currentClass: string };
  answers: (number | null)[];
  status: string;
  correctCount?: number;
  objectiveScore?: number;
}
interface NotStarted { _id: string; firstName: string; lastName: string; studentId: string; }

export default function AdminExamResultsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [examMeta, setExamMeta] = useState<{ title: string; subject: string; questions: Question[]; objectiveCount: number } | null>(null);
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [notStarted, setNotStarted] = useState<NotStarted[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/exams/${id}/results`);
      const data = await res.json();
      if (res.ok) {
        setExamMeta(data.exam);
        setAttempts(data.attempts ?? []);
        setNotStarted(data.notStarted ?? []);
      }
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { fetchData(); }, [fetchData]);

  if (loading) {
    return <div className="flex items-center justify-center py-24 text-slate-500 gap-2"><Loader2 size={20} className="animate-spin" /> Loading…</div>;
  }
  if (!examMeta) {
    return <div className="p-10 text-center text-slate-400">Exam not found.</div>;
  }

  const submittedAttempts = attempts.filter((a) => a.status === 'submitted' || a.status === 'auto_submitted');

  return (
    <div className="max-w-4xl space-y-6 pb-16">
      <Link href="/portals/dashboard/admin/exams" className="flex items-center gap-2 text-slate-400 hover:text-slate-600 text-sm font-medium w-fit transition-colors">
        <ChevronLeft size={16} /> Back to CBT Exams
      </Link>

      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
          <Trophy size={20} className="text-indigo-500" /> {examMeta.title}
        </h1>
        <p className="text-slate-500 text-sm mt-1">{examMeta.subject} — auto-graded objective scores, read-only. Nothing here is written to any student&apos;s report card.</p>
      </div>

      {submittedAttempts.length === 0 ? (
        <div className="py-16 text-center rounded-2xl border border-dashed border-slate-200 bg-slate-50">
          <p className="text-slate-400 font-semibold">No submissions yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {submittedAttempts.map((a) => {
            const isOpen = expanded === a._id;
            return (
              <div key={a._id} className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                <button onClick={() => setExpanded(isOpen ? null : a._id)} className="w-full flex items-center justify-between gap-4 p-4 text-left hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-xs font-black text-indigo-600 shrink-0">
                      {a.student.firstName[0]}{a.student.lastName[0]}
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-slate-900 text-sm truncate">{a.student.firstName} {a.student.lastName}</p>
                      <p className="text-slate-400 text-xs font-mono">{a.student.studentId}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-xs font-bold text-slate-600">{a.correctCount}/{examMeta.objectiveCount} correct</span>
                    <span className="text-xs font-black text-indigo-600 bg-indigo-50 border border-indigo-100 px-2.5 py-1 rounded-full">{a.objectiveScore}/30</span>
                    {isOpen ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />}
                  </div>
                </button>

                {isOpen && (
                  <div className="border-t border-slate-100 p-4">
                    <div className="max-h-72 overflow-y-auto space-y-2.5 pr-1">
                      {examMeta.questions.map((q, qi) => {
                        const studentAnswer = a.answers[qi];
                        const correct = studentAnswer === q.correctIndex;
                        return (
                          <div key={qi} className="text-xs bg-slate-50 rounded-lg p-3">
                            <p className="font-semibold text-slate-700 mb-1.5">{qi + 1}. {q.text}</p>
                            <div className="flex flex-wrap gap-x-4 gap-y-1">
                              {q.options.map((opt, oi) => (
                                <span key={oi} className={
                                  oi === q.correctIndex ? 'text-emerald-600 font-bold' :
                                  oi === studentAnswer ? 'text-red-500 font-bold line-through' : 'text-slate-400'
                                }>
                                  {String.fromCharCode(65 + oi)}. {opt}
                                </span>
                              ))}
                            </div>
                            <p className={`mt-1 flex items-center gap-1 ${correct ? 'text-emerald-600' : studentAnswer == null ? 'text-slate-400' : 'text-red-500'}`}>
                              <Circle size={8} className="fill-current" />
                              {studentAnswer == null ? 'Not answered' : correct ? 'Correct' : 'Incorrect'}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {notStarted.length > 0 && (
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Users size={14} className="text-slate-400" />
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Not Yet Attempted ({notStarted.length})</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {notStarted.map((s) => (
              <span key={s._id} className="text-xs bg-white border border-slate-200 text-slate-500 px-2.5 py-1 rounded-lg">{s.firstName} {s.lastName}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
