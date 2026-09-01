'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft, Loader2, AlertCircle, Sheet,
} from 'lucide-react';
import BroadsheetView from '@/components/results/BroadsheetView';
import type { BroadsheetData, BroadsheetTerm } from '@/lib/broadsheet';

const SECTIONS: { value: 'college' | 'science'; label: string }[] = [
  { value: 'college', label: 'Crescent College' },
  { value: 'science', label: 'Crescent School of Science' },
];

const CLASS_NAMES: Record<'college' | 'science', string[]> = {
  college: ['J.S.S. 1', 'J.S.S. 2', 'J.S.S. 3', 'S.S. 1', 'S.S. 2', 'S.S. 3'],
  science: ['J.S.S. 1', 'J.S.S. 2', 'J.S.S. 3', 'S.S.S. 1'],
};

const TERM_OPTIONS: { value: BroadsheetTerm; label: string }[] = [
  { value: '1st Term', label: '1st Term' },
  { value: '2nd Term', label: '2nd Term' },
  { value: '3rd Term', label: '3rd Term' },
  { value: 'cumulative', label: 'Cumulative (Full Session)' },
];

export default function AdminBroadsheetPage() {
  const [academicSession, setAcademicSession] = useState('2025/2026');
  const [section, setSection] = useState<'college' | 'science'>('college');
  const [targetClass, setTargetClass] = useState(CLASS_NAMES.college[0]);
  const [term, setTerm] = useState<BroadsheetTerm>('3rd Term');
  const [data, setData] = useState<(BroadsheetData & { schoolLogo?: string | null }) | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const generate = async () => {
    setLoading(true);
    setError('');
    setData(null);
    try {
      const params = new URLSearchParams({ session: academicSession, section, class: targetClass, term });
      const res = await fetch(`/api/admin/results/broadsheet?${params}`);
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
    <div className="max-w-7xl space-y-6">
      <div className="no-print flex items-center gap-3">
        <Link href="/portals/dashboard/admin/results" className="text-slate-400 hover:text-slate-600 transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
            <Sheet size={20} className="text-purple-600" /> Broadsheet
          </h1>
          <p className="text-slate-500 text-sm">Generate a term or cumulative broadsheet for any class — viewable, printable, and downloadable as Excel.</p>
        </div>
      </div>

      {/* Controls */}
      <div className="no-print bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-wrap items-end gap-4">
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Session</label>
          <input
            value={academicSession}
            onChange={(e) => setAcademicSession(e.target.value)}
            className="w-36 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400/30 focus:border-purple-400"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Section</label>
          <div className="flex gap-2">
            {SECTIONS.map((s) => (
              <button
                key={s.value}
                onClick={() => { setSection(s.value); setTargetClass(CLASS_NAMES[s.value][0]); }}
                className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all ${
                  section === s.value ? 'bg-slate-900 border-slate-900 text-white' : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Class</label>
          <select
            value={targetClass}
            onChange={(e) => setTargetClass(e.target.value)}
            className="border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400/30 focus:border-purple-400"
          >
            {CLASS_NAMES[section].map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Term</label>
          <select
            value={term}
            onChange={(e) => setTerm(e.target.value as BroadsheetTerm)}
            className="border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400/30 focus:border-purple-400"
          >
            {TERM_OPTIONS.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
          </select>
        </div>

        <button
          onClick={generate}
          disabled={loading || !academicSession.trim()}
          className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold disabled:opacity-40 transition-all"
        >
          {loading ? <Loader2 size={15} className="animate-spin" /> : <Sheet size={15} />} Generate
        </button>
      </div>

      {error && (
        <div className="no-print flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 rounded-xl px-4 py-3 text-sm font-semibold">
          <AlertCircle size={16} /> {error}
        </div>
      )}

      {data && data.students.length > 0 && data.students.every((s) => s.averageScore === null) && (
        <div className="no-print py-20 text-center rounded-2xl border border-dashed border-slate-200 bg-slate-50">
          <p className="text-slate-500 font-semibold">
            No {term === 'cumulative' ? 'results across any term' : `${term} results`} have been saved yet for {data.class} — {data.session}.
          </p>
        </div>
      )}

      {data && <BroadsheetView data={data} />}
    </div>
  );
}
