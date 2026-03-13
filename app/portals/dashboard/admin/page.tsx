// app/portals/dashboard/admin/page.tsx
"use client";

import Link from "next/link";
import { LayoutDashboard, Users, GraduationCap, Briefcase } from "lucide-react";
import { motion } from "framer-motion";

export default function AdminDashboardPage() {
  return (
    <div className="space-y-8 md:space-y-10">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
      >
        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Admin Overview
        </h1>
      </motion.div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {/* Student Management */}
        <Link
          href="/portals/dashboard/admin/student"
          className="group relative overflow-hidden bg-white dark:bg-slate-800/80 backdrop-blur-xl border border-slate-200/60 dark:border-slate-700/60 rounded-2xl p-6 md:p-8 shadow-lg hover:shadow-2xl hover:border-[#0EA5E9]/60 dark:hover:border-[#0EA5E9]/50 transition-all duration-300 hover:-translate-y-1"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-[#0EA5E9]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="relative flex items-center gap-5">
            <div className="p-4 bg-[#0EA5E9]/10 dark:bg-[#0EA5E9]/20 rounded-xl text-[#0EA5E9] group-hover:bg-[#0EA5E9] group-hover:text-white transition-colors duration-300">
              <Users size={28} />
            </div>
            <div>
              <h3 className="font-bold text-xl text-slate-900 dark:text-white group-hover:text-[#0EA5E9] transition-colors">
                Student Management
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Upload bulk data via Excel
              </p>
            </div>
          </div>
        </Link>

        {/* Staff/Teacher Management */}
        <Link
          href="/portals/dashboard/admin/teacher"
          className="group relative overflow-hidden bg-white dark:bg-slate-800/80 backdrop-blur-xl border border-slate-200/60 dark:border-slate-700/60 rounded-2xl p-6 md:p-8 shadow-lg hover:shadow-2xl hover:border-emerald-500/60 dark:hover:border-emerald-500/50 transition-all duration-300 hover:-translate-y-1"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="relative flex items-center gap-5">
            <div className="p-4 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl text-emerald-600 dark:text-emerald-400 group-hover:bg-emerald-600 group-hover:text-white transition-colors duration-300">
              <Briefcase size={28} />
            </div>
            <div>
              <h3 className="font-bold text-xl text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                Staff Management
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Manage teachers & assignments
              </p>
            </div>
          </div>
        </Link>

        {/* Academic Records – Coming Soon */}
        <div className="relative overflow-hidden bg-white/70 dark:bg-slate-800/50 backdrop-blur-xl border border-slate-200/40 dark:border-slate-700/40 rounded-2xl p-6 md:p-8 shadow-lg opacity-75 cursor-not-allowed flex items-center gap-5">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent" />
          <div className="p-4 bg-purple-100 dark:bg-purple-900/30 rounded-xl text-purple-600 dark:text-purple-400">
            <GraduationCap size={28} />
          </div>
          <div>
            <h3 className="font-bold text-xl text-slate-900 dark:text-white">
              Academic Records
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              Coming Soon
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}