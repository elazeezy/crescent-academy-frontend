'use client';

import { useState, useEffect } from 'react';
import {
  Upload, Trash2, FileText, FileImage, File, Download,
  Loader2, CheckCircle2, AlertCircle, BookOpen, Plus, X,
} from 'lucide-react';
import { JSS_SUBJECTS, SSS_SUBJECTS, CLASS_NAMES } from '@/lib/subjects';

const ALL_SUBJECTS = ['General', ...new Set([...JSS_SUBJECTS, ...SSS_SUBJECTS])];
const ALL_CLASSES  = ['All Classes', ...CLASS_NAMES];

interface Material {
  _id: string;
  title: string;
  description: string;
  subject: string;
  targetClass: string;
  fileUrl: string;
  fileType: string;
  fileName: string;
  createdAt: string;
}

function FileIcon({ type }: { type: string }) {
  if (['jpg','jpeg','png','gif','webp'].includes(type))
    return <FileImage size={18} className="text-sky-400" />;
  if (type === 'pdf')
    return <FileText size={18} className="text-red-400" />;
  return <File size={18} className="text-slate-400" />;
}

export default function TeacherMaterialsPage() {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading,   setLoading]   = useState(true);
  const [uploading, setUploading] = useState(false);
  const [deleting,  setDeleting]  = useState<string | null>(null);
  const [showForm,  setShowForm]  = useState(false);
  const [message,   setMessage]   = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Form state
  const [title,       setTitle]       = useState('');
  const [description, setDescription] = useState('');
  const [subject,     setSubject]     = useState('General');
  const [targetClass, setTargetClass] = useState('All Classes');
  const [file,        setFile]        = useState<File | null>(null);

  const fetchMaterials = async () => {
    setLoading(true);
    try {
      const res  = await fetch('/api/teacher/materials');
      const data = await res.json();
      setMaterials(data.materials ?? []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchMaterials(); }, []);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !title.trim()) {
      setMessage({ type: 'error', text: 'Title and file are required.' });
      return;
    }
    setUploading(true);
    setMessage(null);
    const fd = new FormData();
    fd.append('file', file);
    fd.append('title', title.trim());
    fd.append('description', description.trim());
    fd.append('subject', subject);
    fd.append('targetClass', targetClass);
    try {
      const res  = await fetch('/api/teacher/materials', { method: 'POST', body: fd });
      const data = await res.json();
      if (res.ok) {
        setMaterials(prev => [data.material, ...prev]);
        setShowForm(false);
        setTitle(''); setDescription(''); setFile(null);
        setSubject('General'); setTargetClass('All Classes');
        setMessage({ type: 'success', text: 'Material uploaded successfully!' });
      } else {
        setMessage({ type: 'error', text: data.error || 'Upload failed.' });
      }
    } catch {
      setMessage({ type: 'error', text: 'Network error. Try again.' });
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this material?')) return;
    setDeleting(id);
    try {
      const res = await fetch(`/api/teacher/materials/${id}`, { method: 'DELETE' });
      if (res.ok) setMaterials(prev => prev.filter(m => m._id !== id));
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div className="space-y-8 pb-16">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white">Learning Materials</h1>
          <p className="text-slate-400 text-sm mt-1">Upload PDFs, notes, and resources for your students.</p>
        </div>
        <button
          onClick={() => setShowForm(v => !v)}
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-3 rounded-xl font-bold text-sm transition-all active:scale-95 shadow-lg shadow-emerald-900/30"
        >
          {showForm ? <><X size={16} /> Cancel</> : <><Plus size={16} /> Upload Material</>}
        </button>
      </div>

      {/* Message */}
      {message && (
        <div className={`flex items-center gap-3 p-4 rounded-2xl text-sm font-semibold border ${
          message.type === 'success'
            ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20'
            : 'bg-red-500/10 text-red-300 border-red-500/20'
        }`}>
          {message.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
          {message.text}
        </div>
      )}

      {/* Upload form */}
      {showForm && (
        <form
          onSubmit={handleUpload}
          className="bg-white/[0.03] border border-white/[0.08] rounded-[1.75rem] p-6 md:p-8 space-y-5"
        >
          <h2 className="font-black text-white text-lg flex items-center gap-2">
            <Upload size={18} className="text-emerald-400" /> New Material
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs text-slate-400 font-bold uppercase tracking-wider mb-2">Title *</label>
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="e.g. Chapter 3 Notes — Algebra"
                required
                className="w-full bg-slate-800/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
              />
            </div>

            <div>
              <label className="block text-xs text-slate-400 font-bold uppercase tracking-wider mb-2">Subject</label>
              <select
                value={subject}
                onChange={e => setSubject(e.target.value)}
                className="w-full bg-slate-800/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30 cursor-pointer"
              >
                {ALL_SUBJECTS.map(s => <option key={s} value={s} className="bg-slate-900">{s}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-xs text-slate-400 font-bold uppercase tracking-wider mb-2">Target Class</label>
              <select
                value={targetClass}
                onChange={e => setTargetClass(e.target.value)}
                className="w-full bg-slate-800/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30 cursor-pointer"
              >
                {ALL_CLASSES.map(c => <option key={c} value={c} className="bg-slate-900">{c}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-xs text-slate-400 font-bold uppercase tracking-wider mb-2">File *</label>
              <label className="flex items-center gap-3 cursor-pointer bg-slate-800/50 border border-white/10 border-dashed rounded-xl px-4 py-3 hover:border-emerald-500/40 transition-colors">
                <Upload size={16} className="text-emerald-400 shrink-0" />
                <span className="text-sm text-slate-400 truncate">
                  {file ? file.name : 'Click to choose PDF, DOC, image…'}
                </span>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.png,.jpg,.jpeg,.gif"
                  className="hidden"
                  onChange={e => setFile(e.target.files?.[0] ?? null)}
                />
              </label>
            </div>
          </div>

          <div>
            <label className="block text-xs text-slate-400 font-bold uppercase tracking-wider mb-2">Description (optional)</label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              rows={2}
              placeholder="Brief description of this material…"
              className="w-full bg-slate-800/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={uploading}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed text-white px-7 py-3 rounded-xl font-bold text-sm transition-all active:scale-95"
          >
            {uploading ? <><Loader2 size={16} className="animate-spin" /> Uploading…</> : <><Upload size={16} /> Upload</>}
          </button>
        </form>
      )}

      {/* Materials list */}
      {loading ? (
        <div className="py-24 flex items-center justify-center gap-2 text-slate-400">
          <Loader2 size={20} className="animate-spin" /> Loading…
        </div>
      ) : materials.length === 0 ? (
        <div className="py-24 text-center rounded-[2rem] border border-dashed border-white/10">
          <BookOpen size={40} className="text-slate-600 mx-auto mb-4" />
          <p className="text-slate-400 font-semibold">No materials uploaded yet.</p>
          <p className="text-slate-600 text-sm mt-1">Click "Upload Material" to add your first resource.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {materials.map(mat => (
            <div
              key={mat._id}
              className="group bg-white/[0.03] border border-white/[0.07] rounded-[1.5rem] p-5 hover:border-emerald-500/20 transition-all"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                  <FileIcon type={mat.fileType} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-white text-sm truncate">{mat.title}</p>
                  <p className="text-xs text-emerald-400/70 mt-0.5 font-mono">{mat.subject}</p>
                </div>
              </div>

              {mat.description && (
                <p className="text-xs text-slate-500 mt-3 leading-relaxed line-clamp-2">{mat.description}</p>
              )}

              <div className="mt-3 flex flex-wrap gap-2">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-sky-500/10 text-sky-400 border border-sky-500/20">
                  {mat.targetClass}
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-white/5 text-slate-400 border border-white/10 uppercase">
                  {mat.fileType}
                </span>
              </div>

              <div className="mt-4 flex gap-2">
                <a
                  href={mat.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 bg-emerald-600/80 hover:bg-emerald-500 text-white py-2 rounded-xl font-bold text-xs transition-all"
                >
                  <Download size={13} /> Download
                </a>
                <button
                  onClick={() => handleDelete(mat._id)}
                  disabled={deleting === mat._id}
                  className="px-3 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 transition-all disabled:opacity-50"
                >
                  {deleting === mat._id ? <Loader2 size={13} className="animate-spin" /> : <Trash2 size={13} />}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
