'use client';

import * as XLSX from 'xlsx';
import { Printer, Download } from 'lucide-react';
import { SCHOOL } from '@/lib/constants';
import type { BroadsheetData } from '@/lib/broadsheet';

interface Props {
  data: BroadsheetData & { schoolLogo?: string | null };
}

function ordinal(n: number) {
  const s = ['th', 'st', 'nd', 'rd'], v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

const fmt = (v: number | null, decimals = 0) => (v === null ? '—' : v.toFixed(decimals));

const TERM_LABEL: Record<string, string> = {
  '1st Term': '1st Term',
  '2nd Term': '2nd Term',
  '3rd Term': '3rd Term',
  cumulative: 'Cumulative — Full Session',
};

export default function BroadsheetView({ data }: Props) {
  const sectionTitle = data.section === 'science' ? 'Crescent School of Science' : 'The Crescent College';
  const logoSrc = data.schoolLogo || '/logo.png';
  const termLabel = TERM_LABEL[data.term] ?? data.term;

  const headerCells = ['S/NO', 'FULL NAME', 'ADM NO.', ...data.subjects.map((s) => s.toUpperCase()),
    'TOTAL SCORE', 'MAX OBTAINABLE SCORE', 'AVERAGE SCORE', 'AVERAGE SCORE (%)', 'CLASS POSITION', 'GRADE', 'REMARK'];

  const downloadExcel = () => {
    const rows = data.students.map((s, i) => [
      i + 1,
      s.name,
      s.admissionNo,
      ...data.subjects.map((subj) => (s.perSubject[subj] !== null ? Number(s.perSubject[subj]!.toFixed(1)) : '—')),
      s.totalScore !== null ? Number(s.totalScore.toFixed(1)) : '—',
      s.maxObtainable,
      s.averageScore !== null ? Number(s.averageScore.toFixed(1)) : '—',
      s.averagePercent !== null ? Number(s.averagePercent.toFixed(2)) : '—',
      s.position !== null ? ordinal(s.position) : '—',
      s.grade ?? '—',
      s.remark ?? '—',
    ]);
    const ws = XLSX.utils.aoa_to_sheet([headerCells, ...rows]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Broadsheet');
    const safeClass = data.class.replace(/[^\w]+/g, '_');
    const safeSession = data.session.replace(/[^\w]+/g, '_');
    const safeTerm = data.term.replace(/[^\w]+/g, '_');
    XLSX.writeFile(wb, `Broadsheet_${safeClass}_${safeSession}_${safeTerm}.xlsx`);
  };

  return (
    <>
      <style>{`
        @media print {
          html, body { margin: 0; padding: 0; background: white !important; }
          body * { visibility: hidden !important; }
          #broadsheet-root, #broadsheet-root * { visibility: visible !important; }
          #broadsheet-root {
            position: fixed !important; inset: 0 !important;
            width: 100% !important; height: auto !important;
            overflow: visible !important; z-index: 9999 !important;
            background: white !important;
          }
          .no-print { display: none !important; }
        }
        @page { size: A4 landscape; margin: 8mm; }
      `}</style>

      <div className="no-print mb-4 flex justify-end gap-3">
        <button
          onClick={downloadExcel}
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-lg transition-all active:scale-95"
        >
          <Download size={16} /> Download Excel
        </button>
        <button
          onClick={() => window.print()}
          className="flex items-center gap-2 bg-[#1e293b] hover:bg-[#334155] text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-lg transition-all active:scale-95"
        >
          <Printer size={16} /> Print / Download PDF
        </button>
      </div>

      <div
        id="broadsheet-root"
        className="bg-white text-black mx-auto text-[10px] leading-tight shadow-2xl p-4"
        style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b-2 border-black pb-2 mb-2">
          <div className="w-16 h-16 flex items-center justify-center overflow-hidden shrink-0">
            <img
              src={logoSrc}
              alt="School Logo"
              className="w-full h-full object-contain"
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
            />
          </div>
          <div className="text-center flex-1 px-4">
            <h1 className="text-xl font-black uppercase tracking-wide">{sectionTitle}</h1>
            <p className="text-[11px] text-gray-700">{SCHOOL.city}, {SCHOOL.state}</p>
            <p className="text-xs font-bold mt-1">
              SESSION: {data.session} &nbsp;|&nbsp; CLASS: {data.class} &nbsp;|&nbsp; TERM: {termLabel}
            </p>
            <p className="text-[10px] text-gray-600 mt-0.5">
              Total Students: {data.totalStudents} &nbsp;&nbsp; Class Average: {fmt(data.classAverage, 2)} &nbsp;&nbsp; Maximum Obtainable Score per Subject: 100
            </p>
          </div>
          <div className="w-16 shrink-0" />
        </div>

        <p className="text-center font-black underline uppercase mb-2 text-sm">Broadsheet ({termLabel})</p>

        {data.students.length === 0 ? (
          <p className="text-center text-gray-500 py-10">No students found for this class.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-black text-[9px] whitespace-nowrap">
              <thead>
                <tr>
                  {headerCells.map((h) => (
                    <th key={h} className="border border-black px-1.5 py-1 font-bold bg-gray-100 text-left">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.students.map((s, i) => (
                  <tr key={s.studentId}>
                    <td className="border border-black px-1.5 py-1">{i + 1}</td>
                    <td className="border border-black px-1.5 py-1 font-semibold">{s.name}</td>
                    <td className="border border-black px-1.5 py-1">{s.admissionNo}</td>
                    {data.subjects.map((subj) => (
                      <td key={subj} className="border border-black px-1.5 py-1 text-center">{fmt(s.perSubject[subj], 0)}</td>
                    ))}
                    <td className="border border-black px-1.5 py-1 text-center font-bold">{fmt(s.totalScore, 0)}</td>
                    <td className="border border-black px-1.5 py-1 text-center">{s.maxObtainable}</td>
                    <td className="border border-black px-1.5 py-1 text-center">{fmt(s.averageScore, 1)}</td>
                    <td className="border border-black px-1.5 py-1 text-center">{fmt(s.averagePercent, 2)}</td>
                    <td className="border border-black px-1.5 py-1 text-center font-bold">{s.position !== null ? ordinal(s.position) : '—'}</td>
                    <td className="border border-black px-1.5 py-1 text-center font-bold">{s.grade ?? '—'}</td>
                    <td className="border border-black px-1.5 py-1 text-center">{s.remark ?? '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
