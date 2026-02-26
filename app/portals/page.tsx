// app/portals/page.tsx
"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { LogIn, UserCog, Users, BookOpen, Calculator } from "lucide-react";

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

export default function PortalsPage() {
  const portalLinks = [
    {
      title: "Student Portal",
      desc: "Access assignments, results, timetable, and school announcements",
      icon: <BookOpen className="w-10 h-10" />,
      href: "/portals/student",
      color: "bg-[#0EA5E9]",
    },
    {
      title: "Admin Portal",
      desc: "For school administrators (Principal, Vice Principals, Headmaster)",
      icon: <UserCog className="w-10 h-10" />,
      href: "/portals/admin",
      color: "bg-[#1E3A8A]",
    },
    {
      title: "Teacher Portal",
      desc: "Manage classes, upload results, communicate with parents",
      icon: <Users className="w-10 h-10" />,
      href: "/portals/teacher",
      color: "bg-[#0EA5E9]/80",
    },
    {
      title: "Result Checker",
      desc: "Check academic results and performance reports",
      icon: <Calculator className="w-10 h-10" />,
      href: "/portals/result-checker",
      color: "bg-[#1E3A8A]/80",
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
        <div className="absolute inset-0 bg-gradient-to-br from-[#1E3A8A] via-[#0F2A5E] to-[#0EA5E9]" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/60" />

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2 }}
          className="relative z-10 text-center text-white px-6 max-w-5xl mx-auto"
        >
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight mb-6">
            School Portals
          </h1>
          <p className="text-lg md:text-2xl max-w-4xl mx-auto opacity-90">
            Secure access for students, teachers, admins, and parents
          </p>
        </motion.div>
      </section>

      {/* Portal Cards */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-6">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12"
          >
            {portalLinks.map((portal, i) => (
              <motion.div
                key={i}
                variants={fadeInUp}
                className="bg-slate-50 rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 border border-slate-200 text-center group"
              >
                <div className={`w-20 h-20 mx-auto mb-6 rounded-full ${portal.color} text-white flex items-center justify-center transition-transform group-hover:scale-110`}>
                  {portal.icon}
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-[#1E3A8A] mb-4 group-hover:text-[#0EA5E9] transition-colors">
                  {portal.title}
                </h3>
                <p className="text-slate-700 leading-relaxed mb-6">
                  {portal.desc}
                </p>
                <Link
                  href={portal.href}
                  className="inline-block bg-[#0EA5E9] hover:bg-[#0284C7] text-white px-6 py-3 rounded-xl font-medium transition-all"
                >
                  Login
                </Link>
              </motion.div>
            ))}
          </motion.div>

          {/* Result Checker Placeholder */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.8 }}
            className="mt-16 max-w-2xl mx-auto text-center"
          >
            <h3 className="text-2xl md:text-3xl font-bold text-[#1E3A8A] mb-6">
              Result Checker
            </h3>
            <p className="text-lg text-slate-700 mb-8">
              Enter your student ID and term to view results (coming soon – currently handled at school HQ).
            </p>
            <div className="bg-slate-100 p-8 rounded-2xl">
              <p className="text-slate-600 italic">
                For now, please visit the school office in Panada Area to collect printed result sheets.
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}