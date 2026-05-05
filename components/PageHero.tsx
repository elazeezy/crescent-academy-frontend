"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronLeft } from "lucide-react";

interface PageHeroProps {
  title: string;
  subtitle?: string;
  image?: string;
  breadcrumb: string;
  height?: string;
}

const IslamicPattern = () => (
  <svg
    className="absolute inset-0 w-full h-full pointer-events-none select-none"
    style={{ opacity: 0.055 }}
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden
  >
    <defs>
      <pattern id="ip-hero" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
        <polygon
          points="40,4 47,20 62,13 55,28 72,35 55,42 62,57 47,50 40,66 33,50 18,57 25,42 8,35 25,28 18,13 33,20"
          fill="none" stroke="currentColor" strokeWidth="0.7"
        />
        <circle cx="40" cy="35" r="7" fill="none" stroke="currentColor" strokeWidth="0.5" />
        <circle cx="40" cy="35" r="2" fill="currentColor" />
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#ip-hero)" />
  </svg>
);

const Noise = () => (
  <div
    aria-hidden
    className="absolute inset-0 pointer-events-none opacity-[0.028]"
    style={{
      backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
      backgroundSize: "160px",
    }}
  />
);

export default function PageHero({
  title,
  subtitle,
  image,
  breadcrumb,
  height = "h-[52vh] md:h-[68vh]",
}: PageHeroProps) {
  return (
    <section className={`relative ${height} flex items-center justify-center overflow-hidden`}>

      {/* ── Background stack ── */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#061529] via-[#0F2A5E] to-[#1E3A8A]" />

      {image && (
        <img
          src={image}
          alt=""
          aria-hidden
          className="absolute inset-0 w-full h-full object-cover brightness-[0.28] contrast-[1.08]"
          onError={e => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
        />
      )}

      {/* Cinematic dual gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/20 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />

      {/* Radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(14,165,233,0.13)_0%,transparent_68%)]" />

      {/* Crescent watermark */}
      <svg
        aria-hidden
        viewBox="0 0 200 200"
        className="absolute -right-24 -top-24 w-[480px] h-[480px] pointer-events-none select-none text-white opacity-[0.03]"
        fill="currentColor"
      >
        <path d="M100,10 A90,90 0 1,1 100,190 A62,62 0 1,0 100,10 Z" />
        <circle cx="135" cy="48" r="9" />
        <circle cx="158" cy="72" r="5.5" />
        <circle cx="148" cy="33" r="3.5" />
      </svg>

      <IslamicPattern />
      <Noise />

      {/* Gold accent line top */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#D4A847]/60 to-transparent" />

      {/* ── Breadcrumb ── */}
      <div className="absolute top-6 left-5 sm:top-8 sm:left-8 z-20">
        <nav aria-label="Breadcrumb">
          <ol className="flex items-center gap-2 text-sm text-white/80">
            <li>
              <Link
                href="/"
                className="flex items-center gap-1 hover:text-[#0EA5E9] transition-colors duration-200 font-medium"
              >
                <ChevronLeft size={15} />
                Home
              </Link>
            </li>
            <li className="opacity-40">›</li>
            <li className="text-white font-semibold">{breadcrumb}</li>
          </ol>
        </nav>
      </div>

      {/* ── Content ── */}
      <div className="relative z-10 text-center text-white px-5 sm:px-10 max-w-5xl mx-auto">
        {/* Eyebrow gold line */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65 }}
          className="flex items-center justify-center gap-3 mb-4"
        >
          <span className="h-px w-8 bg-[#D4A847]" />
          <span className="text-[#D4A847] text-[10px] font-black tracking-[0.42em] uppercase">
            The Crescent Academy
          </span>
          <span className="h-px w-8 bg-[#D4A847]" />
        </motion.div>

        {/* Title — masked reveal */}
        <div className="overflow-hidden">
          <motion.h1
            initial={{ y: "105%" }}
            animate={{ y: 0 }}
            transition={{ duration: 0.95, ease: [0.16, 1, 0.3, 1] }}
            className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight leading-[1.05] drop-shadow-2xl"
          >
            {title}
          </motion.h1>
        </div>

        {subtitle && (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.2 }}
            className="mt-4 text-base sm:text-lg md:text-xl font-light max-w-3xl mx-auto text-white/75 leading-relaxed"
          >
            {subtitle}
          </motion.p>
        )}
      </div>

      {/* ── Bottom fade into page ── */}
      <div className="absolute bottom-0 inset-x-0 h-24 bg-gradient-to-t from-white via-white/15 to-transparent pointer-events-none" />
    </section>
  );
}
