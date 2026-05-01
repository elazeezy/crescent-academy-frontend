"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import {
  ChevronLeft, ChevronRight, BookOpen, Trophy, Users,
  GraduationCap, Shield, Star, ArrowRight, CheckCircle, Quote,
} from "lucide-react";
import Link from "next/link";

// ── Animated counter ──────────────────────────────────────────
function useCountUp(end: number, started: boolean) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!started) return;
    let raf: number;
    const t0 = performance.now();
    const dur = 1800;
    const tick = (now: number) => {
      const p = Math.min((now - t0) / dur, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      setVal(Math.round(ease * end));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [end, started]);
  return val;
}

// ── Reusable sub-components ───────────────────────────────────
const IslamicPattern = ({ opacity = 0.06 }: { opacity?: number }) => (
  <svg
    className="absolute inset-0 w-full h-full pointer-events-none select-none"
    style={{ opacity }}
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden
  >
    <defs>
      <pattern id="ip" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
        <polygon
          points="40,4 47,20 62,13 55,28 72,35 55,42 62,57 47,50 40,66 33,50 18,57 25,42 8,35 25,28 18,13 33,20"
          fill="none" stroke="currentColor" strokeWidth="0.7"
        />
        <circle cx="40" cy="35" r="7" fill="none" stroke="currentColor" strokeWidth="0.5" />
        <circle cx="40" cy="35" r="2" fill="currentColor" />
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#ip)" />
  </svg>
);

const Noise = () => (
  <div
    aria-hidden
    className="absolute inset-0 pointer-events-none opacity-[0.032]"
    style={{
      backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
      backgroundSize: "160px",
    }}
  />
);

const GoldLine = () => (
  <div className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#D4A847] to-transparent" />
);

const DotPattern = ({ color = "#0145F2", opacity = 0.045 }: { color?: string; opacity?: number }) => (
  <div aria-hidden className="absolute inset-0 pointer-events-none select-none" style={{ opacity }}>
    <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="dots" x="0" y="0" width="28" height="28" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="1.5" fill={color} />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#dots)" />
    </svg>
  </div>
);

const DiagLines = ({ opacity = 0.035 }: { opacity?: number }) => (
  <div aria-hidden className="absolute inset-0 pointer-events-none select-none" style={{ opacity }}>
    <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="diag" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="40" stroke="#0145F2" strokeWidth="1" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#diag)" />
    </svg>
  </div>
);

function EyebrowLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="flex items-center gap-3 text-[#D4A847] text-[10px] font-black tracking-[0.45em] uppercase">
      <span className="w-8 h-px bg-[#D4A847] shrink-0" />
      {children}
      <span className="w-8 h-px bg-[#D4A847] shrink-0" />
    </p>
  );
}

function StatCounter({ raw, suffix, label, icon: Icon, index }: {
  raw: number; suffix: string; label: string; icon: LucideIcon; index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });
  const count = useCountUp(raw, inView);
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.6 }}
      className="flex flex-col items-center text-white group"
    >
      <div className="w-14 h-14 mb-4 bg-white/8 border border-[#D4A847]/25 rounded-2xl flex items-center justify-center group-hover:border-[#D4A847]/60 transition-all duration-400">
        <Icon size={24} className="text-[#D4A847]" />
      </div>
      <p className="text-4xl md:text-5xl font-black tracking-tight tabular-nums">{count}{suffix}</p>
      <div className="w-8 h-0.5 bg-[#D4A847]/40 my-2.5 rounded-full" />
      <p className="text-white/55 text-xs font-semibold tracking-wide text-center">{label}</p>
    </motion.div>
  );
}

// ── Data ──────────────────────────────────────────────────────
const slides = [
  {
    id: "01",
    image: "/images/hero-students-classroom.jpg",
    eyebrow: "The Crescent Academy · Est. 2010 · Iwo, Osun State",
    lines: ["Nurturing the", "Complete Child"],
    accentLine: 1,
    subtitle: "A harmonious blend of academic excellence and authentic Islamic values",
  },
  {
    id: "02",
    image: "/images/hero-islamic-education.jpg",
    eyebrow: "The Crescent Academy · Knowledge with Taqwa",
    lines: ["Faith · Knowledge", "· Character"],
    accentLine: null,
    subtitle: "Building morally upright leaders for this world and the Hereafter",
  },
  {
    id: "03",
    image: "/images/hero-graduation.jpg",
    eyebrow: "The Crescent Academy · Discipline & Integrity",
    lines: ["Excellence in", "Every Step"],
    accentLine: null,
    subtitle: "From Nursery to Vocational — a journey of growth and guidance",
  },
];

const stats = [
  { raw: 14,  suffix: "+", label: "Years of Excellence",  icon: Star },
  { raw: 120, suffix: "+", label: "Academic Prizes",       icon: Trophy },
  { raw: 30,  suffix: "+", label: "Distinguished Awards",  icon: Shield },
  { raw: 3,   suffix: "",  label: "School Sections",       icon: GraduationCap },
] as const;

const pillars = [
  { icon: BookOpen,       title: "Academic Excellence",       desc: "Rigorous curriculum aligned with national standards, producing top performers year after year." },
  { icon: Shield,         title: "Moral & Spiritual Growth",  desc: "Authentic Islamic values woven into every subject, building Taqwa alongside knowledge." },
  { icon: Users,          title: "Holistic Development",      desc: "Sports, arts, leadership, and vocational skills to nurture every dimension of the child." },
  { icon: Trophy,         title: "Award-Winning Institution", desc: "Over 150 prizes and awards in academics, Qur'an, sports, and inter-school competitions." },
  { icon: GraduationCap,  title: "Three-Tier Education",      desc: "Nursery & Primary, Secondary (College), and Vocational (School of Science) under one vision." },
  { icon: Star,           title: "Qualified Educators",       desc: "Dedicated, certified teachers who combine professional competence with moral uprightness." },
];

const galleryItems = [
  { src: "/images/gallery-students-1.jpg",  label: "Classroom Excellence" },
  { src: "/images/gallery-assembly.jpg",    label: "Morning Assembly" },
  { src: "/images/gallery-sports.jpg",      label: "Sports Day" },
  { src: "/images/gallery-quran.jpg",       label: "Qur'anic Studies" },
  { src: "/images/gallery-lab.jpg",         label: "Science Lab" },
  { src: "/images/gallery-awards.jpg",      label: "Prize Giving Day" },
];

const milestones = [
  { year: "2010",      text: "Founded in Ajegbe Close, Panada Area, Iwo" },
  { year: "2010–2016", text: "Early growth: Nursery & Primary sections established" },
  { year: "2014",      text: "Establishment of Crescent College (Secondary)" },
  { year: "2023",      text: "Launch of Crescent School of Science (Vocational)" },
  { year: "Today",     text: "120+ prizes, 30+ awards, thriving alumni network" },
];

const testimonials = [
  {
    initials: "FA",
    name: "Mrs. Fatimah Adeyemi",
    role: "Parent · JSS 2",
    quote: "The transformation in my daughter since joining Crescent Academy has been remarkable. She is more confident, disciplined, and spiritually grounded. Alhamdulillah.",
  },
  {
    initials: "AO",
    name: "Br. Abdullahi Olatunde",
    role: "Alumni · Class of 2019",
    quote: "Crescent Academy didn't just give me certificates — it built my character. The values I learned here shaped who I am today as a professional and a Muslim.",
  },
  {
    initials: "MB",
    name: "Alhaji Musa Babatunde",
    role: "Parent · SSS 1",
    quote: "I've seen three of my children through this school and each one emerged excellent. The teachers genuinely care. This is not just a school — it's a family.",
  },
];

const news = [
  { title: "Iwo Day Football Tournament – Runners-Up!", date: "Nov 15, 2025", image: "/images/news-football.jpg", excerpt: "Our boys' team showed incredible teamwork and discipline, defeating every public school to reach the final.", category: "Sports", tag: "bg-emerald-500" },
  { title: "Qur'anic Recitation Competition Winners",   date: "Oct 28, 2025", image: "/images/news-quran.jpg",    excerpt: "Students secured 1st and 2nd place in the regional Qur'anic competition — a testament to our spiritual excellence.", category: "Spiritual", tag: "bg-[#0EA5E9]" },
  { title: "Annual Prize-Giving Day 2025",              date: "Sep 13, 2025",  image: "/images/news-prize-giving.jpg", excerpt: "Celebrating 15 years of nurturing the Complete Child with awards, speeches, and joyful moments.", category: "Events", tag: "bg-[#D4A847]" },
];

const SLIDE_DURATION = 10000;

// ── Page ──────────────────────────────────────────────────────
export default function HomePage() {
  const [current,        setCurrent]        = useState(0);
  const [paused,         setPaused]         = useState(false);
  const [progress,       setProgress]       = useState(0);
  const [testimonialIdx, setTestimonialIdx] = useState(0);

  // Slide advance — reliable interval loop
  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => {
      setCurrent(p => (p + 1) % slides.length);
    }, SLIDE_DURATION);
    return () => clearInterval(id);
  }, [paused]);

  // Progress bar — resets per slide
  useEffect(() => {
    if (paused) return;
    setProgress(0);
    const t0 = performance.now();
    let raf: number;
    const tick = (now: number) => {
      const p = Math.min((now - t0) / SLIDE_DURATION, 1);
      setProgress(p);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [current, paused]);

  const slide = slides[current];
  const prevSlide = () => setCurrent(p => (p - 1 + slides.length) % slides.length);
  const nextSlide = () => setCurrent(p => (p + 1) % slides.length);

  return (
    <div className="bg-[#FAFAF8] text-slate-900 overflow-x-hidden">

      {/* ══════════════════════════════════════════════════════════
          § 1  HERO
      ══════════════════════════════════════════════════════════ */}
      <section
        className="relative h-[58vh] min-h-[320px] sm:h-screen sm:min-h-[600px] flex items-center overflow-hidden"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {/* Slide backgrounds */}
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, scale: 1.07 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.4, ease: [0.25, 0.1, 0.25, 1] as const }}
            className="absolute inset-0"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#061529] via-[#0F2A5E] to-[#1E3A8A]" />
            <img
              src={slide.image}
              alt=""
              aria-hidden
              className="absolute inset-0 w-full h-full object-cover brightness-[0.32]"
              onError={e => { (e.target as HTMLImageElement).style.display = "none"; }}
            />
            {/* Cinematic dual gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/25 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/15" />
          </motion.div>
        </AnimatePresence>

        <IslamicPattern opacity={0.065} />
        <Noise />

        {/* Crescent watermark top-right */}
        <svg
          aria-hidden
          viewBox="0 0 200 200"
          className="absolute -right-20 -top-20 w-[550px] h-[550px] pointer-events-none select-none text-white opacity-[0.035]"
          fill="currentColor"
        >
          <path d="M100,10 A90,90 0 1,1 100,190 A62,62 0 1,0 100,10 Z" />
          <circle cx="135" cy="48" r="9" />
          <circle cx="158" cy="72" r="5.5" />
          <circle cx="148" cy="33" r="3.5" />
        </svg>

        {/* Left-aligned content */}
        <div className="relative z-20 w-full max-w-7xl mx-auto px-5 sm:px-10 lg:px-16 pt-8 sm:pt-20">
          <AnimatePresence mode="wait">
            <motion.div
              key={`c-${current}`}
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0, y: -12, transition: { duration: 0.28 } }}
              variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.15 } } }}
              className="max-w-[700px] space-y-3 sm:space-y-7"
            >
              {/* Eyebrow */}
              <motion.div
                variants={{ hidden: { opacity: 0, y: 18 }, visible: { opacity: 1, y: 0, transition: { duration: 0.65 } } }}
                className="flex items-center gap-3"
              >
                <span className="h-px w-8 bg-[#D4A847]" />
                <span className="text-[#D4A847] text-[10px] font-black tracking-[0.4em] uppercase">{slide.eyebrow}</span>
              </motion.div>

              {/* Headline — masked line-by-line reveal */}
              <div className="space-y-1">
                {slide.lines.map((line, li) => (
                  <div key={li} className="overflow-hidden leading-none">
                    <motion.h1
                      variants={{
                        hidden: { y: "105%" },
                        visible: { y: 0, transition: { duration: 0.95, ease: [0.16, 1, 0.3, 1] as const, delay: li * 0.07 } },
                      }}
                      className={`block text-[clamp(1.7rem,6vw,5.5rem)] font-black tracking-tight leading-[1.05] ${
                        li === slide.accentLine ? "text-[#0EA5E9]" : "text-white"
                      }`}
                    >
                      {line}
                    </motion.h1>
                  </div>
                ))}
              </div>

              {/* Subtitle */}
              <motion.p
                variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.75, delay: 0.1 } } }}
                className="text-white/70 text-sm sm:text-lg md:text-xl max-w-[520px] leading-relaxed hidden sm:block"
              >
                {slide.subtitle}
              </motion.p>

              {/* CTA row */}
              <motion.div
                variants={{ hidden: { opacity: 0, y: 18 }, visible: { opacity: 1, y: 0, transition: { duration: 0.65, delay: 0.2 } } }}
                className="flex flex-row gap-2 sm:gap-4 pt-1 sm:pt-2"
              >
                <Link
                  href="/admissions"
                  className="group inline-flex items-center justify-center gap-2 px-5 py-2.5 sm:px-9 sm:py-4 bg-[#0145F2] hover:bg-[#0030C9] text-white font-black text-xs sm:text-sm tracking-wide rounded-xl shadow-xl shadow-[#0145F2]/30 transition-all duration-300 hover:scale-[1.04]"
                >
                  Enroll Now
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform duration-200" />
                </Link>
                <Link
                  href="/about"
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 sm:px-9 sm:py-4 bg-white/10 border border-white/20 hover:border-white/45 hover:bg-white/18 text-white font-semibold text-xs sm:text-sm tracking-wide rounded-xl backdrop-blur-md transition-all duration-300"
                >
                  Discover Our Story
                </Link>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Numbered slide nav — bottom right */}
        <div className="absolute bottom-10 right-8 z-30 hidden md:flex items-end gap-7">
          {slides.map((s, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`flex flex-col items-center gap-2 transition-all duration-300 ${i === current ? "opacity-100" : "opacity-35 hover:opacity-60"}`}
            >
              <span className={`text-[10px] font-black tracking-widest ${i === current ? "text-[#D4A847]" : "text-white"}`}>
                {s.id}
              </span>
              <div className="w-14 h-px bg-white/20 overflow-hidden">
                {i === current && (
                  <div
                    className="h-full bg-[#D4A847] transition-none"
                    style={{ width: `${progress * 100}%` }}
                  />
                )}
              </div>
            </button>
          ))}
        </div>

        {/* Minimal arrow controls */}
        <button
          onClick={prevSlide}
          aria-label="Previous slide"
          className="absolute left-3 md:left-10 top-1/2 -translate-y-1/2 z-30 w-8 h-8 sm:w-11 sm:h-11 hidden sm:flex items-center justify-center rounded-full border border-white/15 bg-white/8 backdrop-blur-sm text-white/70 hover:border-white/40 hover:text-white hover:bg-white/15 transition-all duration-200"
        >
          <ChevronLeft size={20} />
        </button>
        <button
          onClick={nextSlide}
          aria-label="Next slide"
          className="absolute right-3 md:right-10 top-1/2 -translate-y-1/2 z-30 w-8 h-8 sm:w-11 sm:h-11 hidden sm:flex items-center justify-center rounded-full border border-white/15 bg-white/8 backdrop-blur-sm text-white/70 hover:border-white/40 hover:text-white hover:bg-white/15 transition-all duration-200"
        >
          <ChevronRight size={20} />
        </button>

        {/* Mobile dot indicators */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 flex sm:hidden items-center gap-2">
          {slides.map((_, i) => (
            <button key={i} onClick={() => setCurrent(i)}
              className={`rounded-full transition-all duration-300 ${i === current ? "w-5 h-1.5 bg-[#D4A847]" : "w-1.5 h-1.5 bg-white/40"}`}
            />
          ))}
        </div>

        {/* Animated scroll cue */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 hidden sm:flex flex-col items-center gap-2 text-white/25 select-none">
          <span className="text-[8px] font-black uppercase tracking-[0.5em]">Scroll</span>
          <motion.div
            animate={{ y: [0, 9, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            className="w-px h-10 bg-gradient-to-b from-white/30 to-transparent"
          />
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          § 2  STATS STRIP
      ══════════════════════════════════════════════════════════ */}
      <section className="relative bg-[#0A1E4A] py-14 md:py-18 overflow-hidden">
        <GoldLine />
        <IslamicPattern opacity={0.04} />
        <Noise />
        <div className="max-w-5xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:divide-x lg:divide-white/8">
            {stats.map((s, i) => (
              <StatCounter key={i} {...s} index={i} />
            ))}
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <GoldLine />
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          § 3  PRINCIPAL'S MESSAGE
      ══════════════════════════════════════════════════════════ */}
      <section className="relative py-20 md:py-28 bg-[#FAFAF8] overflow-hidden">
        <DotPattern color="#0145F2" opacity={0.04} />
        <div className="max-w-7xl mx-auto px-6 sm:px-10">
          <div className="grid lg:grid-cols-2 gap-14 lg:gap-20 items-center">

            {/* Photo */}
            <motion.div
              initial={{ opacity: 0, x: -60 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] as const }}
              className="relative"
            >
              {/* Gold frame accent */}
              <div className="absolute -top-4 -left-4 w-28 h-28 border-2 border-[#D4A847]/30 rounded-3xl pointer-events-none z-0" />

              <div className="relative rounded-3xl overflow-hidden aspect-[4/5] bg-gradient-to-br from-[#1E3A8A] to-[#0EA5E9] shadow-2xl shadow-[#1E3A8A]/20 z-10">
                <img
                  src="/images/principal.jpg"
                  alt="School Proprietor"
                  className="w-full h-full object-cover object-top"
                  onError={e => { (e.target as HTMLImageElement).style.display = "none"; }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0F2A5E]/85 via-transparent to-transparent" />
                <IslamicPattern opacity={0.07} />
                <div className="absolute bottom-7 left-7 right-7">
                  <p className="text-white font-black text-lg leading-tight">The Proprietor</p>
                  <p className="text-white/60 text-sm mt-0.5">Crescent Academy, Iwo</p>
                </div>
              </div>

              {/* Star badge */}
              <motion.div
                initial={{ scale: 0, rotate: -10 }}
                whileInView={{ scale: 1, rotate: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
                className="absolute -bottom-5 -right-5 z-20 w-18 h-18 bg-[#0EA5E9] rounded-2xl shadow-xl flex items-center justify-center p-4"
              >
                <Star size={30} className="text-white" fill="white" />
              </motion.div>
            </motion.div>

            {/* Text */}
            <motion.div
              initial={{ opacity: 0, x: 60 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] as const }}
              className="space-y-7"
            >
              <div>
                <p className="flex items-center gap-2 text-[#D4A847] text-[10px] font-black tracking-[0.45em] uppercase mb-4">
                  <span className="w-6 h-px bg-[#D4A847]" />
                  A Word from Leadership
                </p>
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-[#0145F2] leading-[1.02]">
                  A Message of <span className="text-[#D4A847]">Vision</span><br />& Purpose
                </h2>
              </div>

              <div className="relative pl-6 border-l-2 border-[#D4A847]">
                <Quote size={36} className="absolute -top-3 -left-0.5 text-[#D4A847]/20" />
                <p className="text-slate-600 text-lg leading-relaxed italic">
                  With the help of Allah, we founded Crescent Academy with a singular purpose — to raise a generation of children who are not only academically strong, but morally grounded, spiritually alive, and ready to contribute positively to their communities and the world.
                </p>
              </div>

              <p className="text-slate-500 leading-relaxed">
                Every child who walks through our gates is a trust placed in our hands by their parents and by Allah Himself. We remain steadfast in our commitment to nurturing the Complete Child — one who carries both knowledge and character.
              </p>

              <div className="flex items-center gap-4 pt-1">
                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#1E3A8A] to-[#0EA5E9] flex items-center justify-center text-white font-black text-sm shadow-lg">
                  CA
                </div>
                <div>
                  <p className="font-black text-[#1E3A8A] text-sm">The Proprietor</p>
                  <p className="text-slate-400 text-xs">Crescent Academy · Est. 2010</p>
                </div>
              </div>

              <Link href="/about" className="inline-flex items-center gap-2 text-[#0EA5E9] font-bold text-sm hover:gap-4 transition-all duration-300 group">
                Read More About Us <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          § 4  MISSION / VISION / PHILOSOPHY
      ══════════════════════════════════════════════════════════ */}
      <section className="relative py-20 md:py-32 bg-[#0A1E4A] text-white overflow-hidden">
        {/* Campus photo background */}
        <div className="absolute inset-0">
          <img
            src="/images/school-campus.jpg"
            alt=""
            aria-hidden
            className="w-full h-full object-cover opacity-[0.08]"
            onError={e => { (e.target as HTMLImageElement).style.display = "none"; }}
          />
        </div>
        <IslamicPattern opacity={0.055} />
        <Noise />

        {/* Year watermark */}
        <div aria-hidden className="absolute right-0 top-0 bottom-0 flex items-center pointer-events-none select-none overflow-hidden">
          <span className="text-[20rem] font-black text-white/[0.022] leading-none pr-6">2010</span>
        </div>

        <div className="max-w-7xl mx-auto px-6 sm:px-10 relative z-10">
          <div className="text-center mb-16 md:mb-20">
            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
              <EyebrowLabel>Our Foundation</EyebrowLabel>
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.9 }}
              className="mt-5 text-4xl md:text-5xl lg:text-6xl font-black leading-tight"
            >
              Building the <span className="text-[#D4A847]">Complete Child</span>
            </motion.h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6 lg:gap-7">
            {[
              {
                num: "01", title: "Our Mission", featured: false,
                text: "With the help of Allah (SWT), Crescent Academy is dedicated to nurturing a generation of students who are academically sound, morally upright, spiritually conscious, and socially responsible — producing the 'Complete Child.'",
              },
              {
                num: "02", title: "Our Vision", featured: true,
                text: "To be a leading centre of faith-driven excellence, raising leaders who are knowledgeable, disciplined, God-conscious, and prepared to positively impact their communities — both in this life and the Hereafter.",
              },
              {
                num: "03", title: "Our Philosophy", featured: false,
                text: "True education goes beyond academics. We integrate authentic Islamic teachings with robust conventional learning to balance knowledge with Taqwa, character, and service.",
                list: ["Academic excellence", "Moral & spiritual development", "Discipline & integrity", "Leadership & social responsibility"],
              },
            ].map((card, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: i * 0.15 }}
                whileHover={{ y: -8 }}
                className={`relative rounded-3xl p-8 md:p-10 overflow-hidden group transition-all duration-500 ${
                  card.featured
                    ? "bg-[#0EA5E9] shadow-2xl shadow-[#0EA5E9]/25 md:-translate-y-5"
                    : "bg-white/[0.07] backdrop-blur-xl border border-white/10 hover:border-white/22"
                }`}
              >
                {card.featured && <IslamicPattern opacity={0.1} />}
                <span aria-hidden className={`absolute top-5 right-7 text-8xl font-black leading-none select-none pointer-events-none ${card.featured ? "text-white/8" : "text-white/[0.04]"}`}>
                  {card.num}
                </span>
                <div className="relative z-10">
                  <div className={`w-1.5 h-9 rounded-full mb-7 ${card.featured ? "bg-white/35" : "bg-[#D4A847]"}`} />
                  <h3 className="text-2xl font-black mb-4 tracking-tight">{card.title}</h3>
                  <p className={`leading-relaxed text-[0.925rem] ${card.featured ? "text-white/88" : "text-white/65"}`}>{card.text}</p>
                  {card.list && (
                    <ul className="mt-5 space-y-2">
                      {card.list.map((item, j) => (
                        <li key={j} className="flex items-center gap-3 text-white/75 text-sm">
                          <CheckCircle size={14} className="text-[#D4A847] shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Quote */}
          <motion.div
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.5 }}
            className="mt-20 max-w-4xl mx-auto text-center relative"
          >
            <span aria-hidden className="absolute -top-8 left-1/2 -translate-x-1/2 text-[10rem] font-black text-[#D4A847]/10 leading-none select-none pointer-events-none">"</span>
            <p className="text-2xl md:text-3xl font-medium italic text-white/78 leading-relaxed relative z-10">
              By the grace of Allah, every step forward is a step toward building the Complete Child — knowledgeable, disciplined, and prepared for both worlds.
            </p>
            <p className="text-[#D4A847] text-xs font-black mt-6 tracking-[0.3em] uppercase">— Crescent Academy, Since 2010</p>
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          § 5  WHY CHOOSE US — SPLIT LAYOUT
      ══════════════════════════════════════════════════════════ */}
      <section className="relative py-20 md:py-28 bg-[#FAFAF8] overflow-hidden">
        <DiagLines opacity={0.03} />
        <div className="max-w-7xl mx-auto px-6 sm:px-10">
          <div className="grid lg:grid-cols-[1fr_1.25fr] gap-12 lg:gap-16 items-center">

            {/* Photo */}
            <motion.div
              initial={{ opacity: 0, x: -60 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] as const }}
              className="relative"
            >
              <div
                className="relative rounded-3xl overflow-hidden aspect-[3/4] bg-gradient-to-br from-[#1E3A8A] to-[#0EA5E9] shadow-2xl shadow-[#1E3A8A]/15"
                style={{ clipPath: "polygon(0 0, 100% 0, 100% 86%, 82% 100%, 0 100%)" }}
              >
                <img
                  src="/images/students-classroom.jpg"
                  alt="Students at Crescent Academy"
                  className="w-full h-full object-cover"
                  onError={e => { (e.target as HTMLImageElement).style.display = "none"; }}
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-[#1E3A8A]/55 to-transparent" />
                <IslamicPattern opacity={0.06} />

                {/* Floating badge */}
                <motion.div
                  initial={{ opacity: 0, y: 20, scale: 0.85 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.6, duration: 0.6 }}
                  className="absolute bottom-14 right-6 bg-white rounded-2xl px-5 py-4 shadow-2xl"
                >
                  <p className="text-3xl font-black text-[#1E3A8A] leading-none">150+</p>
                  <p className="text-slate-400 text-xs font-semibold mt-1">Prizes & Awards</p>
                </motion.div>
              </div>

              {/* Gold frame */}
              <div aria-hidden className="absolute -top-3 -left-3 w-20 h-20 border-2 border-[#D4A847]/30 rounded-2xl pointer-events-none" />
            </motion.div>

            {/* Pillars list */}
            <motion.div
              initial={{ opacity: 0, x: 60 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] as const }}
              className="space-y-8"
            >
              <div>
                <p className="flex items-center gap-2 text-[#D4A847] text-[10px] font-black tracking-[0.45em] uppercase mb-4">
                  <span className="w-6 h-px bg-[#D4A847]" />
                  Why Choose Crescent
                </p>
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-[#0145F2] leading-[1.02]">
                  What Sets Us <span className="text-[#D4A847]">Apart</span>
                </h2>
                <p className="text-slate-500 mt-4 leading-relaxed text-[0.95rem]">
                  A school that genuinely cares about who your child becomes — not just their grades, but their character, faith, and future.
                </p>
              </div>

              <div className="space-y-3">
                {pillars.map(({ icon: Icon, title, desc }, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: 24 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.07, duration: 0.55 }}
                    className="group flex gap-4 p-4 rounded-2xl hover:bg-white hover:shadow-lg hover:shadow-[#0145F2]/8 transition-all duration-300 cursor-default border border-transparent hover:border-[#0145F2]/8"
                  >
                    <div className="w-11 h-11 shrink-0 bg-[#0145F2]/6 group-hover:bg-[#0145F2]/12 rounded-xl flex items-center justify-center transition-colors duration-300">
                      <Icon size={19} className="text-[#0145F2] transition-colors" />
                    </div>
                    <div>
                      <h3 className="font-black text-[#0145F2] text-sm mb-0.5">{title}</h3>
                      <p className="text-slate-500 text-xs leading-relaxed">{desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          § 6  SCHOOL LIFE GALLERY STRIP
      ══════════════════════════════════════════════════════════ */}
      <section className="relative py-16 md:py-20 bg-white overflow-hidden">
        <DotPattern color="#0145F2" opacity={0.035} />
        <div className="max-w-7xl mx-auto px-6 sm:px-10 mb-10 flex items-end justify-between">
          <div>
            <p className="flex items-center gap-2 text-[#D4A847] text-[10px] font-black tracking-[0.45em] uppercase mb-2">
              <span className="w-6 h-px bg-[#D4A847]" />
              School Life
            </p>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-[#0145F2]">Life at <span className="text-[#D4A847]">The Crescent Academy</span></h2>
          </div>
          <Link href="/gallery" className="hidden md:inline-flex items-center gap-2 text-[#0EA5E9] font-bold text-sm hover:gap-4 transition-all duration-300 group">
            View Gallery <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="flex gap-4 overflow-x-auto pb-4 px-6 sm:px-10 scrollbar-hide snap-x snap-mandatory">
          {galleryItems.map((img, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.94 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07, duration: 0.55 }}
              className="group relative shrink-0 w-64 md:w-72 aspect-[2/3] rounded-2xl overflow-hidden bg-gradient-to-br from-[#1E3A8A] to-[#0EA5E9] snap-start cursor-pointer shadow-md hover:shadow-xl transition-shadow duration-300"
            >
              <img
                src={img.src}
                alt={img.label}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                onError={e => { (e.target as HTMLImageElement).style.display = "none"; }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent" />
              <div className="absolute inset-0 bg-[#0EA5E9]/0 group-hover:bg-[#0EA5E9]/12 transition-colors duration-400" />
              <p className="absolute bottom-5 left-5 right-5 text-white font-bold text-sm">{img.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          § 7  HISTORY / TIMELINE
      ══════════════════════════════════════════════════════════ */}
      <section className="relative py-20 md:py-28 bg-[#FAFAF8] overflow-hidden">
        <DotPattern color="#0145F2" opacity={0.038} />
        <div aria-hidden className="absolute left-0 top-1/2 -translate-y-1/2 pointer-events-none select-none">
          <span className="text-[17rem] font-black text-[#1E3A8A]/[0.028] leading-none pl-4">2010</span>
        </div>

        <div className="max-w-7xl mx-auto px-6 sm:px-10 relative z-10">
          <div className="text-center mb-16">
            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
              <EyebrowLabel>Our Journey</EyebrowLabel>
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 35 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.8 }}
              className="mt-5 text-4xl md:text-5xl lg:text-6xl font-black text-[#0145F2]"
            >
              History of <span className="text-[#D4A847]">The Crescent Academy</span>
            </motion.h2>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Photo + text */}
            <motion.div
              initial={{ opacity: 0, x: -60 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] as const }}
              className="space-y-7"
            >
              <div className="relative rounded-3xl overflow-hidden aspect-[4/3] bg-gradient-to-br from-[#1E3A8A] to-[#0EA5E9] shadow-xl shadow-[#1E3A8A]/12">
                <img
                  src="/images/school-building.jpg"
                  alt="Crescent Academy campus"
                  className="w-full h-full object-cover"
                  onError={e => { (e.target as HTMLImageElement).style.display = "none"; }}
                />
                <div className="absolute inset-0 bg-gradient-to-br from-[#0EA5E9]/20 to-[#1E3A8A]/65" />
                <IslamicPattern opacity={0.07} />
                <div className="absolute bottom-6 left-6">
                  <p className="text-white font-black text-xl">Est. 2010</p>
                  <p className="text-white/60 text-sm">Ajegbe Close, Panada Area, Iwo</p>
                </div>
              </div>

              <p className="text-slate-700 leading-relaxed">
                With the help of Allah (SWT), <strong className="text-[#1E3A8A]">Crescent Academy</strong> was founded on Monday, 13th September 2010, as a co-educational institution dedicated to providing a harmonious blend of conventional and authentic Islamic education.
              </p>

              <blockquote className="border-l-4 border-[#D4A847] pl-5 py-1.5 bg-[#D4A847]/5 rounded-r-2xl text-slate-600 italic text-[0.95rem] leading-relaxed">
                From humble beginnings, Crescent Academy has grown steadily over sixteen years into a reputable centre of learning known for discipline, excellence, and strong Islamic values.
              </blockquote>
            </motion.div>

            {/* Timeline */}
            <motion.div
              initial={{ opacity: 0, x: 60 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] as const }}
            >
              <h4 className="flex items-center gap-3 text-lg font-black text-[#1E3A8A] mb-8">
                <Trophy size={20} className="text-[#D4A847]" />
                Key Milestones
              </h4>

              <div className="relative pl-9 space-y-5 before:absolute before:left-3.5 before:top-2 before:bottom-2 before:w-px before:bg-gradient-to-b before:from-[#D4A847] before:via-[#0EA5E9] before:to-[#1E3A8A]">
                {milestones.map((m, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.12, duration: 0.55 }}
                    className="relative group"
                  >
                    <motion.span
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.12 + 0.18, type: "spring", stiffness: 250 }}
                      className="absolute -left-9 top-[18px] w-5 h-5 rounded-full bg-white border-2 border-[#0EA5E9] group-hover:border-[#D4A847] group-hover:bg-[#D4A847] transition-all duration-300 shadow-md"
                    />
                    <div className="bg-white border border-slate-100 rounded-2xl p-5 hover:shadow-lg hover:border-[#0EA5E9]/20 transition-all duration-300">
                      <span className="text-[#0EA5E9] font-black text-xs uppercase tracking-wide block mb-1.5">{m.year}</span>
                      <p className="text-slate-700 text-sm leading-relaxed">{m.text}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          § 8  TESTIMONIALS
      ══════════════════════════════════════════════════════════ */}
      <section className="relative py-20 md:py-28 bg-[#0A1E4A] text-white overflow-hidden">
        <IslamicPattern opacity={0.05} />
        <Noise />
        <div aria-hidden className="absolute top-0 right-10 text-[16rem] font-black text-white/[0.025] leading-none select-none pointer-events-none">"</div>

        <div className="max-w-5xl mx-auto px-6 sm:px-10 relative z-10">
          <div className="text-center mb-14">
            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
              <EyebrowLabel>Testimonials</EyebrowLabel>
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.8 }}
              className="mt-5 text-4xl md:text-5xl font-black"
            >
              Voices from Our Community
            </motion.h2>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={testimonialIdx}
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -18 }}
              transition={{ duration: 0.55 }}
              className="bg-white/[0.07] backdrop-blur-xl border border-white/10 rounded-3xl p-10 md:p-14 text-center"
            >
              <div className="flex justify-center gap-1 mb-7">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={17} className="text-[#D4A847]" fill="#D4A847" />
                ))}
              </div>
              <p className="text-xl md:text-2xl text-white/88 leading-relaxed italic mb-10 max-w-3xl mx-auto">
                "{testimonials[testimonialIdx].quote}"
              </p>
              <div className="flex flex-col items-center gap-3">
                <div className="w-13 h-13 rounded-full bg-gradient-to-br from-[#0EA5E9] to-[#1E3A8A] flex items-center justify-center text-white font-black text-sm shadow-lg p-4">
                  {testimonials[testimonialIdx].initials}
                </div>
                <div>
                  <p className="font-bold text-white">{testimonials[testimonialIdx].name}</p>
                  <p className="text-white/45 text-sm">{testimonials[testimonialIdx].role}</p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="flex items-center justify-center gap-4 mt-9">
            <button
              onClick={() => setTestimonialIdx(p => (p - 1 + testimonials.length) % testimonials.length)}
              className="w-10 h-10 rounded-full border border-white/15 flex items-center justify-center text-white/50 hover:border-white/45 hover:text-white transition-all"
            >
              <ChevronLeft size={17} />
            </button>
            <div className="flex gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setTestimonialIdx(i)}
                  className={`rounded-full transition-all duration-300 ${i === testimonialIdx ? "w-7 h-2 bg-[#D4A847]" : "w-2 h-2 bg-white/25 hover:bg-white/45"}`}
                />
              ))}
            </div>
            <button
              onClick={() => setTestimonialIdx(p => (p + 1) % testimonials.length)}
              className="w-10 h-10 rounded-full border border-white/15 flex items-center justify-center text-white/50 hover:border-white/45 hover:text-white transition-all"
            >
              <ChevronRight size={17} />
            </button>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          § 9  NEWS & EVENTS
      ══════════════════════════════════════════════════════════ */}
      <section className="relative py-20 md:py-28 bg-[#FAFAF8] overflow-hidden">
        <DiagLines opacity={0.028} />
        <div className="max-w-7xl mx-auto px-6 sm:px-10">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12">
            <div>
              <p className="flex items-center gap-2 text-[#D4A847] text-[10px] font-black tracking-[0.45em] uppercase mb-3">
                <span className="w-6 h-px bg-[#D4A847]" />
                Stay Updated
              </p>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-[#0145F2]">News & <span className="text-[#D4A847]">Events</span></h2>
            </div>
            <Link href="/news" className="inline-flex items-center gap-2 text-[#0EA5E9] font-bold text-sm hover:gap-4 transition-all duration-300 group">
              View All <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-7">
            {news.map((item, i) => (
              <motion.article
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.65 }}
                className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-[#1E3A8A]/8 transition-all duration-500 hover:-translate-y-2"
              >
                <div className="relative overflow-hidden aspect-[16/10] bg-gradient-to-br from-[#1E3A8A] to-[#0EA5E9]">
                  <img
                    src={item.image} alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    onError={e => { (e.target as HTMLImageElement).style.opacity = "0"; }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                  <span className={`absolute bottom-4 left-4 ${item.tag} text-white text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-wide`}>
                    {item.category}
                  </span>
                </div>
                <div className="p-7">
                  <p className="text-[10px] text-slate-400 mb-3 font-bold uppercase tracking-widest">{item.date}</p>
                  <h3 className="text-lg font-black text-[#0145F2] mb-3 group-hover:text-[#D4A847] transition-colors line-clamp-2 leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-slate-500 text-sm leading-relaxed line-clamp-3 mb-5">{item.excerpt}</p>
                  <span className="inline-flex items-center gap-2 text-[#0EA5E9] font-black text-xs uppercase tracking-wide group-hover:gap-4 transition-all duration-300">
                    Read More <ArrowRight size={13} />
                  </span>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          § 10  TRUST STRIP
      ══════════════════════════════════════════════════════════ */}
      <section className="py-10 bg-white border-y border-slate-100/80">
        <div className="max-w-5xl mx-auto px-6">
          <div className="flex flex-wrap items-center justify-center gap-6 md:gap-14">
            {[
              "Co-Educational · Est. 2010",
              "Registered with Osun State MoE",
              "Nursery · Primary · Secondary · Vocational",
              "Iwo, Osun State",
            ].map((item, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center gap-3 text-slate-400 text-[10px] font-black tracking-[0.3em] uppercase"
              >
                {i > 0 && <span className="w-1.5 h-1.5 rounded-full bg-[#D4A847] hidden md:block shrink-0" />}
                {item}
              </motion.span>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          § 11  CTA BANNER
      ══════════════════════════════════════════════════════════ */}
      <section className="relative py-24 md:py-36 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/images/school-campus.jpg"
            alt=""
            aria-hidden
            className="w-full h-full object-cover"
            onError={e => { (e.target as HTMLImageElement).style.display = "none"; }}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-[#061529]/94 via-[#0F2A5E]/88 to-[#0EA5E9]/65" />
        </div>
        <IslamicPattern opacity={0.06} />
        <Noise />

        <div className="max-w-4xl mx-auto px-6 text-center relative z-10 text-white">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9 }}
            className="space-y-7"
          >
            <EyebrowLabel>Join Our Family</EyebrowLabel>
            <h2 className="text-4xl md:text-6xl font-black leading-[1.05] tracking-tight">
              Give Your Child the Education<br className="hidden sm:block" /> They{" "}
              <span className="text-[#D4A847]">Truly Deserve</span>
            </h2>
            <p className="text-white/70 text-lg max-w-2xl mx-auto leading-relaxed">
              Join hundreds of families who trust Crescent Academy to raise academically excellent, morally upright, and spiritually grounded children.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link
                href="/admissions"
                className="group inline-flex items-center justify-center gap-2 px-11 py-5 bg-[#0EA5E9] hover:bg-[#0284C7] text-white font-black text-sm tracking-wide rounded-xl shadow-2xl shadow-[#0EA5E9]/30 transition-all duration-300 hover:scale-[1.04]"
              >
                Apply for Admission <ArrowRight size={17} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center px-11 py-5 bg-white/10 border border-white/22 backdrop-blur-md text-white font-semibold text-sm tracking-wide rounded-xl hover:bg-white/18 hover:border-white/40 transition-all duration-300"
              >
                Contact Us
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

    </div>
  );
}
