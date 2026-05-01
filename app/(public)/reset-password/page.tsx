import Link from 'next/link';
import { Mail, ArrowLeft } from 'lucide-react';

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#020617] p-4">
      <div className="w-full max-w-md bg-[#0f172a]/60 backdrop-blur-2xl border border-white/10 p-8 md:p-10 rounded-[2.5rem] shadow-xl text-center">
        <div className="w-16 h-16 mx-auto bg-sky-500/20 border border-sky-500/30 rounded-2xl flex items-center justify-center mb-6">
          <Mail className="text-sky-400" size={28} />
        </div>

        <h1 className="text-2xl font-black text-white tracking-tight">Reset Password</h1>
        <p className="text-slate-400 text-sm mt-3 leading-relaxed">
          Password resets are handled by your school administrator.
          <br />
          Please contact the admin office and they will reset your password for you.
        </p>

        <div className="mt-8 p-4 bg-white/5 rounded-2xl border border-white/10 text-left space-y-1">
          <p className="text-xs font-bold text-white/50 uppercase tracking-widest">Admin Contact</p>
          <p className="text-white font-semibold text-sm">The Crescent Academy</p>
          <p className="text-slate-400 text-sm">admin@crescent.edu.ng</p>
        </div>

        <Link
          href="/login"
          className="mt-8 flex items-center justify-center gap-2 text-sky-400 hover:text-sky-300 text-sm font-semibold transition-colors"
        >
          <ArrowLeft size={16} />
          Back to Login
        </Link>
      </div>
    </div>
  );
}
