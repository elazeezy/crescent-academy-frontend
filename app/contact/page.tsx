// app/contact/page.tsx
"use client";

import { motion } from "framer-motion";
import { Phone, Mail, MapPin, Link } from "lucide-react";

const fadeInUp = {
  hidden: { opacity: 0, y: 60 },
  visible: { opacity: 1, y: 0 },
};

export default function ContactPage() {
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
            Contact Us
          </h1>
          <p className="text-lg md:text-2xl max-w-4xl mx-auto opacity-90">
            We're here to help — reach out to our team
          </p>
        </motion.div>
      </section>

      {/* Contact Info */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-white to-slate-50">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="grid md:grid-cols-3 gap-8 lg:gap-12 text-center">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl p-8 shadow-xl border border-slate-100"
            >
              <Phone className="w-12 h-12 mx-auto mb-6 text-[#0EA5E9]" />
              <h3 className="text-2xl font-bold text-[#1E3A8A] mb-4">Phone</h3>
              <p className="text-slate-700 text-lg">
                (+234) 803 123 4567
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl p-8 shadow-xl border border-slate-100"
            >
              <Mail className="w-12 h-12 mx-auto mb-6 text-[#0EA5E9]" />
              <h3 className="text-2xl font-bold text-[#1E3A8A] mb-4">Email</h3>
              <p className="text-slate-700 text-lg">
                info@crescentacademy.edu.ng
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-2xl p-8 shadow-xl border border-slate-100"
            >
              <MapPin className="w-12 h-12 mx-auto mb-6 text-[#0EA5E9]" />
              <h3 className="text-2xl font-bold text-[#1E3A8A] mb-4">Location</h3>
              <p className="text-slate-700 text-lg">
                Panada Area, Beside Car Wash, Along Water Works, Iwo
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Contact Form */}
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
              className="p-4 rounded-xl border border-slate-300 focus:border-[#0EA5E9] focus:ring-2 focus:ring-[#0EA5E9]/30 outline-none"
              required
            />
            <input
              type="email"
              placeholder="Your Email"
              className="p-4 rounded-xl border border-slate-300 focus:border-[#0EA5E9] focus:ring-2 focus:ring-[#0EA5E9]/30 outline-none"
              required
            />
            <textarea
              placeholder="Your Message"
              rows={6}
              className="md:col-span-2 p-4 rounded-xl border border-slate-300 focus:border-[#0EA5E9] focus:ring-2 focus:ring-[#0EA5E9]/30 outline-none"
              required
            ></textarea>
            <button
              type="submit"
              className="md:col-span-2 bg-[#0EA5E9] hover:bg-[#0284C7] text-white font-bold py-4 rounded-xl transition-all shadow-lg"
            >
              Send Message
            </button>
          </motion.form>
        </div>
      </section>
    </div>
  );
}