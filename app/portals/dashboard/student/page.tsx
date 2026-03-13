// app/portals/dashboard/student/page.tsx
import { auth } from "@/auth";
import dbConnect from "@/lib/dbConnect";
import Student from "@/models/Student";
import Result from "@/models/Result";
import { Bell, Download, TrendingUp, Award, BookOpen, Calendar, ChevronRight, FileText } from 'lucide-react';
import { redirect } from "next/navigation";
import Link from "next/link";
import DashboardAnimations from "@/components/DashboardAnimations"; 

export default async function StudentDashboard() {
  await dbConnect();
  const session = await auth();

  // Fixes: 'session' is possibly 'null' error
  if (!session || !session.user || session.user.role !== "student") {
    redirect("/login");
  }

  // Use unique variable names to fix 'Cannot redeclare' errors
  const activeProfile = await Student.findOne({ user: session.user.id });
  
  // Data Matching: Query by ID or Reg No (15) from the report card
  const activeResult = await Result.findOne({ 
    $or: [
      { student: session.user.id },
      { registrationNumber: activeProfile?.studentId }, // Matches "Reg. No 15"
      { studentName: session.user.name }
    ]
  }).sort({ createdAt: -1 });

  const gpaValue = activeResult?.gpa || 0;
  const attendanceRate = activeProfile?.attendancePercentage || "98.3%"; // Based on 122/124 days

  return (
    <DashboardAnimations>
      <div className="space-y-8 pb-12">
        {/* HERO SECTION */}
        <section className="glass-card p-8 md:p-12 relative overflow-hidden group">
          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="flex flex-col md:flex-row items-center gap-8 text-center md:text-left">
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-[2.5rem] overflow-hidden border-4 border-white/10 shadow-2xl">
                <img
                  src={activeProfile?.passportUrl || "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400"}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter">
                  {session.user.name}
                </h1>
                <div className="flex gap-3 mt-4">
                  <span className="px-4 py-1.5 bg-sky-500/20 text-sky-300 rounded-lg text-xs font-bold border border-sky-500/30">
                    REG: {activeProfile?.studentId || "15"}
                  </span>
                  <span className="px-4 py-1.5 bg-white/5 text-white/70 rounded-lg text-xs font-bold border border-white/10">
                    {activeProfile?.currentClass || "JS III"}
                  </span>
                </div>
              </div>
            </div>

            <Link href="/portals/dashboard/student/results" className="px-8 py-5 bg-white text-slate-950 rounded-2xl font-black flex items-center gap-3 transition-all hover:scale-105">
              <FileText size={22} />
              VIEW FULL REPORT
              <ChevronRight size={18} />
            </Link>
          </div>
        </section>

        {/* ANALYTICS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard label="GPA" value={gpaValue.toFixed(2)} subtext="Excellent" color="text-emerald-400" />
          <StatCard label="Attendance" value={attendanceRate} subtext="122/124 Days" color="text-amber-400" />
          <StatCard label="Position" value={activeResult?.position || "1st"} subtext="Class Rank" color="text-purple-400" />
          <StatCard label="Term" value={activeResult?.term || "1st"} subtext="2025/2026" color="text-sky-400" />
        </div>
      </div>
    </DashboardAnimations>
  );
}

function StatCard({ label, value, subtext, color }: any) {
  return (
    <div className="glass-card p-6 border-b-4 border-white/5 hover:border-sky-500 transition-colors">
      <p className="text-xs font-bold text-white/50 uppercase tracking-widest">{label}</p>
      <div className={`text-3xl font-black mt-2 ${color}`}>{value}</div>
      <p className="text-[10px] text-white/40 font-bold mt-1">{subtext}</p>
    </div>
  );
}