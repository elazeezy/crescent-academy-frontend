'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft, Loader2, Plus } from 'lucide-react';

export default function NewExamPage() {
  const router = useRouter();
  const [subjects, setSubjects] = useState<string[]>([]);
  const [assignedClass, setAssignedClass] = useState('');
  const [form, setForm] = useState({
    title: '',
    subject: '',
    targetClass: '',
    objectiveCount: 30,
    durationMinutes: 45,
    theoryMaxScore: 40,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/teacher/profile')
      .then((r) => r.json())
      .then((d) => {
        setSubjects(d.subjects ?? []);
        setAssignedClass(d.assignedClass ?? '');
        setForm((f) => ({ ...f, targetClass: d.assignedClass ?? '', subject: d.subjects?.[0] ?? '' }));
      })
      .catch(() => {});
  }, []);

  const inputCls = "w-full text-sm text-white bg-white/5 placeholder-slate-600 border border-white/10 rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-400/30 focus:border-emerald-400";
  const labelCls = "block text-xs font-bold text-slate-400 mb-1.5";

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/teacher/exams', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
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
        <h1 className="text-2xl font-black text-white">New CBT Exam</h1>
        <p className="text-slate-400 text-sm mt-1">Set up the exam details — you&apos;ll add questions next.</p>
      </div>

      <div className="bg-white/[0.03] border border-white/[0.07] rounded-[1.75rem] p-6 space-y-4">
        <div>
          <label className={labelCls}>Exam Title *</label>
          <input className={inputCls} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="First Term Mid-Term Test" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Subject *</label>
            {subjects.length > 0 ? (
              <select className={inputCls} value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })}>
                {subjects.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            ) : (
              <input className={inputCls} value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} placeholder="Mathematics" />
            )}
          </div>
          <div>
            <label className={labelCls}>Class</label>
            <input className={inputCls} value={form.targetClass || assignedClass} onChange={(e) => setForm({ ...form, targetClass: e.target.value })} />
          </div>
        </div>

        <div>
          <label className={labelCls}>Number of Objective Questions *</label>
          <select className={inputCls} value={form.objectiveCount} onChange={(e) => setForm({ ...form, objectiveCount: Number(e.target.value) })}>
            <option value={30}>30 Questions</option>
            <option value={60}>60 Questions</option>
            <option value={100}>100 Questions</option>
          </select>
          <p className="text-xs text-slate-500 mt-1.5">Objective score is automatically scaled to 30 marks, however many questions you choose.</p>
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

        {error && <p className="text-red-400 text-xs font-semibold">{error}</p>}

        <button
          onClick={handleSubmit}
          disabled={loading || !form.title || !form.subject || !form.targetClass || !form.durationMinutes}
          className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white py-3 rounded-xl text-sm font-bold disabled:opacity-40 transition-all active:scale-95"
        >
          {loading ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
          Create Exam &amp; Add Questions
        </button>
      </div>
    </div>
  );
}
