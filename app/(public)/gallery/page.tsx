"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

const fadeInUp = {
  hidden: { opacity: 0, y: 60 },
  visible: { opacity: 1, y: 0 },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
};

const FALLBACK_IMAGES = [
  "/images/gallery/1-students-learning.jpg",
  "/images/gallery/2-school-assembly.jpg",
  "/images/gallery/3-happy-students.jpg",
  "/images/gallery/4-sports-day.jpg",
  "/images/gallery/5-quran-study.jpg",
  "/images/gallery/6-graduation.jpg",
];

const GALLERY_ZONE_IDS = [
  'gallery_1', 'gallery_2', 'gallery_3',
  'gallery_4', 'gallery_5', 'gallery_6',
];

export default function GalleryPage() {
  const [galleryImages, setGalleryImages] = useState<string[]>(FALLBACK_IMAGES);

  useEffect(() => {
    fetch('/api/site-images')
      .then(r => r.json())
      .then(data => {
        const map: Record<string, string> = data.images ?? {};
        const resolved = GALLERY_ZONE_IDS.map((id, i) => map[id] || FALLBACK_IMAGES[i]);
        setGalleryImages(resolved);
      })
      .catch(() => {});
  }, []);

  const heroImage = galleryImages[0];

  return (
    <div className="bg-white min-h-screen flex flex-col">

      {/* Hero */}
      <section className="relative h-[60vh] md:h-[70vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={heroImage}
            alt="Crescent Academy Gallery"
            className="w-full h-full object-cover brightness-75"
            onError={e => { (e.target as HTMLImageElement).style.display = "none"; }}
          />
          <div className="absolute inset-0 bg-linear-to-b from-black/60 via-black/40 to-black/70" />
        </div>

        <div className="absolute top-6 left-6 sm:top-8 sm:left-8 z-30">
          <nav aria-label="Breadcrumb">
            <ol className="flex items-center space-x-3 text-base md:text-lg">
              <li>
                <Link href="/" className="text-white/90 hover:text-[#0EA5E9] transition-colors duration-300 flex items-center gap-2 font-medium drop-shadow-md">
                  <ChevronLeft size={18} />
                  Home
                </Link>
              </li>
              <li className="text-white/70">›</li>
              <li className="text-white font-semibold drop-shadow-md">Photo Gallery</li>
            </ol>
          </nav>
        </div>

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
            Moments of learning, joy, growth, and faith at The Crescent College
          </p>
        </motion.div>
      </section>

      {/* Gallery Grid */}
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
                className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 group border border-slate-200/60 bg-slate-100"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={src}
                  alt={`Gallery image ${i + 1}`}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  onError={e => { (e.target as HTMLImageElement).style.display = "none"; }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA */}
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
