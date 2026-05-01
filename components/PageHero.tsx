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

export default function PageHero({
  title,
  subtitle,
  image,
  breadcrumb,
  height = "h-[62vh] md:h-[72vh]",
}: PageHeroProps) {
  return (
    <section className={`relative ${height} flex items-center justify-center overflow-hidden`}>
      {/* Background: always-visible gradient + optional image overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0F1E4A] via-[#1E3A8A] to-[#0a2a6e]">
        {image && (
          <img
            src={image}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 w-full h-full object-cover brightness-[0.65] contrast-[1.1] transition-opacity duration-700"
            onError={e => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
          />
        )}
        {/* Layered gradient overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/65" />
        {/* Subtle radial glow */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(14,165,233,0.12)_0%,transparent_70%)]" />
      </div>

      {/* Breadcrumb */}
      <div className="absolute top-6 left-5 sm:top-8 sm:left-8 z-20">
        <nav aria-label="Breadcrumb">
          <ol className="flex items-center gap-2 text-sm text-white/80">
            <li>
              <Link
                href="/"
                className="flex items-center gap-1 hover:text-[#0EA5E9] transition-colors font-medium"
              >
                <ChevronLeft size={15} />
                Home
              </Link>
            </li>
            <li className="opacity-50">›</li>
            <li className="text-white font-semibold">{breadcrumb}</li>
          </ol>
        </nav>
      </div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.1, ease: "easeOut" }}
        className="relative z-10 text-center text-white px-5 sm:px-10 max-w-5xl mx-auto"
      >
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight mb-4 drop-shadow-xl">
          {title}
        </h1>
        {subtitle && (
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl font-light max-w-3xl mx-auto opacity-90 leading-relaxed">
            {subtitle}
          </p>
        )}
      </motion.div>

      {/* Decorative bottom fade */}
      <div className="absolute bottom-0 inset-x-0 h-20 bg-gradient-to-t from-white via-white/20 to-transparent pointer-events-none" />
    </section>
  );
}
