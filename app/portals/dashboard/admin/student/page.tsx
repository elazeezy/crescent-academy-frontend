'use client';

import { useState, useEffect, useCallback } from 'react';
import * as XLSX from 'xlsx';
import { CLASS_NAMES } from '@/lib/subjects';
import {
  Upload, FileSpreadsheet, CheckCircle, AlertCircle, ArrowLeft,
  Download, Search, Users, Eye, X, Loader2, Pencil, Trash2, KeyRound, Plus,
} from 'lucide-react';
import Link from 'next/link';

interface StudentRow { firstName: string; lastName: string; class: string; gender: string; email?: string; parentPhone?: string; }
interface Student { _id: string; studentId: string; firstName: string; lastName: string; currentClass: string; gender: string; parentPhone: string; user: { _id: string; name: string; email: string } }
type Tab = 'list' | 'upload';

export default function StudentManagement() {
  const [tab, setTab] = useState<Tab>('list');
  const [students, setStudents] = useState<Student[]>([]);
  const [listLoading, setListLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Upload state
  const [preview, setPreview] = useState<StudentRow[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<{ count: number; skipped: number } | null>(null);
  const [uploadError, setUploadError] = useState('');

  // Add single student modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [addForm, setAddForm] = useState({ name: '', email: '', firstName: '', lastName: '', currentClass: '', gender: 'male', parentPhone: '' });
  const [addLoading, setAddLoading] = useState(false);
  const [addError, setAddError] = useState('');

  // Edit modal
  const [editStudent, setEditStudent] = useState<Student | null>(null);
  const [editForm, setEditForm] = useState({ firstName: '', lastName: '', currentClass: '', gender: 'male', parentPhone: '' });
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState('');

  // Delete confirmation
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Password reset
  const [resetResult, setResetResult] = useState<{ name: string; password: string } | null>(null);
  const [resetLoading, setResetLoading] = useState<string | null>(null);

  const fetchStudents = useCallback(async () => {
    setListLoading(true);
    try {
      const res = await fetch('/api/admin/students');
      const data = await res.json();
      setStudents(data.students ?? []);
    } finally {
      setListLoading(false);
    }
  }, []);

  useEffect(() => { fetchStudents(); }, [fetchStudents]);

  // ── ADD SINGLE STUDENT ──
  const handleAdd = async () => {
    setAddLoading(true); setAddError('');
    try {
      const res = await fetch('/api/admin/create-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: 'student', ...addForm }),
      });
      const data = await res.json();
      if (!res.ok) { setAddError(data.error ?? 'Failed to create student'); return; }
      setShowAddModal(false);
      setAddForm({ name: '', email: '', firstName: '', lastName: '', currentClass: '', gender: 'male', parentPhone: '' });
      fetchStudents();
    } finally {
      setAddLoading(false);
    }
  };

  // ── EDIT STUDENT ──
  const openEdit = (s: Student) => {
    setEditStudent(s);
    setEditForm({ firstName: s.firstName, lastName: s.lastName, currentClass: s.currentClass, gender: s.gender, parentPhone: s.parentPhone });
    setEditError('');
  };
  const handleEdit = async () => {
    if (!editStudent) return;
    setEditLoading(true); setEditError('');
    try {
      const res = await fetch(`/api/admin/students/${editStudent._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm),
      });
      const data = await res.json();
      if (!res.ok) { setEditError(data.error ?? 'Failed to update'); return; }
      setEditStudent(null);
      fetchStudents();
    } finally {
      setEditLoading(false);
    }
  };

  // ── DELETE STUDENT ──
  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleteLoading(true);
    try {
      await fetch(`/api/admin/students/${deleteId}`, { method: 'DELETE' });
      setDeleteId(null);
      fetchStudents();
    } finally {
      setDeleteLoading(false);
    }
  };

  // ── RESET PASSWORD ──
  const handleReset = async (s: Student) => {
    setResetLoading(s._id);
    try {
      const res = await fetch('/api/admin/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: s.user._id }),
      });
      const data = await res.json();
      if (res.ok) setResetResult({ name: s.firstName, password: data.tempPassword });
    } finally {
      setResetLoading(null);
    }
  };

  // ── EXCEL UPLOAD ──
  const downloadTemplate = () => {
    const ws = XLSX.utils.aoa_to_sheet([
      ['firstName', 'lastName', 'class', 'gender', 'email', 'parentPhone'],
      ['Fatima', 'Adeyemi', 'JSS 1 Gold', 'female', 'fatima@example.com', '08012345678'],
    ]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Students');
    XLSX.writeFile(wb, 'crescent_students_template.xlsx');
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadResult(null); setUploadError('');
    const reader = new FileReader();
    reader.onload = (evt) => {
      const wb = XLSX.read(evt.target?.result, { type: 'array' });
      setPreview(XLSX.utils.sheet_to_json<StudentRow>(wb.Sheets[wb.SheetNames[0]]));
    };
    reader.readAsArrayBuffer(file);
    e.target.value = '';
  };

  const confirmUpload = async () => {
    setUploading(true); setUploadError('');
    try {
      const res = await fetch('/api/admin/upload-students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ students: preview }),
      });
      const data = await res.json();
      if (!res.ok) { setUploadError(data.error ?? 'Upload failed'); return; }
      setUploadResult({ count: data.count, skipped: data.skipped ?? 0 });
      setPreview([]);
      fetchStudents();
    } catch { setUploadError('Network error. Please try again.'); }
    finally { setUploading(false); }
  };

  const filtered = students.filter((s) =>
    `${s.firstName} ${s.lastName}`.toLowerCase().includes(search.toLowerCase()) ||
    s.studentId.toLowerCase().includes(search.toLowerCase()) ||
    s.currentClass.toLowerCase().includes(search.toLowerCase())
  );

  const inputCls = "w-full text-sm border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-400/30 focus:border-sky-400";
  const labelCls = "block text-xs font-bold text-slate-500 mb-1";

  return (
    <div className="max-w-6xl space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <Link href="/portals/dashboard/admin" className="text-slate-400 hover:text-slate-600 transition-colors"><ArrowLeft size={20} /></Link>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900">Student Management</h1>
            <p className="text-slate-500 text-sm">{students.length} students registered</p>
          </div>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <button onClick={() => setShowAddModal(true)} className="flex items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded-xl text-sm font-bold transition-colors">
            <Plus size={16} /> Add Student
          </button>
          <div className="flex bg-slate-100 rounded-xl p-1">
            {(['list', 'upload'] as Tab[]).map((t) => (
              <button key={t} onClick={() => setTab(t)} className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${tab === t ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
                {t === 'list' ? <span className="flex items-center gap-2"><Users size={14} />List</span> : <span className="flex items-center gap-2"><Upload size={14} />Upload</span>}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ─── LIST TAB ─── */}
      {tab === 'list' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex items-center gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input type="text" placeholder="Search by name, ID or class…" value={search} onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-400" />
            </div>
            {search && <button onClick={() => setSearch('')} className="text-slate-400 hover:text-slate-600"><X size={16} /></button>}
          </div>

          {listLoading ? (
            <div className="flex items-center justify-center py-20 text-slate-400 gap-2"><Loader2 size={20} className="animate-spin" /> Loading…</div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20 text-slate-400">
              <Users size={40} className="mx-auto mb-3 opacity-30" />
              <p className="font-semibold">{search ? 'No students match.' : 'No students yet.'}</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                  <tr>
                    {['Student ID', 'Name', 'Class', 'Gender', 'Email', 'Phone', 'Actions'].map((h) => (
                      <th key={h} className="px-4 py-3 text-left font-bold">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filtered.map((s) => (
                    <tr key={s._id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3 font-mono text-xs text-sky-600 font-bold">{s.studentId}</td>
                      <td className="px-4 py-3 font-semibold text-slate-800">{s.firstName} {s.lastName}</td>
                      <td className="px-4 py-3 text-slate-600">{s.currentClass}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${s.gender === 'female' ? 'bg-pink-50 text-pink-600' : 'bg-blue-50 text-blue-600'}`}>{s.gender}</span>
                      </td>
                      <td className="px-4 py-3 text-slate-500 text-xs">{s.user?.email ?? '—'}</td>
                      <td className="px-4 py-3 text-slate-500 text-xs">{s.parentPhone}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <button onClick={() => openEdit(s)} title="Edit" className="p-1.5 rounded-lg text-slate-400 hover:text-sky-600 hover:bg-sky-50 transition-colors"><Pencil size={14} /></button>
                          <button onClick={() => handleReset(s)} title="Reset Password" disabled={resetLoading === s._id} className="p-1.5 rounded-lg text-slate-400 hover:text-amber-600 hover:bg-amber-50 transition-colors disabled:opacity-40">
                            {resetLoading === s._id ? <Loader2 size={14} className="animate-spin" /> : <KeyRound size={14} />}
                          </button>
                          <button onClick={() => setDeleteId(s._id)} title="Delete" className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"><Trash2 size={14} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="px-5 py-3 border-t border-slate-100 text-xs text-slate-400">Showing {filtered.length} of {students.length} students</div>
            </div>
          )}
        </div>
      )}

      {/* ─── UPLOAD TAB ─── */}
      {tab === 'upload' && (
        <div className="space-y-5">
          <div className="bg-[#1E3A8A] text-white rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <FileSpreadsheet size={24} className="shrink-0 text-sky-300" />
              <div>
                <p className="font-bold text-sm">Download the Excel template first</p>
                <p className="text-blue-200 text-xs mt-0.5">Fill it in exactly as shown, then upload below.</p>
              </div>
            </div>
            <button onClick={downloadTemplate} className="flex items-center gap-2 bg-white text-[#1E3A8A] px-4 py-2 rounded-xl text-xs font-bold hover:bg-blue-50 transition-colors shrink-0">
              <Download size={14} /> Download Template
            </button>
          </div>

          {preview.length === 0 && (
            <div className="bg-white border-2 border-dashed border-slate-200 rounded-2xl p-14 flex flex-col items-center text-center hover:border-sky-400 hover:bg-sky-50/30 transition-all relative">
              <input type="file" accept=".xlsx,.xls" onChange={handleFileSelect} className="absolute inset-0 opacity-0 cursor-pointer" />
              <Upload size={36} className="text-slate-300 mb-3" />
              <p className="font-bold text-slate-600">Click to choose your Excel file</p>
              <p className="text-xs text-slate-400 mt-1">Accepts .xlsx and .xls</p>
            </div>
          )}

          {preview.length > 0 && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2"><Eye size={16} className="text-sky-600" /><span className="font-bold text-slate-800 text-sm">Preview — {preview.length} rows</span></div>
                <button onClick={() => setPreview([])} className="text-slate-400 hover:text-red-500"><X size={18} /></button>
              </div>
              <div className="overflow-x-auto max-h-72">
                <table className="w-full text-xs">
                  <thead className="bg-slate-50 sticky top-0">
                    <tr>{['#', 'First Name', 'Last Name', 'Class', 'Gender', 'Email', 'Phone'].map((h) => <th key={h} className="px-4 py-2.5 text-left text-slate-500 font-bold">{h}</th>)}</tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {preview.map((row, i) => (
                      <tr key={i} className={!row.firstName || !row.lastName || !row.class ? 'bg-red-50' : ''}>
                        <td className="px-4 py-2 text-slate-400">{i + 1}</td>
                        <td className="px-4 py-2 font-medium">{row.firstName || <span className="text-red-500">MISSING</span>}</td>
                        <td className="px-4 py-2 font-medium">{row.lastName || <span className="text-red-500">MISSING</span>}</td>
                        <td className="px-4 py-2">{row.class || <span className="text-red-500">MISSING</span>}</td>
                        <td className="px-4 py-2">{row.gender ?? '—'}</td>
                        <td className="px-4 py-2 text-slate-400">{row.email ?? '—'}</td>
                        <td className="px-4 py-2 text-slate-400">{row.parentPhone ?? '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="px-5 py-4 border-t border-slate-100 flex gap-3">
                <button onClick={confirmUpload} disabled={uploading} className="flex items-center gap-2 bg-[#1E3A8A] hover:bg-blue-800 text-white px-6 py-2.5 rounded-xl text-sm font-bold disabled:opacity-50">
                  {uploading ? <><Loader2 size={15} className="animate-spin" />Saving…</> : <><CheckCircle size={15} />Confirm & Upload</>}
                </button>
                <button onClick={() => setPreview([])} className="px-5 py-2.5 rounded-xl text-sm font-bold text-slate-500 hover:bg-slate-100">Cancel</button>
              </div>
            </div>
          )}

          {uploadResult && (
            <div className="flex items-start gap-3 bg-green-50 border border-green-200 text-green-800 rounded-xl p-4">
              <CheckCircle size={20} className="text-green-600 shrink-0 mt-0.5" />
              <div><p className="font-bold text-sm">Upload complete</p><p className="text-xs mt-0.5">{uploadResult.count} added. {uploadResult.skipped > 0 && `${uploadResult.skipped} skipped.`}</p></div>
            </div>
          )}
          {uploadError && (
            <div className="flex items-start gap-3 bg-red-50 border border-red-200 text-red-800 rounded-xl p-4">
              <AlertCircle size={20} className="text-red-600 shrink-0 mt-0.5" />
              <div><p className="font-bold text-sm">Upload failed</p><p className="text-xs mt-0.5">{uploadError}</p></div>
            </div>
          )}
        </div>
      )}

      {/* ═══ ADD STUDENT MODAL ═══ */}
      {showAddModal && (
        <Modal title="Add Single Student" onClose={() => setShowAddModal(false)}>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div><label className={labelCls}>First Name *</label><input className={inputCls} value={addForm.firstName} onChange={(e) => setAddForm({ ...addForm, firstName: e.target.value, name: `${e.target.value} ${addForm.lastName}` })} placeholder="Fatima" /></div>
              <div><label className={labelCls}>Last Name *</label><input className={inputCls} value={addForm.lastName} onChange={(e) => setAddForm({ ...addForm, lastName: e.target.value, name: `${addForm.firstName} ${e.target.value}` })} placeholder="Adeyemi" /></div>
            </div>
            <div><label className={labelCls}>Email (optional — auto-generated if blank)</label><input className={inputCls} type="email" value={addForm.email} onChange={(e) => setAddForm({ ...addForm, email: e.target.value })} placeholder="student@example.com" /></div>
            <div><label className={labelCls}>Class *</label>
              <select className={inputCls} value={addForm.currentClass} onChange={(e) => setAddForm({ ...addForm, currentClass: e.target.value })}>
                <option value="">— Select class —</option>
                {CLASS_NAMES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div><label className={labelCls}>Gender *</label>
                <select className={inputCls} value={addForm.gender} onChange={(e) => setAddForm({ ...addForm, gender: e.target.value })}>
                  <option value="male">Male</option><option value="female">Female</option>
                </select>
              </div>
              <div><label className={labelCls}>Parent Phone</label><input className={inputCls} value={addForm.parentPhone} onChange={(e) => setAddForm({ ...addForm, parentPhone: e.target.value })} placeholder="08012345678" /></div>
            </div>
            {addError && <p className="text-red-500 text-xs font-semibold">{addError}</p>}
            <div className="flex gap-3 pt-2">
              <button onClick={handleAdd} disabled={addLoading || !addForm.firstName || !addForm.lastName || !addForm.currentClass} className="flex-1 flex items-center justify-center gap-2 bg-sky-600 hover:bg-sky-700 text-white py-2.5 rounded-xl text-sm font-bold disabled:opacity-40">
                {addLoading ? <Loader2 size={15} className="animate-spin" /> : <Plus size={15} />} Add Student
              </button>
              <button onClick={() => setShowAddModal(false)} className="px-5 py-2.5 rounded-xl text-sm font-bold text-slate-500 hover:bg-slate-100">Cancel</button>
            </div>
          </div>
        </Modal>
      )}

      {/* ═══ EDIT STUDENT MODAL ═══ */}
      {editStudent && (
        <Modal title={`Edit — ${editStudent.firstName} ${editStudent.lastName}`} onClose={() => setEditStudent(null)}>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div><label className={labelCls}>First Name</label><input className={inputCls} value={editForm.firstName} onChange={(e) => setEditForm({ ...editForm, firstName: e.target.value })} /></div>
              <div><label className={labelCls}>Last Name</label><input className={inputCls} value={editForm.lastName} onChange={(e) => setEditForm({ ...editForm, lastName: e.target.value })} /></div>
            </div>
            <div><label className={labelCls}>Class</label>
              <select className={inputCls} value={editForm.currentClass} onChange={(e) => setEditForm({ ...editForm, currentClass: e.target.value })}>
                <option value="">— Select class —</option>
                {CLASS_NAMES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div><label className={labelCls}>Gender</label>
                <select className={inputCls} value={editForm.gender} onChange={(e) => setEditForm({ ...editForm, gender: e.target.value })}>
                  <option value="male">Male</option><option value="female">Female</option>
                </select>
              </div>
              <div><label className={labelCls}>Parent Phone</label><input className={inputCls} value={editForm.parentPhone} onChange={(e) => setEditForm({ ...editForm, parentPhone: e.target.value })} /></div>
            </div>
            {editError && <p className="text-red-500 text-xs font-semibold">{editError}</p>}
            <div className="flex gap-3 pt-2">
              <button onClick={handleEdit} disabled={editLoading} className="flex-1 flex items-center justify-center gap-2 bg-sky-600 hover:bg-sky-700 text-white py-2.5 rounded-xl text-sm font-bold disabled:opacity-40">
                {editLoading ? <Loader2 size={15} className="animate-spin" /> : <CheckCircle size={15} />} Save Changes
              </button>
              <button onClick={() => setEditStudent(null)} className="px-5 py-2.5 rounded-xl text-sm font-bold text-slate-500 hover:bg-slate-100">Cancel</button>
            </div>
          </div>
        </Modal>
      )}

      {/* ═══ DELETE CONFIRMATION ═══ */}
      {deleteId && (
        <Modal title="Delete Student?" onClose={() => setDeleteId(null)}>
          <p className="text-slate-600 text-sm mb-5">This will permanently delete the student account and all their data. This cannot be undone.</p>
          <div className="flex gap-3">
            <button onClick={handleDelete} disabled={deleteLoading} className="flex-1 flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white py-2.5 rounded-xl text-sm font-bold disabled:opacity-40">
              {deleteLoading ? <Loader2 size={15} className="animate-spin" /> : <Trash2 size={15} />} Yes, Delete
            </button>
            <button onClick={() => setDeleteId(null)} className="px-5 py-2.5 rounded-xl text-sm font-bold text-slate-500 hover:bg-slate-100">Cancel</button>
          </div>
        </Modal>
      )}

      {/* ═══ PASSWORD RESET RESULT ═══ */}
      {resetResult && (
        <Modal title="Password Reset" onClose={() => setResetResult(null)}>
          <div className="space-y-4">
            <p className="text-slate-600 text-sm">{resetResult.name}&apos;s password has been reset. Share the new password below with the student:</p>
            <div className="bg-slate-100 rounded-xl px-4 py-3 font-mono text-lg font-black text-slate-800 text-center tracking-widest">
              {resetResult.password}
            </div>
            <p className="text-xs text-amber-600 font-semibold">⚠ Copy this now — it won&apos;t be shown again.</p>
            <button onClick={() => setResetResult(null)} className="w-full bg-slate-900 text-white py-2.5 rounded-xl text-sm font-bold hover:bg-slate-700 transition-colors">
              Done
            </button>
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
