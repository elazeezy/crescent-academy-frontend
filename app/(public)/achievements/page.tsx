"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ChevronLeft, Trophy, BookOpen, Dumbbell, Users, Star } from "lucide-react";
import AnimatedCounter from "@/components/ui/AnimatedCounter";

type AchievementCategory = "All" | "Academic" | "Qur'anic" | "Sports" | "Leadership" | "Inter-School";
const CATEGORIES: AchievementCategory[] = ["All", "Academic", "Qur'anic", "Sports", "Leadership", "Inter-School"];

const categoryBorder: Record<string, string> = {
  Academic:       "#60A5FA",
  "Qur'anic":     "#C4973A",
  Sports:         "#34D399",
  Leadership:     "#A78BFA",
  "Inter-School": "#FB923C",
};

const categoryIcons: Record<string, React.ReactNode> = {
  Academic:       <BookOpen size={16} />,
  "Qur'anic":     <Star size={16} />,
  Sports:         <Dumbbell size={16} />,
  Leadership:     <Users size={16} />,
  "Inter-School": <Trophy size={16} />,
};

interface Achievement {
  title: string;
  competition: string;
  year: string;
  position: string;
  category: Exclude<AchievementCategory, "All">;
  students?: string;
}

const ACHIEVEMENTS: Achievement[] = [
  { title: "Best School in Qur'anic Recitation",   competition: "AMIS Annual Competition",           year: "2024", position: "1st", category: "Qur'anic" },
  { title: "Excellence in Arabic Language",         competition: "AMIS Annual Competition",           year: "2024", position: "2nd", category: "Academic" },
  { title: "Inter-School Football Tournament",      competition: "Iwo Local Government Championship", year: "2024", position: "2nd", category: "Sports" },
  { title: "Best Student Leadership Award",         competition: "Osun State Schools Competition",    year: "2023", position: "1st", category: "Leadership", students: "Abdullahi Olatunde" },
  { title: "Overall Academic Excellence",           competition: "AMIS Regional Award",               year: "2023", position: "1st", category: "Academic" },
  { title: "Qur'anic Memorisation (Hifz)",          competition: "Annual Iwo Qur'an Competition",     year: "2023", position: "1st", category: "Qur'anic", students: "Maryam Babatunde" },
  { title: "Science Quiz Competition",              competition: "Osun State Inter-School",            year: "2023", position: "3rd", category: "Inter-School" },
  { title: "Best Moral Character Award",            competition: "AMIS Annual Competition",           year: "2022", position: "1st", category: "Leadership" },
  { title: "Mathematics Olympiad",                  competition: "AMIS Regional",                     year: "2022", position: "2nd", category: "Academic" },
  { title: "Boys Sprint Championship",              competition: "Iwo Zone Athletics",                year: "2022", position: "1st", category: "Sports" },
  { title: "Islamic Studies Excellence",            competition: "AMIS Annual Competition",           year: "2021", position: "1st", category: "Qur'anic" },
  { title: "Inter-School Debate",                   competition: "Osun State Inter-School Debate",    year: "2021", position: "2nd", category: "Inter-School" },
];

const YEARS = ["All Years", ...Array.from(new Set(ACHIEVEMENTS.map((a) => a.year))).sort((a, b) => +b - +a)];

const positionStyle: Record<string, React.CSSProperties> = {
  "1st": { background: "rgba(196,151,58,0.15)", color: "#C4973A" },
  "2nd": { background: "#F1F5F9", color: "#475569" },
  "3rd": { background: "#FFF7ED", color: "#C2410C" },
};

const IslamicPattern = () => (
  <svg aria-hidden className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.05]" xmlns="http://www.w3.org/2000/svg">
    <defs><pattern id="achp" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse"><polygon points="40,4 47,20 62,13 55,28 72,35 55,42 62,57 47,50 40,66 33,50 18,57 25,42 8,35 25,28 18,13 33,20" fill="none" stroke="white" strokeWidth="0.7" /></pattern></defs>
    <rect width="100%" height="100%" fill="url(#achp)" />
  </svg>
);

export default function AchievementsPage() {
  const [activeCategory, setActiveCategory] = useState<AchievementCategory>("All");
  const [activeYear,     setActiveYear]     = useState("All Years");

  const filtered = ACHIEVEMENTS.filter(
    (a) =>
      (activeCategory === "All" || a.category === activeCategory) &&
      (activeYear === "All Years" || a.year === activeYear)
  );

  return (
    <div style={{ background: "#F7F5F1" }} className="min-h-screen">

      {/* Hero — navy, matching home style */}
      <section className="relative py-24 md:py-32 overflow-hidden" style={{ background: "#0B1F3A" }}>
        <IslamicPattern />
        <div className="absolute top-6 left-6 z-20">
          <Link href="/" className="flex items-center gap-1.5 text-white/70 hover:text-white text-sm transition-colors"
            style={{ fontFamily: "var(--font-body, sans-serif)" }}>
            <ChevronLeft size={16} /> Home
          </Link>
        </div>
        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
              style={{ background: "rgba(33,150,196,0.15)", border: "1px solid rgba(33,150,196,0.3)" }}>
              <Trophy size={40} style={{ color: "#3BADD9" }} />
            </div>
            <p className="text-xs tracking-[0.2em] uppercase mb-4 font-medium"
              style={{ color: "#2196C4", fontFamily: "var(--font-body, sans-serif)" }}>Our Track Record</p>
            <h1 className="text-4xl sm:text-5xl font-bold text-white leading-tight mb-4"
              style={{ fontFamily: "var(--font-display, 'Cormorant Garamond', serif)" }}>
              A <span className="italic" style={{ color: "#3BADD9" }}>Legacy</span> of Excellence
            </h1>
            <p className="text-lg max-w-2xl mx-auto mb-12"
              style={{ color: "rgba(255,255,255,0.7)", fontFamily: "var(--font-body, sans-serif)" }}>
              150+ prizes. 30+ awards. Across academics, Quran, sports, and leadership.
            </p>
            <div className="grid grid-cols-3 gap-8 max-w-md mx-auto">
              <AnimatedCounter target={150} suffix="+" label="Total Prizes" light />
              <AnimatedCounter target={30} suffix="+" label="Formal Awards" light />
              <AnimatedCounter target={14} suffix="+" label="Years of Wins" light />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Filters */}
      <section className="sticky top-[64px] z-30 border-b shadow-sm"
        style={{ background: "#F7F5F1", borderColor: "#E5E7EB" }}>
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-3 flex flex-wrap gap-2 items-center justify-between">
          <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
            {CATEGORIES.map((cat) => (
              <button key={cat} onClick={() => setActiveCategory(cat)}
                className="shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all"
                style={{
                  background: activeCategory === cat ? "#2196C4" : "transparent",
                  color: activeCategory === cat ? "#fff" : "#6B7280",
                  border: activeCategory === cat ? "none" : "1px solid #E5E7EB",
                  fontFamily: "var(--font-body, sans-serif)",
                }}>
                {cat}
              </button>
            ))}
          </div>
          <select value={activeYear} onChange={(e) => setActiveYear(e.target.value)}
            className="text-xs rounded-full px-3 py-1.5 focus:outline-none"
            style={{
              border: "1px solid #E5E7EB",
              color: "#6B7280",
              background: "transparent",
              fontFamily: "var(--font-body, sans-serif)",
            }}>
            {YEARS.map((y) => <option key={y}>{y}</option>)}
          </select>
        </div>
      </section>

      {/* Achievement Wall */}
      <section className="py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <AnimatePresence mode="popLayout">
            <motion.div layout className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map((a, i) => (
                <motion.div
                  key={`${a.title}-${a.year}`}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.04 }}
                  className="group bg-white rounded-2xl border-x border-b p-6 hover:-translate-y-1 hover:shadow-lg transition-all duration-300"
                  style={{
                    borderColor: "#E5E7EB",
                    borderTop: `4px solid ${categoryBorder[a.category] || "#2196C4"}`,
                  }}
                >
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{ background: "#F1F5F9", color: "#94A3B8" }}>
                      {categoryIcons[a.category]}
                    </div>
                    <span className="px-3 py-1 rounded-full text-xs font-bold"
                      style={positionStyle[a.position] || { background: "#F1F5F9", color: "#6B7280" }}>
                      {a.position} Place
                    </span>
                  </div>
                  <h3 className="font-bold text-base mb-1 leading-snug" style={{ color: "#0B1F3A", fontFamily: "var(--font-body, sans-serif)" }}>{a.title}</h3>
                  <p className="text-xs mb-3" style={{ color: "#6B7280", fontFamily: "var(--font-body, sans-serif)" }}>{a.competition}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-medium uppercase tracking-wide" style={{ color: "#9CA3AF" }}>{a.year}</span>
                    {a.students && <span className="text-[10px] italic" style={{ color: "#6B7280" }}>{a.students}</span>}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
          {filtered.length === 0 && (
            <div className="py-20 text-center" style={{ color: "#9CA3AF", fontFamily: "var(--font-body, sans-serif)" }}>
              No achievements found for the selected filters.
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 relative overflow-hidden" style={{ background: "#0B1F3A" }}>
        <IslamicPattern />
        <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-white text-3xl font-bold mb-4"
            style={{ fontFamily: "var(--font-display, 'Cormorant Garamond', serif)" }}>
            Your Child Could Be <span className="italic" style={{ color: "#3BADD9" }}>Next</span>
          </h2>
          <p className="mb-8" style={{ color: "rgba(255,255,255,0.6)", fontFamily: "var(--font-body, sans-serif)" }}>
            Join The Crescent Academy and be part of a legacy of excellence.
          </p>
          <Link href="/admissions"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full font-bold text-sm transition-all hover:-translate-y-0.5"
            style={{ background: "#2196C4", color: "#fff", fontFamily: "var(--font-body, sans-serif)" }}
            onMouseEnter={e => (e.currentTarget.style.background = "#3BADD9")}
            onMouseLeave={e => (e.currentTarget.style.background = "#2196C4")}>
            Apply for Admission
          </Link>
        </div>
      </section>
    </div>
  );
}
