"use client";
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';   
import { motion } from "framer-motion";
import { GraduationCap, Award, Microscope, Users, BookOpen, Heart, ShieldCheck, Calendar, Trophy, Quote, Image as ImageIcon } from "lucide-react";

// Define animation variants for beautiful slide-ins and fades
const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
  viewport: { once: true }
};

const slideInLeft = {
  initial: { opacity: 0, x: -50 },
  whileInView: { opacity: 1, x: 0 },
  transition: { duration: 0.8 },
  viewport: { once: true }
};

const slideInRight = {
  initial: { opacity: 0, x: 50 },
  whileInView: { opacity: 1, x: 0 },
  transition: { duration: 0.8 },
  viewport: { once: true }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 }
  }
};

export default function LandingPage() {
  return (
    <div className="bg-white text-slate-900 font-sans">

      

     {/* --- HERO SECTION (Premium & Mobile-First Redesign) --- */}
<section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#1E3A8A]">
  {/* Background layers */}
  <div className="absolute inset-0 z-0">
    {/* Gradient overlay */}
    <div className="absolute inset-0 bg-gradient-to-b from-[#1E3A8A]/95 via-[#1E3A8A]/80 to-[#1E3A8A]/70 z-10" />
    
    {/* Image with subtle zoom + parallax feel */}
    <motion.div
      className="absolute inset-0"
      initial={{ scale: 1.05 }}
      animate={{ scale: 1.12 }}
      transition={{ duration: 20, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
    >
      <img
        src="https://images.unsplash.com/photo-1588075592446-265fd1e6e76f?auto=format&fit=crop&q=80&w=2070"
        alt="Crescent Academy - Students in harmony"
        className="w-full h-full object-cover brightness-[0.85] contrast-[1.05]"
        loading="eager"
      />
    </motion.div>
  </div>

  {/* Content */}
  <div className="relative z-20 container mx-auto px-5 sm:px-8 text-center text-white">
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="max-w-4xl mx-auto"
    >
      {/* Badge / Since year */}
      <motion.div
        variants={fadeInUp}
        className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-md border border-white/20 px-5 py-2 rounded-full mb-6 md:mb-8"
      >
        <span className="text-[#0EA5E9] text-sm md:text-base font-semibold tracking-wider uppercase">
          Est. 2010
        </span>
      </motion.div>

      {/* Main Headline */}
      <motion.h1
        variants={fadeInUp}
        className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight tracking-tight mb-6 md:mb-8"
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
        className="text-lg sm:text-xl md:text-2xl font-light opacity-90 max-w-3xl mx-auto mb-10 md:mb-12 leading-relaxed"
      >
        A harmonious blend of conventional excellence and authentic Islamic values — shaping minds, hearts, and futures.
      </motion.p>

      {/* CTA Buttons */}
      <motion.div
        variants={fadeInUp}
        className="flex flex-col sm:flex-row gap-5 sm:gap-6 justify-center items-center"
      >
        <button className="group relative px-10 py-4 bg-[#0EA5E9] hover:bg-[#0284C7] text-white font-semibold rounded-xl shadow-xl transition-all duration-300 transform hover:scale-[1.04] hover:shadow-2xl focus:outline-none focus:ring-4 focus:ring-[#0EA5E9]/40 min-w-[220px]">
          <span className="relative z-10">Enroll Now</span>
          <div className="absolute inset-0 rounded-xl bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
        </button>

        <button className="group relative px-10 py-4 bg-white/10 backdrop-blur-md border border-white/30 hover:border-white/50 text-white font-semibold rounded-xl transition-all duration-300 hover:bg-white/20 min-w-[220px]">
          Explore Our History
        </button>
      </motion.div>
    </motion.div>
  </div>

  {/* Subtle scroll indicator (mobile-friendly) */}
  <motion.div
    className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 hidden md:block"
    animate={{ y: [0, 12, 0] }}
    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
  >
    <div className="w-8 h-12 border-2 border-white/40 rounded-full flex items-center justify-center">
      <div className="w-1.5 h-3 bg-white/70 rounded-full animate-bounce" />
    </div>
  </motion.div>
</section>

{/* --- QUICK STATS (Modern Card Style) --- */}
<motion.section
  className="py-16 md:py-20 bg-gradient-to-b from-[#1E3A8A] to-[#0F2A5E] -mt-1"
  variants={staggerContainer}
  initial="hidden"
  whileInView="visible"
  viewport={{ once: true }}
>
  <div className="container mx-auto px-6">
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
      {[
        { icon: Trophy, value: "120+", label: "Prizes Won" },
        { icon: Award, value: "30+", label: "Distinguished Awards" },
        { icon: Calendar, value: "16+", label: "Years of Excellence" },
        { icon: Heart, value: "100%", label: "Islamic Foundation" },
      ].map((stat, i) => (
        <motion.div
          key={i}
          variants={fadeInUp}
          className="bg-white/10 backdrop-blur-lg border border-white/10 rounded-2xl p-6 md:p-8 text-center transition-all duration-300 hover:bg-white/15 hover:scale-[1.03] hover:shadow-xl"
        >
          <stat.icon className="w-10 h-10 md:w-12 md:h-12 mx-auto mb-4 text-[#0EA5E9]" />
          <h3 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white mb-2">
            {stat.value}
          </h3>
          <p className="text-[#0EA5E9] text-sm md:text-base font-semibold uppercase tracking-wide">
            {stat.label}
          </p>
        </motion.div>
      ))}
    </div>
  </div>
</motion.section>

     {/* --- HISTORY SECTION (Redesigned - Elegant & Premium Look) --- */}
<motion.section
  className="py-24 md:py-32 relative overflow-hidden bg-gradient-to-b from-white via-slate-50 to-white"
  initial={{ opacity: 0 }}
  whileInView={{ opacity: 1 }}
  viewport={{ once: true }}
>
  {/* Subtle background pattern (Islamic geometric style) */}
  <div className="absolute inset-0 opacity-[0.04] pointer-events-none">
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_10%_20%,#0EA5E9_0%,transparent_10%),radial-gradient(circle_at_90%_80%,#1E3A8A_0%,transparent_10%)]" />
  </div>

  <div className="container mx-auto px-6 relative z-10">
    {/* Section Header */}
    <div className="text-center mb-16 md:mb-20">
      <motion.span
        className="inline-block text-[#0EA5E9] text-sm md:text-base font-bold tracking-[0.3em] uppercase mb-4"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        viewport={{ once: true }}
      >
        Our Journey
      </motion.span>

      <motion.h2
        className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#1E3A8A] leading-tight mb-6"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        viewport={{ once: true }}
      >
        Founded on Monday,<br className="hidden sm:block" /> 13th September 2010
      </motion.h2>

      <motion.div
        className="w-24 h-1 bg-gradient-to-r from-[#0EA5E9] to-[#1E3A8A] mx-auto rounded-full"
        initial={{ width: 0 }}
        whileInView={{ width: 96 }}
        transition={{ duration: 1, delay: 0.5 }}
        viewport={{ once: true }}
      />
    </div>

    <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
      {/* Left Column - Main Story */}
      <motion.div
        className="space-y-8 md:space-y-10"
        variants={slideInLeft}
        initial="initial"
        whileInView="whileInView"
        viewport={{ once: true }}
      >
        <div className="prose prose-lg prose-slate max-w-none">
          <p className="text-slate-700 leading-relaxed text-lg">
            With the help of Allah (SWT), Crescent Academy was founded on Monday, 13th September 2010, as a co-educational institution dedicated to providing a harmonious blend of conventional and authentic Islamic education.
          </p>

          <p className="text-slate-700 leading-relaxed">
            Established in Ajegbe Close, Panada Area, Iwo, the school began with a clear vision: to nurture a generation of students who are academically sound, morally upright, spiritually conscious, and socially responsible.
          </p>

          <p className="text-slate-700 leading-relaxed font-medium italic border-l-4 border-[#0EA5E9] pl-5 py-1">
            From humble beginnings, Crescent Academy has grown steadily over the past sixteen years into a reputable centre of learning known for discipline, excellence, and strong Islamic values.
          </p>

          <p className="text-slate-700 leading-relaxed">
            Our establishment was driven by the desire to produce the “Complete Child” — one who excels intellectually while remaining grounded in faith and good character. Every milestone recorded since our inception has been achieved by the grace and guidance of Allah.
          </p>
        </div>

        {/* Core Philosophy Block */}
        <div className="bg-white/70 backdrop-blur-sm border border-slate-100 rounded-2xl p-8 shadow-lg">
          <h4 className="text-2xl font-bold text-[#1E3A8A] mb-6">Our Educational Philosophy</h4>
          <p className="text-slate-700 mb-6 leading-relaxed">
            At Crescent Academy, we believe that education must go beyond academic success. Our philosophy is rooted in the conviction that true success lies in balancing knowledge with character.
          </p>

          <ul className="grid sm:grid-cols-2 gap-4 text-slate-700">
            {[
              "Academic excellence",
              "Moral and spiritual development",
              "Leadership training",
              "Discipline and integrity",
              "Social responsibility",
            ].map((point, i) => (
              <motion.li
                key={i}
                className="flex items-center gap-3"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + i * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="w-2 h-2 rounded-full bg-[#0EA5E9]" />
                {point}
              </motion.li>
            ))}
          </ul>
        </div>
      </motion.div>

      {/* Right Column - Timeline + Achievements */}
      <motion.div
        className="space-y-10"
        variants={slideInRight}
        initial="initial"
        whileInView="whileInView"
        viewport={{ once: true }}
      >
        {/* Timeline Card */}
        <div className="bg-gradient-to-br from-[#1E3A8A]/5 to-[#0EA5E9]/5 rounded-3xl p-8 border border-[#0EA5E9]/20 shadow-xl">
          <h4 className="text-2xl font-bold text-[#1E3A8A] mb-6 flex items-center gap-3">
            <span className="text-3xl">📜</span> Key Milestones
          </h4>

          <div className="space-y-8 relative pl-8 before:absolute before:left-4 before:top-2 before:bottom-2 before:w-0.5 before:bg-gradient-to-b before:from-[#0EA5E9] before:to-[#1E3A8A]">
            {[
              { year: "2010", text: "Founded in Ajegbe Close, Panada Area, Iwo" },
              { year: "2014", text: "Established The Crescent College (Secondary)" },
              { year: "2023", text: "Launched Crescent School of Science (Vocational)" },
              { year: "Today", text: "Over 120 prizes, 30+ awards, thriving alumni network" },
            ].map((milestone, i) => (
              <motion.div
                key={i}
                className="relative"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + i * 0.15 }}
                viewport={{ once: true }}
              >
                <div className="absolute -left-8 top-1.5 w-4 h-4 rounded-full bg-[#0EA5E9] border-4 border-white shadow" />
                <div className="bg-white p-5 rounded-xl shadow-sm">
                  <span className="text-[#0EA5E9] font-bold text-lg block mb-1">{milestone.year}</span>
                  <p className="text-slate-700">{milestone.text}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Featured Image / Visionary Quote */}
        <div className="relative group rounded-3xl overflow-hidden shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-t from-[#1E3A8A]/70 via-transparent to-transparent z-10" />
          <img
            src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80"
            alt="Crescent Academy Campus & Students"
            className="w-full h-96 md:h-[500px] object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute bottom-0 left-0 right-0 p-8 z-20 text-white">
            <p className="text-xl md:text-2xl font-light italic max-w-2xl">
              “By Allah’s grace, every step forward is a step toward building the Complete Child.”
            </p>
            <p className="mt-3 font-medium">— Visionary Leadership</p>
          </div>
        </div>
      </motion.div>
    </div>

    {/* Final Summary Quote */}
    <motion.div
      className="mt-20 text-center max-w-4xl mx-auto"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8 }}
      viewport={{ once: true }}
    >
      <p className="text-2xl md:text-3xl font-medium text-[#1E3A8A] italic leading-relaxed">
        “Crescent Academy stands today as a symbol of faith-driven excellence, academic distinction, and moral refinement — a true home for building the Complete Child.”
      </p>
    </motion.div>
  </div>
</motion.section>

      {/* --- PHILOSOPHY & CORE VALUES --- */}
      {/* Kept and enhanced with grid, slide-in from right */}
      <motion.section 
        className="py-24 bg-slate-50"
        variants={slideInRight}
        initial="initial"
        whileInView="whileInView"
        viewport={{ once: true }}
      >
        <div className="container mx-auto px-6">
          <h2 className="text-[#1E3A8A] font-bold text-sm tracking-[0.2em] uppercase mb-4 text-center">Our Philosophy</h2>
          <h3 className="text-4xl font-bold mb-12 text-center text-slate-900">Core Values</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: <BookOpen className="text-[#0EA5E9] w-10 h-10" />, title: "Academic Excellence" },
              { icon: <Heart className="text-[#0EA5E9] w-10 h-10" />, title: "Moral Development" },
              { icon: <ShieldCheck className="text-[#0EA5E9] w-10 h-10" />, title: "Discipline & Integrity" },
              { icon: <Users className="text-[#0EA5E9] w-10 h-10" />, title: "Social Responsibility" }
            ].map((item, i) => (
              <motion.div 
                key={i} 
                className="flex flex-col items-center p-6 bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow"
                variants={fadeInUp}
              >
                {item.icon}
                <span className="font-bold text-slate-800 mt-4">{item.title}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* --- ACADEMIC WINGS --- */}
      {/* Enhanced cards with real images, hover animations, slide-in stagger */}
      <motion.section 
        className="py-24"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <div className="container mx-auto px-6">
          <motion.h2 variants={fadeInUp} className="text-4xl font-bold text-[#1E3A8A] mb-4 text-center">Our Academic Wings</motion.h2>
          <motion.p variants={fadeInUp} className="text-slate-500 mb-16 text-center">Continuous excellence from Nursery to Vocational levels.</motion.p>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Academy */}
            <motion.div 
              variants={fadeInUp}
              className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-xl transition-all group"
            >
              <img 
                src="https://blog.esc13.net/wp-content/uploads/2019/10/GettyImages-684060418.jpeg" // Real image: Nursery classroom
                alt="Crescent Academy"
                className="w-full h-40 object-cover rounded-2xl mb-6"
              />
              <div className="w-14 h-14 bg-[#0EA5E9]/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-[#0EA5E9] transition-colors mx-auto">
                <GraduationCap className="text-[#0EA5E9] group-hover:text-white" />
              </div>
              <h4 className="text-xl font-bold text-[#1E3A8A] mb-2 text-center">The Crescent Academy</h4>
              <p className="text-sm text-[#0EA5E9] font-bold mb-4 text-center">Nursery & Primary</p>
              <p className="text-slate-600 text-sm leading-relaxed mb-6 text-center">
                Foundational stage focusing on literacy, numeracy, and Tahfīdhul Qur’an (Memorization Program).
              </p>
              <ul className="text-xs space-y-2 text-slate-500 mb-8 text-center">
                <li>• Panada Area Branch</li>
                <li>• Kobaope Phase 1 Branch</li>
              </ul>
            </motion.div>

            {/* College */}
            <motion.div 
              variants={fadeInUp}
              className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-xl transition-all group"
            >
              <img 
                src="https://c7684bdb45.mjedge.net/wp-content/uploads/zikoko/2023/10/5B6D0D61-F0F1-433D-9C52-D152D1C40036-1024x676.webp" // Real image: Secondary students
                alt="Crescent College"
                className="w-full h-40 object-cover rounded-2xl mb-6"
              />
              <div className="w-14 h-14 bg-[#1E3A8A]/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-[#1E3A8A] transition-colors mx-auto">
                <BookOpen className="text-[#1E3A8A] group-hover:text-white" />
              </div>
              <h4 className="text-xl font-bold text-[#1E3A8A] mb-2 text-center">The Crescent College</h4>
              <p className="text-sm text-[#0EA5E9] font-bold mb-4 text-center">Secondary Education (Est. 2014)</p>
              <p className="text-slate-600 text-sm leading-relaxed mb-6 text-center">
                Emphasis on leadership, critical thinking, and character formation.
              </p>
              <p className="text-xs text-slate-400 font-medium tracking-wide uppercase italic text-center">📍 Along Ile Ogbo Road</p>
            </motion.div>

            {/* Science */}
            <motion.div 
              variants={fadeInUp}
              className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-xl transition-all group"
            >
              <img 
                src="https://img.apmcdn.org/9f057903648c36ee1de116e22adced61db50c58b/uncropped/5f62f9-2014-09-dsc-1817.jpg" // Real image: Vocational lab
                alt="School of Science"
                className="w-full h-40 object-cover rounded-2xl mb-6"
              />
              <div className="w-14 h-14 bg-[#0EA5E9]/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-[#0EA5E9] transition-colors mx-auto">
                <Microscope className="text-[#0EA5E9] group-hover:text-white" />
              </div>
              <h4 className="text-xl font-bold text-[#1E3A8A] mb-2 text-center">School of Science</h4>
              <p className="text-sm text-[#0EA5E9] font-bold mb-4 text-center">Vocational & Technical (Est. 2023)</p>
              <p className="text-slate-600 text-sm leading-relaxed mb-6 text-center">
                Strengthening scientific understanding with skills like Baking, Cosmetology, and Lab suit training.
              </p>
              <p className="text-xs text-slate-400 font-medium tracking-wide uppercase italic text-center">📍 Beside Masjid Darus Salam</p>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* --- AWARDS & ACHIEVEMENTS --- */}
      {/* New section with grid of awards, real images, slide-in left */}
      <motion.section 
        className="py-24 bg-slate-50"
        variants={slideInLeft}
        initial="initial"
        whileInView="whileInView"
        viewport={{ once: true }}
      >
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-[#1E3A8A] mb-4 text-center">Awards & Achievements</h2>
          <p className="text-slate-500 mb-16 text-center">Celebrating our journey of excellence.</p>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <img 
                src="https://egcsd.org/wp-content/uploads/2023/06/2023-Goff-Awards-Ceremony-trophies-web.jpg" // Real image: Awards trophies
                alt="Awards"
                className="w-full h-48 object-cover rounded-2xl mb-4"
              />
              <h4 className="font-bold text-[#1E3A8A]">Over 120 Prizes</h4>
              <p className="text-slate-600 text-sm">From competitions like AMIS, NAPPS, etc.</p>
            </div>
            <div className="text-center">
              <img 
                src="https://egcsd.org/wp-content/uploads/2023/06/2023-Goff-Awards-Ceremony-trophies-web.jpg" // Reuse or add more if available
                alt="Distinguished Awards"
                className="w-full h-48 object-cover rounded-2xl mb-4"
              />
              <h4 className="font-bold text-[#1E3A8A]">30+ Distinguished Awards</h4>
              <p className="text-slate-600 text-sm">Recognizing our commitment to education.</p>
            </div>
            <div className="text-center">
              <img 
                src="https://egcsd.org/wp-content/uploads/2023/06/2023-Goff-Awards-Ceremony-trophies-web.jpg" // Reuse
                alt="Football Competition"
                className="w-full h-48 object-cover rounded-2xl mb-4"
              />
              <h4 className="font-bold text-[#1E3A8A]">Runners-up in Iwo Day Football 2025</h4>
              <p className="text-slate-600 text-sm">Showcasing our students' talents.</p>
            </div>
          </div>
          {/* Placeholder for more awards */}
          <div className="mt-8 text-center text-slate-500 italic">
            [Add more awards here as needed]
          </div>
        </div>
      </motion.section>

      {/* --- FOUNDER'S SPEECH --- */}
      {/* New section with placeholder for text, slide-in right */}
      <motion.section 
        className="py-24 container mx-auto px-6"
        variants={slideInRight}
        initial="initial"
        whileInView="whileInView"
        viewport={{ once: true }}
      >
        <h2 className="text-4xl font-bold text-[#1E3A8A] mb-8 text-center">Founder's Speech</h2>
        <div className="max-w-3xl mx-auto bg-slate-50 p-8 rounded-2xl shadow-md">
          <p className="text-slate-600 leading-relaxed">
            {/* Placeholder: Paste your speech text here */}
            Paste the founder's speech text here. This section can include inspirational messages, vision for the school, or any address from the founder.
          </p>
        </div>
      </motion.section>

      {/* --- LEADERSHIP --- */}
      {/* Enhanced with real/placeholder images, stagger animations */}
      <motion.section 
        className="py-24 bg-white"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <div className="container mx-auto px-6">
          <motion.h2 variants={fadeInUp} className="text-3xl font-bold text-center text-[#1E3A8A] mb-16">The Visionary Backbone</motion.h2>
          <div className="grid md:grid-cols-3 gap-8">
            <motion.div variants={fadeInUp} className="text-center">
              <img 
                src="https://placehold.co/128x128?text=Alhaji" // Placeholder; replace with actual
                alt="Alhaji Abdul Wasii Abdus Salam"
                className="w-32 h-32 rounded-full mx-auto mb-6 border-4 border-[#1E3A8A]/20 object-cover"
              />
              <h5 className="font-bold text-[#1E3A8A]">Alhaji Abdul Wasii Abdus Salam</h5>
              <p className="text-xs text-[#0EA5E9] font-bold uppercase mt-1">Proprietor & Founder</p>
            </motion.div>
            <motion.div variants={fadeInUp} className="text-center">
              <img 
                src="https://placehold.co/128x128?text=Alhaja" // Placeholder
                alt="Alhaja Abdus Salam M.B"
                className="w-32 h-32 rounded-full mx-auto mb-6 border-4 border-[#1E3A8A]/20 object-cover"
              />
              <h5 className="font-bold text-[#1E3A8A]">Alhaja Abdus Salam M.B</h5>
              <p className="text-xs text-[#0EA5E9] font-bold uppercase mt-1">Proprietoress & Administrator</p>
            </motion.div>
            <motion.div variants={fadeInUp} className="text-center">
              <img 
                src="https://placehold.co/128x128?text=Mr." // Placeholder
                alt="Mr. Mutiu Oyebanjo (Sheikh)"
                className="w-32 h-32 rounded-full mx-auto mb-6 border-4 border-[#1E3A8A]/20 object-cover"
              />
              <h5 className="font-bold text-[#1E3A8A]">Mr. Mutiu Oyebanjo (Sheikh)</h5>
              <p className="text-xs text-[#0EA5E9] font-bold uppercase mt-1">Principal & Imam, College</p>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* --- FEE STRUCTURE --- */}
      {/* Kept glassmorphism, added fade-in up for rows */}
      <motion.section 
        className="py-24 container mx-auto px-6"
        variants={slideInLeft}
        initial="initial"
        whileInView="whileInView"
        viewport={{ once: true }}
      >
        <div className="bg-[#1E3A8A] rounded-[2.5rem] p-8 md:p-16 text-white shadow-2xl overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#0EA5E9] blur-[120px] opacity-30 -mr-20 -mt-20" />
          <h2 className="text-3xl font-bold mb-10 text-center">School Fees Structure</h2>
          <motion.div 
            className="grid gap-4 max-w-3xl mx-auto"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
          >
            {[
              { level: "Playgroup", price: "₦17,000" },
              { level: "Kindergarten 1 & 2", price: "₦19,000" },
              { level: "Nursery 1 & 2", price: "₦21,000" },
              { level: "Primary 1 – 5", price: "₦23,000" },
              { level: "J.S.S 1 – 3 (College)", price: "₦36,000" },
              { level: "S.S.S 1 – 3 (College)", price: "₦40,000" },
              { level: "School of Science", price: "₦50,000" },
            ].map((fee, i) => (
              <motion.div 
                key={i} 
                variants={fadeInUp}
                className="flex justify-between items-center p-4 border-b border-white/10 hover:bg-white/5 transition-colors"
              >
                <span className="font-medium">{fee.level}</span>
                <span className="font-bold text-[#0EA5E9]">{fee.price}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* --- SCHOOL CALENDAR --- */}
      {/* New section with illustration image, sample events list, slide-in right */}
      <motion.section 
        className="py-24 bg-slate-50"
        variants={slideInRight}
        initial="initial"
        whileInView="whileInView"
        viewport={{ once: true }}
      >
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-[#1E3A8A] mb-4 text-center">School Calendar</h2>
          <p className="text-slate-500 mb-12 text-center">Upcoming events and important dates.</p>
          <div className="flex flex-col md:flex-row gap-8 items-center">
            <img 
              src="https://www.incidentiq.com/wp-content/uploads/2024/06/28.03BlogImage-How-to-Create-a-School-Event-Calendar-scaled.jpg" // Real image: Calendar illustration
              alt="School Calendar"
              className="w-full md:w-1/2 h-64 object-cover rounded-2xl"
            />
            <div className="w-full md:w-1/2">
              <ul className="space-y-4">
                <li className="flex items-center gap-4 p-4 bg-white rounded-lg shadow-sm">
                  <Calendar className="text-[#0EA5E9] w-6 h-6" />
                  <div>
                    <h5 className="font-bold">Term Start - September 2026</h5>
                    <p className="text-sm text-slate-600">Welcome back to school!</p>
                  </div>
                </li>
                <li className="flex items-center gap-4 p-4 bg-white rounded-lg shadow-sm">
                  <Calendar className="text-[#0EA5E9] w-6 h-6" />
                  <div>
                    <h5 className="font-bold">Mid-Term Break - October 2026</h5>
                    <p className="text-sm text-slate-600">Short holiday for students.</p>
                  </div>
                </li>
                {/* Placeholder for more events */}
                <li className="text-center text-slate-500 italic">
                  [Paste more calendar events here]
                </li>
              </ul>
            </div>
          </div>
        </div>
      </motion.section>

      {/* --- NEWS & EVENTS TEASER --- */}
      {/* New section with placeholders for news, slide-in left */}
      <motion.section 
        className="py-24"
        variants={slideInLeft}
        initial="initial"
        whileInView="whileInView"
        viewport={{ once: true }}
      >
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-[#1E3A8A] mb-4 text-center">Latest News & Events</h2>
          <p className="text-slate-500 mb-16 text-center">Stay updated with Crescent Academy.</p>
          <div className="grid md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white p-4 rounded-2xl shadow-md">
                <img 
                  src={`https://placehold.co/400x200?text=News+${i}`} // Placeholder; replace with actual news images
                  alt={`News ${i}`}
                  className="w-full h-32 object-cover rounded-t-2xl"
                />
                <h4 className="font-bold mt-4">News Title {i}</h4>
                <p className="text-sm text-slate-600">Brief description... [Paste news content here]</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <a href="/news" className="text-[#0EA5E9] hover:underline font-bold">View All News</a>
          </div>
        </div>
      </motion.section>

      {/* --- PHOTO GALLERY TEASER --- */}
      {/* New section with real images from search, grid layout, slide-in right */}
      <motion.section 
        className="py-24 bg-slate-50"
        variants={slideInRight}
        initial="initial"
        whileInView="whileInView"
        viewport={{ once: true }}
      >
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-[#1E3A8A] mb-4 text-center">Photo Gallery</h2>
          <p className="text-slate-500 mb-16 text-center">Glimpses of life at Crescent Academy.</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <img 
              src="https://kidsinmuseums.org.uk/wp-content/uploads/2020/04/JayneLloyd_KidsInMusesums_TakeoverDay2019_3332-2-scaled.jpg" // Real image: School activities
              alt="Gallery 1"
              className="w-full h-48 object-cover rounded-2xl"
            />
            <img 
              src="https://i0.wp.com/elabraveandtrue.com/wp-content/uploads/2019/10/img_1470.jpg?fit=750%2C563&ssl=1" // Real image: More activities
              alt="Gallery 2"
              className="w-full h-48 object-cover rounded-2xl"
            />
            {/* Add more placeholders */}
            <div className="bg-slate-200 flex items-center justify-center rounded-2xl text-slate-400 italic">
              [Add photo here]
            </div>
            <div className="bg-slate-200 flex items-center justify-center rounded-2xl text-slate-400 italic">
              [Add photo here]
            </div>
          </div>
          <div className="text-center mt-8">
            <a href="/gallery" className="text-[#0EA5E9] hover:underline font-bold">View Full Gallery</a>
          </div>
        </div>
      </motion.section>

      {/* --- TESTIMONIALS --- */}
      {/* New section with quote images/backgrounds, stagger */}
      <motion.section 
        className="py-24"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-[#1E3A8A] mb-4 text-center">What Our Community Says</h2>
          <p className="text-slate-500 mb-16 text-center">Hear from students, parents, and alumni.</p>
          <div className="grid md:grid-cols-3 gap-8">
            <motion.div variants={fadeInUp} className="relative p-6 bg-white rounded-2xl shadow-md">
              <img 
                src="https://images.template.net/89529/student-testimonial-template-rs1zc.jpeg" // Real image: Testimonial background
                alt="Testimonial 1"
                className="absolute inset-0 w-full h-full object-cover opacity-10 rounded-2xl"
              />
              <Quote className="text-[#0EA5E9] w-8 h-8 mb-4" />
              <p className="text-slate-600 mb-4">"Amazing blend of education and values!"</p>
              <cite className="block text-right font-bold">- Parent</cite>
            </motion.div>
            <motion.div variants={fadeInUp} className="relative p-6 bg-white rounded-2xl shadow-md">
              <img 
                src="https://images.template.net/89016/personal-testimonial-template-1jwn8.jpeg" // Real image
                alt="Testimonial 2"
                className="absolute inset-0 w-full h-full object-cover opacity-10 rounded-2xl"
              />
              <Quote className="text-[#0EA5E9] w-8 h-8 mb-4" />
              <p className="text-slate-600 mb-4">"Prepared me for university success."</p>
              <cite className="block text-right font-bold">- Alumnus</cite>
            </motion.div>
            <motion.div variants={fadeInUp} className="relative p-6 bg-white rounded-2xl shadow-md">
              <img 
                src="https://examstudyexpert.com/wp-content/uploads/2021/07/Motivational-Exam-Quotes-Vidal-Sassoon-1024x724.jpg" // Real image: Quote background
                alt="Testimonial 3"
                className="absolute inset-0 w-full h-full object-cover opacity-10 rounded-2xl"
              />
              <Quote className="text-[#0EA5E9] w-8 h-8 mb-4" />
              <p className="text-slate-600 mb-4">"Teachers are truly inspiring."</p>
              <cite className="block text-right font-bold">- Student</cite>
            </motion.div>
          </div>
          {/* Placeholder for more testimonials */}
          <div className="mt-8 text-center text-slate-500 italic">
            [Paste more testimonials here]
          </div>
        </div>
      </motion.section>

      {/* --- CALL-TO-ACTION --- */}
      {/* Added final CTA section with animation */}
      <motion.section 
        className="py-24 bg-[#1E3A8A] text-white text-center"
        variants={fadeInUp}
        initial="initial"
        whileInView="whileInView"
        viewport={{ once: true }}
      >
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold mb-6">Join Crescent Academy Today</h2>
          <p className="max-w-xl mx-auto mb-8 opacity-90">Start your child's journey towards academic excellence and moral uprightness.</p>
          <button className="bg-[#0EA5E9] hover:bg-white hover:text-[#1E3A8A] text-white px-10 py-4 rounded-xl font-bold transition-all transform hover:scale-105 shadow-xl">
            Enroll Now
          </button>
        </div>
      </motion.section>

    </div>
  );
}