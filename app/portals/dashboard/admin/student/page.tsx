"use client";
import { useState } from "react";
import * as XLSX from "xlsx";
import { Upload, FileSpreadsheet, CheckCircle, AlertCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function StudentUpload() {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error', msg: string } | null>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    const reader = new FileReader();

    reader.onload = async (evt) => {
      try {
        const bstr = evt.target?.result;
        const wb = XLSX.read(bstr, { type: "binary" });
        const wsname = wb.SheetNames[0];
        const data = XLSX.utils.sheet_to_json(wb.Sheets[wsname]);

        const response = await fetch("/api/admin/upload-students", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ students: data }),
        });

        if (response.ok) {
          setStatus({ type: 'success', msg: `Successfully registered ${data.length} students!` });
        } else {
          throw new Error("Upload failed");
        }
      } catch (err) {
        setStatus({ type: 'error', msg: "Check your Excel format and try again." });
      } finally {
        setLoading(false);
      }
    };
    reader.readAsBinaryString(file);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 p-4">
      <Link href="/portals/dashboard/admin" className="flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-colors mb-4">
        <ArrowLeft size={18} /> Back to Dashboard
      </Link>

      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
        <h1 className="text-2xl font-bold text-[#1E3A8A]">Bulk Student Management</h1>
        <p className="text-slate-500 mb-8">Onboard your students to the Crescent Portal system.</p>

        <div className="border-2 border-dashed border-slate-200 rounded-xl p-16 flex flex-col items-center justify-center bg-slate-50 hover:bg-blue-50 hover:border-blue-300 transition-all cursor-pointer relative">
          <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} className="absolute inset-0 opacity-0 cursor-pointer" disabled={loading} />
          <div className="w-20 h-20 bg-blue-100 text-[#0EA5E9] rounded-full flex items-center justify-center mb-6 shadow-inner">
            {loading ? <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div> : <Upload size={40} />}
          </div>
          <p className="font-bold text-slate-700 text-lg text-center leading-tight">Click to select Excel File <br/> <span className="text-sm font-normal text-slate-400">or drag and drop here</span></p>
        </div>

        {status && (
          <div className={`mt-8 p-4 rounded-xl flex items-center gap-4 animate-in fade-in slide-in-from-top-4 ${status.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
            {status.type === 'success' ? <CheckCircle className="text-green-600" size={24} /> : <AlertCircle className="text-red-600" size={24} />}
            <span className="font-medium">{status.msg}</span>
          </div>
        )}
      </div>

      <div className="bg-[#1E3A8A] text-white p-8 rounded-2xl shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10">
           <FileSpreadsheet size={120} />
        </div>
        <h3 className="font-bold text-xl mb-4 flex items-center gap-2">
          Required Excel Structure
        </h3>
        <ul className="space-y-3 text-blue-100 text-sm">
          <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-sky-400 rounded-full"/> <strong>firstName</strong>: Student's first name</li>
          <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-sky-400 rounded-full"/> <strong>lastName</strong>: Student's surname</li>
          <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-sky-400 rounded-full"/> <strong>class</strong>: e.g., JSS1, Grade 10A</li>
          <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-sky-400 rounded-full"/> <strong>gender</strong>: Male or Female</li>
        </ul>
      </div>
    </div>
  );
}