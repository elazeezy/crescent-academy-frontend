// app/achievements/page.tsx
"use client";

import { motion } from "framer-motion";
import Link from "next/dist/client/link";

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

export default function AchievementsPage() {
  const achievements = [
    {
      title: "Association of Model Islamic Schools (AMIS) Competitions",
      desc: "Since 2015, our students have proudly participated in AMIS competitions, winning over 90 prizes, including awards and gift packages.",
      icon: "🏆",
    },
    {
      title: "Iwo Day Academic Competitions",
      desc: "Consistent excellence in Quiz Competitions, Debates, Essay Writing, and Qur’an recitation since 2015 — earning over 25 awards.",
      icon: "📚",
    },
    {
      title: "Oluwo Football Competition",
      desc: "Our football team reached the finals in 2025, showcasing outstanding skill, teamwork, discipline, and sportsmanship.",
      icon: "⚽",
    },
    {
      title: "Other Competitions & Invitationals",
      desc: "Success in various sports tournaments and invitationals, winning over 30 additional prizes across academics, Qur’an, and sports.",
      icon: "🏅",
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
        <div className="absolute inset-0 bg-gradient-to-br from-[#1E3A8A] via-[#0F2A5E] to-[#0EA5E9]" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/60" />

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2 }}
          className="relative z-10 text-center text-white px-6 max-w-5xl mx-auto"
        >
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight mb-6">
            Achievements & Competitions
          </h1>
          <p className="text-lg md:text-2xl max-w-4xl mx-auto opacity-90">
            By the mercy of Allah — excellence in academics, Qur’an, sports, and character
          </p>
        </motion.div>
      </section>

      {/* Intro */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-white to-slate-50">
        <div className="container mx-auto px-6 max-w-5xl text-center">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="text-lg md:text-xl text-slate-700 leading-relaxed"
          >
            Crescent Academy students have consistently demonstrated brilliance, commitment, and discipline across various platforms.
          </motion.p>
        </div>
      </section>

      {/* Achievements Grid */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            {achievements.map((ach, i) => (
              <motion.div
                key={i}
                variants={fadeInUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="bg-slate-50 rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 border border-slate-200 text-center group"
              >
                <div className="text-6xl mb-6 group-hover:scale-110 transition-transform">
                  {ach.icon}
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-[#1E3A8A] mb-4">
                  {ach.title}
                </h3>
                <p className="text-slate-700 leading-relaxed">
                  {ach.desc}
                </p>
              </motion.div>
            ))}
          </div>
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
            Proud of Our Legacy
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