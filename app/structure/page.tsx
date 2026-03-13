// app/structure/page.tsx
"use client";

import { motion, Variants } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

const fadeInUp = {
  hidden: { opacity: 0, y: 60 } as const,
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.9,
      ease: "easeOut" as const,
    },
  },
} satisfies Variants;

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.25,
      delayChildren: 0.3,
    },
  },
};

export default function SchoolStructurePage() {
  const sections = [
    {
      title: "Crescent Academy",
      subtitle: "Nursery & Primary Section",
      locations: [
        "Panada Area, Beside Car Wash, Along Water Works, Iwo",
        "Kobaope Phase 1, Iwo",
      ],
      highlights: [
        "Foundational stage with structured play, literacy, numeracy & moral instruction",
        "Tahfīdhul Qur’an program – memorization, understanding & application",
        "Balanced curriculum: English, Math, Science, Social Studies + Islamic Studies & Arabic",
        "Safe, nurturing environment building confidence, curiosity & love for learning",
      ],
      image: "/images/structure/1-nursery-primary.jpg",
    },
    {
      title: "Crescent College",
      subtitle: "Secondary Section (Founded 2014)",
      location: "Along Ile Ogbo Road, Iwo",
      highlights: [
        "Comprehensive curriculum aligned with national standards",
        "Preparation for higher education & professional careers",
        "Emphasis on discipline, leadership, moral/Islamic values & critical thinking",
        "Experienced teachers passionate about mentoring & character formation",
        "Environment promoting respect, diligence, focus & self-confidence",
      ],
      image: "/images/structure/2-secondary-college.jpg",
    },
    {
      title: "Crescent School of Science",
      subtitle: "Founded 2023",
      location: "Beside Masjid Darus Salam, Along Kobaope, Iwo",
      highlights: [
        "Foundational scientific & technical knowledge from Junior Secondary",
        "Curriculum focus: Basic Science, Technology, Math & analytical reasoning",
        "Hands-on, practical learning",
        "Vocational training: Baking & confectionery, hair plaiting/cosmetology & more",
        "Empowering students to be innovative, self-reliant & productive",
      ],
      image: "/images/structure/3-school-of-science.jpg",
    },
  ];

  return (
    <div className="bg-white min-h-screen flex flex-col">

      {/* Hero with real background image + breadcrumb overlay */}
      <section className="relative h-[60vh] md:h-[70vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/structure/hero-campus.jpg"   // ← Download & place here
            alt="Crescent Schools Campus Overview"
            fill
            className="object-cover brightness-[0.75] contrast-[1.1]"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
        </div>

        {/* Breadcrumb – top-left overlay (same style as previous pages) */}
        <div className="absolute top-6 left-6 sm:top-8 sm:left-8 z-30">
          <nav aria-label="Breadcrumb">
            <ol className="flex items-center space-x-3 text-base md:text-lg">
              <li>
                <Link
                  href="/"
                  className="text-white/90 hover:text-[#0EA5E9] transition-colors duration-300 flex items-center gap-2 font-medium drop-shadow-md"
                >
                  <ChevronLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                  Home
                </Link>
              </li>
              <li className="text-white/70">›</li>
              <li className="text-white font-semibold drop-shadow-md">
                Our School Structure
              </li>
            </ol>
          </nav>
        </div>

        {/* Original hero content (unchanged) */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2 }}
          className="relative z-10 text-center text-white px-6 max-w-5xl mx-auto"
        >
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight mb-6">
            Our School Structure
          </h1>
          <p className="text-lg md:text-2xl max-w-4xl mx-auto opacity-90">
            With the help of Allah (SWT), a complete educational journey from Nursery to Vocational
          </p>
        </motion.div>
      </section>

      {/* Intro (unchanged) */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-white to-slate-50">
        <div className="container mx-auto px-6 max-w-5xl text-center">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="text-lg md:text-xl text-slate-700 leading-relaxed"
          >
            With the help of Allah (SWT), Crescent Academy has expanded into a structured educational system comprising three major sections. Each section is strategically established to serve specific stages of a child’s educational journey, ensuring continuity, excellence, and strong moral foundation.
          </motion.p>
        </div>
      </section>

      {/* Three Sections – glassmorphic cards with hover glow (content 100% unchanged) */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
            {sections.map((section, i) => (
              <motion.div
                key={i}
                variants={fadeInUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="bg-white/90 backdrop-blur-xl border border-slate-200/60 rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl hover:scale-[1.03] transition-all duration-500 group"
              >
                <div className="relative h-56 overflow-hidden">
                  <Image
                    src={section.image}
                    alt={section.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="absolute bottom-6 left-6 right-6">
                    <h3 className="text-2xl font-bold text-white drop-shadow-md">{section.title}</h3>
                    <p className="text-white/90 text-sm mt-1 drop-shadow-md">{section.subtitle}</p>
                  </div>
                </div>

                <div className="p-8">
                  {section.locations && (
                    <div className="mb-6">
                      <h4 className="text-lg font-semibold text-[#1E3A8A] mb-2">Locations</h4>
                      <ul className="space-y-1 text-slate-600 text-base">
                        {section.locations.map((loc, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="text-[#0EA5E9] mt-1">•</span>
                            {loc}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {section.location && (
                    <p className="mb-6 text-slate-600 text-base">
                      <strong>Location:</strong> {section.location}
                    </p>
                  )}

                  <h4 className="text-lg font-semibold text-[#1E3A8A] mb-4">Highlights</h4>
                  <ul className="space-y-3 text-slate-700 text-base">
                    {section.highlights.map((highlight, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <div className="w-2 h-2 rounded-full bg-[#0EA5E9] mt-2 flex-shrink-0 animate-pulse" />
                        {highlight}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Unified Vision (unchanged) */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.8 }}
            className="mt-20 text-center max-w-4xl mx-auto"
          >
            <h3 className="text-3xl md:text-4xl font-bold text-[#1E3A8A] mb-6">
              A Unified Vision
            </h3>
            <p className="text-lg md:text-xl text-slate-700 leading-relaxed mb-8">
              Together, these three sections form a comprehensive and progressive educational system that nurtures learners from early childhood through secondary education. With the help of Allah, the dedication of our leadership, and the commitment of our teachers, Crescent Schools continue to stand as a beacon of faith-based excellence, academic strength, discipline, and practical empowerment in Iwo and beyond.
            </p>
            <p className="text-xl font-medium italic text-[#0EA5E9]">
              Our mission remains steadfast: to raise knowledgeable, disciplined, skilled, and God-conscious individuals who will positively impact their communities and the wider world.
            </p>
          </motion.div>
        </div>
      </section>

      {/* CTA (polished hover scale – content unchanged) */}
      <section className="py-16 md:py-24 bg-gradient-to-r from-[#1E3A8A] to-[#0F2A5E] text-white">
        <div className="container mx-auto px-6 text-center">
          <h3 className="text-3xl md:text-4xl font-bold mb-8">
            Explore More
          </h3>
          <div className="flex flex-wrap justify-center gap-6">
            <Link
              href="/leadership"
              className="bg-white/15 hover:bg-white/25 px-8 py-4 rounded-xl font-medium transition-all duration-300 hover:scale-105 hover:shadow-2xl backdrop-blur-md border border-white/20"
            >
              Meet Our Leadership
            </Link>
            <Link
              href="/admissions"
              className="bg-white/15 hover:bg-white/25 px-8 py-4 rounded-xl font-medium transition-all duration-300 hover:scale-105 hover:shadow-2xl backdrop-blur-md border border-white/20"
            >
              Admissions Information
            </Link>
            <Link
              href="/portals"
              className="bg-white/15 hover:bg-white/25 px-8 py-4 rounded-xl font-medium transition-all duration-300 hover:scale-105 hover:shadow-2xl backdrop-blur-md border border-white/20"
            >
              Access Portals
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}