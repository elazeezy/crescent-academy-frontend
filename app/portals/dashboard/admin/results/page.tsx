'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  ArrowLeft, FileText, Search, X, CheckCircle, Loader2,
  MessageSquare, ChevronDown, ChevronUp, Globe, GlobeLock, Eye,
} from 'lucide-react';
import Link from 'next/link';

interface SubjectResult {
  subjectName: string; test1: number; test2: number; test3: number;
  examScore: number; total: number; grade: string;
}
interface Result {
  _id: string;
  term: string;
  session: string;
  gpa: number;
  published: boolean;
  publishedAt?: string;
  teacherComment: string;
  formMasterComment?: string;
  principalComment?: string;
  subjects: SubjectResult[];
  student: {
    _id: string; firstName: string; lastName: string;
    currentClass: string; studentId: string;
  };
}

export default function AdminResults() {
  const [results,      setResults]      = useState<Result[]>([]);
  const [loading,      setLoading]      = useState(true);
  const [search,       setSearch]       = useState('');
  const [classFilter,  setClassFilter]  = useState('');
  const [expanded,     setExpanded]     = useState<string | null>(null);
  const [commentDraft, setCommentDraft] = useState<Record<string, string>>({});
  const [saving,       setSaving]       = useState<string | null>(null);
  const [saved,        setSaved]        = useState<string | null>(null);
  const [publishing,   setPublishing]   = useState<string | null>(null);
  const [publishMsg,   setPublishMsg]   = useState<Record<string, string>>({});

  const fetchResults = useCallback(async () => {
    setLoading(true);
    try {
      const res  = await fetch('/api/admin/results');
      const data = await res.json();
      setResults(data.results ?? []);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchResults(); }, [fetchResults]);

  const saveComment = async (resultId: string) => {
    const comment = commentDraft[resultId]?.trim();
    if (!comment) return;
    setSaving(resultId);
    try {
      const res = await fetch(`/api/admin/results/${resultId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ principalComment: comment }),
      });
      if (res.ok) {
        setResults(prev => prev.map(r => r._id === resultId ? { ...r, principalComment: comment } : r));
        setSaved(resultId);
        setTimeout(() => setSaved(null), 3000);
      }
    } finally {
      setSaving(null);
    }
  };

  const togglePublish = async (resultId: string, currentlyPublished: boolean) => {
    setPublishing(resultId);
    try {
      const res  = await fetch('/api/admin/results/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resultId, publish: !currentlyPublished }),
      });
      const data = await res.json();
      if (res.ok) {
        setResults(prev => prev.map(r =>
          r._id === resultId ? { ...r, published: data.published } : r
        ));
        setPublishMsg(prev => ({ ...prev, [resultId]: data.message }));
        setTimeout(() => setPublishMsg(prev => { const n = { ...prev }; delete n[resultId]; return n; }), 3500);
      }
    } finally {
      setPublishing(null);
    }
  };

  const classes = [...new Set(results.map(r => r.student?.currentClass).filter(Boolean))].sort();

  const filtered = results.filter(r => {
    const name = `${r.student?.firstName} ${r.student?.lastName}`.toLowerCase();
    const matchSearch = !search || name.includes(search.toLowerCase()) || r.student?.studentId?.toLowerCase().includes(search.toLowerCase());
    const matchClass  = !classFilter || r.student?.currentClass === classFilter;
    return matchSearch && matchClass;
  });

  const publishedCount = results.filter(r => r.published).length;

  return (
    <div className="max-w-6xl space-y-6">

      {/* Header */}
      <div className="flex items-center gap-3">
        <Link href="/portals/dashboard/admin" className="text-slate-400 hover:text-slate-600 transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-extrabold text-slate-900">Academic Results</h1>
          <p className="text-slate-500 text-sm">
            {results.length} results submitted · {publishedCount} published to students
          </p>
        </div>
        {/* Publish status pill */}
        <div className="hidden sm:flex items-center gap-2 bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-2">
          <Globe size={15} className="text-emerald-500" />
          <span className="text-sm font-bold text-emerald-700">{publishedCount} / {results.length} published</span>
        </div>
      </div>

      {/* Class coverage chips */}
      {classes.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
          {classes.map(cls => (
            <button
              key={cls}
              onClick={() => setClassFilter(classFilter === cls ? '' : cls)}
              className={`p-3 rounded-xl border text-left transition-all ${
                classFilter === cls
                  ? 'bg-purple-600 border-purple-600 text-white'
                  : 'bg-white border-slate-200 hover:border-purple-300'
              }`}
            >
              <p className={`text-xs font-bold truncate ${classFilter === cls ? 'text-purple-100' : 'text-slate-500'}`}>{cls}</p>
              <p className={`text-xl font-black mt-0.5 ${classFilter === cls ? 'text-white' : 'text-slate-800'}`}>
                {results.filter(r => r.student?.currentClass === cls).length}
              </p>
            </button>
          ))}
        </div>
      )}

      {/* Search / filter bar */}
      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 max-w-sm">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name or student ID…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-400"
          />
        </div>
        {(search || classFilter) && (
          <button
            onClick={() => { setSearch(''); setClassFilter(''); }}
            className="flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700 px-3 py-2 border border-slate-200 rounded-xl"
          >
            <X size={14} /> Clear
          </button>
        )}
      </div>

      {/* Results table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-24 text-slate-400 gap-2">
            <Loader2 size={20} className="animate-spin" /> Loading results…
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24 text-slate-400">
            <FileText size={40} className="mx-auto mb-3 opacity-30" />
            <p className="font-semibold">
              {search || classFilter ? 'No results match your filter.' : 'No results submitted yet.'}
            </p>
          </div>
        ) : (
          <>
            {/* Table header */}
            <div className="grid grid-cols-7 gap-2 px-5 py-3 bg-slate-50 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100">
              <span className="col-span-2">Student</span>
              <span>Class</span>
              <span>Term</span>
              <span>GPA</span>
              <span>Status</span>
              <span>Actions</span>
            </div>

            {filtered.map(r => {
              const isExpanded  = expanded === r._id;
              const draft       = commentDraft[r._id] ?? r.principalComment ?? '';
              const isPublishing = publishing === r._id;
              const msg         = publishMsg[r._id];

              return (
                <div key={r._id} className="border-b border-slate-100 last:border-0">
                  {/* Row */}
                  <div className="grid grid-cols-7 gap-2 px-5 py-4 hover:bg-slate-50 transition-colors items-center">
                    <div className="col-span-2">
                      <p className="font-semibold text-slate-800 text-sm">
                        {r.student?.firstName} {r.student?.lastName}
                      </p>
                      <p className="text-xs text-slate-400 font-mono">{r.student?.studentId}</p>
                    </div>
                    <span className="text-sm text-slate-600">{r.student?.currentClass}</span>
                    <span className="text-sm text-slate-600">{r.term}<br/><span className="text-xs text-slate-400">{r.session}</span></span>
                    <span className={`text-sm font-black ${r.gpa >= 70 ? 'text-emerald-600' : r.gpa >= 50 ? 'text-amber-600' : 'text-red-500'}`}>
                      {r.gpa.toFixed(1)}
                    </span>

                    {/* Published badge */}
                    <span className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full border w-fit ${
                      r.published
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : 'bg-amber-50 text-amber-700 border-amber-200'
                    }`}>
                      {r.published ? <Globe size={11} /> : <GlobeLock size={11} />}
                      {r.published ? 'Live' : 'Draft'}
                    </span>

                    {/* Actions */}
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => togglePublish(r._id, r.published)}
                        disabled={isPublishing}
                        title={r.published ? 'Unpublish (hide from student)' : 'Publish to student portal'}
                        className={`flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-lg border transition-all disabled:opacity-50 ${
                          r.published
                            ? 'bg-red-50 text-red-600 border-red-200 hover:bg-red-100'
                            : 'bg-emerald-600 text-white border-emerald-600 hover:bg-emerald-500'
                        }`}
                      >
                        {isPublishing
                          ? <Loader2 size={12} className="animate-spin" />
                          : r.published ? <GlobeLock size={12} /> : <Globe size={12} />}
                        {r.published ? 'Unpublish' : 'Publish'}
                      </button>

                      <button
                        onClick={() => setExpanded(isExpanded ? null : r._id)}
                        className="text-slate-400 hover:text-slate-600 p-1 rounded transition-colors"
                        title="View details"
                      >
                        {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </button>
                    </div>
                  </div>

                  {/* Publish feedback */}
                  {msg && (
                    <div className="mx-5 mb-3 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-100 px-3 py-2 rounded-lg flex items-center gap-2">
                      <CheckCircle size={13} /> {msg}
                    </div>
                  )}

                  {/* Expanded detail */}
                  {isExpanded && (
                    <div className="px-5 pb-5 bg-slate-50/60 border-t border-slate-100 space-y-4">

                      {/* Subjects table */}
                      <div className="overflow-x-auto mt-3">
                        <table className="w-full text-xs">
                          <thead>
                            <tr className="text-slate-500 border-b border-slate-200">
                              {['Subject', 'T1', 'T2', 'T3', 'Exam', 'Total', 'Grade'].map(h => (
                                <th key={h} className="pb-2 text-left font-bold pr-4">{h}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {r.subjects.map(sub => (
                              <tr key={sub.subjectName} className="border-b border-slate-100">
                                <td className="py-1.5 pr-4 font-semibold text-slate-700">{sub.subjectName}</td>
                                <td className="py-1.5 pr-4 text-slate-600">{sub.test1}</td>
                                <td className="py-1.5 pr-4 text-slate-600">{sub.test2}</td>
                                <td className="py-1.5 pr-4 text-slate-600">{sub.test3}</td>
                                <td className="py-1.5 pr-4 text-slate-600">{sub.examScore}</td>
                                <td className="py-1.5 pr-4 font-bold text-slate-800">{sub.total}</td>
                                <td className="py-1.5">
                                  <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                                    sub.grade === 'A1' ? 'bg-emerald-100 text-emerald-700'
                                    : sub.grade?.startsWith('F') ? 'bg-red-100 text-red-700'
                                    : 'bg-blue-100 text-blue-700'
                                  }`}>
                                    {sub.grade}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      {/* Comments preview */}
                      {r.teacherComment && (
                        <div>
                          <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">Academic Adviser&apos;s Comment</p>
                          <p className="text-sm text-slate-700 italic">&ldquo;{r.teacherComment}&rdquo;</p>
                        </div>
                      )}
                      {r.formMasterComment && (
                        <div>
                          <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">Form Master&apos;s Comment</p>
                          <p className="text-sm text-slate-700 italic">&ldquo;{r.formMasterComment}&rdquo;</p>
                        </div>
                      )}

                      {/* Principal comment editor */}
                      <div>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Principal&apos;s Comment</p>
                        <div className="flex gap-2">
                          <textarea
                            rows={2}
                            value={draft}
                            onChange={e => setCommentDraft(prev => ({ ...prev, [r._id]: e.target.value }))}
                            placeholder="Type principal's comment…"
                            className="flex-1 text-sm border border-slate-200 rounded-xl px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-purple-400/30 focus:border-purple-400"
                          />
                          <button
                            onClick={() => saveComment(r._id)}
                            disabled={saving === r._id || !draft.trim()}
                            className="self-end flex items-center gap-1.5 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                          >
                            {saving === r._id
                              ? <Loader2 size={13} className="animate-spin" />
                              : saved === r._id
                              ? <CheckCircle size={13} />
                              : <MessageSquare size={13} />}
                            {saved === r._id ? 'Saved!' : 'Save'}
                          </button>
                        </div>
                      </div>

                      {/* Publish CTA inside expanded — prominent */}
                      <div className={`flex items-center justify-between p-4 rounded-xl border ${
                        r.published
                          ? 'bg-emerald-50 border-emerald-200'
                          : 'bg-amber-50 border-amber-200'
                      }`}>
                        <div className="flex items-center gap-2">
                          {r.published
                            ? <><Globe size={16} className="text-emerald-600" /><span className="text-sm font-bold text-emerald-700">This result is visible to the student.</span></>
                            : <><Eye size={16} className="text-amber-600" /><span className="text-sm font-bold text-amber-700">Student cannot see this result yet.</span></>}
                        </div>
                        <button
                          onClick={() => togglePublish(r._id, r.published)}
                          disabled={isPublishing}
                          className={`flex items-center gap-1.5 text-xs font-bold px-4 py-2 rounded-lg transition-all disabled:opacity-50 ${
                            r.published
                              ? 'bg-red-100 text-red-700 hover:bg-red-200 border border-red-200'
                              : 'bg-emerald-600 text-white hover:bg-emerald-500'
                          }`}
                        >
                          {isPublishing ? <Loader2 size={13} className="animate-spin" /> : null}
                          {r.published ? 'Unpublish Result' : 'Publish to Student Portal'}
                        </button>
                      </div>

                    </div>
                  )}
                </div>
              );
            })}
          </>
        )}
      </div>
    </div>
  );
}
