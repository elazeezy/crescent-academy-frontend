'use client';

import { useEffect, useRef, useState } from 'react';
import { Image as ImageIcon, Upload, Trash2, CheckCircle2, AlertCircle, RefreshCw, Globe } from 'lucide-react';

// All image zones on the public website
const ZONES = [
  { id: 'hero_1',         name: 'Hero Slide 1',           desc: 'Main hero carousel — first slide background' },
  { id: 'hero_2',         name: 'Hero Slide 2',           desc: 'Main hero carousel — second slide background' },
  { id: 'hero_3',         name: 'Hero Slide 3',           desc: 'Main hero carousel — third slide background' },
  { id: 'about_main',     name: 'About Page — Main',      desc: 'Featured image on the About page' },
  { id: 'gallery_1',      name: 'Gallery Image 1',        desc: 'Gallery page — slot 1' },
  { id: 'gallery_2',      name: 'Gallery Image 2',        desc: 'Gallery page — slot 2' },
  { id: 'gallery_3',      name: 'Gallery Image 3',        desc: 'Gallery page — slot 3' },
  { id: 'gallery_4',      name: 'Gallery Image 4',        desc: 'Gallery page — slot 4' },
  { id: 'gallery_5',      name: 'Gallery Image 5',        desc: 'Gallery page — slot 5' },
  { id: 'gallery_6',      name: 'Gallery Image 6',        desc: 'Gallery page — slot 6' },
  { id: 'principal_photo',name: 'Principal Photo',        desc: 'Leadership page — principal portrait' },
  { id: 'staff_1',        name: 'Staff Photo 1',          desc: 'Leadership page — staff slot 1' },
  { id: 'staff_2',        name: 'Staff Photo 2',          desc: 'Leadership page — staff slot 2' },
  { id: 'staff_3',        name: 'Staff Photo 3',          desc: 'Leadership page — staff slot 3' },
  { id: 'announcement_1', name: 'Announcement Banner 1',  desc: 'News page — featured announcement image' },
  { id: 'announcement_2', name: 'Announcement Banner 2',  desc: 'News page — second announcement image' },
  { id: 'school_logo',    name: 'School Logo',            desc: 'Used in navbar, report cards, and public pages' },
  { id: 'admissions_bg',  name: 'Admissions Page Image',  desc: 'Background/feature image on admissions page' },
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
    <div className="space-y-8 max-w-6xl">
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {ZONES.map((zone) => {
            const img     = images[zone.id];
            const st      = status[zone.id];
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
                    <img
                      src={img.url}
                      alt={zone.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex flex-col items-center gap-2 text-slate-400">
                      <ImageIcon size={32} />
                      <span className="text-xs font-medium">No image uploaded</span>
                    </div>
                  )}

                  {/* Loading overlay */}
                  {isLoading && (
                    <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
                      <RefreshCw size={24} className="text-sky-500 animate-spin" />
                    </div>
                  )}

                  {/* Uploaded badge */}
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

                  {/* Status message */}
                  {st && st.type !== 'loading' && (
                    <div className={`flex items-center gap-2 text-xs font-semibold px-3 py-2 rounded-lg ${
                      st.type === 'success'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                        : 'bg-red-50 text-red-700 border border-red-100'
                    }`}>
                      {st.type === 'success'
                        ? <CheckCircle2 size={13} />
                        : <AlertCircle  size={13} />}
                      {st.text}
                    </div>
                  )}

                  {/* Action buttons */}
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

                  {/* Hidden file input */}
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
      )}
    </div>
  );
}
