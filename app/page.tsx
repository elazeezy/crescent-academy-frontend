// app/page.tsx — Premium redesign (no content removed)

"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Phone, Mail } from "lucide-react";
import {
  BookOpen,
  Heart,
  ShieldCheck,
  Users,
  GraduationCap,
  Microscope,
  Calendar,
  Trophy,
  Quote,
} from "lucide-react";
import Link from 'next/link';

// Animation variants (kept exactly as yours)
const fadeInUp = {
  hidden: { opacity: 0, y: 60 },
  visible: { opacity: 1, y: 0 },
};

const slideInLeft = {
  hidden: { opacity: 0, x: -60 },
  visible: { opacity: 1, x: 0 },
};

const slideInRight = {
  hidden: { opacity: 0, x: 60 },
  visible: { opacity: 1, x: 0 },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

// Real image paths (download & place in public/images/)
const slides = [
  {
    image: "/images/hero-students-classroom.jpg",
    title: "Nurturing the Complete Child",
    subtitle: "A harmonious blend of academic excellence and authentic Islamic values",
    motto: "By the Grace of Allah",
  },
  {
    image: "/images/hero-islamic-education.jpg",
    title: "Faith • Knowledge • Character",
    subtitle: "Building morally upright leaders for this world and the Hereafter",
    motto: "Knowledge with Taqwa",
  },
  {
    image: "/images/hero-graduation.jpg",
    title: "Excellence in Every Step",
    subtitle: "From Nursery to Vocational — a journey of growth and guidance",
    motto: "Discipline & Integrity",
  },
];

const carouselVariants = {
  initial: { opacity: 0, scale: 1.05 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 1.05 },
};

export default function LandingPage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [isPaused]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  };

  const current = slides[currentIndex];

  return (
    <div className="bg-white text-slate-900 font-sans min-h-screen flex flex-col">
      {/* Hero Carousel – enhanced with glass overlay & better mobile spacing */}
      <section className="relative min-h-[70vh] md:min-h-screen flex items-center justify-center overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            variants={carouselVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 1.2, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            <img
              src={current.image}
              alt={current.title}
              className="w-full h-full object-cover brightness-[0.65] contrast-[1.15] scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/70" />
          </motion.div>
        </AnimatePresence>

        <div className="relative z-20 container mx-auto px-5 sm:px-8 text-center text-white">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="max-w-5xl mx-auto py-12 md:py-0"
          >
            {/* Badge */}
            <motion.div
              variants={fadeInUp}
              transition={{ duration: 0.9 }}
              className="inline-flex items-center gap-3 bg-white/20 backdrop-blur-lg border border-white/30 px-6 py-3 rounded-full mb-8 md:mb-10 shadow-lg"
            >
              <span className="text-[#0EA5E9] font-bold tracking-wider uppercase text-base md:text-lg">
                Est. 2010
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              variants={fadeInUp}
              transition={{ duration: 1, delay: 0.2 }}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight tracking-tight mb-6 md:mb-10 drop-shadow-2xl"
            >
              Nurturing the{" "}
              <span className="text-[#0EA5E9] relative inline-block">
                Complete Child
                <span className="absolute -bottom-3 left-0 right-0 h-1.5 bg-[#0EA5E9]/50 rounded-full blur-sm" />
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              variants={fadeInUp}
              transition={{ duration: 1, delay: 0.4 }}
              className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-light opacity-95 max-w-4xl mx-auto mb-10 md:mb-14 leading-relaxed px-4"
            >
              {current.subtitle}
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              variants={fadeInUp}
              transition={{ duration: 1, delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-5 sm:gap-8 justify-center items-center"
            >
              <Link
                href="/admissions"
                className="group relative px-10 py-4 sm:px-12 sm:py-5 bg-[#0EA5E9] hover:bg-[#0284C7] text-white font-bold text-lg rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-400 transform hover:scale-[1.05] min-w-[220px] text-center"
              >
                Enroll Now
              </Link>

              <Link
                href="/about"
                className="group relative px-10 py-4 sm:px-12 sm:py-5 bg-white/15 backdrop-blur-lg border border-white/40 hover:border-white/70 text-white font-bold text-lg rounded-2xl transition-all duration-400 hover:bg-white/25 min-w-[220px] text-center"
              >
                Discover Our Journey
              </Link>
            </motion.div>
          </motion.div>
        </div>

        {/* Carousel Controls – larger touch targets */}
        <button
          onClick={prevSlide}
          className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 z-30 text-white/80 hover:text-white p-4 sm:p-5 rounded-full bg-black/40 backdrop-blur-md transition-all hover:bg-black/60 shadow-lg"
          aria-label="Previous slide"
        >
          <ChevronLeft size={32} className="sm:size-40" />
        </button>

        <button
          onClick={nextSlide}
          className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 z-30 text-white/80 hover:text-white p-4 sm:p-5 rounded-full bg-black/40 backdrop-blur-md transition-all hover:bg-black/60 shadow-lg"
          aria-label="Next slide"
        >
          <ChevronRight size={32} className="sm:size-40" />
        </button>

        {/* Dots */}
        <div className="absolute bottom-8 sm:bottom-12 left-1/2 -translate-x-1/2 z-30 flex gap-3 sm:gap-4">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => goToSlide(i)}
              className={`w-3 h-3 sm:w-4 sm:h-4 rounded-full transition-all duration-400 shadow-md ${
                i === currentIndex
                  ? "bg-[#0EA5E9] scale-125 ring-4 ring-[#0EA5E9]/40"
                  : "bg-white/60 hover:bg-white/90"
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </section>

      {/* Mission / Vision / Philosophy – enhanced glass cards */}
      <motion.section
        className="relative py-24 md:py-32 bg-gradient-to-b from-[#1E3A8A] via-[#0F2A5E] to-[#1E3A8A] text-white overflow-hidden"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,#0EA5E9_1px,transparent_3px),radial-gradient(circle_at_80%_70%,#0EA5E9_1px,transparent_3px)] bg-[length:60px_60px] animate-pulse-slow" />
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-16 md:mb-20">
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="inline-block text-[#0EA5E9] text-base md:text-lg font-bold tracking-[0.5em] uppercase mb-6"
            >
              Our Foundation
            </motion.span>

            <motion.h2
              initial={{ opacity: 0, y: 80 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              className="text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight mb-8 relative inline-block"
            >
              Building the Complete Child
              <motion.span
                initial={{ width: 0 }}
                whileInView={{ width: "100%" }}
                transition={{ duration: 1.5 }}
                className="absolute -bottom-4 left-0 h-2 bg-gradient-to-r from-[#0EA5E9] to-white rounded-full"
              />
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.3 }}
              className="text-xl md:text-2xl max-w-4xl mx-auto opacity-90 leading-relaxed"
            >
              A harmonious blend of academic excellence, moral uprightness, and authentic Islamic values — by the grace of Allah (SWT).
            </motion.p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
            {[
              {
                title: "Our Mission",
                text: "With the help of Allah (SWT), Crescent Academy is dedicated to nurturing a generation of students who are academically sound, morally upright, spiritually conscious, and socially responsible. We strive to produce the “Complete Child” — one who excels intellectually while remaining grounded in faith, good character, and service to humanity.",
              },
              {
                title: "Our Vision",
                text: "To be a leading centre of faith-driven excellence, raising leaders who are knowledgeable, disciplined, God-conscious, and prepared to positively impact their communities and the world — both in this life and the Hereafter.",
              },
              {
                title: "Our Philosophy",
                text: "True education goes beyond academics. We integrate authentic Islamic teachings with robust conventional learning to balance knowledge with taqwa (God-consciousness), character, and service.",
                list: ["Academic excellence", "Moral & spiritual development", "Discipline & integrity", "Leadership & social responsibility"],
              },
            ].map((card, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 80, rotateX: 10 }}
                whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                whileHover={{ scale: 1.05, rotateX: -5, rotateY: 5, boxShadow: "0 30px 60px -15px rgba(14,165,233,0.5)" }}
                transition={{ duration: 1, delay: i * 0.2 }}
                viewport={{ once: true }}
                className="bg-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl p-8 md:p-10 shadow-2xl transition-all duration-500 group relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-[#0EA5E9]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                <h3 className="text-3xl md:text-4xl font-bold text-[#0EA5E9] mb-8 group-hover:text-white transition-colors">
                  {card.title}
                </h3>
                <p className="text-white/95 leading-relaxed text-lg mb-6">
                  {card.text}
                </p>
                {card.list && (
                  <ul className="space-y-4 text-white/90 text-lg">
                    {card.list.map((item, idx) => (
                      <li key={idx} className="flex items-center gap-4">
                        <div className="w-3 h-3 rounded-full bg-[#0EA5E9] flex-shrink-0 animate-pulse" />
                        {item}
                      </li>
                    ))}
                  </ul>
                )}
              </motion.div>
            ))}
          </div>

          {/* Quote */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 1 }}
            className="mt-24 text-center max-w-5xl mx-auto"
          >
            <motion.p
              className="text-3xl md:text-4xl lg:text-5xl font-medium italic text-[#0EA5E9] leading-relaxed mb-8"
            >
              “By the grace of Allah, every step forward is a step toward building the Complete Child — knowledgeable, disciplined, and prepared for both worlds.”
            </motion.p>
            <p className="text-white/80 text-xl font-light">
              Crescent Academy — Since 2010
            </p>
          </motion.div>
        </div>
      </motion.section>

      {/* History Section – kept all your content, just polished */}
      <motion.section
        className="relative py-24 md:py-32 overflow-hidden bg-gradient-to-b from-white via-slate-50 to-white"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <div className="absolute inset-0 z-0">
          <img
            src="/images/bg-school-campus-blur.jpg"
            alt="Serene school campus"
            className="w-full h-full object-cover brightness-75 contrast-125 blur-md scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-white/95 via-white/80 to-white/95" />
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-16 md:mb-20">
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="inline-block text-[#0EA5E9] text-base md:text-lg font-bold tracking-[0.5em] uppercase mb-6"
            >
              Our Journey
            </motion.span>

            <motion.h2
              initial={{ opacity: 0, y: 80 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-[#1E3A8A] leading-tight mb-8"
            >
              History of Crescent Academy
            </motion.h2>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
            {/* Left Column */}
            <motion.div initial={{ opacity: 0, x: -60 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 1 }} className="space-y-10">
              <div className="prose prose-lg prose-slate max-w-none space-y-8 text-lg">
                <p className="text-slate-700 leading-relaxed">
                  With the help of Allah (SWT), <strong>Crescent Academy</strong> was founded on Monday, 13th September 2010, as a co-educational institution dedicated to providing a harmonious blend of conventional and authentic Islamic education.
                </p>
                <p className="text-slate-700 leading-relaxed">
                  Established in Ajegbe Close, Panada Area, Iwo, the school began with a clear vision: to nurture a generation of students who are academically sound, morally upright, spiritually conscious, and socially responsible.
                </p>
                <p className="text-slate-700 leading-relaxed font-medium italic border-l-4 border-[#0EA5E9] pl-6 py-2 bg-white/50 rounded-r-xl">
                  From humble beginnings, Crescent Academy has grown steadily over the past sixteen years into a reputable centre of learning known for discipline, excellence, and strong Islamic values.
                </p>
                <p className="text-slate-700 leading-relaxed">
                  Our establishment was driven by the desire to produce the “Complete Child” — one who excels intellectually while remaining grounded in faith and good character. Every milestone recorded since our inception has been achieved by the grace and guidance of Allah.
                </p>
              </div>

              <div className="bg-white/90 backdrop-blur-md border border-slate-200 rounded-3xl p-10 shadow-xl">
                <h4 className="text-3xl font-bold text-[#1E3A8A] mb-8">Our Educational Philosophy</h4>
                <p className="text-slate-700 leading-relaxed mb-8 text-lg">
                  At Crescent Academy, we believe that education must go beyond academic success. Our philosophy is rooted in the conviction that true success lies in balancing knowledge with character.
                </p>
                <ul className="space-y-5">
                  {["Academic excellence", "Moral & spiritual development", "Discipline & integrity", "Leadership & social responsibility", "Practical & vocational skills"].map((item, idx) => (
                    <motion.li
                      key={idx}
                      initial={{ opacity: 0, x: -30 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.6, delay: idx * 0.1 }}
                      className="flex items-center gap-5 text-slate-700 text-lg"
                    >
                      <div className="w-4 h-4 rounded-full bg-[#0EA5E9] flex-shrink-0 animate-pulse" />
                      {item}
                    </motion.li>
                  ))}
                </ul>
              </div>
            </motion.div>

            {/* Right Column */}
            <motion.div initial={{ opacity: 0, x: 60 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 1 }} className="space-y-10">
              <div className="bg-white/90 backdrop-blur-md border border-slate-200 rounded-3xl p-10 shadow-xl">
                <h4 className="text-3xl font-bold text-[#1E3A8A] mb-8 flex items-center gap-4">
                  <Trophy className="text-[#0EA5E9] animate-bounce-slow" size={32} />
                  Key Milestones
                </h4>

                <div className="space-y-10 relative pl-10 before:absolute before:left-5 before:top-0 before:bottom-0 before:w-1 before:bg-gradient-to-b before:from-[#0EA5E9] before:to-[#1E3A8A]">
                  {[
                    { year: "2010", text: "Founded in Ajegbe Close, Panada Area, Iwo" },
                    { year: "2010–2016", text: "Early growth: Nursery & Primary established" },
                    { year: "2014", text: "Establishment of Crescent College (Secondary Section)" },
                    { year: "2023", text: "Launch of Crescent School of Science (Vocational & Technical)" },
                    { year: "Today", text: "120+ prizes, 30+ awards, thriving alumni network" },
                  ].map((milestone, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.8, delay: i * 0.2 }}
                      className="relative"
                    >
                      <div className="absolute -left-10 top-2 w-6 h-6 rounded-full bg-[#0EA5E9] border-4 border-white shadow-lg flex items-center justify-center text-white font-bold">
                        {i + 1}
                      </div>
                      <div className="bg-white p-8 rounded-2xl shadow-md hover:shadow-xl transition-shadow">
                        <span className="text-[#0EA5E9] font-bold text-2xl block mb-3">{milestone.year}</span>
                        <p className="text-slate-700 text-lg">{milestone.text}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.03 }}
                transition={{ duration: 1, delay: 1.2 }}
                className="bg-gradient-to-br from-[#1E3A8A]/10 to-[#0EA5E9]/10 rounded-3xl p-10 border border-[#0EA5E9]/30 shadow-xl"
              >
                <h4 className="text-3xl font-bold text-[#1E3A8A] mb-6 flex items-center gap-4">
                  <Trophy className="text-[#0EA5E9] animate-bounce-slow" size={32} />
                  Academic & Competitive Excellence
                </h4>
                <p className="text-slate-700 leading-relaxed text-lg mb-6">
                  By the mercy of Allah, our students have earned over <strong>120 prizes</strong> and <strong>30 distinguished awards</strong> in academics, Qur’anic recitation, debate, sportsmanship, and more.
                </p>
                <p className="text-slate-700 italic text-lg">
                  Recent highlight: Runners-up in the Iwo Day Football Competition — showcasing teamwork, discipline, and resilience.
                </p>
              </motion.div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 1.5 }}
            className="mt-24 text-center max-w-5xl mx-auto"
          >
            <motion.p
              className="text-4xl md:text-5xl font-medium italic text-[#1E3A8A] leading-relaxed mb-8"
            >
              “Crescent Academy stands today as a symbol of faith-driven excellence, academic distinction, and moral refinement — a true home for building the Complete Child.”
            </motion.p>
          </motion.div>
        </div>
      </motion.section>

      {/* News & Events – kept all your cards & logic */}
      <motion.section
        className="relative py-24 md:py-32 bg-gradient-to-b from-slate-50 via-white to-slate-50 overflow-hidden"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(14,165,233,0.08)_0%,transparent_50%),radial-gradient(circle_at_80%_70%,rgba(30,58,138,0.08)_0%,transparent_50%)] animate-pulse-slow" />
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-16 md:mb-20">
            <motion.span
              variants={fadeInUp}
              transition={{ duration: 0.9, delay: 0.2 }}
              className="inline-block text-[#0EA5E9] text-base md:text-lg font-bold tracking-[0.4em] uppercase mb-6"
            >
              Stay Updated
            </motion.span>

            <motion.h2
              variants={fadeInUp}
              transition={{ duration: 0.9, delay: 0.3 }}
              className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-[#1E3A8A] leading-tight mb-8"
            >
              News & Events
            </motion.h2>

            <motion.p
              variants={fadeInUp}
              transition={{ duration: 0.9, delay: 0.4 }}
              className="text-xl md:text-2xl text-slate-600 max-w-4xl mx-auto"
            >
              Highlights from Crescent Academy — celebrations, achievements, upcoming events, and inspiring moments.
            </motion.p>
          </div>

          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {[
              {
                title: "Iwo Day Football Tournament – Runners-Up Glory!",
                date: "November 15, 2025",
                image: "/images/news-football.jpg",
                excerpt: "Our boys' team showed incredible teamwork and discipline to reach the final, defeating every public school in the tournament. A proud moment for Crescent Academy!",
                category: "Sports",
              },
              {
                title: "Qur’anic Recitation Competition Winners",
                date: "October 28, 2025",
                image: "/images/news-quran.jpg",
                excerpt: "Our students secured 1st and 2nd place in the regional Qur’anic competition — a testament to our focus on spiritual excellence.",
                category: "Spiritual",
              },
              {
                title: "Annual Prize-Giving Day 2025",
                date: "September 13, 2025",
                image: "/images/news-prize-giving.jpg",
                excerpt: "Celebrating 15 years of nurturing the Complete Child with awards, speeches, and joyful moments from our growing family.",
                category: "Events",
              },
            ].map((news, i) => (
              <motion.article
                key={i}
                variants={fadeInUp}
                transition={{ duration: 0.9, delay: i * 0.1 }}
                className="group bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-4"
              >
                <div className="relative overflow-hidden aspect-[4/3]">
                  <img
                    src={news.image}
                    alt={news.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                  <span className="absolute bottom-5 left-5 bg-[#0EA5E9] text-white text-sm font-bold px-4 py-2 rounded-full shadow-md">
                    {news.category}
                  </span>
                </div>

                <div className="p-8 md:p-10">
                  <p className="text-sm text-slate-500 mb-4">{news.date}</p>
                  <h3 className="text-2xl md:text-3xl font-bold text-[#1E3A8A] mb-5 group-hover:text-[#0EA5E9] transition-colors line-clamp-2">
                    {news.title}
                  </h3>
                  <p className="text-slate-600 leading-relaxed text-lg line-clamp-4 mb-8">
                    {news.excerpt}
                  </p>
                  <Link
                    href="#"
                    className="inline-flex items-center text-[#0EA5E9] font-bold hover:text-[#0284C7] transition-colors text-lg"
                  >
                    Read More <ChevronRight className="ml-3 w-6 h-6" />
                  </Link>
                </div>
              </motion.article>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.8 }}
            className="text-center mt-16 md:mt-20"
          >
            <Link
              href="/news"
              className="inline-block px-12 py-5 bg-[#0EA5E9] hover:bg-[#0284C7] text-white font-bold text-xl rounded-2xl shadow-2xl transition-all duration-400 transform hover:scale-105"
            >
              View All News & Events
            </Link>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
}