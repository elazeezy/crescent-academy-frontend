'use client';

import { useEffect, useRef, useState } from 'react';
import {
  Image as ImageIcon, Upload, Trash2, CheckCircle2, AlertCircle, RefreshCw, Globe,
  Film, PlayCircle, Loader2, X,
} from 'lucide-react';
import { GALLERY_CATEGORIES } from '@/lib/gallery';

// Fixed, singleton image slots used elsewhere on the public site (logo, hero, etc).
// The gallery below is a separate, uncapped collection — see GalleryManager.
const ZONES = [
  { id: 'school-logo',       name: 'School Logo',              desc: 'Used in navbar, report cards, and public pages',         group: 'Site' },
  { id: 'hero_1',            name: 'Hero Slide 1',             desc: 'Main hero carousel — first slide background',            group: 'Site' },
  { id: 'hero_2',            name: 'Hero Slide 2',             desc: 'Main hero carousel — second slide background',           group: 'Site' },
  { id: 'hero_3',            name: 'Hero Slide 3',             desc: 'Main hero carousel — third slide background',            group: 'Site' },
  { id: 'about_main',        name: 'About Page — Main',        desc: 'Featured image on the About page',                      group: 'Site' },
  { id: 'admissions_bg',     name: 'Admissions Page Image',    desc: 'Background/feature image on admissions page',           group: 'Site' },
  { id: 'announcement_1',    name: 'Announcement Banner 1',    desc: 'News page — featured announcement image',               group: 'Site' },
  { id: 'announcement_2',    name: 'Announcement Banner 2',    desc: 'News page — second announcement image',                 group: 'Site' },
];

interface ZoneImage {
  zoneId: string;
  url: string;
  publicId: string;
}

type StatusMap = Record<string, { type: 'success' | 'error' | 'loading'; text: string }>;

export default function WebsiteContentManager() {
  const [images, setImages]   = useState<Record<string, ZoneImage>>({});
  const [status, setStatus]   = useState<StatusMap>({});
  const [loading, setLoading] = useState(true);
  const fileRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const setZoneStatus = (zoneId: string, type: 'success' | 'error' | 'loading', text: string) => {
    setStatus(prev => ({ ...prev, [zoneId]: { type, text } }));
    if (type !== 'loading') {
      setTimeout(() => setStatus(prev => { const n = { ...prev }; delete n[zoneId]; return n; }), 4000);
    }
  };

  const fetchImages = async () => {
    setLoading(true);
    try {
      const res  = await fetch('/api/admin/site-images');
      const data = await res.json();
      const map: Record<string, ZoneImage> = {};
      for (const img of data.images ?? []) map[img.zoneId] = img;
      setImages(map);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchImages(); }, []);

  const handleUpload = async (zoneId: string, zoneName: string, file: File) => {
    setZoneStatus(zoneId, 'loading', 'Uploading…');
    const fd = new FormData();
    fd.append('file', file);
    fd.append('zoneId', zoneId);
    fd.append('zoneName', zoneName);
    try {
      const res  = await fetch('/api/admin/site-images', { method: 'POST', body: fd });
      const data = await res.json();
      if (res.ok) {
        setImages(prev => ({ ...prev, [zoneId]: data.image }));
        setZoneStatus(zoneId, 'success', 'Uploaded successfully');
      } else {
        setZoneStatus(zoneId, 'error', data.error || 'Upload failed');
      }
    } catch {
      setZoneStatus(zoneId, 'error', 'Network error');
    }
  };

  const handleDelete = async (zoneId: string) => {
    if (!confirm('Remove this image from the website?')) return;
    setZoneStatus(zoneId, 'loading', 'Removing…');
    try {
      const res = await fetch(`/api/admin/site-images/${zoneId}`, { method: 'DELETE' });
      if (res.ok) {
        setImages(prev => { const n = { ...prev }; delete n[zoneId]; return n; });
        setZoneStatus(zoneId, 'success', 'Image removed');
      } else {
        setZoneStatus(zoneId, 'error', 'Delete failed');
      }
    } catch {
      setZoneStatus(zoneId, 'error', 'Network error');
    }
  };

  const uploadedCount = Object.keys(images).length;

  return (
    <div className="space-y-10 max-w-6xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Website Content Manager</h1>
          <p className="text-slate-500 text-sm mt-1">
            Upload, replace or remove images shown on the public-facing website.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-sky-50 border border-sky-100 rounded-xl px-4 py-2">
            <Globe size={16} className="text-sky-500" />
            <span className="text-sm font-bold text-sky-700">{uploadedCount} / {ZONES.length} zones filled</span>
          </div>
          <button
            onClick={fetchImages}
            className="p-2.5 rounded-xl border border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition-all"
            title="Refresh"
          >
            <RefreshCw size={16} />
          </button>
        </div>
      </div>

      {loading ? (
        <div className="py-20 text-center text-slate-400 font-semibold">Loading image zones…</div>
      ) : (
        <div>
          <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4 border-b border-slate-100 pb-2">
            Site-wide Images
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {ZONES.map((zone) => {
              const img = images[zone.id];
              const st  = status[zone.id];
              const isLoading = st?.type === 'loading';
              return (
                <div
                  key={zone.id}
                  className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                >
                  {/* Image preview */}
                  <div className="relative h-44 bg-slate-100 flex items-center justify-center overflow-hidden">
                    {img?.url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={img.url} alt={zone.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="flex flex-col items-center gap-2 text-slate-400">
                        <ImageIcon size={32} />
                        <span className="text-xs font-medium">No image uploaded</span>
                      </div>
                    )}
                    {isLoading && (
                      <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
                        <RefreshCw size={24} className="text-sky-500 animate-spin" />
                      </div>
                    )}
                    {img?.url && !isLoading && (
                      <div className="absolute top-2 right-2 bg-emerald-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                        Live
                      </div>
                    )}
                  </div>

                  {/* Info + actions */}
                  <div className="p-4 space-y-3">
                    <div>
                      <p className="font-bold text-slate-800 text-sm">{zone.name}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{zone.desc}</p>
                    </div>
                    {st && st.type !== 'loading' && (
                      <div className={`flex items-center gap-2 text-xs font-semibold px-3 py-2 rounded-lg ${
                        st.type === 'success'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                          : 'bg-red-50 text-red-700 border border-red-100'
                      }`}>
                        {st.type === 'success' ? <CheckCircle2 size={13} /> : <AlertCircle size={13} />}
                        {st.text}
                      </div>
                    )}
                    <div className="flex gap-2">
                      <button
                        onClick={() => fileRefs.current[zone.id]?.click()}
                        disabled={isLoading}
                        className="flex-1 flex items-center justify-center gap-1.5 bg-sky-600 hover:bg-sky-500 disabled:opacity-50 text-white text-xs font-bold py-2 rounded-xl transition-all active:scale-95"
                      >
                        <Upload size={13} />
                        {img?.url ? 'Replace' : 'Upload'}
                      </button>
                      {img?.url && (
                        <button
                          onClick={() => handleDelete(zone.id)}
                          disabled={isLoading}
                          className="flex items-center justify-center gap-1.5 bg-red-50 hover:bg-red-100 disabled:opacity-50 text-red-600 text-xs font-bold py-2 px-3 rounded-xl border border-red-100 transition-all active:scale-95"
                        >
                          <Trash2 size={13} />
                        </button>
                      )}
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      ref={el => { fileRefs.current[zone.id] = el; }}
                      onChange={e => {
                        const file = e.target.files?.[0];
                        if (file) handleUpload(zone.id, zone.name, file);
                        e.target.value = '';
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <GalleryManager />
    </div>
  );
}

// ── Gallery Manager ─────────────────────────────────────────────────────────
// An uncapped photo/video collection for the public Gallery page — unlike the
// fixed zones above, admin can add as many items as they like, each with its
// own caption and category, no hardcoded slot limit.

interface GalleryItemRow {
  _id: string;
  type: 'image' | 'video';
  url: string;
  caption: string;
  category: string;
}

function GalleryManager() {
  const [items, setItems] = useState<GalleryItemRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [newCaption, setNewCaption] = useState('');
  const [newCategory, setNewCategory] = useState<string>(GALLERY_CATEGORIES[0]);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [uploadError, setUploadError] = useState('');
  const [savingId, setSavingId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/gallery');
      const data = await res.json();
      setItems(data.items ?? []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchItems(); }, []);

  const uploadToCloudinary = (file: File, params: { signature: string; timestamp: number; apiKey: string; cloudName: string; folder: string }) => {
    return new Promise<{ secure_url: string; public_id: string; resource_type: string }>((resolve, reject) => {
      const fd = new FormData();
      fd.append('file', file);
      fd.append('api_key', params.apiKey);
      fd.append('timestamp', String(params.timestamp));
      fd.append('signature', params.signature);
      fd.append('folder', params.folder);

      const xhr = new XMLHttpRequest();
      xhr.open('POST', `https://api.cloudinary.com/v1_1/${params.cloudName}/auto/upload`);
      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) setUploadProgress(Math.round((e.loaded / e.total) * 100));
      };
      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) resolve(JSON.parse(xhr.responseText));
        else reject(new Error('Cloudinary upload failed'));
      };
      xhr.onerror = () => reject(new Error('Network error during upload'));
      xhr.send(fd);
    });
  };

  const handleFileSelected = async (file: File) => {
    setUploadError('');
    setUploadProgress(0);
    try {
      const signRes = await fetch('/api/admin/gallery/sign', { method: 'POST' });
      const signData = await signRes.json();
      if (!signRes.ok) throw new Error(signData.error || 'Could not start upload');

      const uploaded = await uploadToCloudinary(file, signData);

      const saveRes = await fetch('/api/admin/gallery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: uploaded.secure_url,
          publicId: uploaded.public_id,
          type: uploaded.resource_type === 'video' ? 'video' : 'image',
          caption: newCaption,
          category: newCategory,
        }),
      });
      const saveData = await saveRes.json();
      if (!saveRes.ok) throw new Error(saveData.error || 'Could not save item');

      setItems((prev) => [saveData.item, ...prev]);
      setNewCaption('');
    } catch (err: any) {
      setUploadError(err.message || 'Upload failed');
    } finally {
      setUploadProgress(null);
    }
  };

  const updateItem = async (id: string, patch: Partial<Pick<GalleryItemRow, 'caption' | 'category'>>) => {
    setSavingId(id);
    try {
      const res = await fetch(`/api/admin/gallery/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(patch),
      });
      if (res.ok) {
        setItems((prev) => prev.map((it) => (it._id === id ? { ...it, ...patch } : it)));
      }
    } finally {
      setSavingId(null);
    }
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/gallery/${deleteId}`, { method: 'DELETE' });
      if (res.ok) setItems((prev) => prev.filter((it) => it._id !== deleteId));
    } finally {
      setDeleting(false);
      setDeleteId(null);
    }
  };

  const uploading = uploadProgress !== null;

  return (
    <div>
      <div className="flex items-center justify-between gap-4 flex-wrap mb-4 border-b border-slate-100 pb-2">
        <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400">Gallery — Photos &amp; Videos</h2>
        <span className="text-xs font-bold text-slate-500">{items.length} item{items.length !== 1 ? 's' : ''} — add as many as you like, no fixed limit</span>
      </div>

      {/* Add new */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm mb-6 flex flex-wrap items-end gap-4">
        <div className="flex-1 min-w-[180px]">
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Caption</label>
          <input
            value={newCaption}
            onChange={(e) => setNewCaption(e.target.value)}
            placeholder="e.g. Inter-house Sports Day 2026"
            className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400/30 focus:border-sky-400"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Category</label>
          <select
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            className="border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400/30 focus:border-sky-400"
          >
            {GALLERY_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="flex items-center gap-2 bg-sky-600 hover:bg-sky-500 disabled:opacity-50 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all active:scale-95"
        >
          {uploading ? <Loader2 size={15} className="animate-spin" /> : <Upload size={15} />}
          {uploading ? `Uploading… ${uploadProgress}%` : 'Add Photo or Video'}
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,video/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFileSelected(file);
            e.target.value = '';
          }}
        />
        {uploadError && (
          <p className="w-full text-red-500 text-xs font-semibold flex items-center gap-1.5"><AlertCircle size={13} />{uploadError}</p>
        )}
      </div>

      {loading ? (
        <div className="py-16 text-center text-slate-400 font-semibold">Loading gallery…</div>
      ) : items.length === 0 ? (
        <div className="py-16 text-center rounded-2xl border border-dashed border-slate-200 bg-slate-50 text-slate-400 font-semibold">
          No photos or videos yet — add the first one above.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map((item) => (
            <div key={item._id} className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <div className="relative h-40 bg-slate-100 overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.type === 'video' ? item.url.replace(/\.\w+$/, '.jpg') : item.url}
                  alt={item.caption || 'Gallery item'}
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-2 left-2 flex items-center gap-1 bg-black/60 text-white text-[10px] font-bold px-2 py-1 rounded-full">
                  {item.type === 'video' ? <><Film size={11} /> Video</> : <><ImageIcon size={11} /> Photo</>}
                </span>
                {item.type === 'video' && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <PlayCircle size={32} className="text-white/85" />
                  </div>
                )}
                <button
                  onClick={() => setDeleteId(item._id)}
                  className="absolute top-2 right-2 w-7 h-7 rounded-lg bg-red-500/90 hover:bg-red-600 text-white flex items-center justify-center transition-colors"
                  title="Delete"
                >
                  <Trash2 size={13} />
                </button>
              </div>
              <div className="p-3 space-y-2">
                <input
                  defaultValue={item.caption}
                  placeholder="Add a caption…"
                  onBlur={(e) => { if (e.target.value !== item.caption) updateItem(item._id, { caption: e.target.value }); }}
                  className="w-full text-sm border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-sky-400/30 focus:border-sky-400"
                />
                <div className="flex items-center gap-2">
                  <select
                    value={item.category}
                    onChange={(e) => updateItem(item._id, { category: e.target.value })}
                    className="flex-1 text-xs border border-slate-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-sky-400/30 focus:border-sky-400"
                  >
                    {GALLERY_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                  {savingId === item._id && <Loader2 size={13} className="animate-spin text-sky-500 shrink-0" />}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete confirm modal */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-bold text-slate-900">Delete this item?</h3>
              <button onClick={() => setDeleteId(null)} className="text-slate-400 hover:text-slate-600"><X size={18} /></button>
            </div>
            <p className="text-slate-500 text-sm mb-4">This permanently removes it from the gallery and from Cloudinary.</p>
            <div className="flex gap-3">
              <button
                onClick={confirmDelete}
                disabled={deleting}
                className="flex-1 flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white py-2.5 rounded-xl text-sm font-bold disabled:opacity-40"
              >
                {deleting ? <Loader2 size={15} className="animate-spin" /> : <Trash2 size={15} />} Delete
              </button>
              <button onClick={() => setDeleteId(null)} className="px-5 py-2.5 rounded-xl text-sm font-bold text-slate-500 hover:bg-slate-100">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
