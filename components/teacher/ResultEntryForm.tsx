'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { calculateGrade } from '@/lib/grading';
import { AFFECTIVE_TRAITS, PSYCHOMOTOR_SKILLS } from '@/lib/subjects';
import {
  Save, ChevronLeft, CheckCircle2, AlertCircle,
  BookOpen, Brain, Activity, CalendarDays, MessageSquare, Camera, Loader2,
} from 'lucide-react';

const TERMS   = ['1st Term', '2nd Term', '3rd Term'];
const SESSIONS = ['2025/2026', '2026/2027'];
const MAX     = { test1: 10, test2: 10, test3: 10, exam: 70 };

type ScoreKey = keyof typeof MAX;
interface SubjectRow { test1:number; test2:number; test3:number; exam:number; total:number; grade:string }

function initSubject(): SubjectRow {
  return { test1: 0, test2: 0, test3: 0, exam: 0, total: 0, grade: '-' };
}
function calcSubject(row: SubjectRow): SubjectRow {
  const total = row.test1 + row.test2 + row.test3 + row.exam;
  return { ...row, total, grade: calculateGrade(total) };
}

interface Props {
  studentId: string;
  student:   any;
  existingResult: any | null;
  subjects:  string[];
}

function buildInitialScores(subjects: string[], existing: any): Record<string, SubjectRow> {
  const map: Record<string, SubjectRow> = {};
  for (const sub of subjects) {
    const found = existing?.subjects?.find((s: any) => s.subjectName === sub);
    if (found) {
      map[sub] = { test1: found.test1, test2: found.test2, test3: found.test3, exam: found.examScore, total: found.total, grade: found.grade };
    } else {
      map[sub] = initSubject();
    }
  }
  return map;
}

function buildInitialTraits(keys: {key:string}[], existing: any): Record<string, number> {
  const map: Record<string, number> = {};
  for (const { key } of keys) {
    map[key] = existing?.[key] ?? 0;
  }
  return map;
}

export default function ResultEntryForm({ studentId, student, existingResult, subjects }: Props) {
  const router = useRouter();

  const [term,    setTerm]    = useState(existingResult?.term    ?? '1st Term');
  const [session, setSession] = useState(existingResult?.session ?? '2025/2026');

  const [scores, setScores] = useState<Record<string, SubjectRow>>(
    () => buildInitialScores(subjects, existingResult)
  );
  const [affective,    setAffective]    = useState<Record<string, number>>(
    () => buildInitialTraits(AFFECTIVE_TRAITS,   existingResult?.affectiveTraits   ?? {})
  );
  const [psychomotor,  setPsychomotor]  = useState<Record<string, number>>(
    () => buildInitialTraits(PSYCHOMOTOR_SKILLS, existingResult?.psychomotorSkills ?? {})
  );
  const [daysOpened,  setDaysOpened]  = useState(existingResult?.attendance?.daysOpened  ?? 0);
  const [daysPresent, setDaysPresent] = useState(existingResult?.attendance?.daysPresent ?? 0);
  const [teacherComment,    setTeacherComment]    = useState(existingResult?.teacherComment    ?? '');
  const [formMasterComment, setFormMasterComment] = useState(existingResult?.formMasterComment ?? '');
  const [principalComment,  setPrincipalComment]  = useState(existingResult?.principalComment  ?? '');
  const [nextTermBegins,    setNextTermBegins]    = useState(existingResult?.nextTermBegins    ?? '');
  const [termEnded,         setTermEnded]         = useState(existingResult?.termEnded         ?? '');

  const [saving,       setSaving]       = useState(false);
  const [message,      setMessage]      = useState<{ type: 'success'|'error'; text: string }|null>(null);
  const [photoUrl,     setPhotoUrl]     = useState<string>(student.photo || '');
  const [photoLoading, setPhotoLoading] = useState(false);

  const daysAbsent = Math.max(0, daysOpened - daysPresent);

  const handlePhotoUpload = async (file: File) => {
    setPhotoLoading(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res  = await fetch(`/api/admin/students/${studentId}/photo`, { method: 'POST', body: fd });
      const data = await res.json();
      if (res.ok && data.photo) setPhotoUrl(data.photo);
    } finally {
      setPhotoLoading(false);
    }
  };

  const handleScore = useCallback((sub: string, field: ScoreKey, raw: string) => {
    let v = parseFloat(raw);
    if (isNaN(v) || v < 0) v = 0;
    if (v > MAX[field]) v = MAX[field];
    setScores(prev => {
      const updated = { ...prev[sub], [field]: v };
      return { ...prev, [sub]: calcSubject(updated as SubjectRow) };
    });
  }, []);

  const setRating = (setter: typeof setAffective, key: string, val: number) => {
    setter(prev => ({ ...prev, [key]: val }));
  };

  const totalScore = subjects.reduce((acc, s) => acc + (scores[s]?.total ?? 0), 0);
  const avgScore   = subjects.length > 0 ? (totalScore / subjects.length).toFixed(1) : '0';

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch('/api/teacher/save-result', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId,
          term,
          session,
          subjects: subjects.map(sub => ({
            subjectName: sub,
            test1:    scores[sub]?.test1 ?? 0,
            test2:    scores[sub]?.test2 ?? 0,
            test3:    scores[sub]?.test3 ?? 0,
            examScore: scores[sub]?.exam ?? 0,
            total:    scores[sub]?.total ?? 0,
            grade:    scores[sub]?.grade ?? 'F9',
          })),
          affectiveTraits:   affective,
          psychomotorSkills: psychomotor,
          attendance: { daysOpened, daysPresent, daysAbsent },
          nextTermBegins,
          termEnded,
          teacherComment,
          formMasterComment,
          principalComment,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage({ type: 'success', text: 'Results saved! Report card is now live on the student portal.' });
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to save.' });
      }
    } catch {
      setMessage({ type: 'error', text: 'Network error. Please try again.' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8 pb-16">

      {/* ── HEADER ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-slate-500 hover:text-white text-sm font-medium mb-3 transition-colors"
          >
            <ChevronLeft size={16} /> Back to Dashboard
          </button>
          <h1 className="text-2xl font-black text-white">Input Results</h1>
          <p className="text-slate-400 text-sm mt-1">
            <span className="text-emerald-400 font-bold">{student.firstName} {student.lastName}</span>
            &nbsp;·&nbsp;{student.studentId}&nbsp;·&nbsp;{student.currentClass}
          </p>
        </div>

        {/* Term / Session */}
        <div className="flex gap-3">
          <select
            value={term}
            onChange={e => setTerm(e.target.value)}
            className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm font-bold text-white outline-none focus:ring-2 focus:ring-emerald-500/30 cursor-pointer"
          >
            {TERMS.map(t => <option key={t} value={t} className="bg-slate-900">{t}</option>)}
          </select>
          <select
            value={session}
            onChange={e => setSession(e.target.value)}
            className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm font-bold text-white outline-none focus:ring-2 focus:ring-emerald-500/30 cursor-pointer"
          >
            {SESSIONS.map(s => <option key={s} value={s} className="bg-slate-900">{s}</option>)}
          </select>
        </div>
      </div>

      {/* Live avg banner */}
      <div className="flex items-center justify-between bg-emerald-500/10 border border-emerald-500/20 rounded-2xl px-6 py-4">
        <span className="text-sm text-slate-400 font-medium">Live Class Average</span>
        <span className="text-2xl font-black text-emerald-400">{avgScore} <span className="text-sm font-medium text-slate-500">/ 100</span></span>
      </div>

      {/* ── SECTION 1: ACADEMIC SCORES ── */}
      <Section icon={<BookOpen size={18} />} title="Academic Results" subtitle="CA tests max 10 each · Exam max 70 · Total 100">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left py-3 px-2 text-slate-500 font-bold uppercase text-xs tracking-wider w-1/3">Subject</th>
                <th className="text-center py-3 px-2 text-slate-500 font-bold uppercase text-xs tracking-wider">CA 1<br/><span className="font-normal normal-case text-slate-600">/10</span></th>
                <th className="text-center py-3 px-2 text-slate-500 font-bold uppercase text-xs tracking-wider">CA 2<br/><span className="font-normal normal-case text-slate-600">/10</span></th>
                <th className="text-center py-3 px-2 text-slate-500 font-bold uppercase text-xs tracking-wider">CA 3<br/><span className="font-normal normal-case text-slate-600">/10</span></th>
                <th className="text-center py-3 px-2 text-slate-500 font-bold uppercase text-xs tracking-wider">Exam<br/><span className="font-normal normal-case text-slate-600">/70</span></th>
                <th className="text-center py-3 px-2 text-slate-400 font-bold uppercase text-xs tracking-wider">Total</th>
                <th className="text-center py-3 px-2 text-slate-400 font-bold uppercase text-xs tracking-wider">Grade</th>
              </tr>
            </thead>
            <tbody>
              {subjects.map(sub => {
                const row = scores[sub] ?? initSubject();
                const gradeColor = row.grade === '-' ? 'text-slate-500'
                  : row.grade.startsWith('A') ? 'text-emerald-400'
                  : row.grade.startsWith('B') ? 'text-sky-400'
                  : row.grade.startsWith('C') ? 'text-yellow-400'
                  : 'text-red-400';
                return (
                  <tr key={sub} className="border-b border-white/5 hover:bg-white/2 transition-colors">
                    <td className="py-3 px-2 font-semibold text-slate-300">{sub}</td>
                    {(['test1','test2','test3','exam'] as ScoreKey[]).map(field => (
                      <td key={field} className="py-2 px-1">
                        <input
                          type="number"
                          min={0}
                          max={MAX[field]}
                          value={row[field] || ''}
                          placeholder="0"
                          onChange={e => handleScore(sub, field, e.target.value)}
                          className="w-full bg-slate-800/60 border border-white/10 rounded-lg py-2 text-center text-sm font-bold text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500/40 transition-all"
                        />
                      </td>
                    ))}
                    <td className="py-2 px-2 text-center font-black text-lg text-white">{row.total}</td>
                    <td className={`py-2 px-2 text-center font-black text-sm ${gradeColor}`}>{row.grade}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Section>

      {/* ── SECTION 2: AFFECTIVE TRAITS ── */}
      <Section icon={<Brain size={18} />} title="Affective Traits" subtitle="Rate each trait from 1 (poor) to 5 (excellent)">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {AFFECTIVE_TRAITS.map(({ key, label }) => (
            <div key={key} className="flex items-center justify-between bg-white/2 rounded-xl px-4 py-3 border border-white/5">
              <span className="text-sm text-slate-300 font-medium">{label}</span>
              <RatingButtons value={affective[key] ?? 0} onChange={v => setRating(setAffective, key, v)} />
            </div>
          ))}
        </div>
      </Section>

      {/* ── SECTION 3: PSYCHOMOTOR SKILLS ── */}
      <Section icon={<Activity size={18} />} title="Psychomotor Skills" subtitle="Rate each skill from 1 (poor) to 5 (excellent)">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {PSYCHOMOTOR_SKILLS.map(({ key, label }) => (
            <div key={key} className="flex items-center justify-between bg-white/2 rounded-xl px-4 py-3 border border-white/5">
              <span className="text-sm text-slate-300 font-medium">{label}</span>
              <RatingButtons value={psychomotor[key] ?? 0} onChange={v => setRating(setPsychomotor, key, v)} />
            </div>
          ))}
        </div>
      </Section>

      {/* ── SECTION 4: ATTENDANCE ── */}
      <Section icon={<CalendarDays size={18} />} title="Attendance" subtitle="School days this term">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <NumField label="Days School Opened" value={daysOpened}  onChange={setDaysOpened}  max={200} color="text-slate-300" />
          <NumField label="Days Present"        value={daysPresent} onChange={setDaysPresent} max={daysOpened} color="text-emerald-400" />
          <div className="bg-white/2 border border-white/5 rounded-2xl p-5">
            <p className="text-xs text-slate-500 uppercase tracking-wider font-bold mb-2">Days Absent</p>
            <p className="text-3xl font-black text-red-400">{daysAbsent}</p>
            <p className="text-xs text-slate-600 mt-1">Auto-calculated</p>
          </div>
        </div>
      </Section>

      {/* ── SECTION 5: COMMENTS ── */}
      <Section icon={<MessageSquare size={18} />} title="Comments & Remarks" subtitle="Will appear on the printed report card">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs text-slate-400 font-bold uppercase tracking-wider mb-2">
              Academic Adviser&apos;s Report
            </label>
            <textarea
              value={teacherComment}
              onChange={e => setTeacherComment(e.target.value)}
              placeholder="e.g. Excellent performance this term. Keep it up."
              rows={3}
              className="w-full bg-slate-800/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 resize-none"
            />
          </div>
          <div>
            <label className="block text-xs text-slate-400 font-bold uppercase tracking-wider mb-2">
              Form Master&apos;s Report
            </label>
            <textarea
              value={formMasterComment}
              onChange={e => setFormMasterComment(e.target.value)}
              placeholder="e.g. A diligent student with great potential."
              rows={3}
              className="w-full bg-slate-800/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 resize-none"
            />
          </div>
          <div>
            <label className="block text-xs text-slate-400 font-bold uppercase tracking-wider mb-2">
              Principal&apos;s Report
            </label>
            <textarea
              value={principalComment}
              onChange={e => setPrincipalComment(e.target.value)}
              placeholder="e.g. A fine example for others to follow."
              rows={3}
              className="w-full bg-slate-800/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 resize-none"
            />
          </div>
          <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs text-slate-400 font-bold uppercase tracking-wider mb-2">
                Term Ended
              </label>
              <input
                type="text"
                value={termEnded}
                onChange={e => setTermEnded(e.target.value)}
                placeholder="e.g. 20-Dec-2025"
                className="w-full bg-slate-800/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 font-bold uppercase tracking-wider mb-2">
                Next Term Begins
              </label>
              <input
                type="text"
                value={nextTermBegins}
                onChange={e => setNextTermBegins(e.target.value)}
                placeholder="e.g. 05-Jan-2026"
                className="w-full bg-slate-800/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
              />
            </div>
          </div>
        </div>
      </Section>

      {/* ── SECTION 6: STUDENT PASSPORT PHOTO ── */}
      <Section icon={<Camera size={18} />} title="Student Passport Photo" subtitle="Photo will appear on the printed report card">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          {/* Preview */}
          <div className="w-24 h-32 rounded-xl border-2 border-white/10 bg-slate-800/60 overflow-hidden flex items-center justify-center shrink-0">
            {photoUrl
              ? <img src={photoUrl} alt="Passport" className="w-full h-full object-cover" />
              : (
                <div className="flex flex-col items-center gap-1 text-slate-600">
                  <Camera size={28} />
                  <span className="text-[10px] font-bold uppercase tracking-wider">No Photo</span>
                </div>
              )
            }
          </div>
          {/* Upload */}
          <div className="flex-1 space-y-3">
            <p className="text-sm text-slate-400">Upload a clear passport-size photo. It will be cropped to face automatically.</p>
            <label className="inline-flex items-center gap-2 cursor-pointer bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-all active:scale-95">
              {photoLoading
                ? <><Loader2 size={16} className="animate-spin" /> Uploading…</>
                : <><Camera size={16} /> {photoUrl ? 'Replace Photo' : 'Upload Photo'}</>
              }
              <input
                type="file"
                accept="image/*"
                className="hidden"
                disabled={photoLoading}
                onChange={e => { const f = e.target.files?.[0]; if (f) handlePhotoUpload(f); e.target.value = ''; }}
              />
            </label>
            {photoUrl && (
              <p className="text-xs text-emerald-400 font-medium">✓ Photo saved — will appear on report card</p>
            )}
          </div>
        </div>
      </Section>

      {/* ── SAVE + MESSAGE ── */}
      {message && (
        <div className={`flex items-start gap-3 p-4 rounded-2xl text-sm font-semibold border ${
          message.type === 'success'
            ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20'
            : 'bg-red-500/10 text-red-300 border-red-500/20'
        }`}>
          {message.type === 'success'
            ? <CheckCircle2 size={18} className="shrink-0 mt-0.5" />
            : <AlertCircle  size={18} className="shrink-0 mt-0.5" />}
          {message.text}
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex-1 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed text-white py-4 rounded-2xl font-black text-base flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-900/30 active:scale-[0.98]"
        >
          <Save size={20} />
          {saving ? 'Saving…' : 'Save Results'}
        </button>
        <button
          onClick={() => router.push(`/portals/dashboard/teacher/results/${studentId}/view`)}
          className="sm:w-48 bg-white/8 hover:bg-white/12 text-slate-300 py-4 rounded-2xl font-bold text-base flex items-center justify-center gap-2 transition-all border border-white/10"
        >
          Preview Card
        </button>
      </div>
    </div>
  );
}

// ── Reusable sub-components ──────────────────────────────

function Section({ icon, title, subtitle, children }: {
  icon: React.ReactNode; title: string; subtitle: string; children: React.ReactNode;
}) {
  return (
    <div className="bg-white/2 border border-white/[0.07] rounded-[1.75rem] p-6 md:p-8 space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center text-emerald-400">
          {icon}
        </div>
        <div>
          <h2 className="font-black text-white text-lg">{title}</h2>
          <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>
        </div>
      </div>
      {children}
    </div>
  );
}

function RatingButtons({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map(n => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(n === value ? 0 : n)}
          className={`w-8 h-8 rounded-lg text-xs font-black transition-all active:scale-90 ${
            n <= value
              ? 'bg-emerald-500 text-white shadow-sm shadow-emerald-900/40'
              : 'bg-white/5 text-slate-500 hover:bg-white/10'
          }`}
        >
          {n}
        </button>
      ))}
    </div>
  );
}

function NumField({ label, value, onChange, max, color }: {
  label: string; value: number; onChange: (n: number) => void; max: number; color: string;
}) {
  return (
    <div className="bg-white/2 border border-white/5 rounded-2xl p-5">
      <p className="text-xs text-slate-500 uppercase tracking-wider font-bold mb-3">{label}</p>
      <input
        type="number"
        min={0}
        max={max}
        value={value || ''}
        placeholder="0"
        onChange={e => {
          const n = parseInt(e.target.value) || 0;
          onChange(Math.min(Math.max(0, n), max));
        }}
        className={`w-full bg-transparent text-3xl font-black ${color} focus:outline-none border-b-2 border-white/10 focus:border-emerald-500/50 pb-1 transition-colors`}
      />
    </div>
  );
}
