// app/portals/dashboard/layout.tsx
import { auth } from "../../../auth"; // Go up 3 levels to reach root auth.ts
import { redirect } from "next/navigation";
import Sidebar from "../../../components/Sidebar"; // Go up 3 levels to reach components

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  // If not logged in, force them to the login page
  if (!session) redirect("/login");

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar user={session.user} />
      <div className="flex-1 flex flex-col">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8">
          <div className="font-semibold text-slate-700 uppercase">
             Crescent Academy | {session.user.role}
          </div>
          {/* User profile section here */}
        </header>
        <main className="p-8">
          {children}
        </main>
      </div>
    </div>
  );
}