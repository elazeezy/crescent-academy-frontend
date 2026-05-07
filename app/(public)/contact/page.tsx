"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ChevronLeft, Phone, Mail, MapPin, Clock, Send, CheckCircle } from "lucide-react";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { SCHOOL } from "@/lib/constants";

const subjects = ["General Enquiry", "Admissions", "Fees & Charges", "Alumni", "Media / Press", "Other"];

const IslamicPattern = ({ id }: { id: string }) => (
  <svg aria-hidden className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.05]" xmlns="http://www.w3.org/2000/svg">
    <defs><pattern id={id} x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse"><polygon points="40,4 47,20 62,13 55,28 72,35 55,42 62,57 47,50 40,66 33,50 18,57 25,42 8,35 25,28 18,13 33,20" fill="none" stroke="white" strokeWidth="0.7" /></pattern></defs>
    <rect width="100%" height="100%" fill={`url(#${id})`} />
  </svg>
);

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const body = encodeURIComponent(`Name: ${form.name}\nEmail: ${form.email}\nPhone: ${form.phone}\nSubject: ${form.subject}\n\n${form.message}`);
    window.location.href = `mailto:${SCHOOL.email}?subject=${encodeURIComponent(form.subject || "Website Contact")}&body=${body}`;
    setSent(true);
  };

  const inputStyle: React.CSSProperties = {
    padding: "10px 16px",
    borderRadius: 12,
    border: "1px solid #E5E7EB",
    fontSize: 14,
    color: "#1F2937",
    background: "#F9FAFB",
    width: "100%",
    outline: "none",
    fontFamily: "var(--font-body, sans-serif)",
    transition: "border-color 0.2s, box-shadow 0.2s",
  };

  const onFocus = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    e.currentTarget.style.borderColor = "rgba(33,150,196,0.5)";
    e.currentTarget.style.boxShadow = "0 0 0 3px rgba(33,150,196,0.1)";
  };
  const onBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    e.currentTarget.style.borderColor = "#E5E7EB";
    e.currentTarget.style.boxShadow = "none";
  };

  return (
    <div style={{ background: "#F7F5F1" }} className="min-h-screen">

      {/* Hero */}
      <section className="relative h-[50vh] min-h-64 flex items-center overflow-hidden" style={{ background: "#0B1F3A" }}>
        <IslamicPattern id="conp" />
        <div className="absolute inset-0" style={{ background: "rgba(6,14,28,0.78)" }} />
        <div className="absolute top-6 left-6 z-20">
          <Link href="/" className="flex items-center gap-1.5 text-white/70 hover:text-white text-sm transition-colors"
            style={{ fontFamily: "var(--font-body, sans-serif)" }}>
            <ChevronLeft size={16} /> Home
          </Link>
        </div>
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}
          className="relative z-10 max-w-7xl mx-auto px-6 sm:px-10 w-full">
          <p className="text-xs tracking-[0.2em] uppercase mb-3 font-medium"
            style={{ color: "#2196C4", fontFamily: "var(--font-body, sans-serif)" }}>Reach Out</p>
          <h1 className="text-4xl sm:text-5xl font-bold text-white leading-tight"
            style={{ fontFamily: "var(--font-display, 'Cormorant Garamond', serif)" }}>
            Get in <span className="italic" style={{ color: "#3BADD9" }}>Touch</span>
          </h1>
        </motion.div>
      </section>

      {/* Two-column */}
      <section className="py-20 md:py-24" style={{ background: "#fff" }}>
        <div className="max-w-6xl mx-auto px-6 sm:px-10">
          <div className="grid lg:grid-cols-[1fr_1.5fr] gap-14 lg:gap-20">

            {/* Left */}
            <ScrollReveal direction="left">
              <div className="space-y-8">
                <h2 className="text-2xl font-bold mb-6"
                  style={{ color: "#0B1F3A", fontFamily: "var(--font-display, 'Cormorant Garamond', serif)" }}>
                  Contact Information
                </h2>
                <div className="space-y-5">
                  {[
                    { icon: MapPin, label: "Address", value: SCHOOL.address, href: "https://maps.google.com/?q=Panada+Area+Iwo+Osun+State" },
                    { icon: Phone,  label: "Phone",   value: SCHOOL.phone,   href: `tel:${SCHOOL.phone.replace(/\s/g,"")}` },
                    { icon: Mail,   label: "Email",   value: SCHOOL.email,   href: `mailto:${SCHOOL.email}` },
                  ].map(({ icon: Icon, label, value, href }) => (
                    <a key={label} href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer"
                      className="flex items-start gap-4 group">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors"
                        style={{ background: "rgba(33,150,196,0.08)" }}>
                        <Icon size={16} style={{ color: "#2196C4" }} />
                      </div>
                      <div>
                        <p className="text-[10px] font-medium uppercase tracking-wide mb-0.5"
                          style={{ color: "#9CA3AF", fontFamily: "var(--font-body, sans-serif)" }}>{label}</p>
                        <p className="text-sm leading-relaxed transition-colors"
                          style={{ color: "#4B5563", fontFamily: "var(--font-body, sans-serif)" }}
                          onMouseEnter={e => (e.currentTarget.style.color = "#2196C4")}
                          onMouseLeave={e => (e.currentTarget.style.color = "#4B5563")}>{value}</p>
                      </div>
                    </a>
                  ))}
                </div>

                {/* Office hours */}
                <div className="bg-white rounded-2xl p-6" style={{ border: "1px solid #E5E7EB" }}>
                  <div className="flex items-center gap-3 mb-4">
                    <Clock size={16} style={{ color: "#2196C4" }} />
                    <h3 className="font-bold text-sm" style={{ color: "#0B1F3A", fontFamily: "var(--font-body, sans-serif)" }}>Office Hours</h3>
                  </div>
                  <div className="space-y-2 text-sm" style={{ color: "#6B7280" }}>
                    <div className="flex justify-between" style={{ fontFamily: "var(--font-body, sans-serif)" }}>
                      <span>Monday – Friday</span><span className="font-medium" style={{ color: "#374151" }}>8:00am – 4:00pm</span>
                    </div>
                    <div className="flex justify-between" style={{ fontFamily: "var(--font-body, sans-serif)" }}>
                      <span>Saturday</span><span className="font-medium" style={{ color: "#374151" }}>9:00am – 12:00pm</span>
                    </div>
                    <div className="flex justify-between" style={{ fontFamily: "var(--font-body, sans-serif)" }}>
                      <span>Sunday</span><span style={{ color: "#9CA3AF" }}>Closed</span>
                    </div>
                    <p className="text-[10px] pt-2 mt-3" style={{ color: "#9CA3AF", fontFamily: "var(--font-body, sans-serif)", borderTop: "1px solid #F3F4F6" }}>
                      Office follows school Salah schedule
                    </p>
                  </div>
                </div>

                {/* WhatsApp */}
                <a href={SCHOOL.whatsappUrl} target="_blank" rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-3 py-3.5 rounded-full font-bold text-sm text-white hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200"
                  style={{ background: "#25D366", fontFamily: "var(--font-body, sans-serif)" }}>
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  Chat with us on WhatsApp
                </a>
              </div>
            </ScrollReveal>

            {/* Right: form */}
            <ScrollReveal direction="right">
              {sent ? (
                <div className="text-center py-16 bg-white rounded-2xl" style={{ border: "1px solid #E5E7EB" }}>
                  <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                    style={{ background: "rgba(33,150,196,0.1)" }}>
                    <CheckCircle size={32} style={{ color: "#2196C4" }} />
                  </div>
                  <h3 className="font-bold text-xl mb-2" style={{ color: "#0B1F3A", fontFamily: "var(--font-body, sans-serif)" }}>Message Sent!</h3>
                  <p className="text-sm max-w-xs mx-auto" style={{ color: "#6B7280", fontFamily: "var(--font-body, sans-serif)" }}>
                    Your email app should have opened. We'll get back to you as soon as possible.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-8 space-y-5"
                  style={{ border: "1px solid #E5E7EB" }}>
                  <h2 className="text-xl font-bold mb-2"
                    style={{ color: "#0B1F3A", fontFamily: "var(--font-display, 'Cormorant Garamond', serif)" }}>Send a Message</h2>
                  <div className="grid sm:grid-cols-2 gap-5">
                    <label className="flex flex-col gap-1.5">
                      <span className="text-xs font-medium uppercase tracking-wide" style={{ color: "#9CA3AF", fontFamily: "var(--font-body, sans-serif)" }}>Full Name *</span>
                      <input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} style={inputStyle} placeholder="Your name" onFocus={onFocus} onBlur={onBlur} />
                    </label>
                    <label className="flex flex-col gap-1.5">
                      <span className="text-xs font-medium uppercase tracking-wide" style={{ color: "#9CA3AF", fontFamily: "var(--font-body, sans-serif)" }}>Phone</span>
                      <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} style={inputStyle} placeholder="+234 800 000 0000" onFocus={onFocus} onBlur={onBlur} />
                    </label>
                  </div>
                  <label className="flex flex-col gap-1.5">
                    <span className="text-xs font-medium uppercase tracking-wide" style={{ color: "#9CA3AF", fontFamily: "var(--font-body, sans-serif)" }}>Email *</span>
                    <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} style={inputStyle} placeholder="your@email.com" onFocus={onFocus} onBlur={onBlur} />
                  </label>
                  <label className="flex flex-col gap-1.5">
                    <span className="text-xs font-medium uppercase tracking-wide" style={{ color: "#9CA3AF", fontFamily: "var(--font-body, sans-serif)" }}>Subject *</span>
                    <select required value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} style={inputStyle} onFocus={onFocus} onBlur={onBlur}>
                      <option value="">Select a subject</option>
                      {subjects.map((s) => <option key={s}>{s}</option>)}
                    </select>
                  </label>
                  <label className="flex flex-col gap-1.5">
                    <span className="text-xs font-medium uppercase tracking-wide" style={{ color: "#9CA3AF", fontFamily: "var(--font-body, sans-serif)" }}>Message *</span>
                    <textarea required rows={5} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })}
                      style={{ ...inputStyle, resize: "none" }} placeholder="How can we help you?" onFocus={onFocus} onBlur={onBlur} />
                  </label>
                  <button type="submit"
                    className="w-full flex items-center justify-center gap-2 py-3.5 rounded-full font-bold text-sm transition-all hover:-translate-y-0.5"
                    style={{ background: "#2196C4", color: "#fff", fontFamily: "var(--font-body, sans-serif)" }}
                    onMouseEnter={e => (e.currentTarget.style.background = "#3BADD9")}
                    onMouseLeave={e => (e.currentTarget.style.background = "#2196C4")}>
                    <Send size={15} /> Send Message
                  </button>
                </form>
              )}
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Map */}
      <section className="pb-20" style={{ background: "#fff" }}>
        <div className="max-w-6xl mx-auto px-6 sm:px-10">
          <div className="rounded-2xl overflow-hidden shadow-md" style={{ height: 400, border: "1px solid #E5E7EB" }}>
            <iframe title="The Crescent Academy location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3955.2!2d4.18!3d7.63!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zN8KwMzcnNDgiIE4gNMKwMTAnNDgiIEU!5e0!3m2!1sen!2sng!4v1"
              width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
          </div>
          <div className="mt-4 text-center">
            <a href="https://maps.google.com/?q=Panada+Area,+Beside+Car+Wash,+Along+Water+Works,+Iwo,+Osun+State" target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-medium transition-colors"
              style={{ color: "#2196C4", fontFamily: "var(--font-body, sans-serif)" }}
              onMouseEnter={e => (e.currentTarget.style.color = "#3BADD9")}
              onMouseLeave={e => (e.currentTarget.style.color = "#2196C4")}>
              <MapPin size={14} /> Get Directions in Google Maps
            </a>
          </div>
        </div>
      </section>

      {/* Virtual tour */}
      <section className="pb-20" style={{ background: "#F7F5F1" }}>
        <div className="max-w-6xl mx-auto px-6 sm:px-10">
          <div className="relative rounded-2xl overflow-hidden p-10 text-center" style={{ background: "#0B1F3A" }}>
            <IslamicPattern id="vtp" />
            <div className="relative z-10">
              <span className="inline-block px-3 py-1 text-xs font-medium rounded-full mb-4"
                style={{ background: "rgba(33,150,196,0.2)", color: "#3BADD9", fontFamily: "var(--font-body, sans-serif)" }}>
                360° Virtual Tour
              </span>
              <h3 className="text-white text-2xl font-bold mb-3"
                style={{ fontFamily: "var(--font-display, 'Cormorant Garamond', serif)" }}>Virtual Tour Coming Soon</h3>
              <p className="text-sm mb-6 max-w-sm mx-auto"
                style={{ color: "rgba(255,255,255,0.6)", fontFamily: "var(--font-body, sans-serif)" }}>
                Experience our campus digitally. In the meantime, book a physical visit.
              </p>
              <Link href="/admissions"
                className="inline-flex items-center gap-2 px-7 py-3 rounded-full font-bold text-sm transition-all hover:-translate-y-0.5"
                style={{ background: "#2196C4", color: "#fff", fontFamily: "var(--font-body, sans-serif)" }}
                onMouseEnter={e => (e.currentTarget.style.background = "#3BADD9")}
                onMouseLeave={e => (e.currentTarget.style.background = "#2196C4")}>
                Book a School Visit
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
