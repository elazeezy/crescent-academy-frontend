'use client';

import { useState, useEffect, useCallback, use } from 'react';
import Link from 'next/link';
import {
  ChevronLeft, Loader2, Plus, Trash2, CheckCircle, Save, Clock,
  ListChecks, ClipboardPaste, AlertCircle, PlayCircle,
} from 'lucide-react';
import QuestionUpload from '@/components/exams/QuestionUpload';
import { isoToLocalInput, localInputToIso } from '@/lib/examWindow';

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
  rejectionReason?: string;
  windowStart?: string;
  windowEnd?: string;
}

const emptyQuestion = (): Question => ({ text: '', options: ['', '', '', ''], correctIndex: 0 });

export default function ExamBuilderPage({ params }: { params: Promise<{ id: string }> }) {
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
  const [publishError, setPublishError] = useState('');
  const [schedStart, setSchedStart] = useState('');
  const [schedEnd, setSchedEnd] = useState('');
  const [schedMsg, setSchedMsg] = useState('');

  const fetchExam = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/teacher/exams/${id}`);
      const data = await res.json();
      if (res.ok) {
        setExam(data.exam);
        setQuestions(data.exam.questions?.length ? data.exam.questions : []);
        setSchedStart(isoToLocalInput(data.exam.windowStart));
        setSchedEnd(isoToLocalInput(data.exam.windowEnd));
      }
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { fetchExam(); }, [fetchExam]);

  const handleSaveSchedule = async () => {
    setSaving(true);
    setSchedMsg('');
    setSaveError('');
    try {
      const startIso = localInputToIso(schedStart);
      if (!startIso) { setSaveError('Pick a start date & time.'); return; }
      const res = await fetch(`/api/teacher/exams/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ windowStart: startIso, windowEnd: schedEnd ? localInputToIso(schedEnd) : null }),
      });
      const data = await res.json();
      if (!res.ok) { setSaveError(data.error ?? 'Failed to save schedule'); return; }
      setSchedMsg('Schedule saved.');
      setTimeout(() => setSchedMsg(''), 3000);
      fetchExam();
    } catch {
      setSaveError('Network error.');
    } finally {
      setSaving(false);
    }
  };

  const inputCls = "w-full text-sm text-white bg-white/5 placeholder-slate-600 border border-white/10 rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-400/30 focus:border-emerald-400";

  // ── ONE-BY-ONE ──
  const addQuestion = () => setQuestions((q) => [...q, emptyQuestion()]);
  const removeQuestion = (i: number) => setQuestions((q) => q.filter((_, idx) => idx !== i));
  const updateQuestion = (i: number, patch: Partial<Question>) =>
    setQuestions((q) => q.map((item, idx) => (idx === i ? { ...item, ...patch } : item)));
  const updateOption = (qi: number, oi: number, value: string) =>
    setQuestions((q) => q.map((item, idx) => idx === qi ? { ...item, options: item.options.map((o, j) => j === oi ? value : o) } : item));

  // ── BULK PASTE ──
  // Format:
  // 1. Question text
  // A. option
  // B. option
  // *C. option   (asterisk marks the correct one)
  // D. option
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
          // Continuation of question text (wrapped line)
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

  // ── SAVE ──
  const handleSave = async () => {
    setSaving(true);
    setSaveMsg('');
    setSaveError('');
    try {
      const res = await fetch(`/api/teacher/exams/${id}`, {
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

  const handleSubmitForReview = async () => {
    setPublishError('');
    setSaving(true);
    try {
      const saveRes = await fetch(`/api/teacher/exams/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ questions, status: 'pending_review' }),
      });
      const data = await saveRes.json();
      if (!saveRes.ok) { setPublishError(data.error ?? 'Failed to submit for review'); return; }
      fetchExam();
    } catch {
      setPublishError('Network error.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center py-24 text-slate-500 gap-2"><Loader2 size={20} className="animate-spin" /> Loading…</div>;
  }
  if (!exam) {
    return <div className="p-10 text-center text-slate-400">Exam not found.</div>;
  }

  const questionsNeeded = questions.length === 0 ? 1 : 0;

  return (
    <div className="max-w-3xl space-y-6 pb-24">
      <Link href="/portals/dashboard/teacher/exams" className="flex items-center gap-2 text-slate-500 hover:text-white text-sm font-medium w-fit transition-colors">
        <ChevronLeft size={16} /> Back to Exams
      </Link>

      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-black text-white">{exam.title}</h1>
          <p className="text-slate-400 text-sm mt-1">{exam.subject} — {exam.targetClass} — {exam.durationMinutes} min — {exam.objectiveCount} objectives needed</p>
        </div>
        <span className={`text-xs font-bold px-3 py-1.5 rounded-full border capitalize ${
          exam.status === 'live' ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/25'
          : exam.status === 'pending_review' ? 'bg-amber-500/15 text-amber-400 border-amber-500/25'
          : exam.status === 'rejected' ? 'bg-red-500/15 text-red-400 border-red-500/25'
          : exam.status === 'closed' ? 'bg-slate-600/15 text-slate-500 border-slate-600/25'
          : 'bg-slate-500/15 text-slate-400 border-slate-500/25'
        }`}>{exam.status.replace('_', ' ')}</span>
      </div>

      {exam.status === 'pending_review' && (
        <div className="rounded-2xl border border-amber-500/20 bg-amber-500/10 p-4 text-sm text-amber-300 font-semibold">
          Waiting on admin approval. You can still edit questions — resubmitting will reset the review.
        </div>
      )}
      {exam.status === 'rejected' && exam.rejectionReason && (
        <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-300">
          <p className="font-bold mb-1">Rejected by admin</p>
          <p>{exam.rejectionReason}</p>
        </div>
      )}

      {/* Schedule */}
      {['draft', 'pending_review', 'rejected'].includes(exam.status) ? (
        <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-4 space-y-3">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
            <Clock size={13} /> Exam Schedule
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1.5">Start Date &amp; Time *</label>
              <input type="datetime-local" className={inputCls} value={schedStart} onChange={(e) => setSchedStart(e.target.value)} />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1.5">End Date &amp; Time (optional)</label>
              <input type="datetime-local" className={inputCls} value={schedEnd} onChange={(e) => setSchedEnd(e.target.value)} />
            </div>
          </div>
          <p className="text-xs text-slate-500">Students can only start after the start time (server clock). With an end time, the exam locks automatically after it.</p>
          <div className="flex items-center gap-3">
            <button
              onClick={handleSaveSchedule}
              disabled={saving || !schedStart}
              className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-xl text-xs font-bold disabled:opacity-40 transition-all active:scale-95"
            >
              {saving ? <Loader2 size={13} className="animate-spin" /> : <Save size={13} />} Save Schedule
            </button>
            {schedMsg && <span className="text-emerald-400 text-xs font-bold">{schedMsg}</span>}
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border border-white/[0.07] bg-white/[0.03] p-4 text-sm text-slate-300 font-semibold flex items-center gap-2">
          <Clock size={15} className="text-slate-500" />
          {exam.windowStart
            ? `Opens ${new Date(exam.windowStart).toLocaleString()}${exam.windowEnd ? ` — locks ${new Date(exam.windowEnd).toLocaleString()}` : ''}`
            : 'No start time set.'}
        </div>
      )}

      <div className={`rounded-2xl border p-4 flex items-center gap-3 ${questionsNeeded === 0 ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-amber-500/10 border-amber-500/20'}`}>
        {questionsNeeded === 0 ? <CheckCircle size={18} className="text-emerald-400 shrink-0" /> : <AlertCircle size={18} className="text-amber-400 shrink-0" />}
        <p className={`text-sm font-semibold ${questionsNeeded === 0 ? 'text-emerald-300' : 'text-amber-300'}`}>
          {questionsNeeded === 0 ? `${questions.length} questions ready. This is the total that will be graded.` : 'Add at least one question before submitting this assessment.'}
        </p>
      </div>

      {/* Mode tabs */}
      <div className="flex bg-white/5 rounded-xl p-1 w-fit">
        {(['one', 'bulk'] as const).map((m) => (
          <button key={m} onClick={() => setMode(m)} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${mode === m ? 'bg-white/10 text-white' : 'text-slate-500 hover:text-slate-300'}`}>
            {m === 'one' ? <><ListChecks size={14} />One-by-One</> : <><ClipboardPaste size={14} />Paste in Bulk</>}
          </button>
        ))}
      </div>

      {mode === 'bulk' && (
        <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-6 space-y-4">
          <div>
            <p className="text-sm font-bold text-white mb-1">Paste your questions</p>
            <p className="text-xs text-slate-500 mb-3">
              One question per number, options as A–D, put a <span className="text-emerald-400 font-mono">*</span> before the correct option&apos;s letter. Example:
            </p>
            <pre className="text-[11px] text-slate-400 bg-black/30 rounded-xl p-3 mb-3 overflow-x-auto">{`1. What is the capital of Nigeria?
A. Lagos
B. Kano
*C. Abuja
D. Ibadan

2. 5 + 7 = ?
A. 10
*B. 12
C. 13
D. 14`}</pre>
          </div>
          <QuestionUpload theme="dark" onExtracted={(text) => setBulkText((prev) => (prev.trim() ? `${prev}\n\n${text}` : text))} />
          <textarea
            value={bulkText}
            onChange={(e) => setBulkText(e.target.value)}
            rows={12}
            className={`${inputCls} font-mono text-xs`}
            placeholder="Paste your questions here…"
          />
          {bulkError && <p className="text-red-400 text-xs font-semibold flex items-center gap-1.5"><AlertCircle size={13} />{bulkError}</p>}
          <button onClick={parseBulk} disabled={!bulkText.trim()} className="flex items-center gap-2 bg-white/10 hover:bg-white/15 text-white px-4 py-2.5 rounded-xl text-sm font-bold disabled:opacity-40">
            Preview Parsed Questions
          </button>

          {bulkPreview && (
            <div className="bg-black/20 rounded-xl p-4 space-y-3 max-h-80 overflow-y-auto">
              <p className="text-xs font-bold text-emerald-400">{bulkPreview.length} questions parsed successfully</p>
              {bulkPreview.map((q, i) => (
                <div key={i} className="text-xs text-slate-300 border-b border-white/5 pb-2">
                  <p className="font-semibold">{i + 1}. {q.text}</p>
                  <p className="text-slate-500 mt-0.5">
                    {q.options.map((o, j) => (
                      <span key={j} className={j === q.correctIndex ? 'text-emerald-400 font-bold' : ''}>
                        {String.fromCharCode(65 + j)}. {o}{j < q.options.length - 1 ? '  ' : ''}
                      </span>
                    ))}
                  </p>
                </div>
              ))}
              <button onClick={acceptBulkPreview} className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white py-2.5 rounded-xl text-sm font-bold">
                <Plus size={15} /> Add These {bulkPreview.length} Questions
              </button>
            </div>
          )}
        </div>
      )}

      {mode === 'one' && (
        <div className="space-y-4">
          {questions.map((q, qi) => (
            <div key={qi} className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-5 space-y-3">
              <div className="flex items-start justify-between gap-3">
                <span className="text-xs font-bold text-emerald-400 shrink-0 mt-2.5">Q{qi + 1}</span>
                <input
                  className={inputCls}
                  value={q.text}
                  onChange={(e) => updateQuestion(qi, { text: e.target.value })}
                  placeholder="Question text"
                />
                <button onClick={() => removeQuestion(qi)} className="p-2 text-slate-500 hover:text-red-400 shrink-0"><Trash2 size={16} /></button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pl-8">
                {q.options.map((opt, oi) => (
                  <label key={oi} className="flex items-center gap-2.5">
                    <input
                      type="radio"
                      name={`correct-${qi}`}
                      checked={q.correctIndex === oi}
                      onChange={() => updateQuestion(qi, { correctIndex: oi })}
                      className="accent-emerald-500 shrink-0"
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

          <button onClick={addQuestion} className="w-full flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-slate-300 py-3 rounded-xl text-sm font-bold border border-dashed border-white/15">
            <Plus size={16} /> Add Question
          </button>
        </div>
      )}

      {/* Sticky save bar */}
      <div className="fixed bottom-0 left-0 right-0 lg:left-72 bg-[#060d18]/95 backdrop-blur-xl border-t border-white/10 p-4 flex items-center justify-between gap-4 flex-wrap z-40">
        <div className="text-xs">
          {saveMsg && <span className="text-emerald-400 font-semibold flex items-center gap-1.5"><CheckCircle size={14} />{saveMsg}</span>}
          {saveError && <span className="text-red-400 font-semibold flex items-center gap-1.5"><AlertCircle size={14} />{saveError}</span>}
          {publishError && <span className="text-red-400 font-semibold flex items-center gap-1.5"><AlertCircle size={14} />{publishError}</span>}
        </div>
        <div className="flex items-center gap-3">
          <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 bg-white/10 hover:bg-white/15 text-white px-4 py-2.5 rounded-xl text-sm font-bold disabled:opacity-40">
            {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />} Save Draft
          </button>
          {exam.status === 'live' ? (
            <span className="text-sm font-bold text-emerald-400 px-2">Live — students can take this exam</span>
          ) : exam.status === 'pending_review' ? (
            <button onClick={handleSubmitForReview} disabled={saving || questionsNeeded !== 0} className="flex items-center gap-2 bg-amber-600 hover:bg-amber-500 text-white px-4 py-2.5 rounded-xl text-sm font-bold disabled:opacity-40">
              <PlayCircle size={15} /> Resubmit for Review
            </button>
          ) : (
            <button onClick={handleSubmitForReview} disabled={saving || questionsNeeded !== 0} className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2.5 rounded-xl text-sm font-bold disabled:opacity-40">
              <PlayCircle size={15} /> Submit for Admin Approval
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
