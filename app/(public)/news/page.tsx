"use client";

import { motion } from "framer-motion";
import { ArrowRight, CalendarDays, ChevronLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import ScrollReveal from "@/components/ui/ScrollReveal";

const stories = [
  { title: "Iwo Day Football Tournament - Runners-Up", date: "15 Nov 2025", category: "Sports", image: "/images/news-football.jpg", excerpt: "Our boys' team showed remarkable teamwork and discipline, defeating every public school on their way to the final." },
  { title: "Qur'anic Recitation Competition Winners", date: "28 Oct 2025", category: "Spiritual Life", image: "/images/news-quran.jpg", excerpt: "Crescent students secured first and second place at the regional Qur'anic recitation competition." },
  { title: "Annual Prize-Giving Day", date: "13 Sep 2025", category: "School Life", image: "/images/news-prize-giving.jpg", excerpt: "A joyful day recognising the effort, growth, and accomplishments of our pupils, students, and staff." },
];

export default function NewsPage() {
  return (
    <div className="min-h-screen" style={{ background: "#F7F5F1" }}>
      <section className="public-page-hero relative flex items-center overflow-hidden py-24 md:py-32" style={{ background: "#0B1F3A" }}>
        <div aria-hidden className="absolute inset-0 opacity-[0.07] bg-dot-grid" />
        <div className="absolute inset-0" style={{ background: "linear-gradient(110deg, rgba(6,14,28,.35), transparent)" }} />
        <div className="relative z-10 max-w-7xl mx-auto w-full px-6 sm:px-10 lg:px-16">
          <Link href="/" className="inline-flex items-center gap-1.5 mb-8 text-sm text-white/70 hover:text-white transition-colors focus-ring"><ChevronLeft size={16} /> Home</Link>
          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .5 }} className="max-w-2xl">
            <p className="text-xs font-medium tracking-[0.16em] uppercase mb-3" style={{ color: "#6CC4E8" }}>From Crescent Academy</p>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-semibold leading-[1.06] text-white" style={{ fontFamily: "var(--font-display, Georgia, serif)" }}>News & <em style={{ color: "#3BADD9" }}>Events</em></h1>
            <p className="mt-5 text-base sm:text-lg leading-relaxed text-white/70 max-w-xl">The moments, milestones, and people shaping life at The Crescent Academy.</p>
          </motion.div>
        </div>
      </section>

      <section className="public-page-section py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 md:mb-12">
            <ScrollReveal><div><p className="text-xs font-medium tracking-[.14em] uppercase" style={{ color: "#2196C4" }}>Latest stories</p><h2 className="mt-2 text-3xl sm:text-4xl font-semibold" style={{ color: "#1A1714", fontFamily: "var(--font-display, Georgia, serif)" }}>What&apos;s happening at Crescent</h2></div></ScrollReveal>
            <p className="text-sm max-w-sm" style={{ color: "#5C554E" }}>Updates from our classrooms, competitions, and community.</p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {stories.map((story, index) => (
              <ScrollReveal key={story.title} delay={index * .08}>
                <article className="h-full overflow-hidden border bg-white transition-shadow hover:shadow-lg" style={{ borderColor: "#E2DDD6", borderRadius: 8 }}>
                  <div className="relative aspect-[16/10] bg-sky-100"><Image src={story.image} alt={story.title} fill sizes="(max-width: 767px) 100vw, 33vw" className="object-cover" /><span className="absolute left-4 top-4 px-3 py-1 text-[11px] font-medium text-white" style={{ background: "#0B1F3A", borderRadius: 999 }}>{story.category}</span></div>
                  <div className="p-6"><p className="flex items-center gap-2 text-xs mb-4" style={{ color: "#5C554E" }}><CalendarDays size={14} style={{ color: "#2196C4" }} />{story.date}</p><h3 className="text-xl font-semibold leading-snug" style={{ color: "#1A1714", fontFamily: "var(--font-display, Georgia, serif)" }}>{story.title}</h3><p className="mt-3 text-sm leading-relaxed" style={{ color: "#5C554E" }}>{story.excerpt}</p></div>
                </article>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <section className="public-page-section py-16 md:py-20" style={{ background: "#112847" }}><div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 flex flex-col md:flex-row md:items-center justify-between gap-7"><div><p className="text-xs tracking-[.14em] uppercase" style={{ color: "#6CC4E8" }}>Stay connected</p><h2 className="mt-2 text-3xl text-white font-semibold" style={{ fontFamily: "var(--font-display, Georgia, serif)" }}>Have a school story to share?</h2></div><Link href="/contact" className="inline-flex w-fit items-center gap-2 px-5 py-3 text-sm font-semibold text-white transition-colors focus-ring" style={{ border: "1px solid rgba(255,255,255,.25)", borderRadius: 999 }}>Contact the school <ArrowRight size={16} /></Link></div></section>
    </div>
  );
}
