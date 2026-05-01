'use client';

import { useState, useEffect, useCallback } from 'react';
import * as XLSX from 'xlsx';
import { CLASS_NAMES } from '@/lib/subjects';
import {
  Upload, FileSpreadsheet, CheckCircle, AlertCircle, ArrowLeft,
  Download, Search, Briefcase, Eye, X, Loader2, Pencil, Trash2, KeyRound, Plus,
} from 'lucide-react';
import Link from 'next/link';

interface StaffRow { name: string; email: string; assignedClass: string; subjects?: string; }
interface Teacher { _id: string; assignedClass: string; subjects: string[]; user: { _id: string; name: string; email: string } }
type Tab = 'list' | 'upload';

export default function TeacherManagement() {
  const [tab, setTab] = useState<Tab>('list');
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [listLoading, setListLoading] = useState(true);
  const [search, setSearch] = useState('');

  const [preview, setPreview] = useState<StaffRow[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<{ added: number; skipped: number } | null>(null);
  const [uploadError, setUploadError] = useState('');

  const [showAddModal, setShowAddModal] = useState(false);
  const [addForm, setAddForm] = useState({ name: '', email: '', assignedClass: '', subjects: '' });
  const [addLoading, setAddLoading] = useState(false);
  const [addError, setAddError] = useState('');

  const [editTeacher, setEditTeacher] = useState<Teacher | null>(null);
  const [editForm, setEditForm] = useState({ name: '', assignedClass: '', subjects: '' });
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState('');

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [resetResult, setResetResult] = useState<{ name: string; password: string } | null>(null);
  const [resetLoading, setResetLoading] = useState<string | null>(null);

  const fetchTeachers = useCallback(async () => {
    setListLoading(true);
    try {
      const res = await fetch('/api/admin/teachers');
      const data = await res.json();
      setTeachers(data.teachers ?? []);
    } finally { setListLoading(false); }
  }, []);

  useEffect(() => { fetchTeachers(); }, [fetchTeachers]);

  const handleAdd = async () => {
    setAddLoading(true); setAddError('');
    try {
      const res = await fetch('/api/admin/create-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: 'teacher', ...addForm }),
      });
      const data = await res.json();
      if (!res.ok) { setAddError(data.error ?? 'Failed'); return; }
      setShowAddModal(false);
      setAddForm({ name: '', email: '', assignedClass: '', subjects: '' });
      fetchTeachers();
    } finally { setAddLoading(false); }
  };

  const openEdit = (t: Teacher) => {
    setEditTeacher(t);
    setEditForm({ name: t.user?.name ?? '', assignedClass: t.assignedClass, subjects: t.subjects?.join(', ') ?? '' });
    setEditError('');
  };
  const handleEdit = async () => {
    if (!editTeacher) return;
    setEditLoading(true); setEditError('');
    try {
      const res = await fetch(`/api/admin/teachers/${editTeacher._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm),
      });
      const data = await res.json();
      if (!res.ok) { setEditError(data.error ?? 'Failed'); return; }
      setEditTeacher(null);
      fetchTeachers();
    } finally { setEditLoading(false); }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleteLoading(true);
    try {
      await fetch(`/api/admin/teachers/${deleteId}`, { method: 'DELETE' });
      setDeleteId(null);
      fetchTeachers();
    } finally { setDeleteLoading(false); }
  };

  const handleReset = async (t: Teacher) => {
    setResetLoading(t._id);
    try {
      const res = await fetch('/api/admin/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: t.user._id }),
      });
      const data = await res.json();
      if (res.ok) setResetResult({ name: t.user.name, password: data.tempPassword });
    } finally { setResetLoading(null); }
  };

  const downloadTemplate = () => {
    const ws = XLSX.utils.aoa_to_sheet([
      ['name', 'email', 'assignedClass', 'subjects'],
      ['Mr. Ibrahim Salami', 'salami@crescent.edu.ng', 'JSS 1 Gold', 'Mathematics,English'],
    ]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Staff');
    XLSX.writeFile(wb, 'crescent_staff_template.xlsx');
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadResult(null); setUploadError('');
    const reader = new FileReader();
    reader.onload = (evt) => {
      const wb = XLSX.read(evt.target?.result, { type: 'array' });
      setPreview(XLSX.utils.sheet_to_json<StaffRow>(wb.Sheets[wb.SheetNames[0]]));
    };
    reader.readAsArrayBuffer(file);
    e.target.value = '';
  };

  const confirmUpload = async () => {
    setUploading(true); setUploadError('');
    try {
      const res = await fetch('/api/admin/upload-staff', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ staffList: preview }),
      });
      const data = await res.json();
      if (!res.ok) { setUploadError(data.error ?? 'Upload failed'); return; }
      setUploadResult({ added: data.added, skipped: data.skipped });
      setPreview([]);
      fetchTeachers();
    } catch { setUploadError('Network error.'); }
    finally { setUploading(false); }
  };

  const filtered = teachers.filter((t) =>
    t.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
    t.user?.email?.toLowerCase().includes(search.toLowerCase()) ||
    t.assignedClass?.toLowerCase().includes(search.toLowerCase())
  );

  const inputCls = "w-full text-sm border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-400/30 focus:border-emerald-400";
  const labelCls = "block text-xs font-bold text-slate-500 mb-1";

  return (
    <div className="max-w-6xl space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <Link href="/portals/dashboard/admin" className="text-slate-400 hover:text-slate-600 transition-colors"><ArrowLeft size={20} /></Link>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900">Staff Management</h1>
            <p className="text-slate-500 text-sm">{teachers.length} teachers registered</p>
          </div>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <button onClick={() => setShowAddModal(true)} className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-sm font-bold transition-colors">
            <Plus size={16} /> Add Teacher
          </button>
          <div className="flex bg-slate-100 rounded-xl p-1">
            {(['list', 'upload'] as Tab[]).map((t) => (
              <button key={t} onClick={() => setTab(t)} className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${tab === t ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
                {t === 'list' ? <span className="flex items-center gap-2"><Briefcase size={14} />List</span> : <span className="flex items-center gap-2"><Upload size={14} />Upload</span>}
              </button>
            ))}
          </div>
        </div>
      </div>

      {tab === 'list' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex items-center gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input type="text" placeholder="Search by name, email or class…" value={search} onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400" />
            </div>
            {search && <button onClick={() => setSearch('')} className="text-slate-400 hover:text-slate-600"><X size={16} /></button>}
          </div>
          {listLoading ? (
            <div className="flex items-center justify-center py-20 text-slate-400 gap-2"><Loader2 size={20} className="animate-spin" /> Loading…</div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20 text-slate-400"><Briefcase size={40} className="mx-auto mb-3 opacity-30" /><p className="font-semibold">{search ? 'No staff match.' : 'No staff yet.'}</p></div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                  <tr>{['Name', 'Email', 'Class', 'Subjects', 'Actions'].map((h) => <th key={h} className="px-4 py-3 text-left font-bold">{h}</th>)}</tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filtered.map((t) => (
                    <tr key={t._id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3 font-semibold text-slate-800">{t.user?.name ?? '—'}</td>
                      <td className="px-4 py-3 text-slate-500 text-xs">{t.user?.email ?? '—'}</td>
                      <td className="px-4 py-3"><span className="bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-lg text-xs font-bold">{t.assignedClass}</span></td>
                      <td className="px-4 py-3 text-slate-500 text-xs">{t.subjects?.length > 0 ? t.subjects.join(', ') : '—'}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <button onClick={() => openEdit(t)} title="Edit" className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 transition-colors"><Pencil size={14} /></button>
                          <button onClick={() => handleReset(t)} title="Reset Password" disabled={resetLoading === t._id} className="p-1.5 rounded-lg text-slate-400 hover:text-amber-600 hover:bg-amber-50 transition-colors disabled:opacity-40">
                            {resetLoading === t._id ? <Loader2 size={14} className="animate-spin" /> : <KeyRound size={14} />}
                          </button>
                          <button onClick={() => setDeleteId(t._id)} title="Delete" className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"><Trash2 size={14} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="px-5 py-3 border-t border-slate-100 text-xs text-slate-400">Showing {filtered.length} of {teachers.length} staff</div>
            </div>
          )}
        </div>
      )}

      {tab === 'upload' && (
        <div className="space-y-5">
          <div className="bg-emerald-800 text-white rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <FileSpreadsheet size={24} className="shrink-0 text-emerald-300" />
              <div><p className="font-bold text-sm">Download the staff Excel template</p><p className="text-emerald-200 text-xs mt-0.5">Fill it in, then upload below.</p></div>
            </div>
            <button onClick={downloadTemplate} className="flex items-center gap-2 bg-white text-emerald-800 px-4 py-2 rounded-xl text-xs font-bold hover:bg-emerald-50 transition-colors shrink-0">
              <Download size={14} /> Download Template
            </button>
          </div>
          {preview.length === 0 && (
            <div className="bg-white border-2 border-dashed border-slate-200 rounded-2xl p-14 flex flex-col items-center text-center hover:border-emerald-400 transition-all relative">
              <input type="file" accept=".xlsx,.xls" onChange={handleFileSelect} className="absolute inset-0 opacity-0 cursor-pointer" />
              <Upload size={36} className="text-slate-300 mb-3" /><p className="font-bold text-slate-600">Click to choose your staff Excel file</p>
            </div>
          )}
          {preview.length > 0 && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                <span className="flex items-center gap-2 font-bold text-slate-800 text-sm"><Eye size={16} className="text-emerald-600" />Preview — {preview.length} rows</span>
                <button onClick={() => setPreview([])} className="text-slate-400 hover:text-red-500"><X size={18} /></button>
              </div>
              <div className="overflow-x-auto max-h-64">
                <table className="w-full text-xs">
                  <thead className="bg-slate-50 sticky top-0">
                    <tr>{['#', 'Name', 'Email', 'Class', 'Subjects'].map((h) => <th key={h} className="px-4 py-2.5 text-left text-slate-500 font-bold">{h}</th>)}</tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {preview.map((row, i) => (
                      <tr key={i} className={!row.name || !row.email || !row.assignedClass ? 'bg-red-50' : ''}>
                        <td className="px-4 py-2 text-slate-400">{i + 1}</td>
                        <td className="px-4 py-2 font-medium">{row.name || <span className="text-red-500">MISSING</span>}</td>
                        <td className="px-4 py-2">{row.email || <span className="text-red-500">MISSING</span>}</td>
                        <td className="px-4 py-2">{row.assignedClass || <span className="text-red-500">MISSING</span>}</td>
                        <td className="px-4 py-2 text-slate-400">{row.subjects ?? '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="px-5 py-4 border-t border-slate-100 flex gap-3">
                <button onClick={confirmUpload} disabled={uploading} className="flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white px-6 py-2.5 rounded-xl text-sm font-bold disabled:opacity-50">
                  {uploading ? <><Loader2 size={15} className="animate-spin" />Saving…</> : <><CheckCircle size={15} />Confirm & Upload</>}
                </button>
                <button onClick={() => setPreview([])} className="px-5 py-2.5 rounded-xl text-sm font-bold text-slate-500 hover:bg-slate-100">Cancel</button>
              </div>
            </div>
          )}
          {uploadResult && <div className="flex items-start gap-3 bg-green-50 border border-green-200 text-green-800 rounded-xl p-4"><CheckCircle size={20} className="text-green-600 shrink-0" /><div><p className="font-bold text-sm">Done</p><p className="text-xs">{uploadResult.added} added. {uploadResult.skipped > 0 && `${uploadResult.skipped} skipped.`}</p></div></div>}
          {uploadError && <div className="flex items-start gap-3 bg-red-50 border border-red-200 text-red-800 rounded-xl p-4"><AlertCircle size={20} className="text-red-600 shrink-0" /><div><p className="font-bold text-sm">Failed</p><p className="text-xs">{uploadError}</p></div></div>}
        </div>
      )}

      {/* ADD MODAL */}
      {showAddModal && (
        <Modal title="Add Single Teacher" onClose={() => setShowAddModal(false)}>
          <div className="space-y-3">
            <div><label className={labelCls}>Full Name *</label><input className={inputCls} value={addForm.name} onChange={(e) => setAddForm({ ...addForm, name: e.target.value })} placeholder="Mr. Ibrahim Salami" /></div>
            <div><label className={labelCls}>Email *</label><input className={inputCls} type="email" value={addForm.email} onChange={(e) => setAddForm({ ...addForm, email: e.target.value })} placeholder="salami@crescent.edu.ng" /></div>
            <div><label className={labelCls}>Assigned Class *</label>
              <select className={inputCls} value={addForm.assignedClass} onChange={(e) => setAddForm({ ...addForm, assignedClass: e.target.value })}>
                <option value="">— Select class —</option>
                {CLASS_NAMES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div><label className={labelCls}>Subjects (comma separated)</label><input className={inputCls} value={addForm.subjects} onChange={(e) => setAddForm({ ...addForm, subjects: e.target.value })} placeholder="Mathematics, English" /></div>
            {addError && <p className="text-red-500 text-xs font-semibold">{addError}</p>}
            <div className="flex gap-3 pt-2">
              <button onClick={handleAdd} disabled={addLoading || !addForm.name || !addForm.email || !addForm.assignedClass} className="flex-1 flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 rounded-xl text-sm font-bold disabled:opacity-40">
                {addLoading ? <Loader2 size={15} className="animate-spin" /> : <Plus size={15} />} Add Teacher
              </button>
              <button onClick={() => setShowAddModal(false)} className="px-5 py-2.5 rounded-xl text-sm font-bold text-slate-500 hover:bg-slate-100">Cancel</button>
            </div>
          </div>
        </Modal>
      )}

      {/* EDIT MODAL */}
      {editTeacher && (
        <Modal title={`Edit — ${editTeacher.user?.name}`} onClose={() => setEditTeacher(null)}>
          <div className="space-y-3">
            <div><label className={labelCls}>Full Name</label><input className={inputCls} value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} /></div>
            <div><label className={labelCls}>Assigned Class</label>
              <select className={inputCls} value={editForm.assignedClass} onChange={(e) => setEditForm({ ...editForm, assignedClass: e.target.value })}>
                <option value="">— Select class —</option>
                {CLASS_NAMES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div><label className={labelCls}>Subjects (comma separated)</label><input className={inputCls} value={editForm.subjects} onChange={(e) => setEditForm({ ...editForm, subjects: e.target.value })} /></div>
            {editError && <p className="text-red-500 text-xs font-semibold">{editError}</p>}
            <div className="flex gap-3 pt-2">
              <button onClick={handleEdit} disabled={editLoading} className="flex-1 flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 rounded-xl text-sm font-bold disabled:opacity-40">
                {editLoading ? <Loader2 size={15} className="animate-spin" /> : <CheckCircle size={15} />} Save
              </button>
              <button onClick={() => setEditTeacher(null)} className="px-5 py-2.5 rounded-xl text-sm font-bold text-slate-500 hover:bg-slate-100">Cancel</button>
            </div>
          </div>
        </Modal>
      )}

      {/* DELETE */}
      {deleteId && (
        <Modal title="Delete Teacher?" onClose={() => setDeleteId(null)}>
          <p className="text-slate-600 text-sm mb-5">This permanently deletes the teacher account. This cannot be undone.</p>
          <div className="flex gap-3">
            <button onClick={handleDelete} disabled={deleteLoading} className="flex-1 flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white py-2.5 rounded-xl text-sm font-bold disabled:opacity-40">
              {deleteLoading ? <Loader2 size={15} className="animate-spin" /> : <Trash2 size={15} />} Delete
            </button>
            <button onClick={() => setDeleteId(null)} className="px-5 py-2.5 rounded-xl text-sm font-bold text-slate-500 hover:bg-slate-100">Cancel</button>
          </div>
        </Modal>
      )}

      {/* RESET RESULT */}
      {resetResult && (
        <Modal title="Password Reset" onClose={() => setResetResult(null)}>
          <div className="space-y-4">
            <p className="text-slate-600 text-sm">{resetResult.name}&apos;s new password:</p>
            <div className="bg-slate-100 rounded-xl px-4 py-3 font-mono text-lg font-black text-slate-800 text-center tracking-widest">{resetResult.password}</div>
            <p className="text-xs text-amber-600 font-semibold">⚠ Copy this now — it won&apos;t be shown again.</p>
            <button onClick={() => setResetResult(null)} className="w-full bg-slate-900 text-white py-2.5 rounded-xl text-sm font-bold hover:bg-slate-700">Done</button>
          </div>
        </Modal>
      )}
    </div>
  );
}

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h3 className="font-bold text-slate-900">{title}</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><X size={18} /></button>
        </div>
        <div className="px-6 py-5">{children}</div>
      </div>
    </div>
  );
}
