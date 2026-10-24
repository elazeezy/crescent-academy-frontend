'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  ArrowLeft, FileText, Search, X, CheckCircle, Loader2,
  MessageSquare, ChevronDown, ChevronUp, Save, Globe, GlobeLock, Pencil,
} from 'lucide-react';
import Link from 'next/link';

interface SubjectResult {
  subjectName: string; test1: number; test2: number; test3: number;
  examScore: number; total: number; grade: string;
  isCbt?: boolean; cbtExamId?: string; objectiveScore?: number; theoryScore?: number;
}
interface Result {
  _id: string;
  term: string;
  session: string;
  gpa: number;
  published: boolean;
  teacherComment: string;
  formMasterComment?: string;
  principalComment?: string;
  subjects: SubjectResult[];
  student: {
    _id: string; firstName: string; lastName: string;
    currentClass: string; section?: string; studentId: string;
  };
}

function gradeFor(total: number): string {
  if (total >= 75) return 'A1';
  if (total >= 70) return 'B2';
  if (total >= 65) return 'B3';
  if (total >= 60) return 'C4';
  if (total >= 55) return 'C5';
  if (total >= 50) return 'C6';
  if (total >= 45) return 'D7';
  if (total >= 40) return 'E8';
  return 'F9';
}

function subjectTotal(s: SubjectResult): number {
  const t = (Number(s.test1) || 0) + (Number(s.test2) || 0) + (Number(s.test3) || 0);
  if (s.isCbt) return t + (Number(s.objectiveScore) || 0) + (Number(s.theoryScore) || 0);
  return t + (Number(s.examScore) || 0);
}

export default function PrincipalResults() {
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [classFilter, setClassFilter] = useState('');
  const [sectionFilter, setSectionFilter] = useState('');
  const [expanded, setExpanded] = useState<string | null>(null);

  const [commentDraft, setCommentDraft] = useState<Record<string, string>>({});
  const [editScores, setEditScores] = useState<Record<string, SubjectResult[]>>({});
  const [savingComment, setSavingComment] = useState<string | null>(null);
  const [savingScores, setSavingScores] = useState<string | null>(null);
  const [savedComment, setSavedComment] = useState<string | null>(null);
  const [scoreMsg, setScoreMsg] = useState<Record<string, string>>({});

  const fetchResults = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/principal/results');
      const data = await res.json();
      setResults(data.results ?? []);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchResults(); }, [fetchResults]);

  const startEditScores = (r: Result) => {
    setEditScores((prev) => ({ ...prev, [r._id]: r.subjects.map((s) => ({ ...s })) }));
  };

  const updateScore = (resultId: string, idx: number, field: keyof SubjectResult, raw: string) => {
    setEditScores((prev) => {
      const rows = prev[resultId]?.map((s) => ({ ...s })) ?? [];
      const row = rows[idx];
      if (!row) return prev;
      let v = parseFloat(raw);
      if (isNaN(v) || v < 0) v = 0;
      const caps: Record<string, number> = { test1: 10, test2: 10, test3: 10, examScore: 70, objectiveScore: 30, theoryScore: 100 };
      if (caps[field as string] !== undefined && v > caps[field as string]) v = caps[field as string];
      (row as any)[field] = v;
      row.total = subjectTotal(row);
      row.grade = gradeFor(row.total);
      rows[idx] = row;
      return { ...prev, [resultId]: rows };
    });
  };

  const saveScores = async (resultId: string) => {
    const subjects = editScores[resultId];
    if (!subjects) return;
    setSavingScores(resultId);
    setScoreMsg((m) => ({ ...m, [resultId]: '' }));
    try {
      const res = await fetch(`/api/principal/results/${resultId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subjects }),
      });
      const data = await res.json();
      if (!res.ok) { setScoreMsg((m) => ({ ...m, [resultId]: data.error ?? 'Failed to save' })); return; }
      const updated = data.result;
      setResults((prev) => prev.map((r) => r._id === resultId ? { ...r, subjects: updated.subjects, gpa: updated.gpa } : r));
      setEditScores((prev) => { const n = { ...prev }; delete n[resultId]; return n; });
      setScoreMsg((m) => ({ ...m, [resultId]: 'Scores updated.' }));
      setTimeout(() => setScoreMsg((m) => { const n = { ...m }; delete n[resultId]; return n; }), 3500);
    } finally {
      setSavingScores(null);
    }
  };

  const saveComment = async (resultId: string) => {
    const comment = (commentDraft[resultId] ?? '').trim();
    setSavingComment(resultId);
    try {
      const res = await fetch(`/api/principal/results/${resultId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ principalComment: comment }),
      });
      if (res.ok) {
        setResults((prev) => prev.map((r) => r._id === resultId ? { ...r, principalComment: comment } : r));
        setSavedComment(resultId);
        setTimeout(() => setSavedComment(null), 3000);
      }
    } finally {
      setSavingComment(null);
    }
  };

  const bySection = !sectionFilter ? results : results.filter((r) => (r.student?.section || 'college') === sectionFilter);
  const classes = [...new Set(bySection.map((r) => r.student?.currentClass).filter(Boolean))].sort();

  const filtered = results.filter((r) => {
    const name = `${r.student?.firstName} ${r.student?.lastName}`.toLowerCase();
    const matchSearch = !search || name.includes(search.toLowerCase()) || r.student?.studentId?.toLowerCase().includes(search.toLowerCase());
    const matchClass = !classFilter || r.student?.currentClass === classFilter;
    const matchSection = !sectionFilter || (r.student?.section || 'college') === sectionFilter;
    return matchSearch && matchClass && matchSection;
  });

  const inputCls = 'w-14 bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-xs text-white text-center focus:outline-none focus:ring-2 focus:ring-indigo-400/40';

  return (
    <div className="max-w-6xl space-y-6 pb-16">

      {/* Header */}
      <div className="flex items-center gap-3">
        <Link href="/portals/dashboard/principal" className="text-slate-400 hover:text-white transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-black text-white">Results &amp; Report Cards</h1>
          <p className="text-slate-400 text-sm">
            {results.length} result{results.length !== 1 ? 's' : ''} across both sections · edit scores and add your comment
          </p>
        </div>
      </div>

      {/* Section toggle */}
      <div className="flex gap-2 flex-wrap">
        {[{ value: '', label: 'All Sections' }, { value: 'college', label: 'Crescent College' }, { value: 'science', label: 'Crescent School of Science' }].map((s) => (
          <button
            key={s.value}
            onClick={() => { setSectionFilter(s.value); setClassFilter(''); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
              sectionFilter === s.value ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-white/5 border-white/10 text-slate-400 hover:border-white/20'
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* Class chips */}
      {classes.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
          {classes.map((cls) => (
            <button
              key={cls}
              onClick={() => setClassFilter(classFilter === cls ? '' : cls)}
              className={`p-3 rounded-xl border text-left transition-all ${
                classFilter === cls ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-white/[0.03] border-white/10 hover:border-indigo-400/40'
              }`}
            >
              <p className={`text-xs font-bold truncate ${classFilter === cls ? 'text-indigo-100' : 'text-slate-500'}`}>{cls}</p>
              <p className={`text-xl font-black mt-0.5 ${classFilter === cls ? 'text-white' : 'text-slate-200'}`}>
                {bySection.filter((r) => r.student?.currentClass === cls).length}
              </p>
            </button>
          ))}
        </div>
      )}

      {/* Search */}
      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 max-w-sm">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search by name or student ID…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400"
          />
        </div>
        {(search || classFilter || sectionFilter) && (
          <button
            onClick={() => { setSearch(''); setClassFilter(''); setSectionFilter(''); }}
            className="flex items-center gap-1 text-sm text-slate-400 hover:text-white px-3 py-2 border border-white/10 rounded-xl"
          >
            <X size={14} /> Clear
          </button>
        )}
      </div>

      {/* Results list */}
      <div className="bg-white/[0.03] rounded-2xl border border-white/[0.07] overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-24 text-slate-400 gap-2">
            <Loader2 size={20} className="animate-spin" /> Loading results…
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24 text-slate-400">
            <FileText size={40} className="mx-auto mb-3 opacity-30" />
            <p className="font-semibold">{search || classFilter ? 'No results match your filter.' : 'No results recorded yet.'}</p>
          </div>
        ) : (
          filtered.map((r) => {
            const isExpanded = expanded === r._id;
            const draft = commentDraft[r._id] ?? r.principalComment ?? '';
            const editing = editScores[r._id];
            const rows = editing ?? r.subjects;
            const msg = scoreMsg[r._id];

            return (
              <div key={r._id} className="border-b border-white/5 last:border-0">
                {/* Row */}
                <div className="flex items-center gap-4 px-5 py-4 hover:bg-white/[0.02] transition-colors">
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/15 border border-indigo-500/20 flex items-center justify-center text-xs font-black text-white shrink-0">
                    {r.student?.firstName?.[0]}{r.student?.lastName?.[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-white text-sm truncate">{r.student?.firstName} {r.student?.lastName}</p>
                    <p className="text-xs text-slate-500">
                      <span className="font-mono text-indigo-400/70">{r.student?.studentId}</span>
                      {' · '}{r.student?.currentClass}
                      {' · '}{r.student?.section === 'science' ? 'Science' : 'College'}
                      {' · '}{r.term} {r.session}
                    </p>
                  </div>
                  <span className={`hidden sm:inline text-[10px] font-bold px-2.5 py-1 rounded-full border shrink-0 ${
                    r.published ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/25' : 'bg-amber-500/15 text-amber-400 border-amber-500/25'
                  }`}>
                    {r.published ? <span className="inline-flex items-center gap-1"><Globe size={10} /> Live</span> : <span className="inline-flex items-center gap-1"><GlobeLock size={10} /> Draft</span>}
                  </span>
                  <span className={`text-sm font-black shrink-0 ${r.gpa >= 70 ? 'text-emerald-400' : r.gpa >= 50 ? 'text-amber-400' : 'text-red-400'}`}>
                    {r.gpa?.toFixed(1)}
                  </span>
                  <button
                    onClick={() => setExpanded(isExpanded ? null : r._id)}
                    className="text-slate-500 hover:text-white p-1 shrink-0"
                    aria-label={isExpanded ? 'Collapse' : 'Expand'}
                  >
                    {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </button>
                </div>

                {/* Expanded */}
                {isExpanded && (
                  <div className="px-5 pb-5 bg-black/20 border-t border-white/5 space-y-5">

                    {/* Subjects / score editor */}
                    <div className="flex items-center justify-between pt-4">
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">Subject Scores</p>
                      {!editing ? (
                        <button
                          onClick={() => startEditScores(r)}
                          className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg bg-white/5 text-indigo-300 border border-white/10 hover:bg-white/10 transition-all"
                        >
                          <Pencil size={12} /> Edit scores
                        </button>
                      ) : (
                        <div className="flex items-center gap-2">
                          {msg && (
                            <span className={`text-xs font-semibold flex items-center gap-1 ${msg.includes('error') || msg.includes('Failed') || msg.includes('exceed') ? 'text-red-400' : 'text-emerald-400'}`}>
                              {msg.includes('error') || msg.includes('Failed') || msg.includes('exceed') ? null : <CheckCircle size={12} />} {msg}
                            </span>
                          )}
                          <button
                            onClick={() => setEditScores((prev) => { const n = { ...prev }; delete n[r._id]; return n; })}
                            className="text-xs font-bold px-3 py-1.5 rounded-lg bg-white/5 text-slate-400 border border-white/10 hover:bg-white/10"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => saveScores(r._id)}
                            disabled={savingScores === r._id}
                            className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg bg-indigo-600 text-white hover:bg-indigo-500 disabled:opacity-50 transition-all"
                          >
                            {savingScores === r._id ? <Loader2 size={12} className="animate-spin" /> : <Save size={12} />} Save scores
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-xs">
                        <thead>
                          <tr className="text-slate-500 border-b border-white/10">
                            {['Subject', 'T1', 'T2', 'T3', editing ? 'Exam/CBT' : 'Exam', 'Total', 'Grade'].map((h) => (
                              <th key={h} className="pb-2 text-left font-bold pr-3 whitespace-nowrap">{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {rows.map((sub, idx) => (
                            <tr key={sub.subjectName + idx} className="border-b border-white/5">
                              <td className="py-2 pr-3 font-semibold text-slate-200 whitespace-nowrap">
                                {sub.subjectName}
                                {sub.isCbt && <span className="ml-1.5 text-[9px] font-bold text-indigo-400 uppercase">CBT</span>}
                              </td>
                              {editing ? (
                                <>
                                  <td className="py-1.5 pr-3"><input className={inputCls} type="number" min={0} max={10} value={sub.test1} onChange={(e) => updateScore(r._id, idx, 'test1', e.target.value)} /></td>
                                  <td className="py-1.5 pr-3"><input className={inputCls} type="number" min={0} max={10} value={sub.test2} onChange={(e) => updateScore(r._id, idx, 'test2', e.target.value)} /></td>
                                  <td className="py-1.5 pr-3"><input className={inputCls} type="number" min={0} max={10} value={sub.test3} onChange={(e) => updateScore(r._id, idx, 'test3', e.target.value)} /></td>
                                  <td className="py-1.5 pr-3">
                                    {sub.isCbt ? (
                                      <div className="flex items-center gap-1">
                                        <input className={inputCls} type="number" min={0} max={30} value={sub.objectiveScore ?? 0} onChange={(e) => updateScore(r._id, idx, 'objectiveScore', e.target.value)} title="Objective (/30)" />
                                        <span className="text-slate-600">+</span>
                                        <input className={inputCls} type="number" min={0} value={sub.theoryScore ?? 0} onChange={(e) => updateScore(r._id, idx, 'theoryScore', e.target.value)} title="Theory" />
                                      </div>
                                    ) : (
                                      <input className={inputCls} type="number" min={0} max={70} value={sub.examScore} onChange={(e) => updateScore(r._id, idx, 'examScore', e.target.value)} />
                                    )}
                                  </td>
                                </>
                              ) : (
                                <>
                                  <td className="py-2 pr-3 text-slate-400">{sub.test1}</td>
                                  <td className="py-2 pr-3 text-slate-400">{sub.test2}</td>
                                  <td className="py-2 pr-3 text-slate-400">{sub.test3}</td>
                                  <td className="py-2 pr-3 text-slate-400">{sub.isCbt ? `${sub.objectiveScore ?? 0}+${sub.theoryScore ?? 0}` : sub.examScore}</td>
                                </>
                              )}
                              <td className="py-2 pr-3 font-bold text-white">{sub.total}</td>
                              <td className="py-2">
                                <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                                  sub.grade === 'A1' ? 'bg-emerald-500/20 text-emerald-300'
                                  : sub.grade?.startsWith('F') ? 'bg-red-500/20 text-red-300'
                                  : 'bg-indigo-500/20 text-indigo-300'
                                }`}>{sub.grade}</span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Other comments */}
                    {r.teacherComment && (
                      <div>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">Academic Adviser&apos;s Comment</p>
                        <p className="text-sm text-slate-300 italic">&ldquo;{r.teacherComment}&rdquo;</p>
                      </div>
                    )}
                    {r.formMasterComment && (
                      <div>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">Form Master&apos;s Comment</p>
                        <p className="text-sm text-slate-300 italic">&ldquo;{r.formMasterComment}&rdquo;</p>
                      </div>
                    )}

                    {/* Principal comment editor */}
                    <div>
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Principal&apos;s Comment</p>
                      <div className="flex gap-2">
                        <textarea
                          rows={2}
                          value={draft}
                          onChange={(e) => setCommentDraft((prev) => ({ ...prev, [r._id]: e.target.value }))}
                          placeholder="Type the principal's comment for this report card…"
                          className="flex-1 text-sm bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white placeholder:text-slate-500 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-400/30 focus:border-indigo-400"
                        />
                        <button
                          onClick={() => saveComment(r._id)}
                          disabled={savingComment === r._id}
                          className="self-end flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl disabled:opacity-40 transition-colors"
                        >
                          {savingComment === r._id ? <Loader2 size={13} className="animate-spin" /> : savedComment === r._id ? <CheckCircle size={13} /> : <MessageSquare size={13} />}
                          {savedComment === r._id ? 'Saved!' : 'Save'}
                        </button>
                      </div>
                    </div>

                    <p className="text-[11px] text-slate-500">
                      Publishing results to students is handled by the admin. Your edits and comments are saved immediately.
                    </p>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
