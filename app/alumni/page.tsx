// app/alumni/page.tsx
"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function AlumniPage() {
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
          <div className="w-full h-full bg-gradient-to-br from-[#1E3A8A] to-[#0EA5E9]" /> {/* placeholder bg */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black/60" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 text-center text-white px-6 max-w-5xl mx-auto"
        >
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-6">
            Our Alumni Network
          </h1>
          <p className="text-lg md:text-2xl max-w-4xl mx-auto opacity-90">
            Proud graduates continuing to shine — carrying the Crescent legacy forward
          </p>
        </motion.div>
      </section>

      {/* Content Placeholder */}
      <section className="py-20 md:py-28 bg-gradient-to-b from-white to-slate-50">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-[#1E3A8A] mb-8">
            Coming Soon
          </h2>
          <p className="text-xl text-slate-700 max-w-3xl mx-auto">
            Detailed alumni stories, success testimonials, network events, and how to stay connected.
          </p>
          <div className="mt-12">
            <Link
              href="/contact"
              className="inline-block px-10 py-4 bg-[#0EA5E9] hover:bg-[#0284C7] text-white font-bold rounded-xl shadow-xl transition-all"
            >
              Get in Touch with Alumni Team
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}