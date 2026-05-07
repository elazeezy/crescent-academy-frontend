"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ChevronLeft, CheckCircle, FileText, ClipboardList, Users, BadgeCheck, ArrowRight, Send } from "lucide-react";
import ScrollReveal from "@/components/ui/ScrollReveal";
import StaggerContainer, { StaggerItem } from "@/components/ui/StaggerContainer";
import { SCHOOL } from "@/lib/constants";

const steps = [
  { num: "01", icon: Users,         title: "Visit the School",           desc: "All admissions begin at our main campus in Panada Area, Iwo. Visit us in person to start your child's journey.", action: "Get Directions →", actionHref: "https://maps.google.com/?q=Panada+Area,+Beside+Car+Wash,+Along+Water+Works,+Iwo,+Osun+State" },
  { num: "02", icon: FileText,      title: "Collect the Admission Form", desc: "Pick up the official admission form from the school office. Forms can also be requested via WhatsApp.", action: "WhatsApp Us →", actionHref: SCHOOL.whatsappUrl },
  { num: "03", icon: ClipboardList, title: "Submit Required Documents",  desc: "Return the completed form with required documents. Our admissions team will guide you through the checklist.", action: "View Checklist ↓", actionHref: "#checklist" },
  { num: "04", icon: Users,         title: "Assessment & Interview",     desc: "Your child may be invited for a short assessment or interview depending on their level and section.", action: null, actionHref: null },
  { num: "05", icon: BadgeCheck,    title: "Receive Offer & Register",   desc: "Successful applicants receive an offer letter. Pay the registration fee to secure your child's place.", action: "View Fees →", actionHref: "/fees" },
];

const requirements = [
  { item: "Original Birth Certificate",        note: "Or sworn affidavit of age" },
  { item: "4 Recent Passport Photographs",     note: "White background, 35×45mm" },
  { item: "Last School Report / Result",       note: "If transferring from another school" },
  { item: "Transfer Certificate",             note: "From previous school, if applicable" },
  { item: "Completed Admission Form",         note: "Collected from the school office" },
];

const IslamicPattern = () => (
  <svg aria-hidden className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.05]" xmlns="http://www.w3.org/2000/svg">
    <defs><pattern id="ap" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse"><polygon points="40,4 47,20 62,13 55,28 72,35 55,42 62,57 47,50 40,66 33,50 18,57 25,42 8,35 25,28 18,13 33,20" fill="none" stroke="white" strokeWidth="0.7" /></pattern></defs>
    <rect width="100%" height="100%" fill="url(#ap)" />
  </svg>
);

export default function AdmissionsPage() {
  const [form, setForm] = useState({ parentName: "", phone: "", email: "", childName: "", age: "", section: "", referral: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const body = encodeURIComponent(`Parent/Guardian: ${form.parentName}\nPhone: ${form.phone}\nEmail: ${form.email}\nChild: ${form.childName}\nAge: ${form.age}\nSection: ${form.section}\nReferral: ${form.referral}\nMessage: ${form.message}`);
    window.location.href = `mailto:${SCHOOL.admissionsEmail}?subject=Admission%20Enquiry%20-%20${encodeURIComponent(form.childName)}&body=${body}`;
    setSubmitted(true);
  };

  const inputStyle = {
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

  return (
    <div style={{ background: "#F7F5F1" }} className="min-h-screen">

      {/* Hero */}
      <section className="relative h-[55vh] min-h-72 flex items-center overflow-hidden" style={{ background: "#0B1F3A" }}>
        <IslamicPattern />
        <img src="/images/hero-students-classroom.jpg" alt="" aria-hidden
          className="absolute inset-0 w-full h-full object-cover opacity-20"
          onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
        <div className="absolute inset-0" style={{ background: "rgba(6,14,28,0.75)" }} />
        <div className="absolute top-6 left-6 z-20">
          <Link href="/" className="flex items-center gap-1.5 text-white/70 hover:text-white text-sm transition-colors"
            style={{ fontFamily: "var(--font-body, sans-serif)" }}>
            <ChevronLeft size={16} /> Home
          </Link>
        </div>
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}
          className="relative z-10 max-w-7xl mx-auto px-6 sm:px-10 w-full">
          <p className="text-xs tracking-[0.2em] uppercase mb-3 font-medium"
            style={{ color: "#2196C4", fontFamily: "var(--font-body, sans-serif)" }}>
            Admissions Open 2025/2026
          </p>
          <h1 className="text-4xl sm:text-5xl font-bold text-white leading-tight mb-4"
            style={{ fontFamily: "var(--font-display, 'Cormorant Garamond', serif)" }}>
            Begin Your Child's<br />
            <span className="italic" style={{ color: "#3BADD9" }}>Journey</span>
          </h1>
          <p className="text-white/70 text-lg max-w-xl" style={{ fontFamily: "var(--font-body, sans-serif)" }}>
            Academic excellence meets authentic Islamic values.
          </p>
        </motion.div>
      </section>

      {/* 5-step visual bar */}
      <section style={{ background: "#0B1F3A", borderBottom: "1px solid rgba(255,255,255,0.06)" }} className="py-4">
        <div className="max-w-5xl mx-auto px-6">
          <div className="flex items-center justify-between gap-1 sm:gap-2">
            {steps.map((s, i) => (
              <div key={i} className="flex items-center gap-1 sm:gap-2 flex-1">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full font-bold text-[10px] sm:text-xs flex items-center justify-center shrink-0"
                  style={{ background: "#2196C4", color: "#fff" }}>{s.num}</div>
                <span className="text-white/60 text-[9px] sm:text-[10px] font-medium hidden sm:block leading-tight"
                  style={{ fontFamily: "var(--font-body, sans-serif)" }}>{s.title}</span>
                {i < steps.length - 1 && <div className="flex-1 h-px hidden sm:block" style={{ background: "rgba(33,150,196,0.25)" }} />}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How to Apply */}
      <section className="py-20 md:py-24" style={{ background: "#F7F5F1" }}>
        <div className="max-w-5xl mx-auto px-6 sm:px-10">
          <div className="text-center mb-12">
            <p className="text-xs tracking-[0.14em] uppercase mb-3 font-medium flex items-center gap-3 justify-center"
              style={{ color: "#2196C4", fontFamily: "var(--font-body, sans-serif)" }}>
              <span className="w-8 h-px" style={{ background: "#2196C4" }} />How to Apply<span className="w-8 h-px" style={{ background: "#2196C4" }} />
            </p>
            <h2 className="text-3xl md:text-4xl font-bold" style={{ color: "#0B1F3A", fontFamily: "var(--font-display, 'Cormorant Garamond', serif)" }}>
              Five Simple <span className="italic" style={{ color: "#2196C4" }}>Steps</span>
            </h2>
            <p className="mt-3 max-w-xl mx-auto text-sm" style={{ color: "#6B7280", fontFamily: "var(--font-body, sans-serif)" }}>
              Straightforward and family-friendly. Here's how to get started.
            </p>
            <div className="w-12 h-0.5 rounded-full mx-auto mt-4" style={{ background: "#2196C4" }} />
          </div>
          <div className="space-y-5">
            {steps.map((step, i) => {
              const Icon = step.icon;
              return (
                <ScrollReveal key={i} delay={i * 0.08}>
                  <div className="group flex gap-5 sm:gap-8 p-6 sm:p-8 bg-white rounded-2xl border transition-all duration-300 hover:shadow-lg"
                    style={{ borderColor: "#E5E7EB" }}
                    onMouseEnter={e => (e.currentTarget.style.borderColor = "rgba(33,150,196,0.35)")}
                    onMouseLeave={e => (e.currentTarget.style.borderColor = "#E5E7EB")}>
                    <span aria-hidden className="text-6xl sm:text-7xl font-bold leading-none shrink-0 select-none"
                      style={{ color: "rgba(33,150,196,0.12)", fontFamily: "var(--font-display, serif)" }}>{step.num}</span>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 flex-1 min-w-0">
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                        style={{ background: "rgba(33,150,196,0.08)" }}>
                        <Icon size={22} style={{ color: "#2196C4" }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-lg mb-1" style={{ color: "#0B1F3A", fontFamily: "var(--font-body, sans-serif)" }}>{step.title}</h3>
                        <p className="text-sm leading-relaxed" style={{ color: "#6B7280", fontFamily: "var(--font-body, sans-serif)" }}>{step.desc}</p>
                      </div>
                      {step.actionHref && step.action && (
                        <a href={step.actionHref} target={step.actionHref.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer"
                          className="shrink-0 text-xs font-bold transition-colors whitespace-nowrap"
                          style={{ color: "#2196C4", fontFamily: "var(--font-body, sans-serif)" }}
                          onMouseEnter={e => (e.currentTarget.style.color = "#3BADD9")}
                          onMouseLeave={e => (e.currentTarget.style.color = "#2196C4")}>
                          {step.action}
                        </a>
                      )}
                    </div>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Document Checklist */}
      <section id="checklist" className="py-16 relative overflow-hidden" style={{ background: "#0B1F3A" }}>
        <IslamicPattern />
        <div className="relative z-10 max-w-5xl mx-auto px-6 sm:px-10">
          <div className="text-center mb-10">
            <p className="text-xs tracking-[0.14em] uppercase mb-3 font-medium flex items-center gap-3 justify-center"
              style={{ color: "#3BADD9", fontFamily: "var(--font-body, sans-serif)" }}>
              <span className="w-8 h-px" style={{ background: "#3BADD9" }} />Documents Required<span className="w-8 h-px" style={{ background: "#3BADD9" }} />
            </p>
            <h2 className="text-3xl font-bold text-white" style={{ fontFamily: "var(--font-display, 'Cormorant Garamond', serif)" }}>
              What to Bring
            </h2>
            <div className="w-12 h-0.5 rounded-full mx-auto mt-4" style={{ background: "#2196C4" }} />
          </div>
          <StaggerContainer className="grid sm:grid-cols-2 gap-4">
            {requirements.map((req, i) => (
              <StaggerItem key={i}>
                <div className="flex items-start gap-4 rounded-xl p-5"
                  style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}>
                  <CheckCircle size={18} style={{ color: "#2196C4" }} className="shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-white text-sm" style={{ fontFamily: "var(--font-body, sans-serif)" }}>{req.item}</p>
                    <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.5)", fontFamily: "var(--font-body, sans-serif)" }}>{req.note}</p>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Enquiry Form */}
      <section className="py-20 md:py-24" style={{ background: "#fff" }}>
        <div className="max-w-3xl mx-auto px-6 sm:px-10">
          <div className="text-center mb-12">
            <p className="text-xs tracking-[0.14em] uppercase mb-3 font-medium flex items-center gap-3 justify-center"
              style={{ color: "#2196C4", fontFamily: "var(--font-body, sans-serif)" }}>
              <span className="w-8 h-px" style={{ background: "#2196C4" }} />Get in Touch<span className="w-8 h-px" style={{ background: "#2196C4" }} />
            </p>
            <h2 className="text-3xl font-bold" style={{ color: "#0B1F3A", fontFamily: "var(--font-display, 'Cormorant Garamond', serif)" }}>
              Send an <span className="italic" style={{ color: "#2196C4" }}>Enquiry</span>
            </h2>
            <p className="mt-3 text-sm" style={{ color: "#6B7280", fontFamily: "var(--font-body, sans-serif)" }}>
              Not ready to visit yet? Send us your details and we'll get back to you.
            </p>
            <div className="w-12 h-0.5 rounded-full mx-auto mt-4" style={{ background: "#2196C4" }} />
          </div>
          {submitted ? (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
              className="text-center py-16 bg-white rounded-2xl border" style={{ borderColor: "#E5E7EB" }}>
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{ background: "rgba(33,150,196,0.1)" }}>
                <CheckCircle size={32} style={{ color: "#2196C4" }} />
              </div>
              <h3 className="font-bold text-xl mb-2" style={{ color: "#0B1F3A", fontFamily: "var(--font-body, sans-serif)" }}>Enquiry Sent!</h3>
              <p className="text-sm max-w-sm mx-auto" style={{ color: "#6B7280", fontFamily: "var(--font-body, sans-serif)" }}>
                Your email app should have opened. If not, email us directly at{" "}
                <a href={`mailto:${SCHOOL.email}`} style={{ color: "#2196C4" }}>{SCHOOL.email}</a>
              </p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-8 space-y-5"
              style={{ border: "1px solid #E5E7EB" }}>
              <div className="grid sm:grid-cols-2 gap-5">
                <label className="flex flex-col gap-1.5">
                  <span className="text-xs font-medium uppercase tracking-wide" style={{ color: "#9CA3AF", fontFamily: "var(--font-body, sans-serif)" }}>Parent / Guardian Name *</span>
                  <input type="text" required value={form.parentName} onChange={(e) => setForm({ ...form, parentName: e.target.value })} style={inputStyle} placeholder="Full name"
                    onFocus={e => { e.currentTarget.style.borderColor = "rgba(33,150,196,0.5)"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(33,150,196,0.1)"; }}
                    onBlur={e => { e.currentTarget.style.borderColor = "#E5E7EB"; e.currentTarget.style.boxShadow = "none"; }} />
                </label>
                <label className="flex flex-col gap-1.5">
                  <span className="text-xs font-medium uppercase tracking-wide" style={{ color: "#9CA3AF", fontFamily: "var(--font-body, sans-serif)" }}>Phone Number *</span>
                  <input type="tel" required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} style={inputStyle} placeholder="+234 800 000 0000"
                    onFocus={e => { e.currentTarget.style.borderColor = "rgba(33,150,196,0.5)"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(33,150,196,0.1)"; }}
                    onBlur={e => { e.currentTarget.style.borderColor = "#E5E7EB"; e.currentTarget.style.boxShadow = "none"; }} />
                </label>
              </div>
              <label className="flex flex-col gap-1.5">
                <span className="text-xs font-medium uppercase tracking-wide" style={{ color: "#9CA3AF", fontFamily: "var(--font-body, sans-serif)" }}>Email Address</span>
                <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} style={inputStyle} placeholder="Optional"
                  onFocus={e => { e.currentTarget.style.borderColor = "rgba(33,150,196,0.5)"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(33,150,196,0.1)"; }}
                  onBlur={e => { e.currentTarget.style.borderColor = "#E5E7EB"; e.currentTarget.style.boxShadow = "none"; }} />
              </label>
              <div className="grid sm:grid-cols-2 gap-5">
                <label className="flex flex-col gap-1.5">
                  <span className="text-xs font-medium uppercase tracking-wide" style={{ color: "#9CA3AF", fontFamily: "var(--font-body, sans-serif)" }}>Child's Name *</span>
                  <input type="text" required value={form.childName} onChange={(e) => setForm({ ...form, childName: e.target.value })} style={inputStyle} placeholder="Full name"
                    onFocus={e => { e.currentTarget.style.borderColor = "rgba(33,150,196,0.5)"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(33,150,196,0.1)"; }}
                    onBlur={e => { e.currentTarget.style.borderColor = "#E5E7EB"; e.currentTarget.style.boxShadow = "none"; }} />
                </label>
                <label className="flex flex-col gap-1.5">
                  <span className="text-xs font-medium uppercase tracking-wide" style={{ color: "#9CA3AF", fontFamily: "var(--font-body, sans-serif)" }}>Child's Age *</span>
                  <select required value={form.age} onChange={(e) => setForm({ ...form, age: e.target.value })} style={inputStyle}
                    onFocus={e => { e.currentTarget.style.borderColor = "rgba(33,150,196,0.5)"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(33,150,196,0.1)"; }}
                    onBlur={e => { e.currentTarget.style.borderColor = "#E5E7EB"; e.currentTarget.style.boxShadow = "none"; }}>
                    <option value="">Select age range</option>
                    <option>3–4 years</option><option>5–6 years</option><option>7–10 years</option><option>11–14 years</option><option>15–18 years</option>
                  </select>
                </label>
              </div>
              <div className="grid sm:grid-cols-2 gap-5">
                <label className="flex flex-col gap-1.5">
                  <span className="text-xs font-medium uppercase tracking-wide" style={{ color: "#9CA3AF", fontFamily: "var(--font-body, sans-serif)" }}>Section Applying For *</span>
                  <select required value={form.section} onChange={(e) => setForm({ ...form, section: e.target.value })} style={inputStyle}
                    onFocus={e => { e.currentTarget.style.borderColor = "rgba(33,150,196,0.5)"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(33,150,196,0.1)"; }}
                    onBlur={e => { e.currentTarget.style.borderColor = "#E5E7EB"; e.currentTarget.style.boxShadow = "none"; }}>
                    <option value="">Select section</option>
                    <option>Nursery</option><option>Primary</option><option>Secondary / Crescent College</option><option>Vocational / School of Science</option>
                  </select>
                </label>
                <label className="flex flex-col gap-1.5">
                  <span className="text-xs font-medium uppercase tracking-wide" style={{ color: "#9CA3AF", fontFamily: "var(--font-body, sans-serif)" }}>How Did You Hear About Us?</span>
                  <select value={form.referral} onChange={(e) => setForm({ ...form, referral: e.target.value })} style={inputStyle}
                    onFocus={e => { e.currentTarget.style.borderColor = "rgba(33,150,196,0.5)"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(33,150,196,0.1)"; }}
                    onBlur={e => { e.currentTarget.style.borderColor = "#E5E7EB"; e.currentTarget.style.boxShadow = "none"; }}>
                    <option value="">Select</option>
                    <option>Friend / Family</option><option>Social Media</option><option>Google</option><option>Walk-in</option><option>Other</option>
                  </select>
                </label>
              </div>
              <label className="flex flex-col gap-1.5">
                <span className="text-xs font-medium uppercase tracking-wide" style={{ color: "#9CA3AF", fontFamily: "var(--font-body, sans-serif)" }}>Message / Questions</span>
                <textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} rows={4} placeholder="Any questions or additional information..."
                  style={{ ...inputStyle, resize: "none" }}
                  onFocus={e => { e.currentTarget.style.borderColor = "rgba(33,150,196,0.5)"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(33,150,196,0.1)"; }}
                  onBlur={e => { e.currentTarget.style.borderColor = "#E5E7EB"; e.currentTarget.style.boxShadow = "none"; }} />
              </label>
              <button type="submit"
                className="w-full flex items-center justify-center gap-2 py-3.5 font-bold text-sm rounded-full transition-all hover:-translate-y-0.5"
                style={{ background: "#2196C4", color: "#fff", fontFamily: "var(--font-body, sans-serif)" }}
                onMouseEnter={e => (e.currentTarget.style.background = "#3BADD9")}
                onMouseLeave={e => (e.currentTarget.style.background = "#2196C4")}>
                <Send size={15} /> Send Enquiry
              </button>
            </form>
          )}
        </div>
      </section>

      {/* Fee teaser */}
      <section className="py-12" style={{ background: "#0B1F3A" }}>
        <div className="max-w-5xl mx-auto px-6 sm:px-10 text-center">
          <p className="text-sm mb-2" style={{ color: "rgba(255,255,255,0.6)", fontFamily: "var(--font-body, sans-serif)" }}>Affordable excellence for every family</p>
          <h3 className="text-white text-2xl font-bold mb-6" style={{ fontFamily: "var(--font-display, 'Cormorant Garamond', serif)" }}>Questions About Fees?</h3>
          <div className="flex flex-wrap items-center justify-center gap-4">
            {["Nursery & Primary", "Secondary", "Vocational"].map((s) => (
              <span key={s} className="px-4 py-1.5 text-xs rounded-full"
                style={{ border: "1px solid rgba(33,150,196,0.3)", color: "#3BADD9", fontFamily: "var(--font-body, sans-serif)" }}>{s}</span>
            ))}
          </div>
          <Link href="/fees"
            className="inline-flex items-center gap-2 mt-6 px-7 py-3 rounded-full font-bold text-sm transition-all hover:-translate-y-0.5"
            style={{ background: "#2196C4", color: "#fff", fontFamily: "var(--font-body, sans-serif)" }}
            onMouseEnter={e => (e.currentTarget.style.background = "#3BADD9")}
            onMouseLeave={e => (e.currentTarget.style.background = "#2196C4")}>
            View Full Fee Schedule <ArrowRight size={14} />
          </Link>
        </div>
      </section>
    </div>
  );
}
