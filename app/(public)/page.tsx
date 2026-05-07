"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import {
  ChevronLeft, ChevronRight, BookOpen, Trophy, Users,
  GraduationCap, Shield, Star, ArrowRight, Quote,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

// ── Fonts ─────────────────────────────────────────────────────
const displayFont = "var(--font-display, 'Cormorant Garamond', Georgia, serif)";
const bodyFont    = "var(--font-body, 'Plus Jakarta Sans', system-ui, sans-serif)";

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

// ── Sub-components ────────────────────────────────────────────
const IslamicPattern = ({ opacity = 0.05 }: { opacity?: number }) => (
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
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#ip)" />
  </svg>
);

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
      transition={{ delay: index * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col items-center text-white group"
    >
      <div
        className="w-14 h-14 mb-4 rounded-2xl flex items-center justify-center transition-all duration-300"
        style={{ background: "rgba(255,255,255,0.12)" }}
      >
        <Icon size={24} style={{ color: "#fff" }} />
      </div>
      <p
        className="tabular-nums"
        style={{ fontFamily: displayFont, fontSize: "clamp(2.5rem,5vw,4rem)", fontWeight: 700, lineHeight: 1 }}
      >
        {count}{suffix}
      </p>
      <div className="w-8 h-0.5 my-3 rounded-full" style={{ background: "rgba(255,255,255,0.3)" }} />
      <p
        className="text-center"
        style={{ fontFamily: bodyFont, fontSize: 13, color: "rgba(255,255,255,0.75)", letterSpacing: "0.02em" }}
      >
        {label}
      </p>
    </motion.div>
  );
}

// ── Data ──────────────────────────────────────────────────────
const slides = [
  {
    id: "01",
    image: "/images/hero-students-classroom.jpg",
    eyebrow: "THE CRESCENT ACADEMY · EST. 2010 · IWO, OSUN STATE",
    line1: "Nurturing the",
    line2: "Complete Child",
    subtitle: "A harmonious blend of academic excellence and authentic Islamic values",
  },
  {
    id: "02",
    image: "/images/hero-islamic-education.jpg",
    eyebrow: "THE CRESCENT ACADEMY · KNOWLEDGE WITH TAQWA",
    line1: "Faith · Knowledge",
    line2: "· Character",
    subtitle: "Building morally upright leaders for this world and the Hereafter",
  },
  {
    id: "03",
    image: "/images/hero-graduation.jpg",
    eyebrow: "THE CRESCENT ACADEMY · DISCIPLINE & INTEGRITY",
    line1: "Excellence in",
    line2: "Every Step",
    subtitle: "From Nursery to Vocational — a journey of growth and guidance",
  },
];

const stats = [
  { raw: 16,  suffix: "+", label: "Years of Excellence",  icon: Star },
  { raw: 150, suffix: "+", label: "Prizes & Awards",      icon: Trophy },
  { raw: 30,  suffix: "+", label: "Distinguished Awards", icon: Shield },
  { raw: 3,   suffix: "",  label: "School Sections",      icon: GraduationCap },
] as const;

const pillars = [
  {
    icon: BookOpen,      title: "Academic Excellence",
    desc: "Rigorous curriculum aligned with national standards, producing top performers year after year.",
    highlight: false,
  },
  {
    icon: Shield,        title: "Moral & Spiritual Growth",
    desc: "Authentic Islamic values woven into every subject, building Taqwa alongside knowledge.",
    highlight: false,
  },
  {
    icon: Users,         title: "Holistic Development",
    desc: "Sports, arts, leadership, and vocational skills to nurture every dimension of the child.",
    highlight: false,
  },
  {
    icon: Trophy,        title: "Award-Winning Institution",
    desc: "Over 150 prizes and awards in academics, Qur'an, sports, and inter-school competitions.",
    highlight: true,
  },
  {
    icon: GraduationCap, title: "Three-Tier Education",
    desc: "Nursery & Primary, Secondary (College), and Vocational (School of Science) under one vision.",
    highlight: false,
  },
  {
    icon: Star,          title: "Qualified Educators",
    desc: "Dedicated, certified teachers who combine professional competence with moral uprightness.",
    highlight: false,
  },
];

const galleryItems = [
  { src: "/images/gallery-students-1.jpg", label: "Classroom Excellence" },
  { src: "/images/gallery-assembly.jpg",   label: "Morning Assembly" },
  { src: "/images/gallery-sports.jpg",     label: "Sports Day" },
  { src: "/images/gallery-quran.jpg",      label: "Qur'anic Studies" },
  { src: "/images/gallery-lab.jpg",        label: "Science Lab" },
  { src: "/images/gallery-awards.jpg",     label: "Prize Giving Day" },
];

const milestones = [
  { year: "2010",      text: "Founded in Ajegbe Close, Panada Area, Iwo" },
  { year: "2010–16",   text: "Early growth: Nursery & Primary sections established" },
  { year: "2014",      text: "Establishment of Crescent College (Secondary)" },
  { year: "2023",      text: "Launch of Crescent School of Science (Vocational)" },
  { year: "Today",     text: "150+ prizes, 30+ awards, thriving alumni network" },
];

const testimonials = [
  {
    initials: "FA",
    name: "Mrs. Fatimah Adeyemi",
    role: "Parent · JSS 2",
    quote: "The transformation in my daughter since joining The Crescent Academy has been remarkable. She is more confident, disciplined, and spiritually grounded. Alhamdulillah.",
  },
  {
    initials: "AO",
    name: "Br. Abdullahi Olatunde",
    role: "Alumni · Class of 2019",
    quote: "The Crescent Academy didn't just give me certificates — it built my character. The values I learned here shaped who I am today as a professional and a Muslim.",
  },
  {
    initials: "MB",
    name: "Alhaji Musa Babatunde",
    role: "Parent · SSS 1",
    quote: "I've seen three of my children through this school and each one emerged excellent. The teachers genuinely care. This is not just a school — it's a family.",
  },
];

const news = [
  {
    title: "Iwo Day Football Tournament – Runners-Up!",
    date: "Nov 15, 2025",
    image: "/images/news-football.jpg",
    excerpt: "Our boys' team showed incredible teamwork and discipline, defeating every public school to reach the final.",
    category: "Sports",
  },
  {
    title: "Qur'anic Recitation Competition Winners",
    date: "Oct 28, 2025",
    image: "/images/news-quran.jpg",
    excerpt: "Students secured 1st and 2nd place in the regional Qur'anic competition — a testament to our spiritual excellence.",
    category: "Spiritual",
  },
  {
    title: "Annual Prize-Giving Day 2025",
    date: "Sep 13, 2025",
    image: "/images/news-prize-giving.jpg",
    excerpt: "Celebrating 15 years of nurturing the Complete Child with awards, speeches, and joyful moments.",
    category: "Events",
  },
];

const SLIDE_DURATION = 10000;

// ── Page ──────────────────────────────────────────────────────
export default function HomePage() {
  const [current,        setCurrent]        = useState(0);
  const [paused,         setPaused]         = useState(false);
  const [progress,       setProgress]       = useState(0);
  const [testimonialIdx, setTestimonialIdx] = useState(0);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => setCurrent(p => (p + 1) % slides.length), SLIDE_DURATION);
    return () => clearInterval(id);
  }, [paused]);

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

  useEffect(() => {
    const id = setInterval(() => setTestimonialIdx(p => (p + 1) % testimonials.length), 5000);
    return () => clearInterval(id);
  }, []);

  const slide = slides[current];
  const prevSlide = () => setCurrent(p => (p - 1 + slides.length) % slides.length);
  const nextSlide = () => setCurrent(p => (p + 1) % slides.length);

  return (
    <div style={{ background: "#F7F5F1", color: "#1A1714", overflowX: "hidden" }}>

      {/* ══════════════════════════════════════════════════════
          § 1  HERO
      ══════════════════════════════════════════════════════ */}
      <section
        className="relative flex items-center overflow-hidden"
        style={{ height: "100dvh", minHeight: 560 }}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {/* Cross-fade background images */}
        <AnimatePresence mode="sync">
          <motion.div
            key={current}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            <div className="absolute inset-0" style={{ background: "#060E1C" }} />
            <img
              src={slide.image}
              alt=""
              aria-hidden
              className="absolute inset-0 w-full h-full object-cover"
              style={{ opacity: 0.35 }}
              onError={e => { (e.target as HTMLImageElement).style.display = "none"; }}
            />
            {/* Dual navy overlay — no olive, no green */}
            <div
              className="absolute inset-0"
              style={{
                background: "linear-gradient(105deg, rgba(6,14,28,0.88) 0%, rgba(6,14,28,0.65) 50%, rgba(6,14,28,0.3) 100%)",
              }}
            />
            <div
              className="absolute inset-0"
              style={{ background: "linear-gradient(to top, rgba(6,14,28,0.7) 0%, transparent 60%)" }}
            />
          </motion.div>
        </AnimatePresence>

        <IslamicPattern opacity={0.06} />

        {/* Large faint crescent watermark — top right */}
        <svg
          aria-hidden
          viewBox="0 0 200 200"
          className="absolute -right-16 -top-16 pointer-events-none select-none"
          style={{ width: 500, height: 500, opacity: 0.06, color: "#fff", fill: "currentColor" }}
        >
          <path d="M100,10 A90,90 0 1,1 100,190 A62,62 0 1,0 100,10 Z" />
          <circle cx="135" cy="48" r="9" />
          <circle cx="158" cy="72" r="5.5" />
        </svg>

        {/* Left-aligned content */}
        <div className="relative z-20 w-full max-w-7xl mx-auto px-6 sm:px-10 lg:px-16" style={{ paddingTop: "5rem" }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={`hero-${current}`}
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0, y: -10, transition: { duration: 0.25 } }}
              variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.15 } } }}
              style={{ maxWidth: 680 }}
            >
              {/* Eyebrow pill */}
              <motion.div
                variants={{ hidden: { opacity: 0, y: 18 }, visible: { opacity: 1, y: 0, transition: { duration: 0.65, delay: 0.3 } } }}
                className="inline-flex items-center mb-6"
                style={{
                  border: "1px solid rgba(33,150,196,0.45)",
                  background: "rgba(33,150,196,0.1)",
                  borderRadius: 99,
                  padding: "6px 18px",
                }}
              >
                <span style={{ fontFamily: bodyFont, fontSize: 11, color: "#6CC4E8", letterSpacing: "0.1em" }}>
                  {slide.eyebrow}
                </span>
              </motion.div>

              {/* Headline */}
              <div style={{ marginBottom: "1.5rem" }}>
                <div className="overflow-hidden leading-none">
                  <motion.h1
                    variants={{ hidden: { y: "105%" }, visible: { y: 0, transition: { duration: 0.95, ease: [0.16, 1, 0.3, 1] as const, delay: 0.5 } } }}
                    style={{
                      fontFamily: displayFont,
                      fontSize: "clamp(3.2rem, 7vw, 6rem)",
                      fontWeight: 600,
                      lineHeight: 1.05,
                      color: "#fff",
                      display: "block",
                    }}
                  >
                    {slide.line1}
                  </motion.h1>
                </div>
                <div className="overflow-hidden leading-none">
                  <motion.h1
                    variants={{ hidden: { y: "105%" }, visible: { y: 0, transition: { duration: 0.95, ease: [0.16, 1, 0.3, 1] as const, delay: 0.57 } } }}
                    style={{
                      fontFamily: displayFont,
                      fontSize: "clamp(3.2rem, 7vw, 6rem)",
                      fontWeight: 700,
                      fontStyle: "italic",
                      lineHeight: 1.05,
                      color: "#3BADD9",
                      display: "block",
                    }}
                  >
                    {slide.line2}
                  </motion.h1>
                </div>
              </div>

              {/* Subtitle */}
              <motion.p
                variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.75, delay: 0.7 } } }}
                style={{ fontFamily: bodyFont, fontSize: 18, color: "rgba(255,255,255,0.72)", maxWidth: 480, lineHeight: 1.65, marginBottom: "2rem" }}
                className="hidden sm:block"
              >
                {slide.subtitle}
              </motion.p>

              {/* CTA buttons */}
              <motion.div
                variants={{ hidden: { opacity: 0, y: 18 }, visible: { opacity: 1, y: 0, transition: { duration: 0.65, delay: 0.9 } } }}
                className="flex flex-wrap gap-3 mb-8"
              >
                <Link
                  href="/admissions"
                  className="inline-flex items-center gap-2 font-semibold text-sm rounded-full transition-all duration-200"
                  style={{
                    fontFamily: bodyFont,
                    background: "#2196C4",
                    color: "#fff",
                    padding: "14px 32px",
                    height: 52,
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = "#3BADD9"; e.currentTarget.style.transform = "translateY(-2px)"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "#2196C4"; e.currentTarget.style.transform = "translateY(0)"; }}
                >
                  Apply for Admission <ArrowRight size={16} />
                </Link>
                <Link
                  href="/about"
                  className="inline-flex items-center gap-2 font-semibold text-sm rounded-full transition-all duration-200"
                  style={{
                    fontFamily: bodyFont,
                    background: "transparent",
                    border: "1px solid rgba(255,255,255,0.5)",
                    color: "#fff",
                    padding: "14px 32px",
                    height: 52,
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.color = "#0B1F3A"; e.currentTarget.style.borderColor = "#fff"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#fff"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.5)"; }}
                >
                  Discover Our Story
                </Link>
              </motion.div>

              {/* Stat pills */}
              <motion.div
                variants={{ hidden: { opacity: 0, y: 18 }, visible: { opacity: 1, y: 0, transition: { duration: 0.65, delay: 1.1 } } }}
                className="flex flex-wrap gap-3"
              >
                {["16+ Years", "150+ Prizes", "3 School Sections"].map(pill => (
                  <span
                    key={pill}
                    style={{
                      fontFamily: bodyFont,
                      fontSize: 13,
                      background: "rgba(255,255,255,0.08)",
                      border: "1px solid rgba(255,255,255,0.15)",
                      color: "rgba(255,255,255,0.85)",
                      borderRadius: 99,
                      padding: "8px 18px",
                    }}
                  >
                    {pill}
                  </span>
                ))}
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Slide progress indicators — bottom left */}
        <div className="absolute bottom-10 left-6 sm:left-16 z-30 hidden md:flex items-end gap-6">
          {slides.map((s, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              style={{ opacity: i === current ? 1 : 0.35, transition: "opacity 0.3s" }}
              className="flex flex-col items-start gap-2"
            >
              <span
                style={{
                  fontFamily: bodyFont,
                  fontSize: 10,
                  letterSpacing: "0.3em",
                  color: i === current ? "#3BADD9" : "#fff",
                  transition: "color 0.3s",
                }}
              >
                {s.id}
              </span>
              <div className="overflow-hidden rounded-full" style={{ width: 40, height: i === current ? 3 : 2, background: "rgba(255,255,255,0.2)" }}>
                {i === current && (
                  <div className="h-full rounded-full" style={{ width: `${progress * 100}%`, background: "#2196C4", transition: "none" }} />
                )}
              </div>
            </button>
          ))}
        </div>

        {/* Arrow controls */}
        <button
          onClick={prevSlide}
          aria-label="Previous slide"
          className="absolute left-4 md:left-10 top-1/2 -translate-y-1/2 z-30 w-10 h-10 hidden sm:flex items-center justify-center rounded-full transition-all duration-200"
          style={{ border: "1px solid rgba(255,255,255,0.2)", background: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.7)", backdropFilter: "blur(8px)" }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.5)"; e.currentTarget.style.color = "#fff"; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)"; e.currentTarget.style.color = "rgba(255,255,255,0.7)"; }}
        >
          <ChevronLeft size={20} />
        </button>
        <button
          onClick={nextSlide}
          aria-label="Next slide"
          className="absolute right-4 md:right-10 top-1/2 -translate-y-1/2 z-30 w-10 h-10 hidden sm:flex items-center justify-center rounded-full transition-all duration-200"
          style={{ border: "1px solid rgba(255,255,255,0.2)", background: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.7)", backdropFilter: "blur(8px)" }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.5)"; e.currentTarget.style.color = "#fff"; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)"; e.currentTarget.style.color = "rgba(255,255,255,0.7)"; }}
        >
          <ChevronRight size={20} />
        </button>

        {/* Mobile dots */}
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-30 flex sm:hidden gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className="rounded-full transition-all duration-300"
              style={{ width: i === current ? 20 : 6, height: 6, background: i === current ? "#2196C4" : "rgba(255,255,255,0.4)" }}
            />
          ))}
        </div>

        {/* Scroll cue */}
        <div className="absolute bottom-8 right-10 z-30 hidden md:flex flex-col items-center gap-2" style={{ color: "rgba(255,255,255,0.35)" }}>
          <span style={{ fontFamily: bodyFont, fontSize: 10, letterSpacing: "0.4em", textTransform: "uppercase" }}>Scroll</span>
          <motion.div
            animate={{ y: [0, 9, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            className="w-px h-10 rounded-full"
            style={{ background: "linear-gradient(to bottom, #3BADD9, transparent)" }}
          />
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          § 2  STATS STRIP — sky-500 background
      ══════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden" style={{ background: "#2196C4", padding: "4rem 0" }}>
        <IslamicPattern opacity={0.06} />
        <div className="relative z-10 max-w-5xl mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-10">
            {stats.map((s, i) => (
              <div key={i} className="relative">
                <StatCounter {...s} index={i} />
                {i < stats.length - 1 && (
                  <div
                    className="hidden lg:block absolute right-0 top-1/2 -translate-y-1/2"
                    style={{ width: 1, height: 60, background: "rgba(255,255,255,0.2)" }}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          § 3  PROPRIETOR'S MESSAGE — pearl bg
      ══════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden" style={{ background: "#F7F5F1", padding: "clamp(4rem,8vw,7rem) 0" }}>
        {/* Dot pattern */}
        <div aria-hidden className="absolute inset-0 pointer-events-none" style={{ opacity: 0.04 }}>
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="dots" x="0" y="0" width="28" height="28" patternUnits="userSpaceOnUse">
                <circle cx="2" cy="2" r="1.5" fill="#0B1F3A" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#dots)" />
          </svg>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-10">
          <div className="grid lg:grid-cols-2 gap-14 lg:gap-20 items-center">

            {/* Photo side */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
              className="relative"
            >
              {/* Sky-100 circle behind photo */}
              <div
                className="absolute rounded-full"
                style={{
                  width: "110%", height: "110%",
                  top: "-5%", left: "-5%",
                  background: "#E8F6FC",
                  zIndex: 0,
                }}
              />
              <div
                className="relative z-10 rounded-2xl overflow-hidden shadow-2xl"
                style={{ border: "4px solid #E8F6FC", aspectRatio: "4/5" }}
              >
                <img
                  src="/images/principal.jpg"
                  alt="School Proprietor"
                  className="w-full h-full object-cover object-top"
                  onError={e => { (e.target as HTMLImageElement).style.display = "none"; }}
                />
                <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(11,31,58,0.7) 0%, transparent 50%)" }} />
                <div className="absolute bottom-6 left-6 right-6">
                  <p style={{ fontFamily: displayFont, fontWeight: 600, fontSize: 20, color: "#fff" }}>The Proprietor</p>
                  <p style={{ fontFamily: bodyFont, fontSize: 13, color: "rgba(255,255,255,0.65)", marginTop: 2 }}>The Crescent Academy, Iwo</p>
                </div>
              </div>
            </motion.div>

            {/* Text side */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.75, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="relative"
            >
              {/* Giant decorative quote mark */}
              <div
                className="absolute -top-4 -left-2 select-none pointer-events-none"
                style={{ fontFamily: displayFont, fontSize: 120, color: "#0B1F3A", opacity: 0.06, lineHeight: 1 }}
                aria-hidden
              >
                &ldquo;
              </div>

              <p style={{ fontFamily: bodyFont, fontSize: 11, color: "#2196C4", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 16 }}>
                A WORD FROM LEADERSHIP
              </p>
              <h2 style={{ fontFamily: displayFont, fontSize: "clamp(1.75rem,3.5vw,2.75rem)", fontWeight: 600, color: "#1A1714", lineHeight: 1.2, marginBottom: "1.5rem" }}>
                A Vision for the{" "}
                <em style={{ color: "#2196C4", fontStyle: "italic" }}>Complete Child</em>
              </h2>
              <p style={{ fontFamily: displayFont, fontStyle: "italic", fontSize: 22, color: "#1A1714", lineHeight: 1.7, marginBottom: "2rem" }}>
                &ldquo;Our mission has always been simple: to raise children who are excellent in their studies, strong in their faith, and good in their character. Every decision we make at The Crescent Academy is guided by this singular purpose.&rdquo;
              </p>

              <div style={{ width: 40, height: 3, background: "#2196C4", borderRadius: 99, marginBottom: 16 }} />
              <p style={{ fontFamily: bodyFont, fontWeight: 600, fontSize: 16, color: "#0B1F3A" }}>The Proprietor</p>
              <p style={{ fontFamily: bodyFont, fontSize: 13, color: "#2196C4", marginTop: 2 }}>The Crescent Academy, Iwo</p>

              <Link
                href="/about"
                className="inline-flex items-center gap-2 mt-8 font-medium text-sm transition-colors duration-200"
                style={{ fontFamily: bodyFont, color: "#0B1F3A" }}
                onMouseEnter={e => (e.currentTarget.style.color = "#2196C4")}
                onMouseLeave={e => (e.currentTarget.style.color = "#0B1F3A")}
              >
                Read More About Us <ArrowRight size={15} />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          § 4  MISSION / VISION / PHILOSOPHY — navy-900 bg
      ══════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden" style={{ background: "#0B1F3A", padding: "clamp(4rem,8vw,7rem) 0" }}>
        <IslamicPattern opacity={0.04} />
        <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-10">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            className="text-center mb-16"
          >
            <p style={{ fontFamily: bodyFont, fontSize: 11, color: "#2196C4", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 16 }}>
              OUR FOUNDATION
            </p>
            <h2 style={{ fontFamily: displayFont, fontSize: "clamp(1.75rem,3.5vw,2.75rem)", fontWeight: 600, color: "#fff", lineHeight: 1.2 }}>
              What We Stand{" "}
              <em style={{ color: "#3BADD9", fontStyle: "italic" }}>For</em>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {[
              {
                num: "01",
                title: "Mission",
                desc: "Nurturing a generation of students who are academically sound, morally upright, spiritually conscious, and socially responsible — \"the Complete Child\".",
              },
              {
                num: "02",
                title: "Vision",
                desc: "To be a leading centre of faith-driven excellence raising leaders who are knowledgeable, disciplined, God-conscious, and prepared to impact their communities.",
              },
              {
                num: "03",
                title: "Philosophy",
                desc: "True education integrates authentic Islamic teachings with robust conventional learning — balancing knowledge with Taqwa, character, and service.",
              },
            ].map((card, i) => (
              <motion.div
                key={card.num}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.6, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                className="group relative rounded-2xl p-8 cursor-default"
                style={{
                  background: "#112847",
                  border: "1px solid #1A3460",
                  borderTop: "3px solid #2196C4",
                  transition: "border-top-color 0.3s, background 0.3s",
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderTopColor = "#C4973A";
                  e.currentTarget.style.background = "#1A3460";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderTopColor = "#2196C4";
                  e.currentTarget.style.background = "#112847";
                }}
              >
                <p
                  className="mb-4 select-none"
                  style={{ fontFamily: displayFont, fontSize: 72, fontWeight: 700, color: "#245285", opacity: 0.4, lineHeight: 1 }}
                >
                  {card.num}
                </p>
                <div
                  className="w-11 h-11 rounded-full flex items-center justify-center mb-4"
                  style={{ background: "rgba(33,150,196,0.1)" }}
                >
                  <Star size={20} style={{ color: "#2196C4" }} />
                </div>
                <h3 style={{ fontFamily: bodyFont, fontWeight: 600, fontSize: 18, color: "#fff", marginBottom: 12 }}>
                  {card.title}
                </h3>
                <p style={{ fontFamily: bodyFont, fontSize: 15, color: "#9A9389", lineHeight: 1.7 }}>
                  {card.desc}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Pull quote */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.65, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            style={{
              background: "#112847",
              borderLeft: "6px solid #2196C4",
              borderRadius: "0 16px 16px 0",
              padding: "32px 40px",
            }}
          >
            <p style={{ fontFamily: displayFont, fontStyle: "italic", fontSize: 22, color: "#fff", lineHeight: 1.65, marginBottom: 12 }}>
              &ldquo;Every child who walks through our gates carries the potential to change their community — and we treat that responsibility with the gravity it deserves.&rdquo;
            </p>
            <p style={{ fontFamily: bodyFont, fontSize: 13, color: "#3BADD9" }}>— The Proprietor, The Crescent Academy</p>
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          § 5  WHY CHOOSE US — white bg
      ══════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden" style={{ background: "#fff", padding: "clamp(4rem,8vw,7rem) 0" }}>
        <div className="max-w-7xl mx-auto px-6 sm:px-10">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            className="text-center mb-16"
          >
            <p style={{ fontFamily: bodyFont, fontSize: 11, color: "#2196C4", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 16 }}>
              OUR STRENGTHS
            </p>
            <h2 style={{ fontFamily: displayFont, fontSize: "clamp(1.75rem,3.5vw,2.75rem)", fontWeight: 600, color: "#1A1714", lineHeight: 1.2 }}>
              Why Families Choose{" "}
              <em style={{ color: "#2196C4", fontStyle: "italic" }}>The Crescent Academy</em>
            </h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {pillars.map((p, i) => (
              <motion.div
                key={p.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.6, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                className="rounded-2xl p-8 group cursor-default"
                style={{
                  background: p.highlight ? "#E8F6FC" : "#fff",
                  border: p.highlight ? "1px solid #2196C4" : "1px solid #E2DDD6",
                  transition: "border-color 0.3s, box-shadow 0.3s, transform 0.3s",
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = "#2196C4";
                  e.currentTarget.style.boxShadow = "0 8px 32px rgba(33,150,196,0.12)";
                  e.currentTarget.style.transform = "translateY(-4px)";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = p.highlight ? "#2196C4" : "#E2DDD6";
                  e.currentTarget.style.boxShadow = "none";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center mb-5"
                  style={{
                    background: p.highlight ? "#FBF4E6" : "#E6F4F4",
                  }}
                >
                  <p.icon size={22} style={{ color: p.highlight ? "#C4973A" : "#218080" }} />
                </div>
                <h3 style={{ fontFamily: bodyFont, fontWeight: 600, fontSize: 18, color: "#0B1F3A", marginBottom: 10 }}>
                  {p.title}
                </h3>
                <p style={{ fontFamily: bodyFont, fontSize: 15, color: "#5C554E", lineHeight: 1.7 }}>
                  {p.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          § 6  GALLERY — navy-900 bg, FIXED images
      ══════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden" style={{ background: "#0B1F3A", padding: "clamp(4rem,8vw,7rem) 0" }}>
        <div className="max-w-7xl mx-auto px-6 sm:px-10">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10"
          >
            <div>
              <p style={{ fontFamily: bodyFont, fontSize: 11, color: "#2196C4", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 12 }}>
                SCHOOL LIFE
              </p>
              <h2 style={{ fontFamily: displayFont, fontSize: "clamp(1.75rem,3.5vw,2.75rem)", fontWeight: 600, color: "#fff", lineHeight: 1.2 }}>
                A Glimpse of Life at{" "}
                <em style={{ color: "#3BADD9", fontStyle: "italic" }}>Crescent</em>
              </h2>
            </div>
            <Link
              href="/gallery"
              className="flex items-center gap-2 font-medium text-sm whitespace-nowrap transition-colors duration-200"
              style={{ fontFamily: bodyFont, color: "#3BADD9" }}
              onMouseEnter={e => (e.currentTarget.style.color = "#6CC4E8")}
              onMouseLeave={e => (e.currentTarget.style.color = "#3BADD9")}
            >
              View Full Gallery <ArrowRight size={15} />
            </Link>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {galleryItems.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] }}
                className="relative overflow-hidden rounded-2xl group cursor-pointer"
                style={{ aspectRatio: "3/4" }}
              >
                <Image
                  src={item.src}
                  alt={item.label}
                  fill
                  sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 16vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                  onError={(e) => { e.currentTarget.style.display = "none"; }}
                />
                {/* Fallback gradient shown if image fails */}
                <div
                  className="absolute inset-0 -z-10"
                  style={{ background: "linear-gradient(135deg, #112847, #1A3460)" }}
                />
                {/* Hover overlay */}
                <div
                  className="absolute inset-0 flex items-end p-4 transition-opacity duration-400 opacity-0 group-hover:opacity-100"
                  style={{ background: "linear-gradient(to top, rgba(6,14,28,0.9) 0%, rgba(11,31,58,0.2) 60%, transparent 100%)" }}
                >
                  <p style={{ fontFamily: bodyFont, fontWeight: 500, fontSize: 13, color: "#fff" }}>
                    {item.label}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          § 7  HISTORY TIMELINE — sky-100 tinted bg
      ══════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden" style={{ background: "#E8F6FC", padding: "clamp(4rem,8vw,7rem) 0" }}>
        <div className="max-w-7xl mx-auto px-6 sm:px-10">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            className="text-center mb-16"
          >
            <p style={{ fontFamily: bodyFont, fontSize: 11, color: "#2196C4", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 16 }}>
              OUR JOURNEY
            </p>
            <h2 style={{ fontFamily: displayFont, fontSize: "clamp(1.75rem,3.5vw,2.75rem)", fontWeight: 600, color: "#0B1F3A", lineHeight: 1.2 }}>
              15 Years of{" "}
              <em style={{ color: "#2196C4", fontStyle: "italic" }}>Purposeful Growth</em>
            </h2>
          </motion.div>

          <div className="relative max-w-3xl mx-auto">
            {/* Vertical timeline line */}
            <div
              className="absolute left-6 top-0 bottom-0 w-px"
              style={{ background: "linear-gradient(to bottom, transparent, #2196C4, #3BADD9, transparent)" }}
            />

            <div className="space-y-10 pl-16">
              {milestones.map((m, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.55, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                  className="relative"
                >
                  {/* Node */}
                  <div
                    className="absolute -left-[2.75rem] top-1 w-5 h-5 rounded-full flex items-center justify-center"
                    style={{ background: "#fff", border: "3px solid #2196C4", boxShadow: "0 0 0 4px rgba(33,150,196,0.15)" }}
                  />
                  <span style={{ fontFamily: bodyFont, fontWeight: 600, fontSize: 13, color: "#2196C4", display: "block", marginBottom: 4 }}>
                    {m.year}
                  </span>
                  <p style={{ fontFamily: bodyFont, fontSize: 16, color: "#1A1714", lineHeight: 1.6 }}>
                    {m.text}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          § 8  TESTIMONIALS — white bg
      ══════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden" style={{ background: "#fff", padding: "clamp(4rem,8vw,7rem) 0" }}>
        <div className="max-w-7xl mx-auto px-6 sm:px-10">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            className="text-center mb-14"
          >
            <p style={{ fontFamily: bodyFont, fontSize: 11, color: "#2196C4", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 16 }}>
              TESTIMONIALS
            </p>
            <h2 style={{ fontFamily: displayFont, fontSize: "clamp(1.75rem,3.5vw,2.75rem)", fontWeight: 600, color: "#1A1714", lineHeight: 1.2 }}>
              What Families{" "}
              <em style={{ color: "#2196C4", fontStyle: "italic" }}>Say About Us</em>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.6, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                className="rounded-2xl p-8 relative"
                style={{ background: "#F0EDE8", border: "1px solid #E2DDD6" }}
              >
                {/* Decorative quote mark */}
                <div
                  className="absolute top-4 left-6 select-none pointer-events-none"
                  style={{ fontFamily: displayFont, fontSize: 80, color: "#6CC4E8", opacity: 0.5, lineHeight: 1 }}
                  aria-hidden
                >
                  &ldquo;
                </div>

                {/* Gold stars — the gold moment in this section */}
                <div className="flex gap-1 mb-4 relative z-10">
                  {[...Array(5)].map((_, s) => (
                    <Star key={s} size={14} style={{ color: "#D4A84B" }} fill="#D4A84B" />
                  ))}
                </div>

                <p
                  className="relative z-10 mb-6"
                  style={{ fontFamily: displayFont, fontStyle: "italic", fontSize: 18, color: "#1A1714", lineHeight: 1.75 }}
                >
                  &ldquo;{t.quote}&rdquo;
                </p>

                <div className="flex items-center gap-3 relative z-10">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                    style={{ background: "#245285" }}
                  >
                    <span style={{ fontFamily: bodyFont, fontWeight: 600, fontSize: 13, color: "#fff" }}>
                      {t.initials}
                    </span>
                  </div>
                  <div>
                    <p style={{ fontFamily: bodyFont, fontWeight: 600, fontSize: 14, color: "#0B1F3A" }}>{t.name}</p>
                    <p style={{ fontFamily: bodyFont, fontSize: 12, color: "#9A9389" }}>{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Dot navigation */}
          <div className="flex justify-center gap-2 mt-8">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setTestimonialIdx(i)}
                className="rounded-full transition-all duration-300"
                style={{
                  width: i === testimonialIdx ? 24 : 8,
                  height: 8,
                  background: i === testimonialIdx ? "#2196C4" : "#E2DDD6",
                }}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          § 9  NEWS — sky-100 tinted bg
      ══════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden" style={{ background: "#E8F6FC", padding: "clamp(4rem,8vw,7rem) 0" }}>
        <div className="max-w-7xl mx-auto px-6 sm:px-10">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12"
          >
            <div>
              <p style={{ fontFamily: bodyFont, fontSize: 11, color: "#2196C4", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 12 }}>
                STAY UPDATED
              </p>
              <h2 style={{ fontFamily: displayFont, fontSize: "clamp(1.75rem,3.5vw,2.75rem)", fontWeight: 600, color: "#0B1F3A", lineHeight: 1.2 }}>
                News &amp;{" "}
                <em style={{ color: "#2196C4", fontStyle: "italic" }}>Events</em>
              </h2>
            </div>
            <Link
              href="/news"
              className="flex items-center gap-2 font-medium text-sm whitespace-nowrap transition-colors duration-200"
              style={{ fontFamily: bodyFont, color: "#2196C4" }}
              onMouseEnter={e => (e.currentTarget.style.color = "#0B1F3A")}
              onMouseLeave={e => (e.currentTarget.style.color = "#2196C4")}
            >
              All News <ArrowRight size={15} />
            </Link>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {news.map((item, i) => (
              <motion.article
                key={item.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.6, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                className="rounded-2xl overflow-hidden group cursor-pointer"
                style={{
                  background: "#fff",
                  boxShadow: "0 2px 16px rgba(33,150,196,0.07)",
                  transition: "box-shadow 0.3s, transform 0.3s",
                }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 12px 40px rgba(33,150,196,0.15)"; e.currentTarget.style.transform = "translateY(-4px)"; }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = "0 2px 16px rgba(33,150,196,0.07)"; e.currentTarget.style.transform = "translateY(0)"; }}
              >
                {/* Image */}
                <div className="relative overflow-hidden" style={{ aspectRatio: "16/9" }}>
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    onError={(e) => { e.currentTarget.style.display = "none"; }}
                  />
                  <div className="absolute inset-0 -z-10" style={{ background: "linear-gradient(135deg, #112847, #245285)" }} />
                </div>

                <div className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <span
                      className="rounded-full px-3 py-1 text-[11px] font-medium"
                      style={{ background: "#E6F4F4", color: "#1A6B6B", fontFamily: bodyFont }}
                    >
                      {item.category}
                    </span>
                    <span style={{ fontFamily: bodyFont, fontSize: 12, color: "#9A9389" }}>{item.date}</span>
                  </div>
                  <h3
                    className="mb-2 transition-colors duration-200"
                    style={{ fontFamily: displayFont, fontWeight: 600, fontSize: 20, color: "#0B1F3A", lineHeight: 1.3 }}
                    onMouseEnter={e => (e.currentTarget.style.color = "#2196C4")}
                    onMouseLeave={e => (e.currentTarget.style.color = "#0B1F3A")}
                  >
                    {item.title}
                  </h3>
                  <p className="line-clamp-2 mb-4" style={{ fontFamily: bodyFont, fontSize: 14, color: "#5C554E", lineHeight: 1.6 }}>
                    {item.excerpt}
                  </p>
                  <span
                    className="flex items-center gap-1 text-sm font-medium"
                    style={{ fontFamily: bodyFont, color: "#2196C4" }}
                  >
                    Read More <ArrowRight size={13} />
                  </span>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          § 10  TRUST STRIP — white
      ══════════════════════════════════════════════════════ */}
      <section className="py-10" style={{ background: "#fff", borderTop: "1px solid #E2DDD6", borderBottom: "1px solid #E2DDD6" }}>
        <div className="max-w-5xl mx-auto px-6">
          <div className="flex flex-wrap items-center justify-center gap-6 md:gap-14">
            {["Co-Educational · Est. 2010", "Registered with Osun State MoE", "Nursery · Primary · Secondary · Vocational", "Iwo, Osun State"].map((item, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center gap-3"
                style={{ fontFamily: bodyFont, fontSize: 10, color: "#9A9389", fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase" }}
              >
                {i > 0 && <span className="w-1.5 h-1.5 rounded-full hidden md:block" style={{ background: "#2196C4" }} />}
                {item}
              </motion.span>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          § 11  CTA BANNER — navy-950
      ══════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden" style={{ background: "#060E1C", padding: "clamp(4rem,8vw,7rem) 0" }}>
        {/* Dot grid */}
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />
        {/* Large decorative circle */}
        <div
          className="absolute -right-32 top-1/2 -translate-y-1/2 rounded-full pointer-events-none"
          style={{ width: 600, height: 600, background: "#112847", opacity: 0.7 }}
        />

        <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-10">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            >
              <p style={{ fontFamily: bodyFont, fontSize: 11, color: "#3BADD9", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 16 }}>
                ADMISSIONS OPEN
              </p>
              <h2 style={{ fontFamily: displayFont, fontSize: "clamp(2rem,4vw,3.5rem)", fontWeight: 600, color: "#fff", lineHeight: 1.15, marginBottom: "1.5rem" }}>
                Give Your Child the{" "}
                <em style={{ color: "#3BADD9", fontStyle: "italic" }}>Best Start</em>
              </h2>
              <p style={{ fontFamily: bodyFont, fontSize: 17, color: "rgba(255,255,255,0.65)", lineHeight: 1.7, maxWidth: 480 }}>
                Join hundreds of families who trust The Crescent Academy to raise academically excellent, morally upright, and spiritually grounded children.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col sm:flex-row lg:flex-col gap-4 lg:items-start"
            >
              <Link
                href="/admissions"
                className="inline-flex items-center justify-center gap-2 font-semibold text-sm rounded-full transition-all duration-200"
                style={{ fontFamily: bodyFont, background: "#2196C4", color: "#fff", padding: "14px 36px", height: 52 }}
                onMouseEnter={e => { e.currentTarget.style.background = "#3BADD9"; e.currentTarget.style.transform = "translateY(-2px)"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "#2196C4"; e.currentTarget.style.transform = "translateY(0)"; }}
              >
                Apply for Admission <ArrowRight size={16} />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 font-semibold text-sm rounded-full transition-all duration-200"
                style={{ fontFamily: bodyFont, border: "1px solid rgba(255,255,255,0.3)", color: "#fff", padding: "14px 36px", height: 52 }}
                onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.08)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.5)"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.3)"; }}
              >
                Contact Us
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

    </div>
  );
}
