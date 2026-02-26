// app/policies/page.tsx
"use client";

import { motion } from "framer-motion";
import Link from "next/dist/client/link";

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

export default function PoliciesPage() {
  const policies = [
    "The school operates strictly according to Islamic teachings and moral principles.",
    "All students must arrive at school before 8:00 a.m. Late arrivals will be marked and sanctioned accordingly.",
    "Proper school uniform must be worn at all times.",
    "Students must dress modestly and decently according to Islamic standards.",
    "Only the English language must be spoken within the school premises (except during language classes).",
    "Respect for teachers, staff, and fellow students is compulsory.",
    "Bullying, fighting, or physical aggression is strictly prohibited.",
    "All Muslim students must participate in daily Ṣalāh (prayers).",
    "Students must observe proper Islamic manners (Adab).",
    "Indecent hairstyles are prohibited. Female students must wear proper Hijab.",
    "School of Science students must wear lab suits at all times.",
    "Male students must keep moderate and decent haircuts.",
    "Use of abusive or foul language is forbidden.",
    "Students must be honest and truthful at all times. Theft is strictly prohibited.",
    "Participation in Islamic activities is mandatory where required.",
    "Regular attendance is compulsory. Truancy is not allowed.",
    "Homework and assignments must be submitted on time. Late submission may attract penalties.",
    "Examination malpractice will result in serious disciplinary action.",
    "Students must bring required textbooks and materials daily.",
    "Continuous assessment tests are mandatory.",
    "Parents must attend PTA meetings.",
    "Academic excellence is highly encouraged. Students must maintain minimum academic performance standards.",
    "Students must greet teachers and visitors.",
    "Mobile phones are prohibited unless officially permitted.",
    "Vandalism of school property is punishable.",
    "Students must keep classrooms clean. Littering is prohibited.",
    "Respect for school authority is compulsory.",
    "Noise-making during lessons is prohibited.",
    "Students must seek permission before leaving the classroom.",
    "Students must not leave the school premises without prior permission.",
    "Dangerous objects are prohibited in school.",
    "Harassment of any kind is not tolerated.",
    "Students must follow safety instructions at all times.",
    "School ID cards must be worn where applicable.",
    "Lost and found items must be reported to the school office.",
    "Any violation of school rules will attract appropriate disciplinary measures.",
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
            School Policies
          </h1>
          <p className="text-lg md:text-2xl max-w-4xl mx-auto opacity-90">
            Upholding discipline, respect, and Islamic values for a safe and nurturing environment
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
            Crescent Academy operates strictly according to Islamic teachings and moral principles. These policies ensure a safe, respectful, and disciplined environment where every child can thrive academically, spiritually, and socially.
          </motion.p>
        </div>
      </section>

      {/* Policies List */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-6">
          <motion.ul
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="max-w-4xl mx-auto space-y-4 md:space-y-6"
          >
            {policies.map((policy, i) => (
              <motion.li
                key={i}
                variants={fadeInUp}
                className="flex items-start gap-4 bg-slate-50 p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow"
              >
                <span className="text-[#0EA5E9] text-2xl flex-shrink-0 mt-1">•</span>
                <p className="text-slate-800 leading-relaxed text-lg">{policy}</p>
              </motion.li>
            ))}
          </motion.ul>
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
            Questions About Our Policies?
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