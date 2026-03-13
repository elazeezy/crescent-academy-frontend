'use client';

export default function PrintButton() {
  return (
    <button 
      onClick={() => window.print()} 
      className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-2xl font-bold transition-all shadow-lg"
    >
      Download / Print PDF
    </button>
  );
}