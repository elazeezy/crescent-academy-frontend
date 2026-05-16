'use client';

import { useState, useEffect } from 'react';
import {
  FileText, FileImage, File, Download, BookOpen, Loader2, Search, X,
} from 'lucide-react';

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
    return <FileImage size={20} className="text-sky-400" />;
  if (type === 'pdf')
    return <FileText size={20} className="text-red-400" />;
  return <File size={20} className="text-slate-400" />;
}

const TIMETABLE: Record<string, string[]> = {
  Monday:    ['English Language', 'Mathematics', 'Basic Science', 'Qur\'an', 'Physical & Health Education'],
  Tuesday:   ['Social Studies', 'Basic Technology', 'Creative Arts', 'Islamic Religious Knowledge (IRK)', 'English Language'],
  Wednesday: ['Mathematics', 'Agricultural Science / Home Economics', 'Yoruba Language', 'Business Studies', 'Qur\'an'],
  Thursday:  ['Basic Science', 'English Language', 'Mathematics', 'Creative Arts', 'Social Studies'],
  Friday:    ['Islamic Religious Knowledge (IRK)', 'Physical & Health Education', 'Yoruba Language', 'Business Studies', 'Mathematics'],
};

const PERIODS = ['8:00–9:00', '9:00–10:00', '10:30–11:30', '11:30–12:30', '1:30–2:30'];

export default function StudentMaterialsPage() {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading,   setLoading]   = useState(true);
  const [search,    setSearch]    = useState('');
  const [tab,       setTab]       = useState<'materials' | 'timetable'>('materials');

  useEffect(() => {
    fetch('/api/student/materials')
      .then(r => r.json())
      .then(data => setMaterials(data.materials ?? []))
      .finally(() => setLoading(false));
  }, []);

  const filtered = materials.filter(m =>
    !search ||
    m.title.toLowerCase().includes(search.toLowerCase()) ||
    m.subject.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8 pb-16">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-white">Learning Hub</h1>
        <p className="text-slate-400 text-sm mt-1">Access your class materials and weekly timetable.</p>
      </div>

      {/* Tab switcher */}
      <div className="flex gap-2 bg-white/5 p-1 rounded-xl border border-white/8 w-fit">
        {(['materials', 'timetable'] as const).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-5 py-2 rounded-lg text-sm font-bold transition-all capitalize ${
              tab === t
                ? 'bg-sky-600 text-white shadow-lg shadow-sky-900/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {t === 'materials' ? 'Learning Materials' : 'Timetable'}
          </button>
        ))}
      </div>

      {/* ── MATERIALS TAB ── */}
      {tab === 'materials' && (
        <>
          {/* Search */}
          <div className="relative max-w-sm">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by title or subject…"
              className="w-full pl-10 pr-10 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-sky-500/30"
            />
            {search && (
              <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white">
                <X size={14} />
              </button>
            )}
          </div>

          {loading ? (
            <div className="py-24 flex items-center justify-center gap-2 text-slate-400">
              <Loader2 size={20} className="animate-spin" /> Loading materials…
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-24 text-center rounded-[2rem] border border-dashed border-white/10">
              <BookOpen size={40} className="text-slate-600 mx-auto mb-4" />
              <p className="text-slate-400 font-semibold">
                {search ? 'No materials match your search.' : 'No materials uploaded yet.'}
              </p>
              <p className="text-slate-600 text-sm mt-1">Your teacher will upload resources here soon.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {filtered.map(mat => (
                <div
                  key={mat._id}
                  className="group bg-white/[0.03] border border-white/[0.07] rounded-[1.5rem] p-5 hover:border-sky-500/20 transition-all"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-11 h-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                      <FileIcon type={mat.fileType} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-white text-sm leading-snug">{mat.title}</p>
                      <p className="text-xs text-sky-400/70 mt-0.5 font-medium">{mat.subject}</p>
                    </div>
                  </div>

                  {mat.description && (
                    <p className="text-xs text-slate-500 mt-3 leading-relaxed line-clamp-2">{mat.description}</p>
                  )}

                  <div className="mt-3 flex flex-wrap gap-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-sky-500/10 text-sky-400 border border-sky-500/20">
                      {mat.targetClass}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-white/5 text-slate-500 border border-white/10 uppercase">
                      {mat.fileType}
                    </span>
                  </div>

                  <a
                    href={mat.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    download
                    className="mt-4 flex items-center justify-center gap-2 bg-sky-600/80 hover:bg-sky-500 text-white py-2.5 rounded-xl font-bold text-xs transition-all w-full"
                  >
                    <Download size={14} /> Download
                  </a>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* ── TIMETABLE TAB ── */}
      {tab === 'timetable' && (
        <div className="overflow-x-auto rounded-[1.5rem] border border-white/[0.07] bg-white/[0.02]">
          <table className="w-full text-sm min-w-[600px]">
            <thead>
              <tr className="border-b border-white/10">
                <th className="py-4 px-4 text-left text-xs text-slate-500 font-bold uppercase tracking-wider w-28">Period</th>
                {Object.keys(TIMETABLE).map(day => (
                  <th key={day} className="py-4 px-3 text-left text-xs text-sky-400 font-bold uppercase tracking-wider">{day}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {PERIODS.map((period, i) => (
                <tr key={period} className="border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors">
                  <td className="py-3 px-4 text-xs text-slate-500 font-mono font-semibold whitespace-nowrap">{period}</td>
                  {Object.values(TIMETABLE).map((subjects, di) => (
                    <td key={di} className="py-3 px-3">
                      <span className="block text-xs font-semibold text-slate-300 leading-snug">
                        {subjects[i] ?? '—'}
                      </span>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>

          <div className="px-5 py-3 border-t border-white/5">
            <p className="text-[10px] text-slate-600 font-medium">
              * Break: 10:00–10:30 · Lunch: 12:30–1:30 · This is a general timetable; your teacher may adjust periods.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
