// app/page.tsx — Full fixed version

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

// Animation variants (removed transition from variants to avoid TS errors)
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

// Sample slides — replace src with your real school photos
const slides = [
  {
    image: "https://images.unsplash.com/photo-1588075592446-265fd1e6e76f?auto=format&fit=crop&q=80&w=2070",
    title: "Nurturing the Complete Child",
    subtitle: "A harmonious blend of academic excellence and authentic Islamic values",
    motto: "By the Grace of Allah",
  },
  {
    image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1470&q=80",
    title: "Faith • Knowledge • Character",
    subtitle: "Building morally upright leaders for this world and the Hereafter",
    motto: "Knowledge with Taqwa",
  },
  {
    image: "https://images.unsplash.com/photo-1588075592446-265fd1e6e76f?auto=format&fit=crop&q=80&w=2070",
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

  // Auto-slide every 6 seconds
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
      {/* Hero Carousel – smaller height on mobile */}
      <section className="relative min-h-[55vh] md:min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background + Overlay */}
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
              className="w-full h-full object-cover brightness-[0.75] contrast-[1.1]"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/60" />
          </motion.div>
        </AnimatePresence>

        {/* Content – centered vertically */}
        <div className="relative z-20 container mx-auto px-5 sm:px-8 text-center text-white">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="max-w-4xl mx-auto py-8 md:py-0"
          >
            {/* Badge / Motto */}
            <motion.div
              variants={fadeInUp}
              transition={{ duration: 0.9, ease: "easeOut" }}
              className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-md border border-white/20 px-5 py-2 rounded-full mb-6 md:mb-8"
            >
              <span className="text-[#0EA5E9] text-sm md:text-base font-semibold tracking-wider uppercase">
                Est. 2010
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              variants={fadeInUp}
              transition={{ duration: 0.9, ease: "easeOut", delay: 0.2 }}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold leading-tight tracking-tight mb-6 md:mb-8"
            >
              Nurturing the{" "}
              <span className="text-[#0EA5E9] inline-block relative">
                Complete Child
                <span className="absolute -bottom-2 left-0 right-0 h-1 bg-[#0EA5E9]/40 rounded-full blur-sm" />
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              variants={fadeInUp}
              transition={{ duration: 0.9, ease: "easeOut", delay: 0.4 }}
              className="text-base sm:text-lg md:text-xl lg:text-2xl font-light opacity-90 max-w-3xl mx-auto mb-8 md:mb-12 leading-relaxed px-4 sm:px-0"
            >
              A harmonious blend of conventional excellence and authentic Islamic values — shaping minds, hearts, and futures.
            </motion.p>

            {/* CTA Buttons – FIXED with Link */}
            <motion.div
              variants={fadeInUp}
              transition={{ duration: 0.9, ease: "easeOut", delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center"
            >
              <Link
                href="/admissions"
                className="group relative px-8 py-3.5 sm:px-10 sm:py-4 bg-[#0EA5E9] hover:bg-[#0284C7] text-white font-semibold rounded-xl shadow-xl transition-all duration-300 transform hover:scale-[1.04] hover:shadow-2xl focus:outline-none focus:ring-4 focus:ring-[#0EA5E9]/40 min-w-[180px] sm:min-w-[220px] text-center block"
              >
                <span className="relative z-10">Enroll Now</span>
                <div className="absolute inset-0 rounded-xl bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>

              <Link
                href="/about"
                className="group relative px-8 py-3.5 sm:px-10 sm:py-4 bg-white/10 backdrop-blur-md border border-white/30 hover:border-white/50 text-white font-semibold rounded-xl transition-all duration-300 hover:bg-white/20 min-w-[180px] sm:min-w-[220px] text-center block"
              >
                Discover Our Journey
              </Link>
            </motion.div>
          </motion.div>
        </div>

        {/* Controls – smaller on mobile */}
        <button
          onClick={prevSlide}
          className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-30 text-white/70 hover:text-white p-2 sm:p-3 rounded-full bg-black/30 backdrop-blur-sm transition-all hover:bg-black/50"
          aria-label="Previous slide"
        >
          <ChevronLeft size={28} className="sm:size-32" />
        </button>

        <button
          onClick={nextSlide}
          className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-30 text-white/70 hover:text-white p-2 sm:p-3 rounded-full bg-black/30 backdrop-blur-sm transition-all hover:bg-black/50"
          aria-label="Next slide"
        >
          <ChevronRight size={28} className="sm:size-32" />
        </button>

        {/* Dots – smaller on mobile */}
        <div className="absolute bottom-6 sm:bottom-10 left-1/2 -translate-x-1/2 z-30 flex gap-2 sm:gap-3">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => goToSlide(i)}
              className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full transition-all duration-300 ${
                i === currentIndex ? "bg-[#0EA5E9] scale-125" : "bg-white/50 hover:bg-white/80"
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>

        {/* Scroll indicator – only on desktop */}
        <motion.div
          className="absolute bottom-6 sm:bottom-10 left-1/2 -translate-x-1/2 z-30 hidden md:block"
          animate={{ y: [0, 12, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="w-7 h-11 border-2 border-white/40 rounded-full flex items-center justify-center">
            <div className="w-1.5 h-3 bg-white/70 rounded-full animate-bounce" />
          </div>
        </motion.div>
      </section>

     {/* --- MISSION / VISION / PHILOSOPHY SECTION --- */}
<motion.section
  className="relative py-24 md:py-32 bg-gradient-to-b from-[#1E3A8A] via-[#0F2A5E] to-[#1E3A8A] text-white overflow-hidden"
  initial={{ opacity: 0 }}
  whileInView={{ opacity: 1 }}
  viewport={{ once: true }}
>
  {/* Subtle animated background particles */}
  <div className="absolute inset-0 opacity-10 pointer-events-none">
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,#0EA5E9_1px,transparent_3px),radial-gradient(circle_at_80%_70%,#0EA5E9_1px,transparent_3px)] bg-[length:60px_60px] animate-pulse-slow" />
  </div>

  <div className="container mx-auto px-6 relative z-10">
    {/* Section Title */}
    <div className="text-center mb-16 md:mb-20">
      <motion.span
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "backOut" }}
        className="inline-block text-[#0EA5E9] text-sm md:text-base font-bold tracking-[0.5em] uppercase mb-4"
      >
        Our Foundation
      </motion.span>

      <motion.h2
        initial={{ opacity: 0, y: 80, scale: 0.9 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 1, ease: "backOut", delay: 0.2 }}
        className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight mb-6 relative inline-block"
      >
        Building the Complete Child
        <motion.span
          initial={{ width: 0 }}
          whileInView={{ width: "100%" }}
          transition={{ duration: 1.2, ease: "easeOut", delay: 0.6 }}
          className="absolute -bottom-2 left-0 h-1 bg-gradient-to-r from-[#0EA5E9] to-white rounded-full"
        />
      </motion.h2>

      <motion.p
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.5 }}
        className="text-lg md:text-xl max-w-3xl mx-auto opacity-90 leading-relaxed"
      >
        A harmonious blend of academic excellence, moral uprightness, and authentic Islamic values — by the grace of Allah (SWT).
      </motion.p>
    </div>

    {/* Three Elegant Cards – with tilt & glow on hover */}
    <div className="grid md:grid-cols-3 gap-8 lg:gap-12 perspective-1000">
      {/* Mission Card */}
      <motion.div
        initial={{ opacity: 0, y: 80, rotateX: 10 }}
        whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
        whileHover={{ scale: 1.05, rotateX: -5, rotateY: 5, boxShadow: "0 25px 50px -12px rgba(14,165,233,0.4)" }}
        transition={{ duration: 0.9, ease: "backOut" }}
        viewport={{ once: true }}
        className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl p-8 md:p-10 shadow-2xl transition-all duration-500 group relative overflow-hidden transform-gpu"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-[#0EA5E9]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
        <h3 className="text-2xl md:text-3xl font-bold text-[#0EA5E9] mb-6 group-hover:text-white transition-colors">
          Our Mission
        </h3>
        <p className="text-white/90 leading-relaxed text-lg">
          With the help of Allah (SWT), Crescent Academy is dedicated to nurturing a generation of students who are academically sound, morally upright, spiritually conscious, and socially responsible. We strive to produce the “Complete Child” — one who excels intellectually while remaining grounded in faith, good character, and service to humanity.
        </p>
      </motion.div>

      {/* Vision Card */}
      <motion.div
        initial={{ opacity: 0, y: 80, rotateX: 10 }}
        whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
        whileHover={{ scale: 1.05, rotateX: -5, rotateY: -5, boxShadow: "0 25px 50px -12px rgba(14,165,233,0.4)" }}
        transition={{ duration: 0.9, ease: "backOut", delay: 0.2 }}
        viewport={{ once: true }}
        className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl p-8 md:p-10 shadow-2xl transition-all duration-500 group relative overflow-hidden transform-gpu"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-[#0EA5E9]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
        <h3 className="text-2xl md:text-3xl font-bold text-[#0EA5E9] mb-6 group-hover:text-white transition-colors">
          Our Vision
        </h3>
        <p className="text-white/90 leading-relaxed text-lg">
          To be a leading centre of faith-driven excellence, raising leaders who are knowledgeable, disciplined, God-conscious, and prepared to positively impact their communities and the world — both in this life and the Hereafter.
        </p>
      </motion.div>

      {/* Philosophy Card */}
      <motion.div
        initial={{ opacity: 0, y: 80, rotateX: 10 }}
        whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
        whileHover={{ scale: 1.05, rotateX: 5, rotateY: 5, boxShadow: "0 25px 50px -12px rgba(14,165,233,0.4)" }}
        transition={{ duration: 0.9, ease: "backOut", delay: 0.4 }}
        viewport={{ once: true }}
        className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl p-8 md:p-10 shadow-2xl transition-all duration-500 group relative overflow-hidden transform-gpu"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-[#0EA5E9]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
        <h3 className="text-2xl md:text-3xl font-bold text-[#0EA5E9] mb-6 group-hover:text-white transition-colors">
          Our Philosophy
        </h3>
        <p className="text-white/90 leading-relaxed text-lg mb-6">
          True education goes beyond academics. We integrate authentic Islamic teachings with robust conventional learning to balance knowledge with taqwa (God-consciousness), character, and service.
        </p>
        <ul className="space-y-3 text-white/90">
          {["Academic excellence", "Moral & spiritual development", "Discipline & integrity", "Leadership & social responsibility"].map((item, idx) => (
            <motion.li
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 + idx * 0.1, duration: 0.5 }}
              className="flex items-center gap-3"
            >
              <motion.div
                className="w-2 h-2 rounded-full bg-[#0EA5E9]"
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 2, repeat: Infinity, repeatType: "reverse", delay: idx * 0.2 }}
              />
              {item}
            </motion.li>
          ))}
        </ul>
      </motion.div>
    </div>

    {/* Inspirational Quote – typewriter effect */}
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ delay: 1 }}
      className="mt-20 text-center max-w-4xl mx-auto"
    >
      <motion.p
        className="text-2xl md:text-3xl font-medium italic text-[#0EA5E9] leading-relaxed mb-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ staggerChildren: 0.03, delayChildren: 1.2 }}
      >
        {"“By the grace of Allah, every step forward is a step toward building the Complete Child — knowledgeable, disciplined, and prepared for both worlds.”".split("").map((char, i) => (
          <motion.span
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.05, delay: 1.2 + i * 0.03 }}
          >
            {char}
          </motion.span>
        ))}
      </motion.p>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 2.5 }}
        className="text-white/70 text-lg font-light"
      >
        Crescent Academy — Since 2010
      </motion.p>
    </motion.div>
  </div>
</motion.section>



<motion.section
  className="relative py-24 md:py-32 overflow-hidden bg-gradient-to-b from-white via-slate-50 to-white"
  initial={{ opacity: 0 }}
  whileInView={{ opacity: 1 }}
  viewport={{ once: true }}
>
  {/* Blurred nature/school background */}
  <div className="absolute inset-0 z-0">
    <img
      src="https://images.unsplash.com/photo-1502085671122-8d0d6d058485?auto=format&fit=crop&q=80&w=2070"
      alt="Serene school campus with trees"
      className="w-full h-full object-cover brightness-75 contrast-125 blur-sm scale-110"
    />
    <div className="absolute inset-0 bg-gradient-to-b from-white/90 via-white/70 to-white/90" />
  </div>

  <div className="container mx-auto px-6 relative z-10">
    {/* Section Header */}
    <div className="text-center mb-16 md:mb-20">
      <motion.span
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "backOut" }}
        className="inline-block text-[#0EA5E9] text-sm md:text-base font-bold tracking-[0.5em] uppercase mb-4"
      >
        Our Journey
      </motion.span>

      <motion.h2
        initial={{ opacity: 0, y: 80, scale: 0.9 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 1, ease: "backOut", delay: 0.2 }}
        className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight mb-6 relative inline-block"
      >
        History of Crescent Academy
        <motion.span
          initial={{ width: 0 }}
          whileInView={{ width: "100%" }}
          transition={{ duration: 1.5, ease: "easeOut", delay: 0.6 }}
          className="absolute -bottom-2 left-0 h-1 bg-gradient-to-r from-[#0EA5E9] to-[#1E3A8A] rounded-full"
        />
      </motion.h2>
    </div>

    {/* Main Content - Two Columns on Desktop */}
    <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
      {/* Left: Story Text + Philosophy */}
      <motion.div
        initial={{ opacity: 0, x: -60 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="space-y-10"
      >
        <div className="prose prose-lg prose-slate max-w-none space-y-6">
          <p className="text-slate-700 leading-relaxed text-lg">
            With the help of Allah (SWT), <strong>Crescent Academy</strong> was founded on Monday, 13th September 2010, as a co-educational institution dedicated to providing a harmonious blend of conventional and authentic Islamic education.
          </p>

          <p className="text-slate-700 leading-relaxed">
            Established in Ajegbe Close, Panada Area, Iwo, the school began with a clear vision: to nurture a generation of students who are academically sound, morally upright, spiritually conscious, and socially responsible.
          </p>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.9, delay: 0.4 }}
            className="text-slate-700 leading-relaxed font-medium italic border-l-4 border-[#0EA5E9] pl-5 py-1 bg-white/50 rounded-r-lg"
          >
            From humble beginnings, Crescent Academy has grown steadily over the past sixteen years into a reputable centre of learning known for discipline, excellence, and strong Islamic values.
          </motion.p>

          <p className="text-slate-700 leading-relaxed">
            Our establishment was driven by the desire to produce the “Complete Child” — one who excels intellectually while remaining grounded in faith and good character. Every milestone recorded since our inception has been achieved by the grace and guidance of Allah.
          </p>
        </div>

        {/* Educational Philosophy List */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.6 }}
          className="bg-white/80 backdrop-blur-sm border border-slate-200 rounded-2xl p-8 shadow-xl"
        >
          <h4 className="text-2xl font-bold text-[#1E3A8A] mb-6">Our Educational Philosophy</h4>

          <p className="text-slate-700 leading-relaxed mb-6">
            At Crescent Academy, we believe that education must go beyond academic success. Our philosophy is rooted in the conviction that true success lies in balancing knowledge with character.
          </p>

          <ul className="space-y-4">
            {[
              { text: "Academic excellence", delay: 0.7 },
              { text: "Moral & spiritual development", delay: 0.8 },
              { text: "Discipline & integrity", delay: 0.9 },
              { text: "Leadership & social responsibility", delay: 1.0 },
              { text: "Practical & vocational skills", delay: 1.1 },
            ].map((item, idx) => (
              <motion.li
                key={idx}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: item.delay }}
                className="flex items-center gap-4 text-slate-700 text-lg"
              >
                <motion.div
                  className="w-3 h-3 rounded-full bg-[#0EA5E9] flex-shrink-0"
                  animate={{ scale: [1, 1.4, 1] }}
                  transition={{ duration: 2, repeat: Infinity, repeatType: "reverse", delay: idx * 0.2 }}
                />
                {item.text}
              </motion.li>
            ))}
          </ul>
        </motion.div>
      </motion.div>

      {/* Right: Timeline + Highlights */}
      <motion.div
        initial={{ opacity: 0, x: 60 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="space-y-10"
      >
        <div className="bg-white/80 backdrop-blur-sm border border-slate-200 rounded-2xl p-8 shadow-xl">
          <h4 className="text-2xl font-bold text-[#1E3A8A] mb-6 flex items-center gap-3">
            <span className="text-3xl animate-pulse">📜</span> Key Milestones
          </h4>

          <div className="space-y-8 relative pl-8 before:absolute before:left-4 before:top-2 before:bottom-2 before:w-0.5 before:bg-gradient-to-b before:from-[#0EA5E9] before:to-[#1E3A8A]">
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
                transition={{ duration: 0.8, delay: 0.5 + i * 0.2, ease: "backOut" }}
                className="relative"
              >
                <div className="absolute -left-8 top-1.5 w-5 h-5 rounded-full bg-[#0EA5E9] border-4 border-white shadow-md flex items-center justify-center text-white text-xs font-bold">
                  {i + 1}
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                  <span className="text-[#0EA5E9] font-bold text-xl block mb-2">{milestone.year}</span>
                  <p className="text-slate-700">{milestone.text}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Notable Achievements Highlight */}
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          whileHover={{ scale: 1.03 }}
          transition={{ duration: 1, delay: 1.2, ease: "backOut" }}
          viewport={{ once: true }}
          className="bg-gradient-to-br from-[#1E3A8A]/5 to-[#0EA5E9]/5 rounded-3xl p-8 border border-[#0EA5E9]/20 shadow-xl"
        >
          <h4 className="text-2xl font-bold text-[#1E3A8A] mb-4 flex items-center gap-3">
            <Trophy className="text-[#0EA5E9] animate-bounce-slow" size={28} />
            Academic & Competitive Excellence
          </h4>
          <p className="text-slate-700 leading-relaxed mb-4">
            By the mercy of Allah, our students have earned over <strong>120 prizes</strong> and <strong>30 distinguished awards</strong> in academics, Qur’anic recitation, debate, sportsmanship, and more.
          </p>
          <p className="text-slate-700 italic">
            Recent highlight: Runners-up in the Iwo Day Football Competition — showcasing teamwork, discipline, and resilience.
          </p>
        </motion.div>
      </motion.div>
    </div>

    {/* Closing Quote – typewriter effect */}
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ delay: 1.5 }}
      className="mt-20 text-center max-w-4xl mx-auto"
    >
      <motion.p
        className="text-3xl md:text-4xl font-medium italic text-[#1E3A8A] leading-relaxed mb-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ staggerChildren: 0.035, delayChildren: 1.8 }}
      >
        {"“Crescent Academy stands today as a symbol of faith-driven excellence, academic distinction, and moral refinement — a true home for building the Complete Child.”".split("").map((char, i) => (
          <motion.span
            key={i}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.08, delay: 1.8 + i * 0.035 }}
          >
            {char}
          </motion.span>
        ))}
      </motion.p>
    </motion.div>
  </div>
</motion.section>

      {/* --- NEWS & EVENTS SECTION --- */}
      <motion.section
        className="relative py-24 md:py-32 bg-gradient-to-b from-slate-50 via-white to-slate-50 overflow-hidden"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        {/* Subtle animated background particles (optional premium touch) */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(14,165,233,0.08)_0%,transparent_50%),radial-gradient(circle_at_80%_70%,rgba(30,58,138,0.08)_0%,transparent_50%)] animate-pulse-slow" />
        </div>

        <div className="container mx-auto px-6 relative z-10">
          {/* Header */}
          <div className="text-center mb-16 md:mb-20">
            <motion.span
              variants={fadeInUp}
              transition={{ duration: 0.9, ease: "easeOut", delay: 0.2 }}
              className="inline-block text-[#0EA5E9] text-sm md:text-base font-bold tracking-[0.4em] uppercase mb-4"
            >
              Stay Updated
            </motion.span>

            <motion.h2
              variants={fadeInUp}
              transition={{ duration: 0.9, ease: "easeOut", delay: 0.3 }}
              className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#1E3A8A] leading-tight mb-6"
            >
              News & Events
            </motion.h2>

            <motion.p
              variants={fadeInUp}
              transition={{ duration: 0.9, ease: "easeOut", delay: 0.4 }}
              className="text-lg md:text-xl text-slate-600 max-w-3xl mx-auto"
            >
              Highlights from Crescent Academy — celebrations, achievements, upcoming events, and inspiring moments.
            </motion.p>
          </div>

          {/* Featured News Cards - Staggered Animation */}
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
                image: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=1470",
                excerpt: "Our boys' team showed incredible teamwork and discipline to reach the final, defeating every public school in the tournament. A proud moment for Crescent Academy!",
                category: "Sports",
              },
              {
                title: "Qur’anic Recitation Competition Winners",
                date: "October 28, 2025",
                image: "https://images.unsplash.com/photo-1580130718646-9f694209b207?auto=format&fit=crop&q=80&w=1470",
                excerpt: "Our students secured 1st and 2nd place in the regional Qur’anic competition — a testament to our focus on spiritual excellence.",
                category: "Spiritual",
              },
              {
                title: "Annual Prize-Giving Day 2025",
                date: "September 13, 2025",
                image: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&q=80&w=1470",
                excerpt: "Celebrating 15 years of nurturing the Complete Child with awards, speeches, and joyful moments from our growing family.",
                category: "Events",
              },
            ].map((news, i) => (
              <motion.article
                key={i}
                variants={fadeInUp}
                transition={{ duration: 0.9, ease: "easeOut", delay: i * 0.1 }}
                className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2"
              >
                <div className="relative overflow-hidden aspect-[4/3]">
                  <img
                    src={news.image}
                    alt={news.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <span className="absolute bottom-4 left-4 bg-[#0EA5E9] text-white text-xs font-bold px-3 py-1 rounded-full">
                    {news.category}
                  </span>
                </div>

                <div className="p-6 md:p-8">
                  <p className="text-sm text-slate-500 mb-3">{news.date}</p>
                  <h3 className="text-xl md:text-2xl font-bold text-[#1E3A8A] mb-4 group-hover:text-[#0EA5E9] transition-colors line-clamp-2">
                    {news.title}
                  </h3>
                  <p className="text-slate-600 leading-relaxed line-clamp-3 mb-6">
                    {news.excerpt}
                  </p>
                  <Link
                    href="#"
                    className="inline-flex items-center text-[#0EA5E9] font-medium hover:text-[#0284C7] transition-colors"
                  >
                    Read More <ChevronRight className="ml-2 w-5 h-5" />
                  </Link>
                </div>
              </motion.article>
            ))}
          </motion.div>

          {/* Call to Action / View All */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: "easeOut", delay: 0.8 }}
            className="text-center mt-16 md:mt-20"
          >
            <Link
              href="/news"
              className="inline-block px-10 py-4 bg-[#0EA5E9] hover:bg-[#0284C7] text-white font-bold rounded-xl shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              View All News & Events
            </Link>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
}