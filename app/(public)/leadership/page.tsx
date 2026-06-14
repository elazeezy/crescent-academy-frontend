"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ChevronLeft, Quote } from "lucide-react";
import ScrollReveal from "@/components/ui/ScrollReveal";
import StaggerContainer, { StaggerItem } from "@/components/ui/StaggerContainer";

const PROPRIETOR = {
  name: "Abdulwasii Abdulssalam Oluwatoyin",
  role: "Proprietor & Founder",
  image: "/images/leadership/1-proprietor.jpg",
  bio: "The visionary behind The Crescent Academy, whose unwavering commitment to faith-based excellence, discipline, and quality education has shaped every dimension of the institution since its founding in 2010.",
  quote: "We seek to raise the Complete Child — one who carries both knowledge and character into the world.",
};

const TEAM = [
  {
    name: "Abdulssalam Mulikat Bukola",
    role: "Proprietress & Administrative Head",
    section: "Panada Section",
    image: "/images/leadership/2-proprietoress.jpg",
    initials: "AM",
    bio: "A pillar of administrative strength whose dedication has significantly contributed to the growth and stability of the Nursery and Primary sections.",
  },
  {
    name: "Oludoye Mariam Olufisayo",
    role: "Assistant Head",
    section: "Panada Section",
    image: "/images/leadership/3-assistant-head.jpg",
    initials: "OM",
    bio: "Supports the daily academic and pastoral operations of the Panada section, ensuring a structured and nurturing environment for every pupil.",
  },
  {
    name: "Waheed Kehinde Olawale",
    role: "Principal",
    section: "School of Science",
    image: "/images/leadership/4-science-principal.jpg",
    initials: "WK",
    bio: "Leads the School of Science with a focus on innovation, structured learning, and the advancement of technical education.",
  },
  {
    name: "Oyebanjo Mutiu Abiodun",
    role: "Principal",
    section: "The Crescent College",
    image: "/images/leadership/5-college-principal.jpg",
    initials: "OM",
    bio: "Provides strong academic leadership and spiritual guidance, ensuring discipline, moral uprightness, and excellence within the College.",
  },
  {
    name: "Ogunyemi Yusuf Olatunji",
    role: "Vice Principal I",
    section: "The Crescent College",
    image: "/images/leadership/6-vp1.jpg",
    initials: "OY",
    bio: "Supports academic coordination and student development, contributing to effective administration of the College.",
  },
  {
    name: "Sarafa Adamo Adekunle",
    role: "Vice Principal II",
    section: "The Crescent College",
    image: "/images/leadership/7-vp2.jpg",
    initials: "SA",
    bio: "Assists in maintaining discipline, academic standards, and smooth daily operations within the secondary section.",
  },
  {
    name: "Amode Abdulwasiu Ola",
    role: "Head of School",
    section: "Kobaope Section",
    image: "/images/leadership/8-headmaster.jpg",
    initials: "AA",
    bio: "Oversees the academic and moral development of pupils at the Kobaope section, ensuring a solid educational foundation.",
  },
];

const IslamicPattern = ({ id }: { id: string }) => (
  <svg aria-hidden className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.05]" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <pattern id={id} x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
        <polygon points="40,4 47,20 62,13 55,28 72,35 55,42 62,57 47,50 40,66 33,50 18,57 25,42 8,35 25,28 18,13 33,20" fill="none" stroke="white" strokeWidth="0.7" />
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill={`url(#${id})`} />
  </svg>
);

export default function LeadershipPage() {
  return (
    <div style={{ background: "#F7F5F1" }} className="min-h-screen">

      {/* ── Hero ── */}
      <section className="relative h-[52vh] min-h-72 flex items-center overflow-hidden" style={{ background: "#060E1C" }}>
        <IslamicPattern id="ldp-hero" />
        <img
          src="/images/leadership/1-proprietor.jpg"
          alt=""
          aria-hidden
          className="absolute inset-0 w-full h-full object-cover object-top opacity-10"
          onError={e => { (e.target as HTMLImageElement).style.display = "none"; }}
        />
        <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, rgba(6,14,28,0.95) 0%, rgba(11,31,58,0.85) 100%)" }} />

        <div className="absolute top-6 left-6 z-20">
          <Link href="/" className="flex items-center gap-1.5 text-white/60 hover:text-white text-sm transition-colors" style={{ fontFamily: "var(--font-body, sans-serif)" }}>
            <ChevronLeft size={16} /> Home
          </Link>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 max-w-7xl mx-auto px-6 sm:px-10 w-full"
        >
          <p className="text-xs tracking-[0.22em] uppercase mb-3 font-medium flex items-center gap-2"
            style={{ color: "#3BADD9", fontFamily: "var(--font-body, sans-serif)" }}>
            <span className="w-6 h-px bg-current" /> Our People
          </p>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight"
            style={{ fontFamily: "var(--font-display, 'Cormorant Garamond', serif)" }}>
            Meet Our{" "}
            <em className="not-italic" style={{ color: "#3BADD9" }}>Leadership</em>
          </h1>
          <p className="mt-4 max-w-xl text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.55)", fontFamily: "var(--font-body, sans-serif)" }}>
            Dedicated educators and administrators shaping the future of every child at The Crescent Academy.
          </p>
        </motion.div>
      </section>

      {/* ── Proprietor Feature ── */}
      <section className="py-20 md:py-28" style={{ background: "#fff" }}>
        <div className="max-w-6xl mx-auto px-6 sm:px-10">
          <div className="grid lg:grid-cols-[5fr_7fr] gap-16 items-center">

            {/* Portrait */}
            <ScrollReveal direction="left">
              <div className="relative mx-auto max-w-sm lg:max-w-none">
                {/* Corner accents */}
                <div className="absolute -top-3 -left-3 w-20 h-20 border-t-2 border-l-2 rounded-tl-2xl pointer-events-none" style={{ borderColor: "rgba(33,150,196,0.4)" }} />
                <div className="absolute -bottom-3 -right-3 w-20 h-20 border-b-2 border-r-2 rounded-br-2xl pointer-events-none" style={{ borderColor: "rgba(33,150,196,0.4)" }} />

                <div className="relative rounded-2xl overflow-hidden shadow-2xl" style={{ aspectRatio: "3/4" }}>
                  <img
                    src={PROPRIETOR.image}
                    alt={PROPRIETOR.name}
                    className="w-full h-full object-cover object-top"
                    onError={e => { (e.target as HTMLImageElement).style.display = "none"; }}
                  />
                  {/* Gradient overlay at bottom */}
                  <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(6,14,28,0.82) 0%, rgba(6,14,28,0.1) 45%, transparent 70%)" }} />
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <div className="w-8 h-0.5 mb-3" style={{ background: "#3BADD9" }} />
                    <p className="font-bold text-white text-lg leading-snug" style={{ fontFamily: "var(--font-display, 'Cormorant Garamond', serif)" }}>{PROPRIETOR.name}</p>
                    <p className="text-xs mt-1 font-medium tracking-wide uppercase" style={{ color: "#3BADD9", fontFamily: "var(--font-body, sans-serif)" }}>{PROPRIETOR.role}</p>
                  </div>
                </div>
              </div>
            </ScrollReveal>

            {/* Text */}
            <ScrollReveal direction="right">
              <div className="space-y-6">
                <div>
                  <p className="text-xs tracking-[0.18em] uppercase font-medium flex items-center gap-2 mb-3"
                    style={{ color: "#2196C4", fontFamily: "var(--font-body, sans-serif)" }}>
                    <span className="w-6 h-px bg-current" /> A Word from our Founder
                  </p>
                  <h2 className="text-3xl md:text-4xl font-bold leading-tight"
                    style={{ color: "#0B1F3A", fontFamily: "var(--font-display, 'Cormorant Garamond', serif)" }}>
                    Visionary Leadership,{" "}
                    <em style={{ color: "#2196C4", fontStyle: "italic" }}>Faithful Purpose</em>
                  </h2>
                </div>

                <p className="leading-relaxed text-sm" style={{ color: "#4B5563", fontFamily: "var(--font-body, sans-serif)" }}>
                  {PROPRIETOR.bio}
                </p>

                <p className="text-sm leading-relaxed" style={{ color: "#6B7280", fontFamily: "var(--font-body, sans-serif)" }}>
                  With the blessing of Allah, The Crescent Academy was founded to provide a harmonious blend of conventional and authentic Islamic education — producing graduates who are not only academically excellent but morally grounded, spiritually alive, and socially responsible.
                </p>

                <blockquote className="relative rounded-xl px-6 py-5 overflow-hidden"
                  style={{ background: "rgba(11,31,58,0.04)", borderLeft: "3px solid #2196C4" }}>
                  <Quote size={28} className="absolute top-3 right-4 opacity-10" style={{ color: "#2196C4" }} />
                  <p className="italic text-xl leading-relaxed font-medium"
                    style={{ color: "#0B1F3A", fontFamily: "var(--font-display, 'Cormorant Garamond', serif)" }}>
                    &ldquo;{PROPRIETOR.quote}&rdquo;
                  </p>
                  <footer className="text-xs font-semibold mt-3 uppercase tracking-widest"
                    style={{ color: "#2196C4", fontFamily: "var(--font-body, sans-serif)" }}>
                    — {PROPRIETOR.name}
                  </footer>
                </blockquote>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ── Team Portrait Grid ── */}
      <section className="py-20 md:py-28 relative overflow-hidden" style={{ background: "#0B1F3A" }}>
        <IslamicPattern id="ldp-team" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-10">
          {/* Section header */}
          <div className="text-center mb-16">
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-xs tracking-[0.22em] uppercase font-medium flex items-center gap-3 justify-center mb-3"
              style={{ color: "#3BADD9", fontFamily: "var(--font-body, sans-serif)" }}
            >
              <span className="w-8 h-px bg-current" /> Senior Leadership <span className="w-8 h-px bg-current" />
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.08 }}
              className="text-3xl md:text-4xl font-bold text-white"
              style={{ fontFamily: "var(--font-display, 'Cormorant Garamond', serif)" }}
            >
              The People Who Make It{" "}
              <em style={{ color: "#3BADD9", fontStyle: "italic" }}>Happen</em>
            </motion.h2>
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="w-12 h-0.5 rounded-full mx-auto mt-5 origin-center"
              style={{ background: "#2196C4" }}
            />
          </div>

          {/* Portrait cards */}
          <StaggerContainer className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {TEAM.map((leader, i) => (
              <StaggerItem key={i}>
                <PortraitCard leader={leader} />
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-16" style={{ background: "#F7F5F1" }}>
        <div className="max-w-2xl mx-auto px-6 text-center">
          <h2 className="text-2xl font-bold mb-3"
            style={{ color: "#0B1F3A", fontFamily: "var(--font-display, 'Cormorant Garamond', serif)" }}>
            Interested in Joining Our Team?
          </h2>
          <p className="text-sm mb-6 leading-relaxed" style={{ color: "#6B7280", fontFamily: "var(--font-body, sans-serif)" }}>
            We occasionally have openings for qualified, dedicated educators who share our values.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-8 py-3 rounded-full font-semibold text-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
            style={{ background: "#2196C4", color: "#fff", fontFamily: "var(--font-body, sans-serif)" }}
          >
            Get in Touch
          </Link>
        </div>
      </section>
    </div>
  );
}

function PortraitCard({ leader }: { leader: typeof TEAM[number] }) {
  return (
    <motion.div
      whileHover="hover"
      className="group relative rounded-2xl overflow-hidden cursor-default select-none"
      style={{
        aspectRatio: "3/4",
        background: "#112847",
        boxShadow: "0 4px 24px rgba(0,0,0,0.35)",
      }}
    >
      {/* Initials fallback — sits behind the image */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none"
        style={{ background: "linear-gradient(135deg, #112847 0%, #1A3460 100%)", zIndex: 0 }}>
        <span className="text-5xl font-bold opacity-20 text-white select-none"
          style={{ fontFamily: "var(--font-display, 'Cormorant Garamond', serif)" }}>
          {leader.initials}
        </span>
      </div>

      {/* Portrait image — on top of fallback */}
      <motion.div
        variants={{ hover: { scale: 1.06 } }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="absolute inset-0"
        style={{ zIndex: 1 }}
      >
        <img
          src={leader.image}
          alt={leader.name}
          className="w-full h-full object-cover object-top"
          onError={e => {
            const el = e.target as HTMLImageElement;
            el.style.display = "none";
          }}
        />
      </motion.div>

      {/* Always-visible bottom gradient with name */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: "linear-gradient(to top, rgba(6,14,28,0.92) 0%, rgba(6,14,28,0.45) 35%, transparent 60%)", zIndex: 2 }} />

      {/* Name + role — always visible at bottom */}
      <motion.div
        variants={{ hover: { y: -8, opacity: 0 } }}
        transition={{ duration: 0.3 }}
        className="absolute bottom-0 left-0 right-0 p-5 pointer-events-none"
        style={{ zIndex: 3 }}
      >
        <p className="font-bold text-white text-base leading-snug"
          style={{ fontFamily: "var(--font-display, 'Cormorant Garamond', serif)" }}>
          {leader.name}
        </p>
        <p className="text-xs mt-1 font-medium" style={{ color: "#3BADD9", fontFamily: "var(--font-body, sans-serif)" }}>
          {leader.role}
        </p>
        <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.45)", fontFamily: "var(--font-body, sans-serif)" }}>
          {leader.section}
        </p>
      </motion.div>

      {/* Hover overlay — full bio slide up */}
      <motion.div
        variants={{ hover: { opacity: 1, y: 0 } }}
        initial={{ opacity: 0, y: 30 }}
        transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
        className="absolute inset-0 flex flex-col justify-end p-5 pointer-events-none"
        style={{ background: "linear-gradient(to top, rgba(6,14,28,0.97) 0%, rgba(11,31,58,0.92) 55%, rgba(11,31,58,0.6) 100%)", zIndex: 4 }}
      >
        <div className="w-6 h-0.5 mb-3" style={{ background: "#3BADD9" }} />
        <p className="font-bold text-white text-base leading-snug mb-1"
          style={{ fontFamily: "var(--font-display, 'Cormorant Garamond', serif)" }}>
          {leader.name}
        </p>
        <p className="text-xs font-semibold mb-3 uppercase tracking-wide" style={{ color: "#3BADD9", fontFamily: "var(--font-body, sans-serif)" }}>
          {leader.role} · {leader.section}
        </p>
        <p className="text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.72)", fontFamily: "var(--font-body, sans-serif)" }}>
          {leader.bio}
        </p>
      </motion.div>

      {/* Blue border on hover */}
      <motion.div
        variants={{ hover: { opacity: 1 } }}
        initial={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        className="absolute inset-0 rounded-2xl pointer-events-none"
        style={{ border: "2px solid rgba(33,150,196,0.6)", boxShadow: "inset 0 0 0 1px rgba(59,173,217,0.15)", zIndex: 5 }}
      />
    </motion.div>
  );
}
