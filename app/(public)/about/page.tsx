"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ChevronLeft, BookOpen, Shield, Users, Trophy, GraduationCap, Star, CheckCircle, ArrowRight } from "lucide-react";
import ScrollReveal from "@/components/ui/ScrollReveal";
import StaggerContainer, { StaggerItem } from "@/components/ui/StaggerContainer";

const MILESTONES = [
  { year: "2010",  title: "Foundation",           text: "Founded on 13th September 2010 in Ajegbe Close, Panada Area, Iwo — a co-educational institution with a clear vision to nurture the Complete Child." },
  { year: "2012",  title: "Growth",               text: "Expanded Nursery and Primary sections, growing in student population and reputation across Iwo and surrounding areas." },
  { year: "2014",  title: "The Crescent College",  text: "Establishment of the secondary section offering JSS and SSS programmes with strong Islamic values and academic rigour." },
  { year: "2023",  title: "School of Science",    text: "Launch of The Crescent School of Science — our vocational track preparing students for technical excellence and self-reliance." },
  { year: "Today", title: "A Legacy of Excellence", text: "150+ prizes, 30+ distinguished awards, three thriving sections, and a growing alumni network — all by the grace of Allah." },
];

const PILLARS = [
  { icon: BookOpen,      title: "Academic Excellence",         desc: "Rigorous curriculum aligned with national standards, producing top performers year after year." },
  { icon: Shield,        title: "Moral & Spiritual Growth",    desc: "Authentic Islamic values, Tahfīdhul Qur'an, and Salāh woven into every subject — building Taqwa alongside knowledge." },
  { icon: Users,         title: "Discipline & Integrity",      desc: "A structured environment fostering responsibility, honesty, respect, and self-accountability in every student." },
  { icon: Trophy,        title: "Award-Winning Institution",   desc: "Over 150 prizes and awards in academics, Qur'an, sports, and inter-school competitions since 2010." },
  { icon: GraduationCap, title: "Three-Tier Education",        desc: "Nursery & Primary, Secondary (College), and Vocational (School of Science) under one cohesive Islamic vision." },
  { icon: Star,          title: "Qualified, Caring Educators", desc: "Dedicated, certified teachers who combine professional competence with moral uprightness and genuine care." },
];

const IslamicPattern = ({ opacity = 0.055 }: { opacity?: number }) => (
  <svg aria-hidden className="absolute inset-0 w-full h-full pointer-events-none select-none" style={{ opacity }} xmlns="http://www.w3.org/2000/svg">
    <defs>
      <pattern id="abp" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
        <polygon points="40,4 47,20 62,13 55,28 72,35 55,42 62,57 47,50 40,66 33,50 18,57 25,42 8,35 25,28 18,13 33,20" fill="none" stroke="currentColor" strokeWidth="0.7" />
        <circle cx="40" cy="35" r="6" fill="none" stroke="currentColor" strokeWidth="0.5" />
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#abp)" />
  </svg>
);

export default function AboutPage() {
  return (
    <div style={{ background: "#F7F5F1" }} className="min-h-screen">

      {/* ── Hero ──────────────────────────────────────────────── */}
      <section className="relative h-[60vh] min-h-80 flex items-center overflow-hidden" style={{ background: "#0B1F3A" }}>
        <IslamicPattern opacity={0.06} />
        <img src="/images/about-hero-classroom.jpg" alt="" aria-hidden
          className="absolute inset-0 w-full h-full object-cover opacity-20"
          onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
        <div className="absolute inset-0" style={{ background: "rgba(6,14,28,0.75)" }} />
        <div className="absolute top-6 left-6 z-20">
          <Link href="/" className="flex items-center gap-1.5 text-white/70 hover:text-white text-sm transition-colors" style={{ fontFamily: "var(--font-body, sans-serif)" }}>
            <ChevronLeft size={16} /> Home
          </Link>
        </div>
        <motion.div initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.85 }}
          className="relative z-10 max-w-7xl mx-auto px-6 sm:px-10 w-full">
          <p className="text-xs tracking-[0.22em] uppercase mb-3 font-semibold flex items-center gap-2"
            style={{ color: "#2196C4", fontFamily: "var(--font-body, sans-serif)" }}>
            <span className="w-6 h-px" style={{ background: "#2196C4" }} /> Est. 2010 · Iwo, Osun State
          </p>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-4"
            style={{ fontFamily: "var(--font-display, 'Cormorant Garamond', serif)" }}>
            About{" "}
            <span className="italic" style={{ color: "#3BADD9" }}>The Crescent Academy</span>
          </h1>
          <p className="text-white/70 text-lg max-w-2xl leading-relaxed"
            style={{ fontFamily: "var(--font-body, sans-serif)" }}>
            A faith-driven centre of excellence — nurturing the Complete Child since 2010.
          </p>
        </motion.div>
      </section>

      {/* ── Who We Are ────────────────────────────────────────── */}
      <section className="py-20 md:py-28">
        <div className="max-w-6xl mx-auto px-6 sm:px-10">
          <div className="grid lg:grid-cols-[2fr_3fr] gap-14 items-center">

            <ScrollReveal direction="left">
              <div className="relative">
                <div className="absolute -top-4 -left-4 w-24 h-24 border-2 rounded-3xl pointer-events-none"
                  style={{ borderColor: "rgba(33,150,196,0.25)" }} />
                <div className="relative rounded-3xl overflow-hidden aspect-[4/5] shadow-2xl z-10"
                  style={{ background: "#112847", boxShadow: "0 0 0 4px rgba(33,150,196,0.15)" }}>
                  <img src="/images/about-hero-classroom.jpg" alt="Students at The Crescent Academy"
                    className="w-full h-full object-cover"
                    onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#060E1C]/80 via-transparent to-transparent" />
                  <IslamicPattern opacity={0.1} />
                  <div className="absolute bottom-6 left-6 right-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                        style={{ background: "rgba(196,151,58,0.2)", border: "1px solid rgba(196,151,58,0.4)" }}>
                        <Star size={18} style={{ color: "#C4973A" }} />
                      </div>
                      <div>
                        <p className="text-white font-bold text-sm">150+ Prizes & Awards</p>
                        <p className="text-white/60 text-xs">Since 2010</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal direction="right">
              <div className="space-y-6">
                <div>
                  <p className="text-xs tracking-[0.2em] uppercase mb-3 font-semibold flex items-center gap-2"
                    style={{ color: "#2196C4", fontFamily: "var(--font-body, sans-serif)" }}>
                    <span className="w-6 h-px" style={{ background: "#2196C4" }} /> Who We Are
                  </p>
                  <h2 className="text-3xl md:text-4xl font-bold leading-tight mb-5"
                    style={{ color: "#0B1F3A", fontFamily: "var(--font-display, 'Cormorant Garamond', serif)" }}>
                    More Than a School —<br />
                    <span className="italic" style={{ color: "#2196C4" }}>A Nurturing Community</span>
                  </h2>
                </div>
                <p className="text-lg leading-relaxed" style={{ color: "#374151", fontFamily: "var(--font-body, sans-serif)" }}>
                  The Crescent Academy is a co-educational institution dedicated to providing a harmonious blend of conventional and authentic Islamic education. Founded in 2010 by visionary leaders, we remain committed to raising the{" "}
                  <span className="font-semibold" style={{ color: "#0B1F3A" }}>"Complete Child."</span>
                </p>
                <p className="leading-relaxed" style={{ color: "#6B7280", fontFamily: "var(--font-body, sans-serif)" }}>
                  Every child who walks through our gates is a trust placed in our hands — by their parents and by Allah Himself. We nurture students who are academically excellent, morally upright, spiritually alive, and socially responsible.
                </p>
                <div className="grid grid-cols-3 gap-4 pt-2">
                  {[{ n: "14+", l: "Years" }, { n: "3", l: "Sections" }, { n: "150+", l: "Awards" }].map((s) => (
                    <div key={s.l} className="rounded-2xl p-4 text-center"
                      style={{ background: "rgba(33,150,196,0.06)", border: "1px solid rgba(33,150,196,0.15)" }}>
                      <p className="text-2xl font-bold" style={{ color: "#0B1F3A", fontFamily: "var(--font-display, serif)" }}>{s.n}</p>
                      <p className="text-xs mt-0.5" style={{ color: "#6B7280", fontFamily: "var(--font-body, sans-serif)" }}>{s.l}</p>
                    </div>
                  ))}
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ── Mission / Vision / Philosophy ─────────────────────── */}
      <section className="py-20 md:py-28 relative overflow-hidden" style={{ background: "#0B1F3A" }}>
        <IslamicPattern opacity={0.05} />
        <div aria-hidden className="absolute right-0 top-0 bottom-0 flex items-center pointer-events-none select-none overflow-hidden">
          <span className="text-[20rem] font-bold leading-none pr-6" style={{ color: "rgba(255,255,255,0.018)" }}>2010</span>
        </div>
        <div className="relative z-10 max-w-6xl mx-auto px-6 sm:px-10">
          <div className="text-center mb-14">
            <p className="text-xs tracking-[0.18em] uppercase mb-3 font-semibold flex items-center gap-3 justify-center"
              style={{ color: "#C4973A", fontFamily: "var(--font-body, sans-serif)" }}>
              <span className="w-8 h-px" style={{ background: "#C4973A" }} /> Our Foundation <span className="w-8 h-px" style={{ background: "#C4973A" }} />
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-white"
              style={{ fontFamily: "var(--font-display, 'Cormorant Garamond', serif)" }}>
              Built on <span className="italic" style={{ color: "#C4973A" }}>Purpose & Faith</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { num: "01", title: "Our Mission",    featured: false, text: "With the help of Allah (SWT), The Crescent Academy is dedicated to nurturing a generation of students who are academically sound, morally upright, spiritually conscious, and socially responsible — producing the 'Complete Child.'" },
              { num: "02", title: "Our Vision",     featured: true,  text: "To be a leading centre of faith-driven excellence, raising leaders who are knowledgeable, disciplined, God-conscious, and prepared to positively impact their communities — both in this life and the Hereafter." },
              { num: "03", title: "Our Philosophy", featured: false, text: "True education goes beyond academics. We integrate authentic Islamic teachings with robust conventional learning to balance knowledge with Taqwa, character, and service to humanity." },
            ].map((card, i) => (
              <ScrollReveal key={i} delay={i * 0.1}>
                <div className={`relative rounded-2xl p-8 overflow-hidden h-full transition-all duration-300 hover:-translate-y-1`}
                  style={card.featured
                    ? { background: "#2196C4", color: "#fff" }
                    : { background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}>
                  <span aria-hidden className="absolute top-4 right-6 text-7xl font-bold leading-none select-none pointer-events-none opacity-10">{card.num}</span>
                  <div className="w-1 h-8 rounded-full mb-6" style={{ background: card.featured ? "rgba(255,255,255,0.4)" : "#C4973A" }} />
                  <h3 className="text-xl font-bold mb-4"
                    style={{ color: "#fff", fontFamily: "var(--font-display, 'Cormorant Garamond', serif)" }}>{card.title}</h3>
                  <p className="leading-relaxed text-sm"
                    style={{ color: card.featured ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.65)", fontFamily: "var(--font-body, sans-serif)" }}>{card.text}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>

          <ScrollReveal delay={0.3}>
            <blockquote className="mt-14 max-w-3xl mx-auto text-center">
              <p className="text-xl md:text-2xl text-white/80 italic leading-relaxed"
                style={{ fontFamily: "var(--font-display, 'Cormorant Garamond', serif)" }}>
                "We seek to raise the Complete Child — one who carries both knowledge and character into the world."
              </p>
              <footer className="text-xs font-semibold mt-4 tracking-[0.25em] uppercase"
                style={{ color: "#C4973A", fontFamily: "var(--font-body, sans-serif)" }}>— The Proprietor, The Crescent Academy</footer>
            </blockquote>
          </ScrollReveal>
        </div>
      </section>

      {/* ── The Complete Child — 6 Pillars ────────────────────── */}
      <section className="py-20 md:py-24" style={{ background: "#fff" }}>
        <div className="max-w-6xl mx-auto px-6 sm:px-10">
          <div className="text-center mb-14">
            <p className="text-xs tracking-[0.18em] uppercase mb-3 font-semibold flex items-center gap-3 justify-center"
              style={{ color: "#2196C4", fontFamily: "var(--font-body, sans-serif)" }}>
              <span className="w-8 h-px" style={{ background: "#2196C4" }} /> Our Approach <span className="w-8 h-px" style={{ background: "#2196C4" }} />
            </p>
            <h2 className="text-3xl md:text-4xl font-bold" style={{ color: "#0B1F3A", fontFamily: "var(--font-display, 'Cormorant Garamond', serif)" }}>
              The <span className="italic" style={{ color: "#2196C4" }}>Complete Child</span> Philosophy
            </h2>
            <p className="mt-3 max-w-xl mx-auto text-sm" style={{ color: "#6B7280", fontFamily: "var(--font-body, sans-serif)" }}>
              Six pillars that define how we educate and nurture every student at The Crescent Academy.
            </p>
            <div className="w-12 h-0.5 rounded-full mx-auto mt-4" style={{ background: "#2196C4" }} />
          </div>

          <StaggerContainer className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {PILLARS.map(({ icon: Icon, title, desc }, i) => (
              <StaggerItem key={i}>
                <div className="group bg-white border rounded-2xl p-7 hover:-translate-y-1 hover:shadow-lg transition-all duration-300 h-full"
                  style={{ borderColor: "#E5E7EB" }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = "rgba(33,150,196,0.4)")}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = "#E5E7EB")}>
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 transition-colors"
                    style={{ background: "rgba(33,150,196,0.08)" }}>
                    <Icon size={22} style={{ color: "#2196C4" }} />
                  </div>
                  <h3 className="font-bold text-base mb-2" style={{ color: "#0B1F3A", fontFamily: "var(--font-body, sans-serif)" }}>{title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: "#6B7280", fontFamily: "var(--font-body, sans-serif)" }}>{desc}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* ── History Timeline ───────────────────────────────────── */}
      <section className="py-20 md:py-24 relative overflow-hidden" style={{ background: "#060E1C" }}>
        <IslamicPattern opacity={0.06} />
        <div className="relative z-10 max-w-4xl mx-auto px-6 sm:px-10">
          <div className="text-center mb-14">
            <p className="text-xs tracking-[0.18em] uppercase mb-3 font-semibold flex items-center gap-3 justify-center"
              style={{ color: "#3BADD9", fontFamily: "var(--font-body, sans-serif)" }}>
              <span className="w-8 h-px" style={{ background: "#3BADD9" }} /> Our Story <span className="w-8 h-px" style={{ background: "#3BADD9" }} />
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-white"
              style={{ fontFamily: "var(--font-display, 'Cormorant Garamond', serif)" }}>
              A Growing <span className="italic" style={{ color: "#C4973A" }}>Legacy</span>
            </h2>
          </div>

          <div className="relative">
            <div className="absolute left-6 sm:left-8 top-0 bottom-0 w-px" style={{ background: "rgba(33,150,196,0.3)" }} />
            <div className="space-y-10">
              {MILESTONES.map((m, i) => (
                <ScrollReveal key={i} delay={i * 0.08}>
                  <div className="flex gap-6 sm:gap-8 items-start">
                    <div className="shrink-0 z-10">
                      <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center"
                        style={{ background: "#0B1F3A", border: "2px solid #2196C4" }}>
                        <span className="font-bold text-[10px] sm:text-xs text-center leading-tight" style={{ color: "#3BADD9" }}>{m.year}</span>
                      </div>
                    </div>
                    <div className="rounded-2xl p-5 flex-1 transition-colors"
                      style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}
                      onMouseEnter={e => (e.currentTarget.style.borderColor = "rgba(33,150,196,0.4)")}
                      onMouseLeave={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)")}>
                      <h3 className="font-bold text-white text-base mb-1" style={{ fontFamily: "var(--font-body, sans-serif)" }}>{m.title}</h3>
                      <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.65)", fontFamily: "var(--font-body, sans-serif)" }}>{m.text}</p>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────── */}
      <section className="py-16 md:py-20" style={{ background: "#F7F5F1" }}>
        <div className="max-w-4xl mx-auto px-6 sm:px-10">
          <ScrollReveal>
            <div className="rounded-3xl p-10 md:p-14 relative overflow-hidden text-center"
              style={{ background: "#0B1F3A" }}>
              <IslamicPattern opacity={0.05} />
              <div className="relative z-10">
                <p className="text-xs tracking-[0.2em] uppercase mb-3 font-semibold" style={{ color: "#2196C4", fontFamily: "var(--font-body, sans-serif)" }}>
                  Join Our Community
                </p>
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-4"
                  style={{ fontFamily: "var(--font-display, 'Cormorant Garamond', serif)" }}>
                  Start Your Child's Journey at The Crescent Academy
                </h2>
                <p className="mb-8 max-w-lg mx-auto text-sm leading-relaxed"
                  style={{ color: "rgba(255,255,255,0.6)", fontFamily: "var(--font-body, sans-serif)" }}>
                  Admissions are open for the 2025/2026 session. Give your child the gift of excellence — academic and spiritual.
                </p>
                <div className="flex flex-wrap items-center justify-center gap-4">
                  <Link href="/admissions"
                    className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-bold text-sm transition-all hover:-translate-y-0.5"
                    style={{ background: "#2196C4", color: "#fff", fontFamily: "var(--font-body, sans-serif)" }}
                    onMouseEnter={e => (e.currentTarget.style.background = "#3BADD9")}
                    onMouseLeave={e => (e.currentTarget.style.background = "#2196C4")}>
                    Apply for Admission <ArrowRight size={15} />
                  </Link>
                  <Link href="/contact"
                    className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-medium text-sm transition-all"
                    style={{ border: "1px solid rgba(255,255,255,0.2)", color: "#fff", fontFamily: "var(--font-body, sans-serif)" }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(59,173,217,0.5)"; e.currentTarget.style.color = "#3BADD9"; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)"; e.currentTarget.style.color = "#fff"; }}>
                    Contact Us
                  </Link>
                </div>
                <div className="flex flex-wrap justify-center gap-6 mt-8 pt-8" style={{ borderTop: "1px solid rgba(255,255,255,0.1)" }}>
                  {[
                    { href: "/leadership",   label: "Meet Our Leadership" },
                    { href: "/achievements", label: "Our Achievements" },
                    { href: "/fees",         label: "Fees & Charges" },
                    { href: "/gallery",      label: "Photo Gallery" },
                  ].map((l) => (
                    <Link key={l.href} href={l.href}
                      className="flex items-center gap-1.5 text-xs font-medium transition-colors"
                      style={{ color: "rgba(255,255,255,0.5)", fontFamily: "var(--font-body, sans-serif)" }}
                      onMouseEnter={e => (e.currentTarget.style.color = "#3BADD9")}
                      onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.5)")}>
                      <CheckCircle size={12} /> {l.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
