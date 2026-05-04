import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import Sidebar from '@/components/Sidebar';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user || session.user.role !== 'admin') redirect('/login');

  return (
    <div className="flex min-h-screen bg-slate-950 text-white">
      <Sidebar user={session.user} />

      {/* Mobile top bar — Sidebar is hidden md:hidden on mobile */}
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        <header className="md:hidden h-14 bg-slate-900 border-b border-white/5 flex items-center px-4 shrink-0">
          <span className="font-bold text-slate-300 text-sm tracking-widest uppercase">
            Crescent Academy · Admin
          </span>
        </header>
        <main className="flex-1 overflow-y-auto p-5 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
