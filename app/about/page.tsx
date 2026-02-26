// app/about/page.tsx
"use client";

import { motion } from "framer-motion";
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
    <div className="bg-white min-h-screen flex flex-col">
    
    <Link
  href="/"
  className="fixed top-24 left-6 z-50 bg-white/95 hover:bg-white text-[#1E3A8A] px-6 py-3 rounded-full shadow-xl flex items-center gap-2 transition-all hover:shadow-2xl hover:scale-105 md:top-28 md:left-8"
>
  ← Back to Home
</Link>

      {/* Hero */}
      <section className="relative h-[70vh] md:h-[80vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1588075592446-265fd1e6e76f?auto=format&fit=crop&q=80&w=2070"
            alt="Crescent Academy Campus"
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
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight mb-6">
            About Crescent Academy
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-light max-w-4xl mx-auto opacity-90">
            A faith-driven centre of excellence — nurturing the Complete Child since 2010
          </p>
          <p className="mt-6 text-base md:text-lg opacity-80 max-w-3xl mx-auto">
            By the grace of Allah (SWT), we blend authentic Islamic values with academic distinction to raise knowledgeable, disciplined, and God-conscious leaders.
          </p>
        </motion.div>
      </section>

      {/* Overview / Intro */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-white to-slate-50">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="container mx-auto px-6 max-w-5xl"
        >
          <motion.h2
            variants={fadeInUp}
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#1E3A8A] text-center mb-10 md:mb-16"
          >
            Who We Are
          </motion.h2>

          <motion.p
            variants={fadeInUp}
            className="text-lg md:text-xl text-slate-700 leading-relaxed text-center max-w-4xl mx-auto mb-12"
          >
            Crescent Academy is more than a school — it is a nurturing environment where young minds are shaped with knowledge, hearts are filled with taqwa (God-consciousness), and characters are built on integrity and compassion. Founded in 2010 by visionary leaders who believe in the transformative power of faith-based education, we remain committed to raising the "Complete Child" — academically excellent, morally upright, spiritually aware, and socially responsible.
          </motion.p>
        </motion.div>
      </section>

      {/* History */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-6">
          <motion.h2
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#1E3A8A] text-center mb-12 md:mb-16"
          >
            Our History
          </motion.h2>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="prose prose-lg prose-slate max-w-5xl mx-auto space-y-6 md:space-y-8 text-slate-700 leading-relaxed"
          >
            <p>
              With the help of Allah (SWT), Crescent Academy was founded on Monday, 13th September 2010, as a co-educational institution dedicated to providing a harmonious blend of conventional and authentic Islamic education. Established in Ajegbe Close, Panada Area, Iwo, the school began with a clear vision: to nurture a generation of students who are academically sound, morally upright, spiritually conscious, and socially responsible.
            </p>

            <p className="font-medium italic border-l-4 border-[#0EA5E9] pl-6 py-1">
              From humble beginnings, Crescent Academy has grown steadily over the past sixteen years into a reputable centre of learning known for discipline, excellence, and strong Islamic values.
            </p>

            <p>
              Our establishment was driven by the desire to produce the “Complete Child” — one who excels intellectually while remaining grounded in faith and good character. Every milestone recorded since our inception has been achieved by the grace and guidance of Allah.
            </p>

            {/* You can continue adding more paragraphs here if you want to expand the history */}
          </motion.div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-[#1E3A8A]/5 to-[#0EA5E9]/5">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-10 lg:gap-16">
            <motion.div
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="bg-white rounded-2xl p-8 md:p-12 shadow-xl border border-slate-100 hover:shadow-2xl transition-shadow duration-500"
            >
              <h3 className="text-3xl md:text-4xl font-bold text-[#1E3A8A] mb-6">
                Our Vision
              </h3>
              <p className="text-lg text-slate-700 leading-relaxed">
                To be a leading centre of faith-driven excellence, raising leaders who are knowledgeable, disciplined, God-conscious, and prepared to positively impact their communities and the world — both in this life and the Hereafter.
              </p>
            </motion.div>

            <motion.div
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="bg-[#1E3A8A] text-white rounded-2xl p-8 md:p-12 shadow-xl hover:shadow-2xl transition-shadow duration-500"
            >
              <h3 className="text-3xl md:text-4xl font-bold mb-6">
                Our Mission
              </h3>
              <p className="text-lg leading-relaxed opacity-90">
                With the grace of Allah (SWT), we are dedicated to nurturing the Complete Child — academically sound, morally upright, spiritually conscious, and socially responsible — through authentic Islamic teachings integrated with robust conventional learning.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Complete Child Philosophy */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-6">
          <motion.h2
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#1E3A8A] text-center mb-12 md:mb-16"
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
                className="bg-slate-50 rounded-xl p-8 shadow-md hover:shadow-xl hover:scale-[1.02] transition-all duration-300 border border-slate-200"
              >
                <h4 className="text-xl md:text-2xl font-bold text-[#1E3A8A] mb-4">
                  {item.title}
                </h4>
                <p className="text-slate-700 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Call to Action / Explore More */}
      <section className="py-16 md:py-24 bg-gradient-to-r from-[#1E3A8A] to-[#0F2A5E] text-white">
        <div className="container mx-auto px-6 text-center">
          <motion.h3
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-4xl font-bold mb-8"
          >
            Discover More About Crescent Academy
          </motion.h3>
          <div className="flex flex-wrap justify-center gap-6">
            <Link
              href="/structure"
              className="bg-white/15 hover:bg-white/25 px-8 py-4 rounded-xl font-medium transition-all backdrop-blur-md border border-white/20"
            >
              School Structure
            </Link>
            <Link
              href="/leadership"
              className="bg-white/15 hover:bg-white/25 px-8 py-4 rounded-xl font-medium transition-all backdrop-blur-md border border-white/20"
            >
              Leadership Team
            </Link>
            <Link
              href="/policies"
              className="bg-white/15 hover:bg-white/25 px-8 py-4 rounded-xl font-medium transition-all backdrop-blur-md border border-white/20"
            >
              School Policies
            </Link>
            <Link
              href="/achievements"
              className="bg-white/15 hover:bg-white/25 px-8 py-4 rounded-xl font-medium transition-all backdrop-blur-md border border-white/20"
            >
              Achievements
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}