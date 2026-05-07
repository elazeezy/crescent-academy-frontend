"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import Link from "next/link";
import { ChevronLeft, Maximize2 } from "lucide-react";
import Lightbox from "@/components/ui/Lightbox";

type Category = "All" | "Classroom" | "Assembly" | "Sports" | "Qur'anic Studies" | "Science Lab" | "Awards" | "Events";

const CATEGORIES: Category[] = ["All", "Classroom", "Assembly", "Sports", "Qur'anic Studies", "Science Lab", "Awards", "Events"];

interface GalleryItem {
  src: string;
  alt: string;
  caption: string;
  category: Exclude<Category, "All">;
  tall?: boolean;
}

const GALLERY_ZONE_IDS = ["gallery_1", "gallery_2", "gallery_3", "gallery_4", "gallery_5", "gallery_6"];

const FALLBACK_ITEMS: GalleryItem[] = [
  { src: "/images/gallery/1-students-learning.jpg", alt: "Students learning in class", caption: "Classroom Excellence",  category: "Classroom", tall: true },
  { src: "/images/gallery/2-school-assembly.jpg",   alt: "Morning school assembly",   caption: "Morning Assembly",      category: "Assembly" },
  { src: "/images/gallery/3-happy-students.jpg",    alt: "Happy students",             caption: "Student Life",          category: "Classroom" },
  { src: "/images/gallery/4-sports-day.jpg",        alt: "Sports day activities",      caption: "Sports Day",            category: "Sports", tall: true },
  { src: "/images/gallery/5-quran-study.jpg",       alt: "Qur'anic studies session",  caption: "Qur'anic Studies",      category: "Qur'anic Studies" },
  { src: "/images/gallery/6-graduation.jpg",        alt: "Prize giving ceremony",      caption: "Prize Giving Day",      category: "Awards" },
];

export default function GalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>(FALLBACK_ITEMS);
  const [active, setActive] = useState<Category>("All");
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/site-images")
      .then((r) => r.json())
      .then((data) => {
        const map: Record<string, string> = data.images ?? {};
        setItems(FALLBACK_ITEMS.map((item, i) => ({ ...item, src: map[GALLERY_ZONE_IDS[i]] || item.src })));
      })
      .catch(() => {});
  }, []);

  const filtered = active === "All" ? items : items.filter((i) => i.category === active);
  const lightboxImages = filtered.map((i) => ({ src: i.src, alt: i.alt, caption: i.caption, category: i.category }));

  return (
    <div style={{ background: "#F7F5F1" }} className="min-h-screen">

      {/* Hero */}
      <section className="relative h-[55vh] min-h-72 flex items-center justify-center overflow-hidden" style={{ background: "#0B1F3A" }}>
        <svg aria-hidden className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.06]" xmlns="http://www.w3.org/2000/svg">
          <defs><pattern id="gp" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse"><polygon points="40,4 47,20 62,13 55,28 72,35 55,42 62,57 47,50 40,66 33,50 18,57 25,42 8,35 25,28 18,13 33,20" fill="none" stroke="white" strokeWidth="0.7" /></pattern></defs>
          <rect width="100%" height="100%" fill="url(#gp)" />
        </svg>
        <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(6,14,28,0.55), rgba(6,14,28,0.85))" }} />
        <div className="absolute top-6 left-6 z-20">
          <Link href="/" className="flex items-center gap-1.5 text-white/70 hover:text-white text-sm transition-colors"
            style={{ fontFamily: "var(--font-body, sans-serif)" }}>
            <ChevronLeft size={16} /> Home
          </Link>
        </div>
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}
          className="relative z-10 text-center text-white px-6 max-w-3xl mx-auto">
          <p className="text-xs tracking-[0.2em] uppercase mb-4 font-medium"
            style={{ color: "#2196C4", fontFamily: "var(--font-body, sans-serif)" }}>Our School</p>
          <h1 className="text-4xl sm:text-5xl font-bold leading-tight mb-4"
            style={{ fontFamily: "var(--font-display, 'Cormorant Garamond', serif)" }}>
            Photo <span className="italic" style={{ color: "#3BADD9" }}>Gallery</span>
          </h1>
          <p className="text-lg" style={{ color: "rgba(255,255,255,0.7)", fontFamily: "var(--font-body, sans-serif)" }}>
            Moments of learning, joy, growth, and faith at The Crescent Academy
          </p>
        </motion.div>
      </section>

      {/* Filter bar */}
      <section className="sticky top-[64px] z-30 border-b shadow-sm"
        style={{ background: "#F7F5F1", borderColor: "#E5E7EB" }}>
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-3 flex gap-2 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
          {CATEGORIES.map((cat) => (
            <button key={cat} onClick={() => setActive(cat)}
              className="shrink-0 px-4 py-1.5 rounded-full text-xs font-medium transition-all duration-200"
              style={{
                background: active === cat ? "#2196C4" : "transparent",
                color: active === cat ? "#fff" : "#6B7280",
                border: active === cat ? "none" : "1px solid #E5E7EB",
                fontFamily: "var(--font-body, sans-serif)",
              }}>
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Masonry grid */}
      <section className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <LayoutGroup>
            <motion.div layout className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
              <AnimatePresence mode="popLayout">
                {filtered.map((item, i) => (
                  <motion.div
                    key={item.src + item.category}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.35, delay: i * 0.04 }}
                    className={`group relative break-inside-avoid rounded-2xl overflow-hidden cursor-pointer shadow-md hover:shadow-xl transition-shadow duration-300 ${item.tall ? "aspect-[3/4]" : "aspect-[4/3]"}`}
                    style={{ background: "#112847" }}
                    onClick={() => setLightboxIdx(i)}
                  >
                    <img src={item.src} alt={item.alt} loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
                    <div className="absolute inset-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300"
                      style={{ background: "linear-gradient(to top, rgba(6,14,28,0.85), transparent)" }} />
                    <div className="absolute bottom-0 left-0 right-0 p-5 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                      <span className="inline-block px-2.5 py-1 text-[10px] font-medium rounded-full mb-2"
                        style={{ background: "rgba(33,150,196,0.25)", color: "#3BADD9" }}>{item.category}</span>
                      <p className="text-white text-sm font-medium" style={{ fontFamily: "var(--font-body, sans-serif)" }}>{item.caption}</p>
                    </div>
                    <div className="absolute top-3 right-3 w-8 h-8 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      style={{ background: "rgba(255,255,255,0.15)", backdropFilter: "blur(4px)" }}>
                      <Maximize2 size={14} className="text-white" />
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          </LayoutGroup>
          {filtered.length === 0 && (
            <div className="py-20 text-center" style={{ color: "#9CA3AF", fontFamily: "var(--font-body, sans-serif)" }}>
              No images in this category yet.
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 relative overflow-hidden" style={{ background: "#0B1F3A" }}>
        <svg aria-hidden className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.05]" xmlns="http://www.w3.org/2000/svg">
          <defs><pattern id="gcta" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse"><polygon points="40,4 47,20 62,13 55,28 72,35 55,42 62,57 47,50 40,66 33,50 18,57 25,42 8,35 25,28 18,13 33,20" fill="none" stroke="white" strokeWidth="0.7" /></pattern></defs>
          <rect width="100%" height="100%" fill="url(#gcta)" />
        </svg>
        <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white"
            style={{ fontFamily: "var(--font-display, 'Cormorant Garamond', serif)" }}>
            Want to See <span className="italic" style={{ color: "#3BADD9" }}>More?</span>
          </h2>
          <p className="mb-8" style={{ color: "rgba(255,255,255,0.7)", fontFamily: "var(--font-body, sans-serif)" }}>
            Book a physical visit and experience The Crescent Academy in person.
          </p>
          <Link href="/contact"
            className="inline-flex items-center px-8 py-3.5 rounded-full font-bold text-sm transition-all hover:-translate-y-0.5"
            style={{ background: "#2196C4", color: "#fff", fontFamily: "var(--font-body, sans-serif)" }}
            onMouseEnter={e => (e.currentTarget.style.background = "#3BADD9")}
            onMouseLeave={e => (e.currentTarget.style.background = "#2196C4")}>
            Book a Visit
          </Link>
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIdx !== null && (
          <Lightbox images={lightboxImages} initialIndex={lightboxIdx} onClose={() => setLightboxIdx(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}
