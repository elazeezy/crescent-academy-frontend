"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { UserCog, Users, BookOpen, ChevronLeft, Loader2 } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

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

export default function PortalsPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [loadingPortal, setLoadingPortal] = useState<string | null>(null);

  const portalLinks = [
    {
      title: "Student Portal",
      desc: "Access your assignments, term results, and school announcements in one place.",
      icon: <BookOpen className="w-10 h-10" />,
      role: "student",
      color: "from-sky-400 to-sky-600",
      shadow: "shadow-sky-200",
    },
    {
      title: "Admin Portal",
      desc: "Administrative management for Principals and school executives.",
      icon: <UserCog className="w-10 h-10" />,
      role: "admin",
      color: "from-blue-800 to-indigo-950",
      shadow: "shadow-indigo-200",
    },
    {
      title: "Teacher Portal",
      desc: "Manage classroom activities, upload results, and track student progress.",
      icon: <Users className="w-10 h-10" />,
      role: "teacher",
      color: "from-sky-500/80 to-blue-700/80",
      shadow: "shadow-blue-200",
    },
  ];

  const handleEnterPortal = async (role: string) => {
    setLoadingPortal(role);
    try {
      if (session) {
        // Sign out silently without redirecting — we will redirect ourselves
        await signOut({ redirect: false });
      }
      // Always go to login — login page will redirect to the right dashboard after credentials are verified
      router.push("/login");
    } catch {
      router.push("/login");
    }
  };

  return (
    <div className="bg-[#F8FAFC] min-h-screen flex flex-col font-sans">

      {/* Breadcrumb Navigation */}
      <div className="absolute top-6 left-6 sm:top-8 sm:left-8 z-30">
        <nav aria-label="Breadcrumb">
          <ol className="flex items-center space-x-3 text-base md:text-lg">
            <li>
              <Link
                href="/"
                className="group text-white/90 hover:text-sky-300 transition-colors duration-300 flex items-center gap-2 font-medium drop-shadow-md"
              >
                <ChevronLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                Home
              </Link>
            </li>
            <li className="text-white/70">›</li>
            <li className="text-white font-semibold drop-shadow-md">
              Portals
            </li>
          </ol>
        </nav>
      </div>

      {/* Hero Section */}
      <section className="relative h-[45vh] md:h-[55vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1E3A8A] via-[#0F2A5E] to-[#0EA5E9]" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#F8FAFC] via-transparent to-transparent" />

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 text-center text-white px-6 max-w-4xl mx-auto"
        >
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight mb-4 drop-shadow-lg">
            Access Portals
          </h1>
          <p className="text-lg md:text-xl opacity-90 font-medium max-w-2xl mx-auto leading-relaxed">
            Welcome back. Please select your gateway to access your dashboard.
          </p>
        </motion.div>
      </section>

      {/* Portal Cards Grid */}
      <section className="flex-grow pb-24 -mt-16 md:-mt-24 relative z-20">
        <div className="container mx-auto px-6">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="grid md:grid-cols-3 gap-8 lg:gap-10 max-w-6xl mx-auto"
          >
            {portalLinks.map((portal, i) => (
              <motion.div
                key={i}
                variants={fadeInUp}
                className="bg-white rounded-[2.5rem] p-8 lg:p-10 shadow-2xl shadow-slate-200/60 hover:shadow-sky-100 transition-all duration-500 border border-slate-100 flex flex-col items-center text-center group relative overflow-hidden"
              >
                {/* Decorative background element */}
                <div className={`absolute -top-12 -right-12 w-24 h-24 rounded-full bg-gradient-to-br ${portal.color} opacity-5 group-hover:scale-[3] transition-transform duration-700`} />

                <div className={`w-24 h-24 mb-8 rounded-3xl bg-gradient-to-br ${portal.color} ${portal.shadow} text-white flex items-center justify-center transition-all duration-500 group-hover:rotate-6 group-hover:scale-110 shadow-lg`}>
                  {portal.icon}
                </div>

                <h3 className="text-2xl font-extrabold text-[#1E3A8A] mb-4 group-hover:text-sky-600 transition-colors">
                  {portal.title}
                </h3>

                <p className="text-slate-600 font-medium leading-relaxed mb-10 flex-grow">
                  {portal.desc}
                </p>

                <button
                  onClick={() => handleEnterPortal(portal.role)}
                  disabled={loadingPortal !== null}
                  className={`w-full py-4 rounded-2xl bg-[#1E3A8A] hover:bg-sky-600 text-white font-bold tracking-wide transition-all duration-300 shadow-md hover:shadow-xl active:scale-95 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed`}
                >
                  {loadingPortal === portal.role ? (
                    <><Loader2 size={18} className="animate-spin" /> Signing out…</>
                  ) : (
                    "Enter Portal"
                  )}
                </button>
              </motion.div>
            ))}
          </motion.div>

          {/* Footer Assistance */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="mt-20 text-center"
          >
            <p className="text-slate-400 font-medium">
              Having trouble logging in? <Link href="/contact" className="text-sky-600 hover:underline">Contact System Administrator</Link>
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
