// app/about/page.tsx — Premium redesign (no content removed)

"use client";

import { motion } from "framer-motion";
import { ChevronLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 },
  },
};

export default function AboutPage() {
  return (
    <div className="bg-gradient-to-b from-slate-50 to-white min-h-screen flex flex-col">
     

      {/* Hero Section – richer overlay, better mobile padding */}
      <section className="relative h-[70vh] md:h-[85vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/about-hero-classroom.jpg" // ← Real path – download & place here
            alt="Crescent Academy Students in Classroom"
            fill
            className="object-cover brightness-[0.70] contrast-[1.15] scale-105"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/65 via-black/45 to-black/75" />
        </div>

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
          About
        </li>
      </ol>
    </nav>
  </div>

        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.4, ease: "easeOut" }}
          className="relative z-10 text-center text-white px-6 sm:px-10 max-w-6xl mx-auto"
        >
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight tracking-tight mb-6 md:mb-10 drop-shadow-2xl">
            About Crescent Academy
          </h1>
          <p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-light max-w-5xl mx-auto opacity-95 mb-6 md:mb-10">
            A faith-driven centre of excellence — nurturing the Complete Child since 2010
          </p>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl opacity-90 max-w-4xl mx-auto leading-relaxed">
            By the grace of Allah (SWT), we blend authentic Islamic values with academic distinction to raise knowledgeable, disciplined, and God-conscious leaders.
          </p>
        </motion.div>
      </section>

      {/* Overview / Intro – glass card style */}
      <section className="py-20 md:py-28 bg-gradient-to-b from-white to-slate-50/50">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="container mx-auto px-6 max-w-6xl"
        >
          <motion.h2
            variants={fadeInUp}
            className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#1E3A8A] text-center mb-12 md:mb-16 tracking-tight"
          >
            Who We Are
          </motion.h2>

          <motion.div
            variants={fadeInUp}
            className="bg-white/80 backdrop-blur-xl border border-slate-200/60 rounded-3xl p-8 md:p-12 lg:p-16 shadow-2xl max-w-5xl mx-auto"
          >
            <p className="text-lg md:text-xl lg:text-2xl text-slate-800 leading-relaxed mb-8">
              Crescent Academy is more than a school — it is a nurturing environment where young minds are shaped with knowledge, hearts are filled with taqwa (God-consciousness), and characters are built on integrity and compassion. Founded in 2010 by visionary leaders who believe in the transformative power of faith-based education, we remain committed to raising the "Complete Child" — academically excellent, morally upright, spiritually aware, and socially responsible.
            </p>
          </motion.div>
        </motion.div>
      </section>

      {/* History – richer card layout */}
      <section className="py-20 md:py-28 bg-white">
        <div className="container mx-auto px-6">
          <motion.h2
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#1E3A8A] text-center mb-12 md:mb-16 tracking-tight"
          >
            Our History
          </motion.h2>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 1.2 }}
            className="prose prose-xl prose-slate max-w-5xl mx-auto space-y-8 md:space-y-10 text-slate-800 leading-relaxed bg-white/90 backdrop-blur-md border border-slate-200/50 rounded-3xl p-8 md:p-12 lg:p-16 shadow-xl"
          >
            <p>
              With the help of Allah (SWT), Crescent Academy was founded on Monday, 13th September 2010, as a co-educational institution dedicated to providing a harmonious blend of conventional and authentic Islamic education. Established in Ajegbe Close, Panada Area, Iwo, the school began with a clear vision: to nurture a generation of students who are academically sound, morally upright, spiritually conscious, and socially responsible.
            </p>

            <p className="font-medium italic border-l-4 border-[#0EA5E9] pl-6 py-3 bg-slate-50/80 rounded-r-2xl text-xl">
              From humble beginnings, Crescent Academy has grown steadily over the past sixteen years into a reputable centre of learning known for discipline, excellence, and strong Islamic values.
            </p>

            <p>
              Our establishment was driven by the desire to produce the “Complete Child” — one who excels intellectually while remaining grounded in faith and good character. Every milestone recorded since our inception has been achieved by the grace and guidance of Allah.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Vision & Mission – glass cards with glow */}
      <section className="py-20 md:py-28 bg-gradient-to-br from-[#1E3A8A]/5 via-white to-[#0EA5E9]/5">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-10 lg:gap-16">
            <motion.div
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="bg-white/90 backdrop-blur-xl border border-slate-200/60 rounded-3xl p-10 md:p-14 shadow-2xl hover:shadow-3xl transition-all duration-500 group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#0EA5E9]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              <h3 className="text-4xl md:text-5xl font-extrabold text-[#1E3A8A] mb-8 group-hover:text-[#0EA5E9] transition-colors">
                Our Vision
              </h3>
              <p className="text-xl md:text-2xl text-slate-800 leading-relaxed">
                To be a leading centre of faith-driven excellence, raising leaders who are knowledgeable, disciplined, God-conscious, and prepared to positively impact their communities and the world — both in this life and the Hereafter.
              </p>
            </motion.div>

            <motion.div
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="bg-[#1E3A8A] text-white rounded-3xl p-10 md:p-14 shadow-2xl hover:shadow-3xl transition-all duration-500 group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              <h3 className="text-4xl md:text-5xl font-extrabold mb-8">
                Our Mission
              </h3>
              <p className="text-xl md:text-2xl leading-relaxed opacity-95">
                With the grace of Allah (SWT), we are dedicated to nurturing the Complete Child — academically sound, morally upright, spiritually conscious, and socially responsible — through authentic Islamic teachings integrated with robust conventional learning.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Complete Child Philosophy – enhanced grid */}
      <section className="py-20 md:py-28 bg-white">
        <div className="container mx-auto px-6">
          <motion.h2
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#1E3A8A] text-center mb-12 md:mb-16 tracking-tight"
          >
            The Complete Child Philosophy
          </motion.h2>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12"
          >
            {[
              {
                title: "Academic Excellence",
                desc: "Rigorous curriculum aligned with national standards, preparing students for higher education and lifelong learning.",
              },
              {
                title: "Moral & Spiritual Development",
                desc: "Daily focus on Islamic values, Tahfīdhul Qur’an, Ṣalāh, and Adab to build taqwa and strong character.",
              },
              {
                title: "Discipline & Integrity",
                desc: "Structured environment fostering responsibility, honesty, respect, and self-accountability.",
              },
              {
                title: "Leadership & Social Responsibility",
                desc: "Training compassionate leaders who serve their communities and uphold justice.",
              },
              {
                title: "Practical & Vocational Skills",
                desc: "Hands-on training in Crescent School of Science to promote innovation and self-reliance.",
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                variants={fadeInUp}
                className="bg-gradient-to-br from-slate-50/80 to-white/80 backdrop-blur-xl border border-slate-200/60 rounded-3xl p-8 md:p-10 shadow-xl hover:shadow-2xl hover:scale-[1.03] transition-all duration-500 group relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-[#0EA5E9]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-3xl" />
                <h4 className="text-2xl md:text-3xl font-extrabold text-[#1E3A8A] mb-6 group-hover:text-[#0EA5E9] transition-colors">
                  {item.title}
                </h4>
                <p className="text-slate-700 text-lg md:text-xl leading-relaxed">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Call to Action – richer buttons */}
      <section className="py-20 md:py-28 bg-gradient-to-r from-[#1E3A8A] via-[#0F2A5E] to-[#1E3A8A] text-white">
        <div className="container mx-auto px-6 text-center">
          <motion.h3
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-extrabold mb-10 tracking-tight"
          >
            Discover More About Crescent Academy
          </motion.h3>

          <div className="flex flex-wrap justify-center gap-6 md:gap-8">
            {[
              { href: "/structure", label: "School Structure" },
              { href: "/leadership", label: "Leadership Team" },
              { href: "/policies", label: "School Policies" },
              { href: "/achievements", label: "Achievements" },
            ].map((btn) => (
              <Link
                key={btn.href}
                href={btn.href}
                className="bg-white/20 hover:bg-white/30 backdrop-blur-lg border border-white/30 px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 hover:scale-105 hover:shadow-xl min-w-[220px] text-center"
              >
                {btn.label}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}