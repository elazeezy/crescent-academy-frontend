"use client";

import { motion, useReducedMotion } from "framer-motion";

interface Props {
  eyebrow?: string;
  title: string;
  highlightWord?: string;
  subtitle?: string;
  align?: "left" | "center";
  light?: boolean;
}

export default function SectionHeader({
  eyebrow,
  title,
  highlightWord,
  subtitle,
  align = "center",
  light = false,
}: Props) {
  const reduced = useReducedMotion();
  const titleParts = highlightWord ? title.split(highlightWord) : [title];

  return (
    <div className={`mb-12 md:mb-16 ${align === "center" ? "text-center" : ""}`}>
      {eyebrow && (
        <motion.p
          initial={reduced ? false : { opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className={`text-[11px] font-medium tracking-[0.14em] uppercase mb-4 ${
            light ? "text-ca-gold-light" : "text-ca-gold"
          } flex items-center gap-3 ${align === "center" ? "justify-center" : ""}`}
        >
          <span className="w-8 h-px bg-current shrink-0" />
          {eyebrow}
          <span className="w-8 h-px bg-current shrink-0" />
        </motion.p>
      )}

      <motion.h2
        initial={reduced ? false : { opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.65, delay: 0.1 }}
        className={`text-3xl md:text-4xl font-bold leading-tight ${
          light ? "text-white" : "text-ca-navy"
        }`}
        style={{ fontSize: "clamp(1.5rem, 3vw, 2.25rem)" }}
      >
        {highlightWord ? (
          <>
            {titleParts[0]}
            <span className="text-ca-gold">{highlightWord}</span>
            {titleParts[1]}
          </>
        ) : (
          title
        )}
      </motion.h2>

      {subtitle && (
        <motion.p
          initial={reduced ? false : { opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className={`mt-4 text-base leading-relaxed max-w-2xl ${
            align === "center" ? "mx-auto" : ""
          } ${light ? "text-white/70" : "text-slate-500"}`}
        >
          {subtitle}
        </motion.p>
      )}

      <motion.div
        initial={reduced ? false : { width: 0 }}
        whileInView={{ width: "3rem" }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className={`mt-5 h-0.5 bg-ca-gold rounded-full ${align === "center" ? "mx-auto" : ""}`}
      />
    </div>
  );
}
