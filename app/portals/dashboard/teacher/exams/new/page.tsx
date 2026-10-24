'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft, Loader2, Plus } from 'lucide-react';
import { localInputToIso } from '@/lib/examWindow';
import { SECTIONS, getClassNamesForSection, type Section } from '@/lib/subjects';

export default function NewExamPage() {
  const router = useRouter();
  const [subjects, setSubjects] = useState<string[]>([]);
  const [form, setForm] = useState({
    title: '',
    subject: '',
    targetClass: '',
    section: 'college' as Section,
    objectiveCount: 1,
    durationMinutes: 45,
    theoryMaxScore: 40,
    term: '1st Term',
    session: '2026/2027',
    assessmentSlot: 'exam',
    windowStart: '',
    windowEnd: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const classOptions = getClassNamesForSection(form.section);

  useEffect(() => {
    fetch('/api/teacher/profile')
      .then((r) => r.json())
      .then((d) => {
        setSubjects(d.subjects ?? []);
        const sec: Section = d.section === 'science' ? 'science' : 'college';
        setForm((f) => ({
          ...f,
          section: sec,
          targetClass: d.assignedClass ?? '',
          subject: d.subjects?.[0] ?? '',
        }));
      })
      .catch(() => {});
  }, []);

  const inputCls = "w-full text-sm text-white bg-white/5 placeholder-slate-600 border border-white/10 rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-400/30 focus:border-emerald-400";
  const labelCls = "block text-xs font-bold text-slate-400 mb-1.5";

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    try {
      const windowStartIso = localInputToIso(form.windowStart);
      if (!windowStartIso) { setError('Pick a start date & time for the exam.'); return; }
      const windowEndIso = form.windowEnd ? localInputToIso(form.windowEnd) : null;
      if (form.windowEnd && !windowEndIso) { setError('The end date & time is invalid.'); return; }
      const res = await fetch('/api/teacher/exams', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, windowStart: windowStartIso, windowEnd: windowEndIso ?? undefined }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? 'Failed to create exam'); return; }
      router.push(`/portals/dashboard/teacher/exams/${data.examId}/build`);
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl space-y-6 pb-16">
      <Link href="/portals/dashboard/teacher/exams" className="flex items-center gap-2 text-slate-500 hover:text-white text-sm font-medium w-fit transition-colors">
        <ChevronLeft size={16} /> Back to Exams
      </Link>

      <div>
          <h1 className="text-2xl font-black text-white">New CBT Assessment</h1>
          <p className="text-slate-400 text-sm mt-1">Choose the term and result slot first. Add questions next; the saved question count is used for grading.</p>
      </div>

      <div className="bg-white/[0.03] border border-white/[0.07] rounded-[1.75rem] p-6 space-y-4">
        <div>
          <label className={labelCls}>Exam Title *</label>
          <input className={inputCls} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="First Term Mid-Term Test" />
        </div>

        <div>
          <label className={labelCls}>Subject *</label>
          <input
            className={inputCls}
            value={form.subject}
            onChange={(e) => setForm({ ...form, subject: e.target.value })}
            placeholder="Type any subject, e.g. Mathematics"
            list="subject-suggestions"
          />
          {subjects.length > 0 && (
            <datalist id="subject-suggestions">
              {subjects.map((s) => <option key={s} value={s} />)}
            </datalist>
          )}
          <p className="text-xs text-slate-500 mt-1.5">You can type any subject — suggestions come from your assigned subjects.</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Section *</label>
            <select
              className={inputCls}
              value={form.section}
              onChange={(e) => {
                const section = e.target.value as Section;
                const opts = getClassNamesForSection(section);
                setForm((f) => ({ ...f, section, targetClass: opts.includes(f.targetClass) ? f.targetClass : (opts[0] ?? '') }));
              }}
            >
              {SECTIONS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
          </div>
          <div>
            <label className={labelCls}>Class *</label>
            <select className={inputCls} value={form.targetClass} onChange={(e) => setForm({ ...form, targetClass: e.target.value })}>
              {!classOptions.includes(form.targetClass) && form.targetClass && (
                <option value={form.targetClass}>{form.targetClass}</option>
              )}
              {classOptions.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>

        <p className="text-xs text-slate-500">You can set this assessment for any class in either section. Add as many questions as you need in the next step — the system detects the final count for grading.</p>

        <div className="grid grid-cols-3 gap-3">
          <div><label className={labelCls}>Term *</label><select className={inputCls} value={form.term} onChange={(e) => setForm({ ...form, term: e.target.value })}><option>1st Term</option><option>2nd Term</option><option>3rd Term</option></select></div>
          <div><label className={labelCls}>Result slot *</label><select className={inputCls} value={form.assessmentSlot} onChange={(e) => setForm({ ...form, assessmentSlot: e.target.value })}><option value="ca1">C.A Test 1</option><option value="ca2">C.A Test 2</option><option value="exam">Exam</option><option value="testing">CBT Testing (no result)</option></select></div>
          <div><label className={labelCls}>Session *</label><input className={inputCls} value={form.session} onChange={(e) => setForm({ ...form, session: e.target.value })} placeholder="2026/2027" /></div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Duration (minutes) *</label>
            <input type="number" min={1} className={inputCls} value={form.durationMinutes} onChange={(e) => setForm({ ...form, durationMinutes: Number(e.target.value) })} />
          </div>
          <div>
            <label className={labelCls}>Theory Max Score</label>
            <input type="number" min={0} max={100} className={inputCls} value={form.theoryMaxScore} onChange={(e) => setForm({ ...form, theoryMaxScore: Number(e.target.value) })} />
            <p className="text-xs text-slate-500 mt-1.5">Entered manually per student after marking. Default 40.</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Start Date &amp; Time *</label>
            <input type="datetime-local" className={inputCls} value={form.windowStart} onChange={(e) => setForm({ ...form, windowStart: e.target.value })} />
          </div>
          <div>
            <label className={labelCls}>End Date &amp; Time (optional)</label>
            <input type="datetime-local" className={inputCls} value={form.windowEnd} onChange={(e) => setForm({ ...form, windowEnd: e.target.value })} />
          </div>
        </div>
        <p className="text-xs text-slate-500 -mt-2">Students can only start the exam after the start time (enforced by the server clock). If an end time is set, the exam locks automatically after it.</p>

        {error && <p className="text-red-400 text-xs font-semibold">{error}</p>}

        <button
          onClick={handleSubmit}
          disabled={loading || !form.title || !form.subject || !form.targetClass || !form.durationMinutes || !form.windowStart}
          className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white py-3 rounded-xl text-sm font-bold disabled:opacity-40 transition-all active:scale-95"
        >
          {loading ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
          Create Exam &amp; Add Questions
        </button>
      </div>
    </div>
  );
}
