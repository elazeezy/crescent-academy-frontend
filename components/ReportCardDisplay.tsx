'use client';

import { AFFECTIVE_TRAITS, PSYCHOMOTOR_SKILLS, GRADING_SCALE, getGradeRemark, getOverallPerformance } from '@/lib/subjects';
import { Printer } from 'lucide-react';

interface ClassStats {
  totalStudents:   number;
  positionInClass: number;
  classAvgScore:   number;
  highestAvg:      number;
  lowestAvg:       number;
  subjectStats: Record<string, {
    classAvg: number; highest: number; lowest: number; position: number;
  }>;
}

interface Props {
  result:     any;
  student:    any;
  classStats?: ClassStats;
  schoolLogo?: string; // URL to uploaded school logo
}

function ordinal(n: number) {
  const s = ['th','st','nd','rd'], v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

function calcAge(dob?: string | Date): string {
  if (!dob) return '—';
  const birth = new Date(dob);
  const now   = new Date();
  const age   = now.getFullYear() - birth.getFullYear() -
    (now.getMonth() < birth.getMonth() ||
     (now.getMonth() === birth.getMonth() && now.getDate() < birth.getDate()) ? 1 : 0);
  return `${age} yrs`;
}

export default function ReportCardDisplay({ result, student, classStats, schoolLogo }: Props) {
  const subjectStats = classStats?.subjectStats ?? {};
  const totalScore   = result.subjects?.reduce((s: number, r: any) => s + r.total, 0) ?? 0;
  const avgScore     = result.subjects?.length > 0 ? (totalScore / result.subjects.length).toFixed(2) : '0';
  const highestAvg   = classStats?.highestAvg?.toFixed(2) ?? avgScore;
  const overall      = getOverallPerformance(parseFloat(avgScore));

  // Use uploaded logo if available, fall back to /logo.png
  const logoSrc = schoolLogo || '/logo.png';

  return (
    <>
      <style>{`
        @media print {
          html, body { margin: 0; padding: 0; background: white !important; }
          body * { visibility: hidden !important; }
          #report-card-root, #report-card-root * { visibility: visible !important; }
          #report-card-root {
            position: fixed !important; inset: 0 !important;
            width: 100% !important; height: auto !important;
            overflow: visible !important; z-index: 9999 !important;
            background: white !important;
          }
          .no-print { display: none !important; }
        }
        @page { size: A4; margin: 8mm; }
      `}</style>

      {/* Print button */}
      <div className="no-print mb-6 flex justify-end">
        <button
          onClick={() => window.print()}
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-3 rounded-xl font-bold text-sm shadow-lg transition-all active:scale-95"
        >
          <Printer size={18} />
          Print / Download PDF
        </button>
      </div>

      {/* ── THE REPORT CARD ── */}
      <div
        id="report-card-root"
        className="bg-white text-black max-w-5xl mx-auto font-sans text-[11px] leading-tight shadow-2xl"
        style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
      >
        {/* ── HEADER ── */}
        <div className="flex items-center justify-between px-4 pt-3 pb-2 border-b-4 border-[#1a5276]">
          {/* School logo */}
          <div className="w-16 h-16 rounded-full border-2 border-[#1a5276] flex items-center justify-center overflow-hidden bg-white shrink-0">
            <img
              src={logoSrc}
              alt="School Logo"
              className="w-full h-full object-contain"
              onError={(e) => {
                // Fallback to text if logo fails
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          </div>

          <div className="text-center flex-1 px-4">
            <h1 className="text-[22px] font-black text-[#1a5276] uppercase tracking-wide leading-tight">
              The Crescent College
            </h1>
            <p className="text-[11px] text-gray-600 mt-0.5">Iwo, Osun State</p>
            <p className="text-[10px] text-gray-500">Phone No: 08032545074 &nbsp;|&nbsp; Email: info@crescentcollege.edu.ng</p>
            <div className="mt-1.5 bg-[#1a5276] text-white text-[12px] font-bold py-1 px-6 rounded inline-block tracking-widest uppercase">
              STUDENT REPORT CARD — {result.term?.toUpperCase()} · {result.session}
            </div>
          </div>

          {/* Student passport photo */}
          <div className="w-16 h-20 border-2 border-gray-400 flex items-center justify-center bg-gray-50 text-gray-400 text-[9px] text-center rounded shrink-0 overflow-hidden">
            {student?.photo
              ? <img src={student.photo} alt="Student" className="w-full h-full object-cover" />
              : (
                <div className="flex flex-col items-center gap-0.5 text-gray-400">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
                  </svg>
                  <span className="text-[8px]">Passport<br/>Photo</span>
                </div>
              )
            }
          </div>
        </div>

        {/* ── INFO GRID ── */}
        <div className="grid grid-cols-2 gap-0 border-b border-gray-300">
          <div className="border-r border-gray-300 p-2 space-y-1">
            <InfoRow label="Session"          value={result.session} />
            <InfoRow label="Name of Student"  value={`${student?.firstName ?? ''} ${student?.lastName ?? ''}`.trim() || '—'} bold />
            <InfoRow label="Class"            value={student?.currentClass ?? '—'} />
            <InfoRow label="Next Term Begins" value={result.nextTermBegins || '—'} />
          </div>
          <div className="p-2 space-y-1">
            <InfoRow label="Term"    value={result.term} />
            <InfoRow label="Reg. No" value={student?.studentId ?? '—'} />
            <InfoRow label="Age"     value={calcAge(student?.dateOfBirth)} />
            <InfoRow label="Gender"  value={student?.gender ? (student.gender === 'male' ? 'M' : 'F') : '—'} />
            <InfoRow label="Weight"  value={student?.weight ?? '—'} inline />
            <InfoRow label="Height"  value={student?.height ?? '—'} inline />
          </div>
        </div>

        {/* ── PERFORMANCE SUMMARY ── */}
        <div className="grid grid-cols-3 text-[10px] border-b border-gray-300">
          <div className="border-r border-gray-300 p-2 space-y-0.5">
            <SummaryRow label="Position in Entire Class"         value={classStats ? ordinal(classStats.positionInClass) : '—'} />
            <SummaryRow label="Position in Class Section"        value={classStats ? ordinal(classStats.positionInClass) : '—'} />
            <SummaryRow label="Overall Total Score"              value={totalScore.toString()} />
            <SummaryRow label="Student's Average Score"          value={avgScore} />
            <SummaryRow label="Highest Average in Class Section" value={parseFloat(highestAvg).toFixed(2)} />
          </div>
          <div className="border-r border-gray-300 p-2 space-y-0.5">
            <SummaryRow label="No. of Students in Class"         value={(classStats?.totalStudents ?? '—').toString()} />
            <SummaryRow label="No. of Students in Class Section" value={(classStats?.totalStudents ?? '—').toString()} />
            <SummaryRow label="Class Section Average Score"      value={classStats ? classStats.classAvgScore.toFixed(2) : '—'} />
            <SummaryRow label="Lowest Average in Class Section"  value={classStats ? classStats.lowestAvg.toFixed(2) : '—'} />
            <SummaryRow label="Overall Performance"              value={overall} />
          </div>
          <div className="p-2 space-y-0.5">
            <SummaryRow label="No. of Days School Opened" value={(result.attendance?.daysOpened  ?? '—').toString()} />
            <SummaryRow label="No. of Days Present"       value={(result.attendance?.daysPresent ?? '—').toString()} />
            <SummaryRow label="No. of Days Absent"        value={(result.attendance?.daysAbsent  ?? '—').toString()} />
            <SummaryRow label="Term Ended"                value={result.termEnded || '—'} />
          </div>
        </div>

        {/* ── SUBJECTS TABLE ── */}
        <table className="w-full border-collapse text-[10px]">
          <thead>
            <tr className="bg-[#1a5276] text-white">
              <th className="border border-gray-400 p-1 text-left font-bold w-1/5">SUBJECT</th>
              <th className="border border-gray-400 p-1 text-center font-bold" style={{writingMode:'vertical-rl',transform:'rotate(180deg)',minWidth:'22px'}}>TEST 1<br/>(10)</th>
              <th className="border border-gray-400 p-1 text-center font-bold" style={{writingMode:'vertical-rl',transform:'rotate(180deg)',minWidth:'22px'}}>TEST 2<br/>(10)</th>
              <th className="border border-gray-400 p-1 text-center font-bold" style={{writingMode:'vertical-rl',transform:'rotate(180deg)',minWidth:'22px'}}>TEST 3<br/>(10)</th>
              <th className="border border-gray-400 p-1 text-center font-bold" style={{writingMode:'vertical-rl',transform:'rotate(180deg)',minWidth:'22px'}}>EXAM<br/>(70)</th>
              <th className="border border-gray-400 p-1 text-center font-bold" style={{writingMode:'vertical-rl',transform:'rotate(180deg)',minWidth:'26px'}}>TOTAL<br/>(100)</th>
              <th className="border border-gray-400 p-1 text-center font-bold" style={{writingMode:'vertical-rl',transform:'rotate(180deg)',minWidth:'26px'}}>GRADE</th>
              <th className="border border-gray-400 p-1 text-center font-bold" style={{writingMode:'vertical-rl',transform:'rotate(180deg)',minWidth:'30px'}}>SUBJECT<br/>POSITION</th>
              <th className="border border-gray-400 p-1 text-center font-bold" style={{writingMode:'vertical-rl',transform:'rotate(180deg)',minWidth:'30px'}}>CLASS<br/>AVERAGE</th>
              <th className="border border-gray-400 p-1 text-center font-bold" style={{writingMode:'vertical-rl',transform:'rotate(180deg)',minWidth:'30px'}}>HIGHEST<br/>IN CLASS</th>
              <th className="border border-gray-400 p-1 text-center font-bold" style={{writingMode:'vertical-rl',transform:'rotate(180deg)',minWidth:'30px'}}>LOWEST<br/>IN CLASS</th>
              <th className="border border-gray-400 p-1 text-center font-bold">REMARK</th>
            </tr>
          </thead>
          <tbody>
            {result.subjects?.map((sub: any, i: number) => {
              const ss     = subjectStats[sub.subjectName];
              const rowBg  = i % 2 === 0 ? 'bg-white' : 'bg-gray-50';
              return (
                <tr key={i} className={rowBg}>
                  <td className="border border-gray-300 p-1 font-semibold">{sub.subjectName}</td>
                  <td className="border border-gray-300 p-1 text-center">{sub.test1}</td>
                  <td className="border border-gray-300 p-1 text-center">{sub.test2}</td>
                  <td className="border border-gray-300 p-1 text-center">{sub.test3}</td>
                  <td className="border border-gray-300 p-1 text-center">{sub.examScore}</td>
                  <td className="border border-gray-300 p-1 text-center font-bold">{sub.total}</td>
                  <td className="border border-gray-300 p-1 text-center font-bold">{sub.grade}</td>
                  <td className="border border-gray-300 p-1 text-center">{ss ? ordinal(ss.position) : '—'}</td>
                  <td className="border border-gray-300 p-1 text-center">{ss ? ss.classAvg.toFixed(1) : '—'}</td>
                  <td className="border border-gray-300 p-1 text-center">{ss ? ss.highest : '—'}</td>
                  <td className="border border-gray-300 p-1 text-center">{ss ? ss.lowest : '—'}</td>
                  <td className="border border-gray-300 p-1 text-center font-semibold" style={{ color: getRemarkColor(sub.grade) }}>
                    {getGradeRemark(sub.grade)}
                  </td>
                </tr>
              );
            })}
            {Array.from({ length: Math.max(0, 2 - (result.subjects?.length ?? 0)) }).map((_, i) => (
              <tr key={`fill-${i}`} className="h-5">
                {Array.from({ length: 12 }).map((_, j) => <td key={j} className="border border-gray-200" />)}
              </tr>
            ))}
          </tbody>
        </table>

        {/* ── AFFECTIVE + KEY ── */}
        <div className="grid grid-cols-2 border-t border-gray-300 text-[10px]">
          <div className="border-r border-gray-300">
            <div className="bg-[#1a5276] text-white font-bold p-1 text-center tracking-wide">AFFECTIVE TRAITS</div>
            <div className="grid grid-cols-2 p-1 gap-x-2 gap-y-0.5">
              {AFFECTIVE_TRAITS.map(({ key, label }) => {
                const rating = result.affectiveTraits?.[key] ?? 0;
                return (
                  <div key={key} className="flex items-center justify-between border-b border-gray-100 py-0.5">
                    <span className="text-gray-700">{label}</span>
                    <span className="font-bold w-5 text-center">{rating || '—'}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div>
            <div className="bg-[#1a5276] text-white font-bold p-1 text-center tracking-wide">SCORE RANGE / GRADE / MEANING</div>
            <table className="w-full text-[10px]">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-200 p-0.5 text-center">Score Range</th>
                  <th className="border border-gray-200 p-0.5 text-center">Grade</th>
                  <th className="border border-gray-200 p-0.5 text-center">Meaning</th>
                </tr>
              </thead>
              <tbody>
                {GRADING_SCALE.map((row, i) => (
                  <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="border border-gray-200 p-0.5 text-center">{row.range}</td>
                    <td className="border border-gray-200 p-0.5 text-center font-bold">{row.grade}</td>
                    <td className="border border-gray-200 p-0.5 text-center">{row.meaning}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="mt-1 p-1 border-t border-gray-300">
              <div className="font-bold text-[10px] mb-0.5 uppercase text-[#1a5276]">Key</div>
              {[
                [5, 'Maintains an excellent degree of observation'],
                [4, 'Maintains high level of observation trait'],
                [3, 'Acceptable level of observation trait'],
                [2, 'Shows minimal level of observation trait'],
                [1, 'Has no regard for observation trait'],
              ].map(([n, text]) => (
                <div key={n} className="flex gap-1 text-[9px] text-gray-600">
                  <span className="font-bold w-3">{n}</span><span>{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── PSYCHOMOTOR SKILLS ── */}
        <div className="border-t border-gray-300 text-[10px]">
          <div className="bg-[#1a5276] text-white font-bold p-1 text-center tracking-wide">PSYCHOMOTOR SKILLS</div>
          <div className="grid grid-cols-4 p-1 gap-x-4 gap-y-0.5">
            {PSYCHOMOTOR_SKILLS.map(({ key, label }) => {
              const rating = result.psychomotorSkills?.[key] ?? 0;
              return (
                <div key={key} className="flex items-center justify-between border-b border-gray-100 py-0.5">
                  <span className="text-gray-700">{label}</span>
                  <span className="font-bold w-5 text-center">{rating || '—'}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── COMMENTS ── */}
        <div className="border-t-2 border-gray-300 text-[10px]">
          <CommentRow label="Academic Adviser's Report" value={result.teacherComment    || '—'} />
          <CommentRow label="Form Master's Report"      value={result.formMasterComment || '—'} />
          <CommentRow label="Principal's Report"        value={result.principalComment  || '—'} />
        </div>

        {/* ── SIGNATURES / STAMP ── */}
        <div className="border-t-2 border-[#1a5276] p-3 text-[10px]">
          <div className="grid grid-cols-3 gap-6">

            {/* Form Master */}
            <div className="text-center">
              <div className="h-14 border border-dashed border-gray-400 rounded mb-1 flex items-end justify-center pb-1 text-[8px] text-gray-300 italic">
                sign here
              </div>
              <div className="border-t border-gray-500 pt-1 font-semibold text-gray-700">Form Master / Class Teacher</div>
            </div>

            {/* School Stamp — scannable area */}
            <div className="text-center">
              <div className="h-14 border-2 border-dashed border-[#1a5276]/40 rounded-full mx-auto w-14 flex items-center justify-center text-[8px] text-[#1a5276]/40 font-bold text-center leading-tight">
                SCHOOL<br/>STAMP
              </div>
              <div className="border-t border-gray-500 pt-1 mt-1 font-semibold text-gray-700">Official Stamp</div>
            </div>

            {/* Principal */}
            <div className="text-center">
              <div className="h-14 border border-dashed border-gray-400 rounded mb-1 flex items-end justify-center pb-1 text-[8px] text-gray-300 italic">
                sign here
              </div>
              <div className="border-t border-gray-500 pt-1 font-semibold text-gray-700">Principal's Signature</div>
            </div>

          </div>

          {/* Date line */}
          <div className="mt-3 flex items-center gap-2 text-[10px] text-gray-600">
            <span className="font-semibold">Date Issued:</span>
            <span className="border-b border-gray-400 flex-1 max-w-40">&nbsp;</span>
          </div>

          {/* Footer note */}
          <div className="mt-2 text-center text-[9px] text-gray-400 italic border-t border-gray-200 pt-1">
            This report card is only valid with the school stamp and principal's signature.
          </div>
        </div>

      </div>
    </>
  );
}

// ── Small helpers ────────────────────────────────────────────────

function InfoRow({ label, value, bold, inline }: { label: string; value: string; bold?: boolean; inline?: boolean }) {
  if (inline) {
    return (
      <span className="text-[10px] mr-3">
        <span className="text-gray-500">{label}:</span>
        <span className="font-bold ml-1">{value}</span>
      </span>
    );
  }
  return (
    <div className="flex gap-1 text-[10px]">
      <span className="text-gray-500 shrink-0 w-32">{label}:</span>
      <span className={bold ? 'font-black' : 'font-semibold'}>{value}</span>
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-1">
      <span className="text-gray-600">{label}</span>
      <span className="font-bold shrink-0">{value}</span>
    </div>
  );
}

function CommentRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex border-b border-gray-200 py-1 px-2">
      <span className="text-gray-600 w-44 shrink-0 font-semibold">{label}:</span>
      <span className="text-gray-800">{value}</span>
    </div>
  );
}

function getRemarkColor(grade: string): string {
  if (grade.startsWith('A')) return '#16a34a';
  if (grade.startsWith('B')) return '#2563eb';
  if (grade.startsWith('C')) return '#ca8a04';
  if (grade.startsWith('D') || grade === 'E8') return '#ea580c';
  return '#dc2626';
}
