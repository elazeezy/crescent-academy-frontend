"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ChevronLeft, Quote } from "lucide-react";
import ScrollReveal from "@/components/ui/ScrollReveal";
import StaggerContainer, { StaggerItem } from "@/components/ui/StaggerContainer";

const TEAM = [
  { name: "Alhaji Abdul Wasii Abdus Salam", role: "Proprietor & Founder",                              image: "/images/leadership/1-proprietor.jpg",        initials: "AW", bio: "The visionary behind The Crescent Academy, whose commitment to faith-based excellence, discipline, and quality education continues to shape the direction of the institution.", featured: true },
  { name: "Alhaja Abdus Salam M.B",         role: "Proprietoress & Administrator, Nursery & Primary",  image: "/images/leadership/2-proprietoress.jpg",     initials: "AM", bio: "A pillar of administrative strength whose dedication has significantly contributed to the growth and stability of the Nursery and Primary sections." },
  { name: "Mr. Mutiu Oyebanjo (Sheikh)",    role: "Principal & Imam, The Crescent College",            image: "/images/leadership/3-principal.jpg",         initials: "MO", bio: "Provides strong academic leadership and spiritual guidance, ensuring discipline, moral uprightness, and excellence within the College." },
  { name: "Mr. Yusuf Ogunyemi",            role: "Vice Principal I, The Crescent College",            image: "/images/leadership/4-vp1.jpg",               initials: "YO", bio: "Supports academic coordination and student development, contributing to effective administration of the College." },
  { name: "Mr. Sarafa Adam",                role: "Vice Principal II, The Crescent College",           image: "/images/leadership/5-vp2.jpg",               initials: "SA", bio: "Assists in maintaining discipline, academic standards, and smooth daily operations within the secondary section." },
  { name: "Mr. Abdul Waheed Kehinde",       role: "Principal, The Crescent School of Science",        image: "/images/leadership/6-science-principal.jpg", initials: "AK", bio: "Leads the School of Science with a focus on innovation, structured learning, and advancement of technical education." },
  { name: "Mr. Abdul Wasiu Amade",          role: "Headmaster, Primary Section",                      image: "/images/leadership/7-headmaster.jpg",        initials: "AA", bio: "Oversees the academic and moral development of pupils at the Primary level, ensuring a solid educational foundation." },
];

const proprietor = TEAM[0];
const teamMembers = TEAM.slice(1);

const IslamicPattern = ({ id }: { id: string }) => (
  <svg aria-hidden className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.05]" xmlns="http://www.w3.org/2000/svg">
    <defs><pattern id={id} x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse"><polygon points="40,4 47,20 62,13 55,28 72,35 55,42 62,57 47,50 40,66 33,50 18,57 25,42 8,35 25,28 18,13 33,20" fill="none" stroke="white" strokeWidth="0.7" /></pattern></defs>
    <rect width="100%" height="100%" fill={`url(#${id})`} />
  </svg>
);

export default function LeadershipPage() {
  return (
    <div style={{ background: "#F7F5F1" }} className="min-h-screen">

      {/* Hero */}
      <section className="relative h-[50vh] min-h-64 flex items-center overflow-hidden" style={{ background: "#0B1F3A" }}>
        <IslamicPattern id="ldp" />
        <img src="/images/leadership/1-proprietor.jpg" alt="" aria-hidden
          className="absolute inset-0 w-full h-full object-cover opacity-15"
          onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
        <div className="absolute inset-0" style={{ background: "rgba(6,14,28,0.80)" }} />
        <div className="absolute top-6 left-6 z-20">
          <Link href="/" className="flex items-center gap-1.5 text-white/70 hover:text-white text-sm transition-colors"
            style={{ fontFamily: "var(--font-body, sans-serif)" }}>
            <ChevronLeft size={16} /> Home
          </Link>
        </div>
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}
          className="relative z-10 max-w-7xl mx-auto px-6 sm:px-10 w-full">
          <p className="text-xs tracking-[0.2em] uppercase mb-3 font-medium"
            style={{ color: "#2196C4", fontFamily: "var(--font-body, sans-serif)" }}>Our Team</p>
          <h1 className="text-4xl sm:text-5xl font-bold text-white leading-tight"
            style={{ fontFamily: "var(--font-display, 'Cormorant Garamond', serif)" }}>
            Meet Our <span className="italic" style={{ color: "#3BADD9" }}>Leadership</span>
          </h1>
        </motion.div>
      </section>

      {/* Proprietor Feature */}
      <section className="py-20 md:py-28" style={{ background: "#fff" }}>
        <div className="max-w-6xl mx-auto px-6 sm:px-10">
          <div className="grid lg:grid-cols-[2fr_3fr] gap-14 items-center">
            <ScrollReveal direction="left">
              <div className="relative">
                <div className="absolute -top-4 -left-4 w-24 h-24 border-2 rounded-3xl pointer-events-none"
                  style={{ borderColor: "rgba(33,150,196,0.25)" }} />
                <div className="relative rounded-3xl overflow-hidden aspect-[4/5] shadow-2xl z-10"
                  style={{ background: "#112847", boxShadow: "0 0 0 4px rgba(33,150,196,0.15)" }}>
                  <img src={proprietor.image} alt={proprietor.name} className="w-full h-full object-cover object-top"
                    onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#060E1C]/70 via-transparent to-transparent" />
                  <div className="absolute bottom-6 left-6 right-6">
                    <p className="text-white font-bold text-lg" style={{ fontFamily: "var(--font-body, sans-serif)" }}>{proprietor.name}</p>
                    <p className="text-xs" style={{ color: "rgba(255,255,255,0.6)", fontFamily: "var(--font-body, sans-serif)" }}>{proprietor.role}</p>
                  </div>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal direction="right">
              <div className="space-y-6">
                <div>
                  <p className="text-xs tracking-[0.2em] uppercase mb-3 font-medium flex items-center gap-2"
                    style={{ color: "#2196C4", fontFamily: "var(--font-body, sans-serif)" }}>
                    <span className="w-6 h-px" style={{ background: "#2196C4" }} /> A Word from our Founder
                  </p>
                  <h2 className="text-3xl md:text-4xl font-bold leading-tight mb-6"
                    style={{ color: "#0B1F3A", fontFamily: "var(--font-display, 'Cormorant Garamond', serif)" }}>
                    Visionary Leadership,<br /><span className="italic" style={{ color: "#2196C4" }}>Faithful Purpose</span>
                  </h2>
                </div>
                <div className="relative pl-6" style={{ borderLeft: "2px solid rgba(33,150,196,0.4)" }}>
                  <Quote size={30} className="absolute -top-2 -left-0.5" style={{ color: "rgba(33,150,196,0.2)" }} />
                  <p className="leading-relaxed italic" style={{ color: "#4B5563", fontFamily: "var(--font-body, sans-serif)" }}>{proprietor.bio}</p>
                </div>
                <p className="text-sm leading-relaxed" style={{ color: "#6B7280", fontFamily: "var(--font-body, sans-serif)" }}>
                  With the blessing of Allah, The Crescent Academy was founded to provide a harmonious blend of conventional and authentic Islamic education — producing graduates who are not only academically excellent but morally grounded, spiritually alive, and socially responsible.
                </p>
                <blockquote className="rounded-r-xl px-5 py-4"
                  style={{ background: "rgba(33,150,196,0.06)", borderLeft: "4px solid #2196C4" }}>
                  <p className="italic text-lg leading-relaxed font-medium"
                    style={{ color: "#0B1F3A", fontFamily: "var(--font-display, 'Cormorant Garamond', serif)" }}>
                    "We seek to raise the Complete Child — one who carries both knowledge and character into the world."
                  </p>
                  <footer className="text-xs font-medium mt-2 uppercase tracking-wide"
                    style={{ color: "#2196C4", fontFamily: "var(--font-body, sans-serif)" }}>— {proprietor.name}</footer>
                </blockquote>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Team Grid */}
      <section className="py-16 md:py-20 relative overflow-hidden" style={{ background: "#0B1F3A" }}>
        <IslamicPattern id="ldteam" />
        <div className="relative z-10 max-w-6xl mx-auto px-6 sm:px-10">
          <div className="text-center mb-12">
            <p className="text-xs tracking-[0.14em] uppercase mb-3 font-medium flex items-center gap-3 justify-center"
              style={{ color: "#3BADD9", fontFamily: "var(--font-body, sans-serif)" }}>
              <span className="w-8 h-px" style={{ background: "#3BADD9" }} />The Team<span className="w-8 h-px" style={{ background: "#3BADD9" }} />
            </p>
            <h2 className="text-3xl font-bold text-white"
              style={{ fontFamily: "var(--font-display, 'Cormorant Garamond', serif)" }}>
              Our Senior <span className="italic" style={{ color: "#3BADD9" }}>Leaders</span>
            </h2>
            <p className="mt-3 max-w-lg mx-auto text-sm"
              style={{ color: "rgba(255,255,255,0.6)", fontFamily: "var(--font-body, sans-serif)" }}>
              Dedicated educators and administrators guiding The Crescent Academy's three sections.
            </p>
            <div className="w-12 h-0.5 rounded-full mx-auto mt-4" style={{ background: "#2196C4" }} />
          </div>
          <StaggerContainer className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {teamMembers.map((leader, i) => (
              <StaggerItem key={i}>
                <div className="group rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1"
                  style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}
                  onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.1)"; e.currentTarget.style.borderColor = "rgba(33,150,196,0.35)"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.06)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; }}>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 rounded-full overflow-hidden flex items-center justify-center shrink-0 relative"
                      style={{ background: "#112847", border: "2px solid rgba(33,150,196,0.3)" }}>
                      <img src={leader.image} alt={leader.name} className="w-full h-full object-cover object-top"
                        onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
                      <span className="absolute inset-0 flex items-center justify-center font-bold text-white text-lg pointer-events-none select-none">
                        {leader.initials}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-base leading-snug" style={{ fontFamily: "var(--font-body, sans-serif)" }}>{leader.name}</h3>
                      <p className="text-xs mt-0.5" style={{ color: "#3BADD9", fontFamily: "var(--font-body, sans-serif)" }}>{leader.role}</p>
                    </div>
                  </div>
                  <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.55)", fontFamily: "var(--font-body, sans-serif)" }}>{leader.bio}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16" style={{ background: "#F7F5F1" }}>
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-2xl font-bold mb-3"
            style={{ color: "#0B1F3A", fontFamily: "var(--font-display, 'Cormorant Garamond', serif)" }}>
            Interested in Joining Our Team?
          </h2>
          <p className="text-sm mb-6" style={{ color: "#6B7280", fontFamily: "var(--font-body, sans-serif)" }}>
            We occasionally have openings for qualified, dedicated educators who share our values.
          </p>
          <Link href="/contact"
            className="inline-flex items-center gap-2 px-7 py-3 rounded-full font-bold text-sm transition-all hover:-translate-y-0.5"
            style={{ background: "#2196C4", color: "#fff", fontFamily: "var(--font-body, sans-serif)" }}
            onMouseEnter={e => (e.currentTarget.style.background = "#3BADD9")}
            onMouseLeave={e => (e.currentTarget.style.background = "#2196C4")}>
            Contact Us
          </Link>
        </div>
      </section>
    </div>
  );
}
