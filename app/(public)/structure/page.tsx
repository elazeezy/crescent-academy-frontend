"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ChevronLeft, MapPin, CheckCircle, BookOpen, Microscope, GraduationCap, ArrowRight, Users } from "lucide-react";
import ScrollReveal from "@/components/ui/ScrollReveal";
import StaggerContainer, { StaggerItem } from "@/components/ui/StaggerContainer";

const IslamicPattern = ({ id, opacity = 0.055 }: { id: string; opacity?: number }) => (
  <svg aria-hidden className="absolute inset-0 w-full h-full pointer-events-none select-none" style={{ opacity }} xmlns="http://www.w3.org/2000/svg">
    <defs>
      <pattern id={id} x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
        <polygon points="40,4 47,20 62,13 55,28 72,35 55,42 62,57 47,50 40,66 33,50 18,57 25,42 8,35 25,28 18,13 33,20" fill="none" stroke="currentColor" strokeWidth="0.7" />
        <circle cx="40" cy="35" r="6" fill="none" stroke="currentColor" strokeWidth="0.5" />
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill={`url(#${id})`} />
  </svg>
);

const SECTIONS = [
  {
    num: "01",
    icon: Users,
    title: "The Crescent Academy",
    subtitle: "Nursery & Primary Section",
    tag: "Foundation Stage",
    locations: [
      "Panada Area, Beside Car Wash, Along Water Works, Iwo",
      "Kobaope Phase 1, Iwo",
    ],
    highlights: [
      "Structured play, literacy, numeracy & early moral instruction",
      "Tahfīdhul Qur'an — memorisation, understanding & application",
      "English, Mathematics, Science, Social Studies, Islamic Studies & Arabic",
      "Safe, nurturing environment building curiosity, confidence & love of learning",
    ],
    image: "/images/structure/1-nursery-primary.jpg",
  },
  {
    num: "02",
    icon: GraduationCap,
    title: "Crescent College",
    subtitle: "Secondary Section",
    tag: "Est. 2014",
    locations: ["Along Ile Ogbo Road, Iwo"],
    highlights: [
      "Comprehensive curriculum aligned with national standards (WAEC/NECO)",
      "Preparation for higher education and professional careers",
      "Emphasis on discipline, leadership, moral uprightness & critical thinking",
      "Experienced teachers passionate about mentoring and character formation",
      "Environment promoting respect, diligence, focus & self-confidence",
    ],
    image: "/images/structure/2-secondary-college.jpg",
  },
  {
    num: "03",
    icon: Microscope,
    title: "Crescent School of Science",
    subtitle: "Vocational & Technical Section",
    tag: "Est. 2023",
    locations: ["Beside Masjid Darus Salam, Along Kobaope, Iwo"],
    highlights: [
      "Foundational scientific & technical knowledge from Junior Secondary",
      "Basic Science, Technology, Mathematics & analytical reasoning",
      "Hands-on, practical learning environment",
      "Vocational training: baking & confectionery, cosmetology & more",
      "Empowering students to be innovative, self-reliant & productive",
    ],
    image: "/images/structure/3-school-of-science.jpg",
  },
];

export default function StructurePage() {
  return (
    <div style={{ background: "#F7F5F1" }} className="min-h-screen">

      {/* ── Hero ──────────────────────────────────────────────── */}
      <section className="relative h-[58vh] min-h-80 flex items-center overflow-hidden" style={{ background: "#0B1F3A" }}>
        <IslamicPattern id="stp" opacity={0.06} />
        <img
          src="/images/structure/hero-campus.jpg"
          alt=""
          aria-hidden
          className="absolute inset-0 w-full h-full object-cover opacity-20"
          onError={e => { (e.target as HTMLImageElement).style.display = "none"; }}
        />
        <div className="absolute inset-0" style={{ background: "rgba(6,14,28,0.78)" }} />
        <div className="absolute top-6 left-6 z-20">
          <Link href="/" className="flex items-center gap-1.5 text-white/70 hover:text-white text-sm transition-colors"
            style={{ fontFamily: "var(--font-body, sans-serif)" }}>
            <ChevronLeft size={16} /> Home
          </Link>
        </div>
        <div aria-hidden className="absolute right-0 top-0 bottom-0 flex items-center pointer-events-none select-none overflow-hidden">
          <span className="text-[22rem] font-bold leading-none pr-8" style={{ color: "rgba(255,255,255,0.025)" }}>3</span>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85 }}
          className="relative z-10 max-w-7xl mx-auto px-6 sm:px-10 w-full"
        >
          <p className="text-xs tracking-[0.22em] uppercase mb-3 font-semibold flex items-center gap-2"
            style={{ color: "#2196C4", fontFamily: "var(--font-body, sans-serif)" }}>
            <span className="w-6 h-px" style={{ background: "#2196C4" }} /> Three Sections · One Vision
          </p>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-4"
            style={{ fontFamily: "var(--font-display, 'Cormorant Garamond', serif)" }}>
            Our School <span className="italic" style={{ color: "#3BADD9" }}>Structure</span>
          </h1>
          <p className="text-lg max-w-2xl leading-relaxed"
            style={{ color: "rgba(255,255,255,0.65)", fontFamily: "var(--font-body, sans-serif)" }}>
            With the help of Allah (SWT) — a complete educational journey from Nursery through Vocational training under one unified Islamic vision.
          </p>
          <div className="flex flex-wrap gap-3 mt-8">
            {SECTIONS.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + i * 0.1 }}
                className="flex items-center gap-2 px-4 py-2 rounded-full text-sm"
                style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", color: "rgba(255,255,255,0.8)", fontFamily: "var(--font-body, sans-serif)" }}
              >
                <s.icon size={14} style={{ color: "#3BADD9" }} className="shrink-0" />
                <span>{s.title}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ── Intro strip ───────────────────────────────────────── */}
      <section style={{ background: "#2196C4" }} className="py-6">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <p className="font-semibold text-sm sm:text-base leading-relaxed max-w-3xl mx-auto text-white"
            style={{ fontFamily: "var(--font-body, sans-serif)" }}>
            The Crescent Academy has grown into a structured three-section institution, each designed to serve a specific stage of a child's educational journey — with continuity, excellence, and strong moral foundation throughout.
          </p>
        </div>
      </section>

      {/* ── Three Sections — Alternating Layout ───────────────── */}
      <section className="py-16 md:py-24" style={{ background: "#fff" }}>
        <div className="max-w-6xl mx-auto px-6 sm:px-10 space-y-20 md:space-y-28">
          {SECTIONS.map((sec, i) => {
            const isEven = i % 2 === 0;
            const Icon = sec.icon;
            return (
              <ScrollReveal key={i} delay={0.05}>
                <div className={`grid lg:grid-cols-2 gap-10 lg:gap-14 items-center ${isEven ? "" : "lg:[direction:rtl]"}`}>

                  {/* Image side */}
                  <div className={isEven ? "" : "lg:[direction:ltr]"}>
                    <div className="relative group">
                      <div aria-hidden className="absolute -top-6 -left-4 text-8xl font-bold leading-none select-none pointer-events-none z-0"
                        style={{ color: "#F1F5F9", fontFamily: "var(--font-display, serif)" }}>
                        {sec.num}
                      </div>
                      <div className="relative rounded-2xl overflow-hidden aspect-[4/3] shadow-xl z-10 transition-all duration-300"
                        style={{ boxShadow: "0 0 0 2px rgba(33,150,196,0.15)" }}>
                        <img
                          src={sec.image}
                          alt={sec.title}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                          onError={e => { (e.target as HTMLImageElement).style.display = "none"; }}
                        />
                        <div className="absolute top-4 left-4">
                          <span className="px-3 py-1.5 text-xs font-bold rounded-full"
                            style={{ background: "#2196C4", color: "#fff" }}>{sec.tag}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Content side */}
                  <div className={isEven ? "" : "lg:[direction:ltr]"}>
                    <div className="space-y-5">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                          style={{ background: "#0B1F3A" }}>
                          <Icon size={20} style={{ color: "#3BADD9" }} />
                        </div>
                        <div>
                          <p className="text-[10px] font-bold tracking-[0.25em] uppercase"
                            style={{ color: "#2196C4", fontFamily: "var(--font-body, sans-serif)" }}>{sec.subtitle}</p>
                        </div>
                      </div>

                      <h2 className="text-3xl md:text-4xl font-bold leading-tight"
                        style={{ color: "#0B1F3A", fontFamily: "var(--font-display, 'Cormorant Garamond', serif)" }}>
                        {sec.title}
                      </h2>

                      <div className="space-y-1.5">
                        {(sec.locations ?? [sec.locations]).flat().map((loc, j) => (
                          <div key={j} className="flex items-start gap-2 text-sm"
                            style={{ color: "#6B7280", fontFamily: "var(--font-body, sans-serif)" }}>
                            <MapPin size={13} style={{ color: "#2196C4" }} className="shrink-0 mt-0.5" />
                            <span>{loc}</span>
                          </div>
                        ))}
                      </div>

                      <div className="w-12 h-0.5 rounded-full" style={{ background: "#2196C4" }} />

                      <ul className="space-y-3">
                        {sec.highlights.map((h, j) => (
                          <li key={j} className="flex items-start gap-3">
                            <CheckCircle size={15} style={{ color: "#2196C4" }} className="shrink-0 mt-0.5" />
                            <span className="text-sm leading-relaxed"
                              style={{ color: "#4B5563", fontFamily: "var(--font-body, sans-serif)" }}>{h}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </section>

      {/* ── Unified Vision strip — dark ────────────────────────── */}
      <section className="py-20 md:py-28 relative overflow-hidden" style={{ background: "#0B1F3A" }}>
        <IslamicPattern id="stp2" opacity={0.05} />
        <div className="relative z-10 max-w-4xl mx-auto px-6 sm:px-10 text-center">
          <p className="text-xs tracking-[0.2em] uppercase mb-3 font-semibold flex items-center gap-3 justify-center"
            style={{ color: "#C4973A", fontFamily: "var(--font-body, sans-serif)" }}>
            <span className="w-8 h-px" style={{ background: "#C4973A" }} /> A Unified Vision <span className="w-8 h-px" style={{ background: "#C4973A" }} />
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6"
            style={{ fontFamily: "var(--font-display, 'Cormorant Garamond', serif)" }}>
            Three Sections. <span className="italic" style={{ color: "#C4973A" }}>One Purpose.</span>
          </h2>
          <p className="text-base leading-relaxed mb-8 max-w-2xl mx-auto"
            style={{ color: "rgba(255,255,255,0.65)", fontFamily: "var(--font-body, sans-serif)" }}>
            Together, these three sections form a comprehensive and progressive educational system that nurtures learners from early childhood through secondary and vocational education. By the grace of Allah, The Crescent Academy stands as a beacon of faith-based excellence in Iwo and beyond.
          </p>
          <blockquote className="pl-6 text-left max-w-xl mx-auto"
            style={{ borderLeft: "4px solid rgba(196,151,58,0.6)" }}>
            <p className="text-lg text-white/80 italic leading-relaxed"
              style={{ fontFamily: "var(--font-display, 'Cormorant Garamond', serif)" }}>
              "Our mission remains steadfast: to raise knowledgeable, disciplined, skilled, and God-conscious individuals who will positively impact their communities and the world."
            </p>
            <footer className="text-xs font-semibold mt-3 tracking-[0.2em] uppercase"
              style={{ color: "#C4973A", fontFamily: "var(--font-body, sans-serif)" }}>— The Crescent Academy</footer>
          </blockquote>
        </div>
      </section>

      {/* ── Stats row ─────────────────────────────────────────── */}
      <section className="py-14 relative overflow-hidden" style={{ background: "#2196C4" }}>
        <IslamicPattern id="stp3" opacity={0.06} />
        <div className="relative z-10 max-w-5xl mx-auto px-6 sm:px-10">
          <StaggerContainer className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
            {[
              { n: "3",    l: "School Sections" },
              { n: "2010", l: "Year Founded" },
              { n: "5+",   l: "Campus Locations" },
              { n: "150+", l: "Prizes & Awards" },
            ].map((s) => (
              <StaggerItem key={s.l}>
                <div className="text-white">
                  <p className="text-3xl md:text-4xl font-bold"
                    style={{ fontFamily: "var(--font-display, 'Cormorant Garamond', serif)", color: "#fff" }}>{s.n}</p>
                  <p className="text-sm mt-1 font-medium"
                    style={{ color: "rgba(255,255,255,0.7)", fontFamily: "var(--font-body, sans-serif)" }}>{s.l}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* ── CTA ────────────────────────────────────────────────── */}
      <section className="py-16" style={{ background: "#F7F5F1" }}>
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-3"
            style={{ color: "#0B1F3A", fontFamily: "var(--font-display, 'Cormorant Garamond', serif)" }}>
            Ready to Begin?
          </h2>
          <p className="text-sm mb-8 max-w-md mx-auto"
            style={{ color: "#6B7280", fontFamily: "var(--font-body, sans-serif)" }}>
            Admissions are open for all three sections for the 2025/2026 session.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link href="/admissions"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-bold text-sm transition-all hover:-translate-y-0.5"
              style={{ background: "#2196C4", color: "#fff", fontFamily: "var(--font-body, sans-serif)" }}
              onMouseEnter={e => (e.currentTarget.style.background = "#3BADD9")}
              onMouseLeave={e => (e.currentTarget.style.background = "#2196C4")}>
              Apply for Admission <ArrowRight size={15} />
            </Link>
            <Link href="/leadership"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-medium text-sm transition-all"
              style={{ border: "1px solid rgba(11,31,58,0.2)", color: "#0B1F3A", fontFamily: "var(--font-body, sans-serif)" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(33,150,196,0.5)"; e.currentTarget.style.color = "#2196C4"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(11,31,58,0.2)"; e.currentTarget.style.color = "#0B1F3A"; }}>
              Meet Our Leadership
            </Link>
            <Link href="/fees"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-medium text-sm transition-all"
              style={{ border: "1px solid rgba(11,31,58,0.2)", color: "#0B1F3A", fontFamily: "var(--font-body, sans-serif)" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(33,150,196,0.5)"; e.currentTarget.style.color = "#2196C4"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(11,31,58,0.2)"; e.currentTarget.style.color = "#0B1F3A"; }}>
              View Fees
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
