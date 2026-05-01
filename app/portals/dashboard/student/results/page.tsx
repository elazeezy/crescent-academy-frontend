'use client';

import { useEffect, useState } from 'react';
import { ChevronDown, Printer, BookOpen, Clock } from 'lucide-react';
import ReportCardDisplay from '@/components/ReportCardDisplay';

interface TermOption { label: string; term: string; session: string; resultId: string; }

export default function StudentResultView() {
  const [termOptions,  setTermOptions]  = useState<TermOption[]>([]);
  const [selected,     setSelected]     = useState<string>('');   // resultId
  const [result,       setResult]       = useState<any>(null);
  const [student,      setStudent]      = useState<any>(null);
  const [classStats,   setClassStats]   = useState<any>(null);
  const [loading,      setLoading]      = useState(true);
  const [loadingCard,  setLoadingCard]  = useState(false);
  const [error,        setError]        = useState('');

  // Step 1: fetch available published terms for this student
  useEffect(() => {
    fetch('/api/student/results')
      .then(r => r.json())
      .then(data => {
        if (data.error) { setError(data.error); return; }
        setTermOptions(data.termOptions ?? []);
        setStudent(data.student ?? null);
        if (data.termOptions?.length) {
          setSelected(data.termOptions[0].resultId);
        }
      })
      .catch(() => setError('Failed to load results.'))
      .finally(() => setLoading(false));
  }, []);

  // Step 2: fetch full result + class stats whenever selection changes
  useEffect(() => {
    if (!selected) return;
    setLoadingCard(true);
    fetch(`/api/student/results/${selected}`)
      .then(r => r.json())
      .then(data => {
        if (data.error) { setError(data.error); return; }
        setResult(data.result ?? null);
        setClassStats(data.classStats ?? null);
      })
      .catch(() => setError('Failed to load report card.'))
      .finally(() => setLoadingCard(false));
  }, [selected]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-slate-400 font-semibold animate-pulse">Loading your results…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-10 text-center text-white">
        <p className="text-lg font-semibold">{error}</p>
      </div>
    );
  }

  if (!termOptions.length) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 text-center px-6">
        <div className="w-16 h-16 rounded-2xl bg-slate-800 flex items-center justify-center">
          <Clock size={28} className="text-slate-500" />
        </div>
        <p className="text-white text-lg font-bold">No published results yet</p>
        <p className="text-slate-400 text-sm max-w-xs">
          Your teacher has not published any report cards yet. Check back after your term results are reviewed.
        </p>
      </div>
    );
  }

  return (
    <div className="pb-16">
      {/* Term selector bar */}
      <div className="sticky top-0 z-30 bg-slate-900/95 backdrop-blur border-b border-white/5 px-4 md:px-8 py-3 flex flex-col sm:flex-row sm:items-center gap-3 no-print">
        <div className="flex items-center gap-2 text-slate-400 text-sm font-semibold">
          <BookOpen size={16} />
          <span>Report Card</span>
        </div>

        <div className="relative sm:ml-4">
          <select
            value={selected}
            onChange={e => setSelected(e.target.value)}
            className="appearance-none bg-slate-800 border border-white/10 text-white text-sm font-bold rounded-xl pl-4 pr-10 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500/30 cursor-pointer"
          >
            {termOptions.map(opt => (
              <option key={opt.resultId} value={opt.resultId} className="bg-slate-900">
                {opt.term} — {opt.session}
              </option>
            ))}
          </select>
          <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
        </div>

        <div className="sm:ml-auto flex items-center gap-3">
          <span className="text-xs text-slate-500 font-medium">
            {termOptions.length} term{termOptions.length !== 1 ? 's' : ''} available
          </span>
          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-xl font-bold text-sm shadow-lg transition-all active:scale-95"
          >
            <Printer size={15} />
            Print / PDF
          </button>
        </div>
      </div>

      {/* Report card */}
      <div className="p-4 md:p-8">
        {loadingCard ? (
          <div className="py-24 text-center text-slate-400 font-semibold animate-pulse">
            Loading report card…
          </div>
        ) : result ? (
          <ReportCardDisplay
            result={result}
            student={student}
            classStats={classStats}
          />
        ) : (
          <div className="py-24 text-center text-slate-400">
            <p className="font-semibold">Could not load report card.</p>
          </div>
        )}
      </div>
    </div>
  );
}
