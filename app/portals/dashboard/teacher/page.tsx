import { auth } from "@/auth";
import dbConnect from "@/lib/dbConnect";
import Student from "@/models/Student";
import Link from "next/link";
import { redirect } from "next/navigation";
import { User, ClipboardList, Eye, Search, Filter, GraduationCap } from "lucide-react";

export default async function TeacherDashboard() {
  const session = await auth();
  
  if (!session?.user || session.user.role !== "teacher") {
    redirect("/login");
  }

  await dbConnect();
  
  const assignedClass = session.user.assignedClass || "";

  // Fetching students with a cleaner query
  const students = await Student.find({ 
    currentClass: { $regex: assignedClass, $options: "i" } 
  }).sort({ lastName: 1 }).lean();

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Dynamic Header Section */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-sky-400 font-bold tracking-widest text-xs uppercase mb-2">
            <GraduationCap size={16} />
            Academic Management
          </div>
          <h1 className="text-4xl font-black text-blue tracking-tight">
            Class: <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-emerald-400">{assignedClass}</span>
          </h1>
          <p className="text-slate-400 mt-2 font-medium">
            You have {students.length} students enrolled in your current class session.
          </p>
        </div>

        {/* Quick Stats/Filter Placeholder */}
        <div className="flex gap-4">
          <div className="bg-white/5 backdrop-blur-md border border-white/10 p-4 rounded-2xl flex items-center gap-4">
            <div className="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center text-emerald-400">
              <User size={20} />
            </div>
            <div>
              <p className="text-[10px] text-slate-500 uppercase font-bold tracking-tighter">Total Students</p>
              <p className="text-xl font-bold text-blue">{students.length}</p>
            </div>
          </div>
        </div>
      </header>

      {/* Control Bar */}
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-4 rounded-2xl flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:max-w-xs group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-sky-400 transition-colors" size={18} />
          <input 
            placeholder="Search student name..." 
            className="w-full bg-slate-900/50 border border-white/5 rounded-xl py-2.5 pl-12 pr-4 text-sm focus:ring-2 focus:ring-sky-500/20 outline-none transition-all"
          />
        </div>
        <button className="flex items-center gap-2 text-sm font-semibold text-slate-400 hover:text-white transition-colors">
          <Filter size={18} />
          Sort by Name
        </button>
      </div>

      {/* Student Grid */}
      {!students || students.length === 0 ? (
        <div className="py-20 text-center bg-white/5 rounded-[2.5rem] border border-dashed border-white/10">
          <h2 className="text-xl text-slate-400 font-medium">No students found for this class.</h2>
          <p className="text-slate-500 text-sm mt-1">Please contact the admin for enrollment updates.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {students.map((student: any) => (
            <div 
              key={student._id.toString()} 
              className="group relative bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-[2rem] hover:bg-white/[0.08] hover:border-white/20 transition-all duration-300 overflow-hidden"
            >
              {/* Decorative background element */}
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-sky-500/5 rounded-full blur-3xl group-hover:bg-sky-500/10 transition-colors" />

              <div className="flex items-start justify-between relative z-10">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center text-xl font-bold text-white border border-white/5 shadow-inner">
                    {student.firstName[0]}{student.lastName[0]}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-blue group-hover:text-sky-400 transition-colors">
                      {student.firstName} {student.lastName}
                    </h2>
                    <p className="text-sky-400/80 text-xs font-mono tracking-wider mt-1">ID: {student.studentId}</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex gap-3 relative z-10">
                <Link 
                  href={`/portals/dashboard/teacher/results/${student._id.toString()}`}
                  className="flex-1 bg-sky-600 hover:bg-sky-500 text-blue py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-sky-900/20 active:scale-95"
                >
                  <ClipboardList size={18} />
                  Input Results
                </Link>
                <Link 
                  href={`/portals/dashboard/teacher/results/${student._id.toString()}/view`}
                  className="bg-white/10 hover:bg-white/20 text-blue-400 px-4 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all active:scale-95 border border-white/5"
                >
                  <Eye size={18} />
                  View Card
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}