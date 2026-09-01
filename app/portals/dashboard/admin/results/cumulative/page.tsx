'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import * as XLSX from 'xlsx';
import {
  ArrowLeft, Loader2, AlertCircle, Sheet, Download, Trophy,
} from 'lucide-react';

const SECTIONS: { value: 'college' | 'science'; label: string }[] = [
  { value: 'college', label: 'Crescent College' },
  { value: 'science', label: 'Crescent School of Science' },
];

const CLASS_NAMES: Record<'college' | 'science', string[]> = {
  college: ['J.S.S. 1', 'J.S.S. 2', 'J.S.S. 3', 'S.S. 1', 'S.S. 2', 'S.S. 3'],
  science: ['J.S.S. 1', 'J.S.S. 2', 'J.S.S. 3', 'S.S.S. 1'],
};

const TERMS = ['1st Term', '2nd Term', '3rd Term'];

interface StudentRow {
  studentId: string;
  admissionNo: string;
  name: string;
  termsCovered: string[];
  termGpas: Record<string, number | null>;
  perSubject: Record<string, number | null>;
  cumulativePercentage: number | null;
  cumulativeGrade: string | null;
  position: number | null;
}

interface CumulativeData {
  session: string;
  section: string;
  class: string;
  subjects: string[];
  students: StudentRow[];
}

const fmt = (v: number | null) => (v === null ? '—' : v.toFixed(1));

export default function CumulativeResultsPage() {
  const [academicSession, setAcademicSession] = useState('2025/2026');
  const [section, setSection] = useState<'college' | 'science'>('college');
  const [targetClass, setTargetClass] = useState(CLASS_NAMES.college[0]);
  const [data, setData] = useState<CumulativeData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const generate = async () => {
    setLoading(true);
    setError('');
    setData(null);
    try {
      const params = new URLSearchParams({ session: academicSession, section, class: targetClass });
      const res = await fetch(`/api/admin/results/cumulative?${params}`);
      const json = await res.json();
      if (!res.ok) { setError(json.error ?? 'Failed to generate cumulative result'); return; }
      setData(json);
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const headerRow = useMemo(() => {
    if (!data) return [];
    return ['Pos', 'Student', 'Admission No', ...data.subjects, '1st Term %', '2nd Term %', '3rd Term %', 'Cumulative %', 'Grade'];
  }, [data]);

  const downloadExcel = () => {
    if (!data) return;
    const rows = data.students.map((s) => [
      s.position ?? '—',
      s.name,
      s.admissionNo,
      ...data.subjects.map((subj) => (s.perSubject[subj] !== null ? Number(s.perSubject[subj]!.toFixed(1)) : '—')),
      s.termGpas['1st Term'] !== null ? Number(s.termGpas['1st Term']!.toFixed(1)) : '—',
      s.termGpas['2nd Term'] !== null ? Number(s.termGpas['2nd Term']!.toFixed(1)) : '—',
      s.termGpas['3rd Term'] !== null ? Number(s.termGpas['3rd Term']!.toFixed(1)) : '—',
      s.cumulativePercentage !== null ? Number(s.cumulativePercentage.toFixed(1)) : '—',
      s.cumulativeGrade ?? '—',
    ]);
    const ws = XLSX.utils.aoa_to_sheet([headerRow, ...rows]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Cumulative Result');
    const safeClass = data.class.replace(/[^\w]+/g, '_');
    const safeSession = data.session.replace(/[^\w]+/g, '_');
    XLSX.writeFile(wb, `Cumulative_Result_${safeClass}_${safeSession}.xlsx`);
  };

  return (
    <div className="max-w-7xl space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/portals/dashboard/admin/results" className="text-slate-400 hover:text-slate-600 transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
            <Sheet size={20} className="text-purple-600" /> Cumulative Result
          </h1>
          <p className="text-slate-500 text-sm">1st, 2nd and 3rd term results averaged together per student, with cumulative grade and class position.</p>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-wrap items-end gap-4">
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

        <button
          onClick={generate}
          disabled={loading || !academicSession.trim()}
          className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold disabled:opacity-40 transition-all"
        >
          {loading ? <Loader2 size={15} className="animate-spin" /> : <Sheet size={15} />} Generate
        </button>

        {data && (
          <button
            onClick={downloadExcel}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all"
          >
            <Download size={15} /> Download Excel
          </button>
        )}
      </div>

      {error && (
        <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 rounded-xl px-4 py-3 text-sm font-semibold">
          <AlertCircle size={16} /> {error}
        </div>
      )}

      {data && data.students.length === 0 && (
        <div className="py-20 text-center rounded-2xl border border-dashed border-slate-200 bg-slate-50">
          <p className="text-slate-500 font-semibold">No students found for {data.class} ({data.section === 'science' ? 'Science' : 'College'}).</p>
        </div>
      )}

      {data && data.students.length > 0 && data.students.every((s) => s.cumulativePercentage === null) && (
        <div className="py-20 text-center rounded-2xl border border-dashed border-slate-200 bg-slate-50">
          <p className="text-slate-500 font-semibold">No results have been submitted yet for {data.class} — {data.session}.</p>
        </div>
      )}

      {data && data.students.some((s) => s.cumulativePercentage !== null) && (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between flex-wrap gap-2">
            <p className="text-sm font-bold text-slate-800">{data.class} — {data.session}</p>
            {data.students.some((s) => s.termsCovered.length < 3 && s.cumulativePercentage !== null) && (
              <p className="text-[11px] text-amber-600 font-semibold flex items-center gap-1.5">
                <AlertCircle size={12} /> Some students are missing a term — their cumulative average uses only the terms available.
              </p>
            )}
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs whitespace-nowrap">
              <thead>
                <tr className="bg-slate-50 text-slate-500 border-b border-slate-200">
                  {headerRow.map((h) => (
                    <th key={h} className="px-3 py-2.5 text-left font-bold uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.students.map((s) => (
                  <tr key={s.studentId} className="border-b border-slate-100 hover:bg-slate-50/60">
                    <td className="px-3 py-2 font-black text-slate-700">
                      {s.position === null ? '—' : (
                        <span className={`inline-flex items-center gap-1 ${s.position === 1 ? 'text-amber-500' : ''}`}>
                          {s.position === 1 && <Trophy size={12} />} {s.position}
                        </span>
                      )}
                    </td>
                    <td className="px-3 py-2 font-semibold text-slate-800">{s.name}</td>
                    <td className="px-3 py-2 font-mono text-slate-500">{s.admissionNo}</td>
                    {data.subjects.map((subj) => (
                      <td key={subj} className="px-3 py-2 text-slate-600">{fmt(s.perSubject[subj])}</td>
                    ))}
                    {TERMS.map((t) => (
                      <td key={t} className="px-3 py-2 text-slate-600">{fmt(s.termGpas[t])}</td>
                    ))}
                    <td className="px-3 py-2 font-black text-slate-900">{fmt(s.cumulativePercentage)}</td>
                    <td className="px-3 py-2">
                      {s.cumulativeGrade && (
                        <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                          s.cumulativeGrade === 'A1' ? 'bg-emerald-100 text-emerald-700'
                          : s.cumulativeGrade.startsWith('F') ? 'bg-red-100 text-red-700'
                          : 'bg-blue-100 text-blue-700'
                        }`}>
                          {s.cumulativeGrade}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
