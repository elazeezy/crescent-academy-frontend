'use client';

import { useId, useState } from 'react';
import { UploadCloud, Camera, Loader2, AlertCircle } from 'lucide-react';

interface QuestionUploadProps {
  onExtracted: (text: string) => void;
  theme?: 'dark' | 'light';
}

// Pulls raw text out of a Word doc or a photo of printed questions and hands it
// back to the caller to drop into the bulk-paste box — staff then mark the
// correct option with a leading "*" themselves, same as manual paste.
export default function QuestionUpload({ onExtracted, theme = 'light' }: QuestionUploadProps) {
  const [busy, setBusy] = useState(false);
  const [stage, setStage] = useState('');
  const [error, setError] = useState('');
  const fileInputId = useId();
  const cameraInputId = useId();
  const isDark = theme === 'dark';

  const extractFromDocx = async (file: File) => {
    setStage('Reading Word document…');
    const mammoth = await import('mammoth');
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    return result.value.trim();
  };

  const extractFromImage = async (file: File) => {
    setStage('Scanning photo for text… this can take a moment');
    const { createWorker } = await import('tesseract.js');
    const worker = await createWorker('eng');
    try {
      const { data } = await worker.recognize(file);
      return data.text.trim();
    } finally {
      await worker.terminate();
    }
  };

  const handleFile = async (file: File | undefined) => {
    if (!file) return;
    setError('');
    setBusy(true);
    try {
      const isDocx = file.name.toLowerCase().endsWith('.docx') ||
        file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
      const isImage = file.type.startsWith('image/');

      let text = '';
      if (isDocx) text = await extractFromDocx(file);
      else if (isImage) text = await extractFromImage(file);
      else { setError('Please upload a .docx Word document or a photo (JPG/PNG) of the questions.'); return; }

      if (!text) { setError('No readable text was found in that file.'); return; }
      onExtracted(text);
    } catch {
      setError('Could not read that file. Try a clearer photo, or a plain .docx file.');
    } finally {
      setBusy(false);
      setStage('');
    }
  };

  const btnCls = `flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold cursor-pointer transition-colors ${
    busy ? 'opacity-50 pointer-events-none' : ''
  } ${
    isDark
      ? 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10'
      : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200'
  }`;

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center gap-3">
        <label htmlFor={fileInputId} className={btnCls}>
          <UploadCloud size={15} /> Upload Word Doc / Photo
        </label>
        <input
          id={fileInputId}
          type="file"
          accept=".docx,image/*"
          className="hidden"
          disabled={busy}
          onChange={(e) => { handleFile(e.target.files?.[0]); e.target.value = ''; }}
        />

        <label htmlFor={cameraInputId} className={btnCls}>
          <Camera size={15} /> Snap a Photo
        </label>
        <input
          id={cameraInputId}
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          disabled={busy}
          onChange={(e) => { handleFile(e.target.files?.[0]); e.target.value = ''; }}
        />

        {busy && (
          <span className={`flex items-center gap-2 text-sm font-semibold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            <Loader2 size={15} className="animate-spin" /> {stage}
          </span>
        )}
      </div>

      {error && (
        <p className="text-red-500 text-xs font-semibold flex items-center gap-1.5"><AlertCircle size={13} />{error}</p>
      )}

      <p className={`text-[11px] ${isDark ? 'text-slate-600' : 'text-slate-400'}`}>
        Extracted text lands in the box below exactly as read — clean it up, then mark each question&apos;s correct option with a leading <span className="font-mono">*</span> before previewing.
      </p>
    </div>
  );
}
