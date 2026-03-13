'use client';

import { useState } from 'react';
import * as XLSX from 'xlsx';
import { UserPlus, Upload, FileSpreadsheet, CheckCircle } from 'lucide-react';

export default function AdminTeacherUpload() {
  const [isLoading, setIsLoading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<{added: number, skipped: number} | null>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    const reader = new FileReader();

    reader.onload = async (evt) => {
      try {
        const bstr = evt.target?.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        const ws = wb.Sheets[wb.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(ws);

        // Sending to the specific Staff endpoint we built
        const res = await fetch('/api/admin/upload-staff', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ staffList: jsonData })
        });
        
        const result = await res.json();
        if (result.success) {
          setUploadStatus({ added: result.added, skipped: result.skipped });
        } else {
          alert(`Error: ${result.error}`);
        }
      } catch (error) {
        console.error("Upload failed", error);
        alert("Check Excel format: Columns must be 'name', 'email', 'assignedClass'");
      } finally {
        setIsLoading(false);
      }
    };
    reader.readAsBinaryString(file);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <div className="p-3 bg-sky-500/20 rounded-2xl">
          <UserPlus className="text-sky-400" size={32} />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-white">Staff Management</h1>
          <p className="text-sky-200/70">Bulk upload teachers and assign classroom authority.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Upload Card */}
        <div className="glass-card p-8 md:col-span-2 border-2 border-dashed border-white/10 hover:border-sky-500/50 transition-colors text-center">
          <Upload className="mx-auto text-sky-400 mb-4" size={48} />
          <h3 className="text-xl font-semibold text-white mb-2">Upload Staff Excel</h3>
          <p className="text-sm text-sky-100/60 mb-6">Required columns: name, email, assignedClass</p>
          
          <input 
            type="file" 
            id="staff-upload"
            hidden
            onChange={handleFileUpload}
            disabled={isLoading}
          />
          <label 
            htmlFor="staff-upload"
            className="cursor-pointer bg-sky-600 hover:bg-sky-500 text-white px-8 py-3 rounded-xl font-bold transition inline-block"
          >
            {isLoading ? "Processing Staff..." : "Select Excel File"}
          </label>
        </div>

        {/* Status Card */}
        <div className="glass-card p-8 flex flex-col justify-center items-center text-center">
          {uploadStatus ? (
            <div className="animate-in fade-in zoom-in duration-500">
              <CheckCircle className="text-green-400 mb-4 mx-auto" size={40} />
              <p className="text-2xl font-bold text-white">{uploadStatus.added}</p>
              <p className="text-sky-200/60">Teachers Added</p>
              <p className="mt-2 text-xs text-yellow-400">{uploadStatus.skipped} Duplicates Skipped</p>
            </div>
          ) : (
            <div className="opacity-40">
              <FileSpreadsheet size={40} className="mx-auto mb-4" />
              <p>No recent uploads</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}