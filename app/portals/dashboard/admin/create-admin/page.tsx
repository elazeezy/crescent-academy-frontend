'use client';

import { useState } from 'react';
import { ArrowLeft, ShieldPlus, CheckCircle, Loader2, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';

const ROLES = [
  { value: 'admin', label: 'Admin', desc: 'Full access to manage students, staff, and results' },
  { value: 'principal', label: 'Principal', desc: 'Can add principal comments to all result sheets' },
];

export default function CreateAdminPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'admin' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError(''); setSuccess('');

    try {
      const res = await fetch('/api/admin/create-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: form.role, name: form.name, email: form.email, password: form.password }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? 'Failed to create account'); return; }
      setSuccess(`${form.role === 'admin' ? 'Admin' : 'Principal'} account created for ${form.name}.`);
      setForm({ name: '', email: '', password: '', role: 'admin' });
    } finally {
      setLoading(false);
    }
  };

  const inputCls = "w-full text-sm border border-slate-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-purple-400/30 focus:border-purple-400 bg-white";
  const labelCls = "block text-xs font-bold text-slate-500 mb-1.5";

  return (
    <div className="max-w-xl space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link href="/portals/dashboard/admin" className="text-slate-400 hover:text-slate-600 transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Create Admin Account</h1>
          <p className="text-slate-500 text-sm">Create a new admin or principal portal account.</p>
        </div>
      </div>

      {/* Role selector */}
      <div className="grid grid-cols-2 gap-3">
        {ROLES.map((r) => (
          <button
            key={r.value}
            type="button"
            onClick={() => setForm({ ...form, role: r.value })}
            className={`p-4 rounded-2xl border-2 text-left transition-all ${
              form.role === r.value
                ? 'border-purple-500 bg-purple-50'
                : 'border-slate-200 bg-white hover:border-purple-300'
            }`}
          >
            <div className="flex items-center gap-2 mb-1">
              <ShieldPlus size={16} className={form.role === r.value ? 'text-purple-600' : 'text-slate-400'} />
              <span className={`font-bold text-sm ${form.role === r.value ? 'text-purple-700' : 'text-slate-700'}`}>{r.label}</span>
            </div>
            <p className="text-xs text-slate-500 leading-snug">{r.desc}</p>
          </button>
        ))}
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
        <div>
          <label className={labelCls}>Full Name *</label>
          <input
            className={inputCls}
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="e.g. Mrs. Aisha Bello"
            required
          />
        </div>

        <div>
          <label className={labelCls}>Email Address *</label>
          <input
            className={inputCls}
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="e.g. bello@crescent.edu.ng"
            required
          />
        </div>

        <div>
          <label className={labelCls}>Password (leave blank to use default: Crescent123)</label>
          <div className="relative">
            <input
              className={inputCls}
              type={showPassword ? 'text' : 'password'}
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="Set a strong password…"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm font-semibold">
            {error}
          </div>
        )}

        {success && (
          <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 rounded-xl px-4 py-3 text-sm font-semibold">
            <CheckCircle size={16} /> {success}
          </div>
        )}

        <button
          type="submit"
          disabled={loading || !form.name || !form.email}
          className="w-full flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-xl font-bold text-sm transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {loading ? <Loader2 size={16} className="animate-spin" /> : <ShieldPlus size={16} />}
          {loading ? 'Creating…' : `Create ${form.role === 'admin' ? 'Admin' : 'Principal'} Account`}
        </button>
      </form>

      {/* Info box */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-xs text-amber-700 leading-relaxed">
        <p className="font-bold mb-1">Important</p>
        <ul className="space-y-1 list-disc list-inside">
          <li>Admin accounts have full portal access — only create for trusted staff.</li>
          <li>The new account can log in immediately at <span className="font-mono font-bold">/login</span>.</li>
          <li>Share the password securely — it is not emailed automatically.</li>
        </ul>
      </div>
    </div>
  );
}
