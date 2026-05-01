import { auth } from "../../../auth";
import { redirect } from "next/navigation";
import Sidebar from "../../../components/Sidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session) redirect("/login");

  const role = session.user.role;

  // Teacher and student portals have their own full-screen layouts
  if (role === 'teacher' || role === 'student') {
    return <>{children}</>;
  }

  // Admin / principal get the classic sidebar layout
  return (
    <div className="flex min-h-screen bg-slate-950">
      <Sidebar user={session.user} />
      <div className="flex-1 flex flex-col">
        <header className="h-16 bg-slate-900 border-b border-white/5 flex items-center justify-between px-8">
          <div className="font-semibold text-slate-400 uppercase text-sm tracking-widest">
            Crescent Academy &nbsp;|&nbsp; {role}
          </div>
        </header>
        <main className="p-8 flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}
