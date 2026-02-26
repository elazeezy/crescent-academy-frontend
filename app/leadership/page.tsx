// app/leadership/page.tsx
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

export default function LeadershipPage() {
  const leaders = [
    {
      name: "Alhaji Abdul Wasii Abdus Salam",
      role: "Proprietor & Founder",
      bio: "The visionary behind Crescent Schools, whose commitment to faith-based excellence, discipline, and quality education continues to shape the direction and progress of the institution.",
      image: "https://images.unsplash.com/photo-1552058544-f2b08422138a?auto=format&fit=crop&q=80&w=800",
    },
    {
      name: "Alhaja Abdus Salam M.B",
      role: "Proprietoress & Administrator, Nursery & Primary Section",
      bio: "A pillar of administrative strength whose dedication and oversight have significantly contributed to the growth, stability, and development of the Nursery and Primary sections.",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=800",
    },
    {
      name: "Mr. Mutiu Oyebanjo (Sheikh)",
      role: "Principal & Imam, The Crescent College",
      bio: "Provides strong academic leadership and spiritual guidance, ensuring discipline, moral uprightness, and academic excellence within the College.",
      image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=800",
    },
    {
      name: "Mr. Yusuf Ogunyemi",
      role: "Vice Principal I, The Crescent College",
      bio: "Supports academic coordination and student development, contributing to the effective administration of the College.",
      image: "https://images.unsplash.com/photo-1556155099-490a1ba16284?auto=format&fit=crop&q=80&w=800",
    },
    {
      name: "Mr. Sarafa Adam",
      role: "Vice Principal II, The Crescent College",
      bio: "Assists in maintaining discipline, academic standards, and smooth daily operations within the secondary section.",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=800",
    },
    {
      name: "Mr. Abdul Waheed Kehinde",
      role: "Principal, The Crescent School of Science",
      bio: "Leads the School of Science with a focus on innovation, structured learning, and the advancement of scientific and technical education.",
      image: "https://images.unsplash.com/photo-1557862921-37829c776f74?auto=format&fit=crop&q=80&w=800",
    },
    {
      name: "Mr. Abdul Wasiu Amade",
      role: "Headmaster, Primary Section",
      bio: "Oversees the academic and moral development of pupils at the Primary level, ensuring a solid educational foundation.",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=800",
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
            src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=2070"
            alt="Leadership Team"
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
            Our Leadership Team
          </h1>
          <p className="text-lg md:text-2xl max-w-4xl mx-auto opacity-90">
            Guided by vision, integrity, and dedication — shaping the future with faith and excellence
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
            The strength and steady growth of Crescent Schools are built upon visionary leadership, dedicated administration, and a firm commitment to excellence. The foundation of the institution rests on the guidance, discipline, and integrity of the following distinguished leaders.
          </motion.p>
        </div>
      </section>

      {/* Leadership Grid */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-12">
            {leaders.map((leader, i) => (
              <motion.div
                key={i}
                variants={fadeInUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="bg-slate-50 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 border border-slate-200 group text-center p-8"
              >
                <div className="relative w-48 h-48 md:w-56 md:h-56 mx-auto mb-6 rounded-full overflow-hidden shadow-2xl border-4 border-[#0EA5E9]">
                  <Image
                    src={leader.image}
                    alt={leader.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                </div>

                <h3 className="text-xl md:text-2xl font-bold text-[#1E3A8A] mb-2">
                  {leader.name}
                </h3>
                <p className="text-[#0EA5E9] font-medium mb-4">{leader.role}</p>
                <p className="text-slate-700 leading-relaxed text-base md:text-lg">
                  {leader.bio}
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
            Join Our Journey
          </motion.h3>
          <div className="flex flex-wrap justify-center gap-6">
            <Link
              href="/admissions"
              className="bg-white/15 hover:bg-white/25 px-8 py-4 rounded-xl font-medium transition-all backdrop-blur-md border border-white/20"
            >
              Admissions
            </Link>
            <Link
              href="/contact"
              className="bg-white/15 hover:bg-white/25 px-8 py-4 rounded-xl font-medium transition-all backdrop-blur-md border border-white/20"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}