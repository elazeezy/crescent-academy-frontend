// app/fees/page.tsx
"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const fadeInUp = {
  hidden: { opacity: 0, y: 60 },
  visible: { opacity: 1, y: 0 },
};

export default function FeesPage() {
  const feeStructure = [
    { level: "Playgroup", fee: "₦17,000" },
    { level: "Kindergarten 1 & 2", fee: "₦19,000" },
    { level: "Nursery 1 & 2", fee: "₦21,000" },
    { level: "Primary 1 – 5", fee: "₦23,000" },
    { level: "Junior Secondary School (J.S.S 1 – 3 | College)", fee: "₦36,000" },
    { level: "Senior Secondary School (S.S.S 1 – 3 | College)", fee: "₦40,000" },
    { level: "School of Science (J.S.S 1 – 3)", fee: "₦50,000" },
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
            School Fees Structure
          </h1>
          <p className="text-lg md:text-2xl max-w-4xl mx-auto opacity-90">
            Transparent & affordable — investing in your child's complete future
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
            Fees are structured to support quality education while remaining accessible. All payments are handled at the school headquarters in Panada Area, Iwo.
          </motion.p>
        </div>
      </section>

      {/* Fee Table */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto overflow-x-auto"
          >
            <table className="w-full border-collapse bg-slate-50 rounded-2xl shadow-xl overflow-hidden">
              <thead>
                <tr className="bg-[#1E3A8A] text-white">
                  <th className="p-6 text-left text-xl font-bold">Level</th>
                  <th className="p-6 text-right text-xl font-bold">Annual Fee</th>
                </tr>
              </thead>
              <tbody>
                {feeStructure.map((item, i) => (
                  <motion.tr
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    viewport={{ once: true }}
                    className="border-b border-slate-200 hover:bg-slate-100 transition-colors"
                  >
                    <td className="p-6 text-lg font-medium text-slate-800">{item.level}</td>
                    <td className="p-6 text-right text-lg font-bold text-[#1E3A8A]">{item.fee}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-center mt-12 text-slate-600 italic"
          >
            Fees are subject to annual review. Contact the school for payment plans and additional details.
          </motion.p>
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
            Ready to Enroll?
          </motion.h3>
          <Link
            href="/admissions"
            className="inline-block px-10 py-4 bg-white/15 hover:bg-white/25 rounded-xl font-medium transition-all backdrop-blur-md border border-white/20"
          >
            View Admission Process
          </Link>
        </div>
      </section>
    </div>
  );
}