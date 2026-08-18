'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft, Loader2, Plus, FlaskConical } from 'lucide-react';
import { SECTIONS, getClassNamesForSection, type Section } from '@/lib/subjects';

function NewAdminExamForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isDemo = searchParams.get('demo') === '1';

  const [form, setForm] = useState({
    title: isDemo ? 'CBT Testing Demo' : '',
    subject: isDemo ? 'General Test' : '',
    section: 'college' as Section,
    targetClass: '',
    objectiveCount: isDemo ? 5 : 30,
    durationMinutes: isDemo ? 10 : 45,
    theoryMaxScore: 40,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const inputCls = "w-full text-sm text-slate-900 bg-white placeholder-slate-400 border border-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-400/30 focus:border-indigo-400";
  const labelCls = "block text-xs font-bold text-slate-500 mb-1.5";

  const objectiveOptions = isDemo ? [3, 5, 10] : [30, 60, 100];

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/admin/exams', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? 'Failed to create exam'); return; }
      router.push(`/portals/dashboard/admin/exams/${data.examId}/build`);
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl space-y-6">
      <Link href="/portals/dashboard/admin/exams" className="flex items-center gap-2 text-slate-400 hover:text-slate-600 text-sm font-medium w-fit transition-colors">
        <ChevronLeft size={16} /> Back to CBT Exams
      </Link>

      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
          {isDemo && <FlaskConical size={20} className="text-indigo-500" />}
          {isDemo ? 'New Testing Exam' : 'New Exam'}
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          {isDemo
            ? 'A small demo exam — pick 3, 5, or 10 questions to try the full flow: build, approve, take as a student, and watch it live.'
            : 'Create an exam directly as admin, using the same builder and approval flow teachers use.'}
        </p>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
        <div>
          <label className={labelCls}>Exam Title *</label>
          <input className={inputCls} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="First Term Mid-Term Test" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Subject *</label>
            <input className={inputCls} value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} placeholder="Mathematics" />
          </div>
          <div>
            <label className={labelCls}>Section *</label>
            <select className={inputCls} value={form.section} onChange={(e) => setForm({ ...form, section: e.target.value as Section, targetClass: '' })}>
              {SECTIONS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
          </div>
        </div>

        <div>
          <label className={labelCls}>Class *</label>
          <select className={inputCls} value={form.targetClass} onChange={(e) => setForm({ ...form, targetClass: e.target.value })}>
            <option value="">— Select class —</option>
            {getClassNamesForSection(form.section).map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        <div>
          <label className={labelCls}>Number of Objective Questions *</label>
          <select className={inputCls} value={form.objectiveCount} onChange={(e) => setForm({ ...form, objectiveCount: Number(e.target.value) })}>
            {objectiveOptions.map((n) => <option key={n} value={n}>{n} Questions</option>)}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Duration (minutes) *</label>
            <input type="number" min={1} className={inputCls} value={form.durationMinutes} onChange={(e) => setForm({ ...form, durationMinutes: Number(e.target.value) })} />
          </div>
          <div>
            <label className={labelCls}>Theory Max Score</label>
            <input type="number" min={0} max={100} className={inputCls} value={form.theoryMaxScore} onChange={(e) => setForm({ ...form, theoryMaxScore: Number(e.target.value) })} />
          </div>
        </div>

        {error && <p className="text-red-500 text-xs font-semibold">{error}</p>}

        <button
          onClick={handleSubmit}
          disabled={loading || !form.title || !form.subject || !form.targetClass}
          className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl text-sm font-bold disabled:opacity-40 transition-all active:scale-95"
        >
          {loading ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
          Create Exam &amp; Add Questions
        </button>
      </div>
    </div>
  );
}

export default function NewAdminExamPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center py-24 text-slate-400 gap-2"><Loader2 size={20} className="animate-spin" /> Loading…</div>}>
      <NewAdminExamForm />
    </Suspense>
  );
}
