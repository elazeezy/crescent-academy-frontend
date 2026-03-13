// app/contact/page.tsx
"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, Phone, Mail, MapPin } from "lucide-react";

const fadeInUp = {
  hidden: { opacity: 0, y: 60 },
  visible: { opacity: 1, y: 0 },
};

export default function ContactPage() {
  return (
    <div className="bg-white min-h-screen flex flex-col">

      {/* Hero with real background image + breadcrumb overlay */}
      <section className="relative h-[60vh] md:h-[70vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/contact-hero.jpg"   // ← Download & place here
            alt="Crescent Academy Contact & Reception"
            fill
            className="object-cover brightness-[0.75] contrast-[1.1]"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
        </div>

        {/* Breadcrumb – top-left overlay (same style as previous pages) */}
        <div className="absolute top-6 left-6 sm:top-8 sm:left-8 z-30">
          <nav aria-label="Breadcrumb">
            <ol className="flex items-center space-x-3 text-base md:text-lg">
              <li>
                <Link
                  href="/"
                  className="text-white/90 hover:text-[#0EA5E9] transition-colors duration-300 flex items-center gap-2 font-medium drop-shadow-md"
                >
                  <ChevronLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                  Home
                </Link>
              </li>
              <li className="text-white/70">›</li>
              <li className="text-white font-semibold drop-shadow-md">
                Contact Us
              </li>
            </ol>
          </nav>
        </div>

        {/* Original hero content (unchanged) */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2 }}
          className="relative z-10 text-center text-white px-6 max-w-5xl mx-auto"
        >
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight mb-6">
            Contact Us
          </h1>
          <p className="text-lg md:text-2xl max-w-4xl mx-auto opacity-90">
            We're here to help — reach out to our team
          </p>
        </motion.div>
      </section>

      {/* Contact Info – glassmorphic cards for premium feel (content unchanged) */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-white to-slate-50">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="grid md:grid-cols-3 gap-8 lg:gap-12 text-center">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white/90 backdrop-blur-xl border border-slate-200/60 rounded-3xl p-8 md:p-10 shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all duration-500 group"
            >
              <Phone className="w-12 h-12 mx-auto mb-6 text-[#0EA5E9] group-hover:scale-110 transition-transform" />
              <h3 className="text-2xl font-bold text-[#1E3A8A] mb-4">Phone</h3>
              <p className="text-slate-700 text-lg font-medium">
                08032545074<br />
                08025100466
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-white/90 backdrop-blur-xl border border-slate-200/60 rounded-3xl p-8 md:p-10 shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all duration-500 group"
            >
              <Mail className="w-12 h-12 mx-auto mb-6 text-[#0EA5E9] group-hover:scale-110 transition-transform" />
              <h3 className="text-2xl font-bold text-[#1E3A8A] mb-4">Email</h3>
              <p className="text-slate-700 text-lg font-medium">
                info@crescentacademy.edu.ng
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="bg-white/90 backdrop-blur-xl border border-slate-200/60 rounded-3xl p-8 md:p-10 shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all duration-500 group"
            >
              <MapPin className="w-12 h-12 mx-auto mb-6 text-[#0EA5E9] group-hover:scale-110 transition-transform" />
              <h3 className="text-2xl font-bold text-[#1E3A8A] mb-4">Location</h3>
              <p className="text-slate-700 text-lg font-medium">
                Panada Area, Beside Car Wash, Along Water Works, Iwo
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Contact Form (unchanged – kept your exact form) */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-6 max-w-4xl">
          <motion.h2
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-[#1E3A8A] text-center mb-12"
          >
            Send Us a Message
          </motion.h2>

          <motion.form
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
            className="grid md:grid-cols-2 gap-6"
          >
            <input
              type="text"
              placeholder="Your Name"
              className="p-4 rounded-xl border border-slate-300 focus:border-[#0EA5E9] focus:ring-2 focus:ring-[#0EA5E9]/30 outline-none transition-all duration-300"
              required
            />
            <input
              type="email"
              placeholder="Your Email"
              className="p-4 rounded-xl border border-slate-300 focus:border-[#0EA5E9] focus:ring-2 focus:ring-[#0EA5E9]/30 outline-none transition-all duration-300"
              required
            />
            <textarea
              placeholder="Your Message"
              rows={6}
              className="md:col-span-2 p-4 rounded-xl border border-slate-300 focus:border-[#0EA5E9] focus:ring-2 focus:ring-[#0EA5E9]/30 outline-none transition-all duration-300"
              required
            ></textarea>
            <button
              type="submit"
              className="md:col-span-2 bg-[#0EA5E9] hover:bg-[#0284C7] text-white font-bold py-4 rounded-xl transition-all shadow-lg hover:shadow-xl hover:scale-[1.02] duration-300"
            >
              Send Message
            </button>
          </motion.form>
        </div>
      </section>
    </div>
  );
}