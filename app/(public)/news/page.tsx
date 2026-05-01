// app/news/page.tsx
"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

const fadeInUp = {
  hidden: { opacity: 0, y: 60 },
  visible: { opacity: 1, y: 0 },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 },
  },
};

export default function NewsPage() {
  const newsItems = [
    {
      title: "Iwo Day Football Tournament – Runners-Up Glory!",
      date: "November 15, 2025",
      excerpt: "Our boys' team showed incredible teamwork and discipline to reach the final, defeating every public school. A proud moment for Crescent Academy!",
      image: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=1470",
      category: "Sports",
    },
    {
      title: "Qur’anic Recitation Competition Winners",
      date: "October 28, 2025",
      excerpt: "Our students secured 1st and 2nd place in the regional Qur’anic competition — a testament to our focus on spiritual excellence.",
      image: "https://images.unsplash.com/photo-1580130718646-9f694209b207?auto=format&fit=crop&q=80&w=1470",
      category: "Spiritual",
    },
    {
      title: "Annual Prize-Giving Day 2025",
      date: "September 13, 2025",
      excerpt: "Celebrating 15 years of nurturing the Complete Child with awards, speeches, and joyful moments from our growing family.",
      image: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&q=80&w=1470",
      category: "Events",
    },
    {
      title: "AMIS Competitions – Another Strong Showing",
      date: "August 2025",
      excerpt: "Students brought home multiple prizes in academics, Qur’an recitation, and debate — continuing our legacy of excellence.",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=1470",
      category: "Academics",
    },
  ];

  return (
    <div className="bg-white min-h-screen flex flex-col">
    

    <Link
  href="/"
  className="fixed top-24 left-6 z-50 bg-white/95 hover:bg-white text-[#1E3A8A] px-6 py-3 rounded-full shadow-xl flex items-center gap-2 transition-all hover:shadow-2xl hover:scale-105 md:top-28 md:left-8"
>
  ← Back to Home
</Link>

      {/* Hero */}
      <section className="relative h-[60vh] md:h-[70vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1588075592446-265fd1e6e76f?auto=format&fit=crop&q=80&w=2070"
            alt="News & Events"
            fill
            className="object-cover brightness-[0.75]"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2 }}
          className="relative z-10 text-center text-white px-6 max-w-5xl mx-auto"
        >
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight mb-6">
            News & Events
          </h1>
          <p className="text-lg md:text-2xl max-w-4xl mx-auto opacity-90">
            Stay updated with the latest happenings, achievements, and celebrations at Crescent Academy
          </p>
        </motion.div>
      </section>

      {/* Latest News Grid */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-6">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12"
          >
            {newsItems.map((item, i) => (
              <motion.article
                key={i}
                variants={fadeInUp}
                className="bg-slate-50 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 border border-slate-200 group"
              >
                <div className="relative h-56 overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <span className="absolute top-4 left-4 bg-[#0EA5E9] text-white text-xs font-bold px-3 py-1 rounded-full">
                    {item.category}
                  </span>
                </div>

                <div className="p-6 md:p-8">
                  <p className="text-sm text-slate-500 mb-3">{item.date}</p>
                  <h3 className="text-xl md:text-2xl font-bold text-[#1E3A8A] mb-4 group-hover:text-[#0EA5E9] transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-slate-700 leading-relaxed mb-6 line-clamp-3">
                    {item.excerpt}
                  </p>
                  <Link
                    href="#"
                    className="inline-flex items-center text-[#0EA5E9] font-medium hover:text-[#0284C7] transition-colors"
                  >
                    Read More →
                  </Link>
                </div>
              </motion.article>
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
            Stay Connected
          </motion.h3>
          <Link
            href="/contact"
            className="inline-block px-10 py-4 bg-white/15 hover:bg-white/25 rounded-xl font-medium transition-all backdrop-blur-md border border-white/20"
          >
            Contact Us for Updates
          </Link>
        </div>
      </section>
    </div>
  );
}