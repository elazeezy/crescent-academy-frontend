// app/admissions/page.tsx
"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const fadeInUp = {
  hidden: { opacity: 0, y: 60 },
  visible: { opacity: 1, y: 0 },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.25 },
  },
};

export default function AdmissionsPage() {
  const steps = [
    {
      number: 1,
      title: "Visit the School HQ",
      desc: "All admission processes take place at our main headquarters in Panada Area, Iwo. Visit us in person to begin your child's journey.",
      icon: "🏫",
      location: "Panada Area, Beside Car Wash, Along Water Works, Iwo",
    },
    {
      number: 2,
      title: "Collect the Admission Form",
      desc: "Pick up the official admission form directly from the school office. No online submission is required at this stage.",
      icon: "📄",
    },
    {
      number: 3,
      title: "Submit Required Documents",
      desc: "Complete and submit the form along with birth certificate, previous school results (if applicable), passport photos, and any other requested documents.",
      icon: "📋",
    },
    {
      number: 4,
      title: "Assessment & Interview",
      desc: "Your child may be invited for a simple assessment or interview (depending on level) to ensure a good fit with our learning environment.",
      icon: "🧑‍🏫",
    },
    {
      number: 5,
      title: "Receive Offer & Complete Registration",
      desc: "Successful applicants will receive an offer letter. Pay the registration fee and complete enrollment to secure your child's place.",
      icon: "✅",
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
          <div className="w-full h-full bg-gradient-to-br from-[#1E3A8A] via-[#0F2A5E] to-[#0EA5E9]" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/60" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2 }}
          className="relative z-10 text-center text-white px-6 max-w-5xl mx-auto"
        >
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight mb-6">
            Admissions
          </h1>
          <p className="text-lg md:text-2xl max-w-4xl mx-auto opacity-90">
            Join the Crescent Family — Enroll Your Child Today
          </p>
          <p className="mt-6 text-base md:text-lg opacity-85 max-w-3xl mx-auto">
            We welcome prospective students and parents to experience our faith-driven environment of excellence.
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
            className="text-lg md:text-xl text-slate-700 leading-relaxed mb-8"
          >
            At Crescent Academy, we make the admission process simple and personal. All admissions are handled directly at our school headquarters in Panada Area, Iwo.
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="text-lg md:text-xl font-medium text-[#1E3A8A]"
          >
            Admission forms are available for collection in person — no online application at this time.
          </motion.p>
        </div>
      </section>

      {/* Admission Steps */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-6">
          <motion.h2
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#1E3A8A] text-center mb-12 md:mb-16"
          >
            How to Apply – Step by Step
          </motion.h2>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12"
          >
            {steps.map((step, i) => (
              <motion.div
                key={i}
                variants={fadeInUp}
                className="bg-slate-50 rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 border border-slate-200 text-center group"
              >
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-[#0EA5E9]/10 flex items-center justify-center text-4xl group-hover:bg-[#0EA5E9] group-hover:text-white transition-colors">
                  {step.icon}
                </div>

                <h3 className="text-2xl font-bold text-[#1E3A8A] mb-4">
                  Step {step.number}: {step.title}
                </h3>

                <p className="text-slate-700 leading-relaxed mb-4">
                  {step.desc}
                </p>

                {step.location && (
                  <p className="text-sm font-medium text-[#0EA5E9] mt-4">
                    Location: {step.location}
                  </p>
                )}
              </motion.div>
            ))}
          </motion.div>

          {/* Final Note */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.8 }}
            className="mt-16 text-center max-w-4xl mx-auto"
          >
            <p className="text-xl md:text-2xl font-medium text-[#1E3A8A] italic">
              We look forward to welcoming your child into our nurturing, faith-driven community. Visit us at the HQ in Panada Area to start the process.
            </p>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-24 bg-gradient-to-r from-[#1E3A8A] to-[#0F2A5E] text-white">
        <div className="container mx-auto px-6 text-center">
          <h3 className="text-3xl md:text-4xl font-bold mb-8">
            Ready to Begin?
          </h3>
          <div className="flex flex-wrap justify-center gap-6">
            <Link
              href="/contact"
              className="bg-white/15 hover:bg-white/25 px-8 py-4 rounded-xl font-medium transition-all backdrop-blur-md border border-white/20"
            >
              Contact Admissions
            </Link>
            <Link
              href="/structure"
              className="bg-white/15 hover:bg-white/25 px-8 py-4 rounded-xl font-medium transition-all backdrop-blur-md border border-white/20"
            >
              Learn About Our Structure
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
