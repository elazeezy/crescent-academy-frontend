'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import {
  ChevronLeft, Loader2, AlertCircle, Sheet,
} from 'lucide-react';
import BroadsheetView from '@/components/results/BroadsheetView';
import type { BroadsheetData, BroadsheetTerm } from '@/lib/broadsheet';
import { SECTIONS, getClassNamesForSection, type Section } from '@/lib/subjects';

const TERM_OPTIONS: { value: BroadsheetTerm; label: string }[] = [
  { value: '1st Term', label: '1st Term' },
  { value: '2nd Term', label: '2nd Term' },
  { value: '3rd Term', label: '3rd Term' },
  { value: 'cumulative', label: 'Cumulative (Full Session)' },
];

export default function TeacherBroadsheetPage() {
  const { data: authSession } = useSession();
  const sp = useSearchParams();
  const assignedClass = authSession?.user?.assignedClass;
  const assignedSection: Section = authSession?.user?.section === 'science' ? 'science' : 'college';

  const initialSection: Section = sp.get('section') === 'science' ? 'science' : sp.get('section') === 'college' ? 'college' : assignedSection;
  const initialClass = sp.get('class') ? decodeURIComponent(sp.get('class') as string) : (assignedClass || '');

  const [section, setSection] = useState<Section>(initialSection);
  const [targetClass, setTargetClass] = useState(initialClass);
  const [academicSession, setAcademicSession] = useState('2025/2026');
  const [term, setTerm] = useState<BroadsheetTerm>('3rd Term');
  const [data, setData] = useState<(BroadsheetData & { schoolLogo?: string | null }) | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const classOptions = getClassNamesForSection(section);

  const generate = async () => {
    if (!targetClass) { setError('Pick a class to generate a broadsheet.'); return; }
    setLoading(true);
    setError('');
    setData(null);
    try {
      const params = new URLSearchParams({ session: academicSession, term, section, class: targetClass });
      const res = await fetch(`/api/teacher/results/broadsheet?${params}`);
      const json = await res.json();
      if (!res.ok) { setError(json.error ?? 'Failed to generate broadsheet'); return; }
      setData(json);
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl space-y-6 pb-16">
      <div className="no-print">
        <Link href="/portals/dashboard/teacher/results" className="flex items-center gap-2 text-slate-500 hover:text-white text-sm font-medium mb-4 transition-colors w-fit">
          <ChevronLeft size={16} /> Back to Results
        </Link>
        <h1 className="text-2xl font-black text-white flex items-center gap-2">
          <Sheet size={20} className="text-emerald-400" /> Broadsheet
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Pick any class and a term (or the full session) to generate its broadsheet.
        </p>
      </div>

      {(
        <>
          {/* Controls */}
          <div className="no-print bg-white/[0.03] border border-white/[0.07] rounded-2xl p-5 flex flex-wrap items-end gap-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Section</label>
              <select
                value={section}
                onChange={(e) => {
                  const next = e.target.value as Section;
                  setSection(next);
                  const opts = getClassNamesForSection(next);
                  setTargetClass((c) => (opts.includes(c) ? c : (opts[0] ?? '')));
                }}
                className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-400/30 focus:border-emerald-400"
              >
                {SECTIONS.map((s) => <option key={s.value} value={s.value} className="bg-slate-900">{s.label}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Class</label>
              <select
                value={targetClass}
                onChange={(e) => setTargetClass(e.target.value)}
                className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-400/30 focus:border-emerald-400"
              >
                {!classOptions.includes(targetClass) && targetClass && <option value={targetClass} className="bg-slate-900">{targetClass}</option>}
                {classOptions.map((c) => <option key={c} value={c} className="bg-slate-900">{c}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Session</label>
              <input
                value={academicSession}
                onChange={(e) => setAcademicSession(e.target.value)}
                className="w-36 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-400/30 focus:border-emerald-400"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Term</label>
              <select
                value={term}
                onChange={(e) => setTerm(e.target.value as BroadsheetTerm)}
                className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-400/30 focus:border-emerald-400"
              >
                {TERM_OPTIONS.map((t) => <option key={t.value} value={t.value} className="bg-slate-900">{t.label}</option>)}
              </select>
            </div>

            <button
              onClick={generate}
              disabled={loading || !academicSession.trim()}
              className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2.5 rounded-xl text-sm font-bold disabled:opacity-40 transition-all"
            >
              {loading ? <Loader2 size={15} className="animate-spin" /> : <Sheet size={15} />} Generate
            </button>
          </div>

          {error && (
            <div className="no-print flex items-center gap-2 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl px-4 py-3 text-sm font-semibold">
              <AlertCircle size={16} /> {error}
            </div>
          )}

          {data && data.students.length > 0 && data.students.every((s) => s.averageScore === null) && (
            <div className="no-print py-20 text-center rounded-2xl border border-dashed border-white/10 bg-white/[0.02]">
              <p className="text-slate-400 font-semibold">
                No {term === 'cumulative' ? 'results across any term' : `${term} results`} have been saved yet for {data.class} — {data.session}.
              </p>
            </div>
          )}

          {data && <BroadsheetView data={data} />}
        </>
      )}
    </div>
  );
}
