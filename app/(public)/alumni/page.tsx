"use client";

import { motion } from "framer-motion";
import { ArrowRight, ChevronLeft, GraduationCap, Mail, Users } from "lucide-react";
import Link from "next/link";
import { SCHOOL } from "@/lib/constants";

export default function AlumniPage() {
  return (
    <div className="min-h-screen" style={{ background: "#F7F5F1" }}>
      <section className="public-page-hero relative overflow-hidden py-24 md:py-32" style={{ background: "#0B1F3A" }}>
        <div aria-hidden className="absolute inset-0 bg-dot-grid opacity-[.07]" />
        <div className="relative max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
          <Link href="/" className="inline-flex items-center gap-1.5 mb-8 text-sm text-white/70 hover:text-white focus-ring"><ChevronLeft size={16} /> Home</Link>
          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .5 }} className="max-w-2xl">
            <p className="text-xs tracking-[.16em] uppercase font-medium" style={{ color: "#6CC4E8" }}>The Crescent community</p>
            <h1 className="mt-3 text-4xl sm:text-5xl md:text-6xl font-semibold text-white leading-[1.06]" style={{ fontFamily: "var(--font-display, Georgia, serif)" }}>Our <em style={{ color: "#3BADD9" }}>Alumni</em></h1>
            <p className="mt-5 max-w-xl text-base sm:text-lg leading-relaxed text-white/70">Our former students carry Crescent values into their homes, workplaces, and communities.</p>
          </motion.div>
        </div>
      </section>

      <section className="public-page-section py-16 md:py-24"><div className="max-w-5xl mx-auto px-6 sm:px-10">
        <div className="grid md:grid-cols-[1.1fr_.9fr] gap-8 md:gap-12 items-start">
          <div><p className="text-xs uppercase tracking-[.14em] font-medium" style={{ color: "#2196C4" }}>Stay part of the story</p><h2 className="mt-3 text-3xl sm:text-4xl font-semibold leading-tight" style={{ color: "#1A1714", fontFamily: "var(--font-display, Georgia, serif)" }}>A lifelong connection to Crescent Academy.</h2><p className="mt-5 leading-relaxed" style={{ color: "#5C554E" }}>We are building a dedicated alumni network for school news, reunions, mentoring, and celebrating the paths our graduates take after Crescent.</p></div>
          <div className="grid gap-4"><div className="border bg-white p-6" style={{ borderRadius: 8, borderColor: "#E2DDD6" }}><GraduationCap size={22} style={{ color: "#2196C4" }} /><h3 className="mt-4 text-lg font-semibold" style={{ color: "#1A1714" }}>Share your journey</h3><p className="mt-2 text-sm leading-relaxed" style={{ color: "#5C554E" }}>Tell us what you have been doing since graduation and help inspire today&apos;s students.</p></div><div className="border bg-white p-6" style={{ borderRadius: 8, borderColor: "#E2DDD6" }}><Users size={22} style={{ color: "#2196C4" }} /><h3 className="mt-4 text-lg font-semibold" style={{ color: "#1A1714" }}>Reconnect with your class</h3><p className="mt-2 text-sm leading-relaxed" style={{ color: "#5C554E" }}>Register your interest for future school updates and alumni gatherings.</p></div></div>
        </div>
      </div></section>

      <section className="public-page-section py-14 md:py-16" style={{ background: "#112847" }}><div className="max-w-5xl mx-auto px-6 sm:px-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6"><div><h2 className="text-2xl sm:text-3xl text-white font-semibold" style={{ fontFamily: "var(--font-display, Georgia, serif)" }}>Join the alumni network</h2><p className="mt-2 text-sm text-white/65">Our team will help add you to the growing community.</p></div><a href={`mailto:${SCHOOL.email}?subject=Alumni%20Network%20Enquiry`} className="inline-flex items-center gap-2 px-5 py-3 text-sm font-semibold text-white focus-ring" style={{ background: "#2196C4", borderRadius: 999 }}><Mail size={16} /> Contact the school <ArrowRight size={15} /></a></div></section>
    </div>
  );
}
