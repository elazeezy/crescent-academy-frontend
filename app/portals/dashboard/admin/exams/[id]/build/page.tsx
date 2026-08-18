'use client';

import { useState, useEffect, useCallback, use } from 'react';
import Link from 'next/link';
import {
  ChevronLeft, Loader2, Plus, Trash2, CheckCircle, Save,
  ListChecks, ClipboardPaste, AlertCircle, PlayCircle,
} from 'lucide-react';

interface Question {
  text: string;
  options: string[];
  correctIndex: number;
}

interface ExamDetail {
  _id: string;
  title: string;
  subject: string;
  targetClass: string;
  objectiveCount: number;
  durationMinutes: number;
  theoryMaxScore: number;
  questions: Question[];
  status: string;
}

const emptyQuestion = (): Question => ({ text: '', options: ['', '', '', ''], correctIndex: 0 });

export default function AdminExamBuilderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [exam, setExam] = useState<ExamDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState<'one' | 'bulk'>('one');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [bulkText, setBulkText] = useState('');
  const [bulkPreview, setBulkPreview] = useState<Question[] | null>(null);
  const [bulkError, setBulkError] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState('');
  const [saveError, setSaveError] = useState('');
  const [actionError, setActionError] = useState('');

  const fetchExam = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/exams/${id}`);
      const data = await res.json();
      if (res.ok) {
        setExam(data.exam);
        setQuestions(data.exam.questions?.length ? data.exam.questions : []);
      }
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { fetchExam(); }, [fetchExam]);

  const inputCls = "w-full text-sm text-slate-900 bg-white placeholder-slate-400 border border-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-400/30 focus:border-indigo-400";

  const addQuestion = () => setQuestions((q) => [...q, emptyQuestion()]);
  const removeQuestion = (i: number) => setQuestions((q) => q.filter((_, idx) => idx !== i));
  const updateQuestion = (i: number, patch: Partial<Question>) =>
    setQuestions((q) => q.map((item, idx) => (idx === i ? { ...item, ...patch } : item)));
  const updateOption = (qi: number, oi: number, value: string) =>
    setQuestions((q) => q.map((item, idx) => idx === qi ? { ...item, options: item.options.map((o, j) => j === oi ? value : o) } : item));

  const parseBulk = () => {
    setBulkError('');
    const lines = bulkText.split('\n').map((l) => l.trim()).filter(Boolean);
    const parsed: Question[] = [];
    let current: { text?: string; options: string[]; correctIndex: number } | null = null;

    const pushCurrent = () => {
      if (!current) return;
      if (!current.text || current.options.length < 2) {
        throw new Error(`Question "${current.text || '(untitled)'}" needs a text and at least 2 options`);
      }
      parsed.push({ text: current.text, options: current.options, correctIndex: current.correctIndex });
    };

    try {
      for (const line of lines) {
        const qMatch = line.match(/^\d+[.)]\s*(.+)$/);
        const optMatch = line.match(/^(\*?)([A-Za-z])[.)]\s*(.+)$/);

        if (qMatch && !optMatch) {
          pushCurrent();
          current = { text: qMatch[1].trim(), options: [], correctIndex: 0 };
        } else if (optMatch && current) {
          const isCorrect = optMatch[1] === '*';
          if (isCorrect) current.correctIndex = current.options.length;
          current.options.push(optMatch[3].trim());
        } else if (line) {
          if (current && current.options.length === 0) {
            current.text = `${current.text} ${line}`.trim();
          }
        }
      }
      pushCurrent();

      if (parsed.length === 0) throw new Error('No questions could be parsed. Check the format against the example.');
      setBulkPreview(parsed);
    } catch (e: any) {
      setBulkError(e.message || 'Failed to parse questions');
      setBulkPreview(null);
    }
  };

  const acceptBulkPreview = () => {
    if (!bulkPreview) return;
    setQuestions((q) => [...q, ...bulkPreview]);
    setBulkPreview(null);
    setBulkText('');
    setMode('one');
  };

  const handleSave = async () => {
    setSaving(true);
    setSaveMsg('');
    setSaveError('');
    try {
      const res = await fetch(`/api/admin/exams/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ questions }),
      });
      const data = await res.json();
      if (!res.ok) { setSaveError(data.error ?? 'Failed to save'); return; }
      setSaveMsg('Saved.');
      fetchExam();
    } catch {
      setSaveError('Network error.');
    } finally {
      setSaving(false);
    }
  };

  const setStatus = async (status: string) => {
    setActionError('');
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/exams/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ questions, status }),
      });
      const data = await res.json();
      if (!res.ok) { setActionError(data.error ?? 'Action failed'); return; }
      fetchExam();
    } catch {
      setActionError('Network error.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center py-24 text-slate-400 gap-2"><Loader2 size={20} className="animate-spin" /> Loading…</div>;
  }
  if (!exam) {
    return <div className="p-10 text-center text-slate-400">Exam not found.</div>;
  }

  const questionsNeeded = exam.objectiveCount - questions.length;

  return (
    <div className="max-w-3xl space-y-6 pb-24">
      <Link href="/portals/dashboard/admin/exams" className="flex items-center gap-2 text-slate-400 hover:text-slate-600 text-sm font-medium w-fit transition-colors">
        <ChevronLeft size={16} /> Back to CBT Exams
      </Link>

      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">{exam.title}</h1>
          <p className="text-slate-500 text-sm mt-1">{exam.subject} — {exam.targetClass} — {exam.durationMinutes} min — {exam.objectiveCount} objectives needed</p>
        </div>
        <span className="text-xs font-bold px-3 py-1.5 rounded-full border capitalize bg-slate-100 text-slate-600 border-slate-200">{exam.status.replace('_', ' ')}</span>
      </div>

      <div className={`rounded-2xl border p-4 flex items-center gap-3 ${questionsNeeded === 0 ? 'bg-emerald-50 border-emerald-200' : 'bg-amber-50 border-amber-200'}`}>
        {questionsNeeded === 0 ? <CheckCircle size={18} className="text-emerald-500 shrink-0" /> : <AlertCircle size={18} className="text-amber-500 shrink-0" />}
        <p className={`text-sm font-semibold ${questionsNeeded === 0 ? 'text-emerald-700' : 'text-amber-700'}`}>
          {questionsNeeded === 0 ? `All ${exam.objectiveCount} questions ready.` : `${questions.length} of ${exam.objectiveCount} questions added — ${questionsNeeded} more needed.`}
        </p>
      </div>

      <div className="flex bg-slate-100 rounded-xl p-1 w-fit">
        {(['one', 'bulk'] as const).map((m) => (
          <button key={m} onClick={() => setMode(m)} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${mode === m ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
            {m === 'one' ? <><ListChecks size={14} />One-by-One</> : <><ClipboardPaste size={14} />Paste in Bulk</>}
          </button>
        ))}
      </div>

      {mode === 'bulk' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
          <div>
            <p className="text-sm font-bold text-slate-900 mb-1">Paste your questions</p>
            <p className="text-xs text-slate-500 mb-3">
              One question per number, options as A–D, put a <span className="text-indigo-600 font-mono">*</span> before the correct option&apos;s letter.
            </p>
            <pre className="text-[11px] text-slate-500 bg-slate-50 rounded-xl p-3 mb-3 overflow-x-auto border border-slate-100">{`1. What is the capital of Nigeria?
A. Lagos
B. Kano
*C. Abuja
D. Ibadan`}</pre>
          </div>
          <textarea
            value={bulkText}
            onChange={(e) => setBulkText(e.target.value)}
            rows={10}
            className={`${inputCls} font-mono text-xs`}
            placeholder="Paste your questions here…"
          />
          {bulkError && <p className="text-red-500 text-xs font-semibold flex items-center gap-1.5"><AlertCircle size={13} />{bulkError}</p>}
          <button onClick={parseBulk} disabled={!bulkText.trim()} className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-800 px-4 py-2.5 rounded-xl text-sm font-bold disabled:opacity-40">
            Preview Parsed Questions
          </button>

          {bulkPreview && (
            <div className="bg-slate-50 rounded-xl p-4 space-y-3 max-h-80 overflow-y-auto border border-slate-100">
              <p className="text-xs font-bold text-emerald-600">{bulkPreview.length} questions parsed successfully</p>
              {bulkPreview.map((q, i) => (
                <div key={i} className="text-xs text-slate-600 border-b border-slate-200 pb-2">
                  <p className="font-semibold">{i + 1}. {q.text}</p>
                  <p className="text-slate-400 mt-0.5">
                    {q.options.map((o, j) => (
                      <span key={j} className={j === q.correctIndex ? 'text-emerald-600 font-bold' : ''}>
                        {String.fromCharCode(65 + j)}. {o}{j < q.options.length - 1 ? '  ' : ''}
                      </span>
                    ))}
                  </p>
                </div>
              ))}
              <button onClick={acceptBulkPreview} className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-xl text-sm font-bold">
                <Plus size={15} /> Add These {bulkPreview.length} Questions
              </button>
            </div>
          )}
        </div>
      )}

      {mode === 'one' && (
        <div className="space-y-4">
          {questions.map((q, qi) => (
            <div key={qi} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-3">
              <div className="flex items-start justify-between gap-3">
                <span className="text-xs font-bold text-indigo-600 shrink-0 mt-2.5">Q{qi + 1}</span>
                <input
                  className={inputCls}
                  value={q.text}
                  onChange={(e) => updateQuestion(qi, { text: e.target.value })}
                  placeholder="Question text"
                />
                <button onClick={() => removeQuestion(qi)} className="p-2 text-slate-400 hover:text-red-500 shrink-0"><Trash2 size={16} /></button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pl-8">
                {q.options.map((opt, oi) => (
                  <label key={oi} className="flex items-center gap-2.5">
                    <input
                      type="radio"
                      name={`correct-${qi}`}
                      checked={q.correctIndex === oi}
                      onChange={() => updateQuestion(qi, { correctIndex: oi })}
                      className="accent-indigo-600 shrink-0"
                    />
                    <input
                      className={inputCls}
                      value={opt}
                      onChange={(e) => updateOption(qi, oi, e.target.value)}
                      placeholder={`Option ${String.fromCharCode(65 + oi)}`}
                    />
                  </label>
                ))}
              </div>
            </div>
          ))}

          <button onClick={addQuestion} className="w-full flex items-center justify-center gap-2 bg-slate-50 hover:bg-slate-100 text-slate-600 py-3 rounded-xl text-sm font-bold border border-dashed border-slate-300">
            <Plus size={16} /> Add Question
          </button>
        </div>
      )}

      {/* Sticky action bar */}
      <div className="fixed bottom-0 left-0 right-0 md:left-64 bg-white/95 backdrop-blur-xl border-t border-slate-200 p-4 flex items-center justify-between gap-4 flex-wrap z-40">
        <div className="text-xs">
          {saveMsg && <span className="text-emerald-600 font-semibold flex items-center gap-1.5"><CheckCircle size={14} />{saveMsg}</span>}
          {saveError && <span className="text-red-500 font-semibold flex items-center gap-1.5"><AlertCircle size={14} />{saveError}</span>}
          {actionError && <span className="text-red-500 font-semibold flex items-center gap-1.5"><AlertCircle size={14} />{actionError}</span>}
        </div>
        <div className="flex items-center gap-3">
          <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-800 px-4 py-2.5 rounded-xl text-sm font-bold disabled:opacity-40">
            {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />} Save Draft
          </button>
          {exam.status === 'live' ? (
            <button onClick={() => setStatus('closed')} disabled={saving} className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2.5 rounded-xl text-sm font-bold disabled:opacity-40">
              Close Exam
            </button>
          ) : (
            <button onClick={() => setStatus('live')} disabled={saving || questionsNeeded !== 0} className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-xl text-sm font-bold disabled:opacity-40">
              <PlayCircle size={15} /> Approve &amp; Go Live
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
