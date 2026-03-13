'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Lock, Mail, ChevronRight } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });

      if (result?.error) {
        setError('Invalid credentials. Please verify your account.');
        setIsLoading(false);
        return;
      }

      const sessionResponse = await fetch('/api/auth/session');
      const session = await sessionResponse.json();

      const rolePaths: Record<string, string> = {
        admin: '/portals/dashboard/admin',
        teacher: '/portals/dashboard/teacher',
        student: '/portals/dashboard/student',
      };

      window.location.href = rolePaths[session?.user?.role] || '/';
    } catch (err) {
      setError('Connection failed. Please check your network.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#020617] p-4 relative overflow-hidden">
      {/* Dynamic Background Mesh */}
      <div className="absolute inset-0 z-0">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-sky-500/10 rounded-full blur-[120px]" />
        <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] bg-emerald-500/10 rounded-full blur-[120px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="bg-[#0f172a]/60 backdrop-blur-2xl border border-white/10 p-8 md:p-10 rounded-[2.5rem] shadow-[0_0_50px_-12px_rgba(0,0,0,0.5)]">
          
          <div className="text-center mb-10">
            <div className="w-20 h-20 mx-auto bg-gradient-to-tr from-sky-600 to-emerald-500 rounded-3xl flex items-center justify-center mb-6 shadow-xl shadow-sky-900/20">
              <img src="/logo.png" alt="Logo" className="w-12 h-12 object-contain" />
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight">Welcome Back</h1>
            <p className="text-slate-400 text-sm mt-2">Sign in to your academic portal</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-sky-400 transition-colors" size={18} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-slate-600 focus:bg-white/10 focus:border-sky-500/50 outline-none transition-all"
                placeholder="Email address"
                required
              />
            </div>

            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-sky-400 transition-colors" size={18} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-slate-600 focus:bg-white/10 focus:border-sky-500/50 outline-none transition-all"
                placeholder="Password"
                required
              />
            </div>

            <AnimatePresence>
              {error && (
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-red-400 text-xs font-bold text-center">
                  {error}
                </motion.p>
              )}
            </AnimatePresence>

            <button
              disabled={isLoading}
              className="w-full bg-white hover:bg-slate-200 text-slate-900 font-black py-4 rounded-2xl transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              {isLoading ? <Loader2 className="animate-spin" size={20} /> : "Sign In"}
              {!isLoading && <ChevronRight size={20} />}
            </button>
          </form>

          <p className="text-center text-slate-500 mt-8 text-xs font-medium">
            Forgot password? <a href="/reset-password" className="text-sky-400 hover:text-sky-300 underline underline-offset-4">Reset here</a>
          </p>
        </div>
      </motion.div>
    </div>
  );
}