// app/gallery/page.tsx
"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

const fadeInUp = {
  hidden: { opacity: 0, y: 60 },
  visible: { opacity: 1, y: 0 },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

export default function GalleryPage() {
  // Real image paths – download & place in public/images/gallery/
  const galleryImages = [
    "/images/gallery/1-students-learning.jpg",
    "/images/gallery/2-school-assembly.jpg",
    "/images/gallery/3-happy-students.jpg",
    "/images/gallery/4-sports-day.jpg",
    "/images/gallery/5-quran-study.jpg",
    "/images/gallery/6-graduation.jpg",
  ];

  return (
    <div className="bg-white min-h-screen flex flex-col">

      {/* Hero with first gallery image as background + breadcrumb overlay */}
      <section className="relative h-[60vh] md:h-[70vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src={galleryImages[0]}  // Using first image as hero background (as in your original)
            alt="Crescent Academy Gallery"
            fill
            className="object-cover brightness-[0.75]"
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
                Photo Gallery
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
            Photo Gallery
          </h1>
          <p className="text-lg md:text-2xl max-w-4xl mx-auto opacity-90">
            Moments of learning, joy, growth, and faith at Crescent Academy
          </p>
        </motion.div>
      </section>

      {/* Gallery Grid – enhanced with glass hover (content & images paths updated, no reduction) */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-6">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
          >
            {galleryImages.map((src, i) => (
              <motion.div
                key={i}
                variants={fadeInUp}
                className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 group border border-slate-200/60"
              >
                <Image
                  src={src}
                  alt={`Gallery image ${i + 1}`}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA (unchanged) */}
      <section className="py-16 md:py-24 bg-gradient-to-r from-[#1E3A8A] to-[#0F2A5E] text-white">
        <div className="container mx-auto px-6 text-center">
          <motion.h3
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-4xl font-bold mb-8"
          >
            Want to See More?
          </motion.h3>
          <Link
            href="/contact"
            className="inline-block px-10 py-4 bg-white/15 hover:bg-white/25 rounded-xl font-medium transition-all backdrop-blur-md border border-white/20"
          >
            Contact Us
          </Link>
        </div>
      </section>
    </div>
  );
}