"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ChevronLeft, CheckCircle } from "lucide-react";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { SCHOOL } from "@/lib/constants";

type Section = "Nursery & Primary" | "Secondary" | "Vocational";
const SECTIONS: Section[] = ["Nursery & Primary", "Secondary", "Vocational"];

const FEE_DATA: Record<Section, Array<{ level: string; amount: number }>> = {
  "Nursery & Primary": [
    { level: "Playgroup",        amount: 17000 },
    { level: "Kindergarten 1–2", amount: 19000 },
    { level: "Nursery 1–2",      amount: 21000 },
    { level: "Primary 1–5",      amount: 23000 },
  ],
  "Secondary": [
    { level: "JSS 1–3 (College)", amount: 36000 },
    { level: "SSS 1–3 (College)", amount: 40000 },
  ],
  "Vocational": [
    { level: "JSS 1–3 (School of Science)", amount: 50000 },
  ],
};

function fmt(n: number) { return "₦" + n.toLocaleString("en-NG"); }

const IslamicPattern = ({ id }: { id: string }) => (
  <svg aria-hidden className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.05]" xmlns="http://www.w3.org/2000/svg">
    <defs><pattern id={id} x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse"><polygon points="40,4 47,20 62,13 55,28 72,35 55,42 62,57 47,50 40,66 33,50 18,57 25,42 8,35 25,28 18,13 33,20" fill="none" stroke="white" strokeWidth="0.7" /></pattern></defs>
    <rect width="100%" height="100%" fill={`url(#${id})`} />
  </svg>
);

export default function FeesPage() {
  const [activeSection, setActiveSection] = useState<Section>("Nursery & Primary");
  const [calcSection,   setCalcSection]   = useState<Section>("Nursery & Primary");
  const [calcLevel,     setCalcLevel]     = useState(0);
  const [numChildren,   setNumChildren]   = useState(1);

  const fees      = FEE_DATA[activeSection];
  const calcFees  = FEE_DATA[calcSection];
  const perTerm   = (calcFees[calcLevel]?.amount ?? 0) * numChildren;
  const perSession = perTerm * 3;

  const selectStyle: React.CSSProperties = {
    padding: "10px 12px",
    borderRadius: 12,
    background: "rgba(255,255,255,0.08)",
    border: "1px solid rgba(255,255,255,0.15)",
    fontSize: 14,
    color: "#fff",
    width: "100%",
    outline: "none",
    fontFamily: "var(--font-body, sans-serif)",
  };

  return (
    <div style={{ background: "#F7F5F1" }} className="min-h-screen">

      {/* Hero */}
      <section className="relative h-[50vh] min-h-64 flex items-center overflow-hidden" style={{ background: "#0B1F3A" }}>
        <IslamicPattern id="feep" />
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
            style={{ color: "#2196C4", fontFamily: "var(--font-body, sans-serif)" }}>Transparent Pricing</p>
          <h1 className="text-4xl sm:text-5xl font-bold text-white leading-tight mb-3"
            style={{ fontFamily: "var(--font-display, 'Cormorant Garamond', serif)" }}>
            Fees & <span className="italic" style={{ color: "#3BADD9" }}>Charges</span>
          </h1>
          <p className="text-white/70 max-w-xl" style={{ fontFamily: "var(--font-body, sans-serif)" }}>
            Affordable excellence for every family. All fees are per term.
          </p>
        </motion.div>
      </section>

      {/* Fee Table */}
      <section className="py-20 md:py-24" style={{ background: "#F7F5F1" }}>
        <div className="max-w-4xl mx-auto px-6 sm:px-10">
          <div className="text-center mb-12">
            <p className="text-xs tracking-[0.14em] uppercase mb-3 font-medium flex items-center gap-3 justify-center"
              style={{ color: "#2196C4", fontFamily: "var(--font-body, sans-serif)" }}>
              <span className="w-8 h-px" style={{ background: "#2196C4" }} />Fee Schedule<span className="w-8 h-px" style={{ background: "#2196C4" }} />
            </p>
            <h2 className="text-3xl font-bold" style={{ color: "#0B1F3A", fontFamily: "var(--font-display, 'Cormorant Garamond', serif)" }}>
              Per-Term <span className="italic" style={{ color: "#2196C4" }}>Fee Structure</span>
            </h2>
            <p className="mt-3 text-sm" style={{ color: "#6B7280", fontFamily: "var(--font-body, sans-serif)" }}>
              Fees are charged per term (3 terms per session). Enquire about sibling discounts.
            </p>
            <div className="w-12 h-0.5 rounded-full mx-auto mt-4" style={{ background: "#2196C4" }} />
          </div>

          {/* Tab switcher */}
          <div className="flex gap-2 mb-10 rounded-full p-1 w-fit mx-auto"
            style={{ background: "#fff", border: "1px solid #E5E7EB" }}>
            {SECTIONS.map((s) => (
              <button key={s} onClick={() => setActiveSection(s)}
                className="px-4 sm:px-5 py-2 rounded-full text-sm font-medium transition-all duration-200"
                style={{
                  background: activeSection === s ? "#2196C4" : "transparent",
                  color: activeSection === s ? "#fff" : "#6B7280",
                  boxShadow: activeSection === s ? "0 2px 8px rgba(33,150,196,0.3)" : "none",
                  fontFamily: "var(--font-body, sans-serif)",
                }}>
                {s}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div key={activeSection} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}
              className="bg-white rounded-2xl overflow-hidden" style={{ border: "1px solid #E5E7EB" }}>
              <table className="w-full">
                <thead>
                  <tr style={{ background: "#0B1F3A" }}>
                    <th className="text-left px-6 py-4 text-sm font-medium text-white" style={{ fontFamily: "var(--font-body, sans-serif)" }}>Level / Class</th>
                    <th className="text-right px-6 py-4 text-sm font-medium text-white" style={{ fontFamily: "var(--font-body, sans-serif)" }}>Fee per Term</th>
                  </tr>
                </thead>
                <tbody>
                  {fees.map((row, i) => (
                    <tr key={i} style={{ borderTop: "1px solid #F3F4F6" }}>
                      <td className="px-6 py-4 text-sm flex items-center gap-2" style={{ color: "#4B5563", fontFamily: "var(--font-body, sans-serif)" }}>
                        <CheckCircle size={13} style={{ color: "#2196C4" }} className="shrink-0" />{row.level}
                      </td>
                      <td className="px-6 py-4 text-sm text-right font-bold" style={{ color: "#0B1F3A", fontFamily: "var(--font-body, sans-serif)" }}>{fmt(row.amount)}</td>
                    </tr>
                  ))}
                  <tr style={{ background: "rgba(33,150,196,0.06)", borderTop: "2px solid rgba(33,150,196,0.2)" }}>
                    <td className="px-6 py-4 text-sm font-bold" style={{ color: "#0B1F3A", fontFamily: "var(--font-body, sans-serif)" }}>Approximate Per Session</td>
                    <td className="px-6 py-4 text-sm text-right font-bold" style={{ color: "#2196C4", fontFamily: "var(--font-body, sans-serif)" }}>
                      {fmt(fees.reduce((a, r) => a + r.amount, 0) * 3 / fees.length)} avg.
                    </td>
                  </tr>
                </tbody>
              </table>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* Calculator */}
      <section className="py-16 relative overflow-hidden" style={{ background: "#0B1F3A" }}>
        <IslamicPattern id="calcp" />
        <div className="relative z-10 max-w-3xl mx-auto px-6 sm:px-10">
          <div className="text-center mb-10">
            <p className="text-xs tracking-[0.14em] uppercase mb-3 font-medium flex items-center gap-3 justify-center"
              style={{ color: "#3BADD9", fontFamily: "var(--font-body, sans-serif)" }}>
              <span className="w-8 h-px" style={{ background: "#3BADD9" }} />Fee Calculator<span className="w-8 h-px" style={{ background: "#3BADD9" }} />
            </p>
            <h2 className="text-3xl font-bold text-white" style={{ fontFamily: "var(--font-display, 'Cormorant Garamond', serif)" }}>
              Estimate Your Fees
            </h2>
            <p className="mt-3 text-sm" style={{ color: "rgba(255,255,255,0.6)", fontFamily: "var(--font-body, sans-serif)" }}>
              Select your section, level, and number of children.
            </p>
          </div>
          <div className="rounded-2xl p-8 space-y-6"
            style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(33,150,196,0.25)" }}>
            <div className="grid sm:grid-cols-3 gap-4">
              <label className="flex flex-col gap-1.5">
                <span className="text-xs uppercase tracking-wide" style={{ color: "rgba(255,255,255,0.6)", fontFamily: "var(--font-body, sans-serif)" }}>Section</span>
                <select value={calcSection} onChange={(e) => { setCalcSection(e.target.value as Section); setCalcLevel(0); }} style={selectStyle}>
                  {SECTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </label>
              <label className="flex flex-col gap-1.5">
                <span className="text-xs uppercase tracking-wide" style={{ color: "rgba(255,255,255,0.6)", fontFamily: "var(--font-body, sans-serif)" }}>Level</span>
                <select value={calcLevel} onChange={(e) => setCalcLevel(Number(e.target.value))} style={selectStyle}>
                  {FEE_DATA[calcSection].map((r, i) => <option key={i} value={i}>{r.level}</option>)}
                </select>
              </label>
              <label className="flex flex-col gap-1.5">
                <span className="text-xs uppercase tracking-wide" style={{ color: "rgba(255,255,255,0.6)", fontFamily: "var(--font-body, sans-serif)" }}>Children</span>
                <select value={numChildren} onChange={(e) => setNumChildren(Number(e.target.value))} style={selectStyle}>
                  {[1,2,3,4,5].map((n) => <option key={n} value={n}>{n} {n===1?"child":"children"}</option>)}
                </select>
              </label>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="rounded-xl p-5 text-center" style={{ background: "rgba(255,255,255,0.08)" }}>
                <p className="text-xs uppercase tracking-wide mb-2" style={{ color: "rgba(255,255,255,0.5)", fontFamily: "var(--font-body, sans-serif)" }}>Per Term</p>
                <p className="text-white text-3xl font-bold" style={{ fontFamily: "var(--font-display, serif)" }}>{fmt(perTerm)}</p>
              </div>
              <div className="rounded-xl p-5 text-center"
                style={{ background: "rgba(33,150,196,0.12)", border: "1px solid rgba(33,150,196,0.3)" }}>
                <p className="text-xs uppercase tracking-wide mb-2" style={{ color: "rgba(59,173,217,0.7)", fontFamily: "var(--font-body, sans-serif)" }}>Per Session (3 terms)</p>
                <p className="text-3xl font-bold" style={{ color: "#3BADD9", fontFamily: "var(--font-display, serif)" }}>{fmt(perSession)}</p>
              </div>
            </div>
            <p className="text-xs text-center" style={{ color: "rgba(255,255,255,0.35)", fontFamily: "var(--font-body, sans-serif)" }}>
              Estimates only. Contact school for exact fees and sibling discounts.
            </p>
          </div>
        </div>
      </section>

      {/* Payment info */}
      <section className="py-16" style={{ background: "#fff" }}>
        <div className="max-w-4xl mx-auto px-6 sm:px-10">
          <ScrollReveal>
            <div className="bg-white rounded-2xl p-8 flex flex-col md:flex-row items-center gap-8"
              style={{ border: "1px solid #E5E7EB" }}>
              <div className="flex-1">
                <h3 className="text-xl font-bold mb-3" style={{ color: "#0B1F3A", fontFamily: "var(--font-body, sans-serif)" }}>Payment Methods</h3>
                <ul className="space-y-2 text-sm" style={{ color: "#6B7280" }}>
                  {["Direct bank transfer", "Cash at school office", "Mobile transfer (confirmation required)"].map((m) => (
                    <li key={m} className="flex items-center gap-2" style={{ fontFamily: "var(--font-body, sans-serif)" }}>
                      <CheckCircle size={13} style={{ color: "#2196C4" }} />{m}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="text-center">
                <p className="text-sm mb-4" style={{ color: "#6B7280", fontFamily: "var(--font-body, sans-serif)" }}>Questions about fees?</p>
                <a href={SCHOOL.whatsappUrl} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-bold text-sm text-white hover:-translate-y-0.5 transition-all"
                  style={{ background: "#25D366" }}>
                  Chat on WhatsApp
                </a>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
