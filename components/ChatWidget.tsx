"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, MessageCircle, Phone, Mail, MapPin, Clock, Send } from "lucide-react";

const faqs = [
  { q: "How do I apply for admission?", a: "Visit our Admissions page or call us. New intakes are in September each year. Requirements: birth certificate, last school report card, and passport photographs." },
  { q: "What levels do you offer?", a: "We offer Nursery & Primary, Secondary (Crescent College), and Vocational (Crescent School of Science) — all under one vision since 2010." },
  { q: "What are your school fees?", a: "Fees vary by level and term. Visit the Fees page for a full breakdown. Payment plans are available — contact us to discuss." },
  { q: "Is the school co-educational?", a: "Yes. Crescent Academy is a co-educational institution that maintains Islamic values, discipline, and a safe learning environment for all." },
  { q: "Where are you located?", a: "Panada Area, Beside Car Wash, Along Water Works, Iwo, Osun State, Nigeria." },
];

export default function ChatWidget() {
  const [open, setOpen]   = useState(false);
  const [tab, setTab]     = useState<"chat"|"contact">("chat");
  const [expanded, setExpanded] = useState<number|null>(null);
  const [msg, setMsg]     = useState("");
  const [sent, setSent]   = useState(false);

  const sendWA = () => {
    const text = msg.trim() || "Hello, I'd like to enquire about The Crescent Academy.";
    window.open(`https://wa.me/2348032545074?text=${encodeURIComponent(text)}`, "_blank");
    setSent(true);
    setMsg("");
    setTimeout(() => setSent(false), 3000);
  };

  return (
    <>
      {/* Floating bubble */}
      <div className="fixed bottom-6 right-5 z-50 flex flex-col items-end gap-3">
        <AnimatePresence>
          {!open && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
              className="bg-white text-slate-700 text-xs font-semibold px-3 py-1.5 rounded-full shadow-lg border border-slate-100 whitespace-nowrap">
              💬 How can we help?
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.95 }}
          onClick={() => setOpen(!open)}
          className="w-14 h-14 rounded-full bg-[#0145F2] shadow-xl shadow-[#0145F2]/35 flex items-center justify-center text-white relative"
        >
          <AnimatePresence mode="wait">
            {open
              ? <motion.div key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}><X size={22} /></motion.div>
              : <motion.div key="msg" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}><MessageCircle size={22} /></motion.div>
            }
          </AnimatePresence>
          {!open && <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white animate-pulse" />}
        </motion.button>
      </div>

      {/* Chat panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 20 }}
            transition={{ type: "spring", stiffness: 320, damping: 28 }}
            className="fixed bottom-24 right-5 z-50 w-[340px] max-w-[calc(100vw-2rem)] rounded-2xl shadow-2xl overflow-hidden border border-slate-100"
          >
            {/* Header */}
            <div className="bg-[#0145F2] px-5 py-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <img src="/logo.png" alt="" className="w-7 h-7 object-contain"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
              </div>
              <div>
                <p className="text-white font-black text-sm leading-none">The Crescent Academy</p>
                <p className="text-white/70 text-[11px] mt-0.5 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full inline-block" />
                  Online · Iwo, Osun State
                </p>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex bg-slate-50 border-b border-slate-100">
              {(["chat", "contact"] as const).map(t => (
                <button key={t} onClick={() => setTab(t)}
                  className={`flex-1 py-2.5 text-xs font-bold uppercase tracking-wide transition-colors ${tab === t ? "text-[#0145F2] border-b-2 border-[#0145F2] bg-white" : "text-slate-400 hover:text-slate-600"}`}>
                  {t === "chat" ? "💬 Quick Answers" : "📞 Contact Us"}
                </button>
              ))}
            </div>

            <div className="bg-white max-h-[340px] overflow-y-auto">
              {tab === "chat" && (
                <div className="p-4 space-y-2">
                  <p className="text-xs text-slate-400 font-semibold mb-3">Select a question or type below:</p>
                  {faqs.map((faq, i) => (
                    <div key={i} className="rounded-xl border border-slate-100 overflow-hidden">
                      <button onClick={() => setExpanded(expanded === i ? null : i)}
                        className="w-full text-left px-4 py-3 text-[0.8rem] font-bold text-slate-700 hover:bg-slate-50 transition-colors flex items-start justify-between gap-2">
                        <span>{faq.q}</span>
                        <span className="shrink-0 text-[#0145F2] font-black">{expanded === i ? "−" : "+"}</span>
                      </button>
                      <AnimatePresence>
                        {expanded === i && (
                          <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} transition={{ duration: 0.2 }}
                            className="overflow-hidden">
                            <p className="px-4 pb-3 text-xs text-slate-500 leading-relaxed border-t border-slate-50 pt-2">{faq.a}</p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
                </div>
              )}

              {tab === "contact" && (
                <div className="p-4 space-y-3">
                  <a href="tel:+2348032545074" className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 hover:border-[#0145F2]/20 hover:bg-[#0145F2]/3 transition-all group">
                    <div className="w-9 h-9 bg-[#0145F2]/10 rounded-lg flex items-center justify-center group-hover:bg-[#0145F2]/15 transition-colors">
                      <Phone size={16} className="text-[#0145F2]" />
                    </div>
                    <div>
                      <p className="text-[0.75rem] font-black text-slate-700">Call Us</p>
                      <p className="text-xs text-slate-400">(+234) 803 254 5074</p>
                    </div>
                  </a>
                  <a href="mailto:info@crescentacademy.edu.ng" className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 hover:border-[#0145F2]/20 hover:bg-[#0145F2]/3 transition-all group">
                    <div className="w-9 h-9 bg-[#0145F2]/10 rounded-lg flex items-center justify-center">
                      <Mail size={16} className="text-[#0145F2]" />
                    </div>
                    <div>
                      <p className="text-[0.75rem] font-black text-slate-700">Email Us</p>
                      <p className="text-xs text-slate-400">info@crescentacademy.edu.ng</p>
                    </div>
                  </a>
                  <div className="flex items-center gap-3 p-3 rounded-xl border border-slate-100">
                    <div className="w-9 h-9 bg-[#0145F2]/10 rounded-lg flex items-center justify-center">
                      <MapPin size={16} className="text-[#0145F2]" />
                    </div>
                    <div>
                      <p className="text-[0.75rem] font-black text-slate-700">Visit Us</p>
                      <p className="text-xs text-slate-400 leading-relaxed">Panada Area, Along Water Works, Iwo, Osun State</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-xl border border-slate-100">
                    <div className="w-9 h-9 bg-[#0145F2]/10 rounded-lg flex items-center justify-center">
                      <Clock size={16} className="text-[#0145F2]" />
                    </div>
                    <div>
                      <p className="text-[0.75rem] font-black text-slate-700">School Hours</p>
                      <p className="text-xs text-slate-400">Mon–Fri: 7:30am – 3:00pm</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer input */}
            <div className="border-t border-slate-100 bg-white p-3 flex gap-2">
              <input value={msg} onChange={e => setMsg(e.target.value)}
                onKeyDown={e => e.key === "Enter" && sendWA()}
                placeholder="Type a message..."
                className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0145F2]/30 focus:border-[#0145F2]/40 transition min-w-0" />
              <button onClick={sendWA}
                className="w-9 h-9 shrink-0 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white flex items-center justify-center transition-all hover:scale-105 shadow-md">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
              </button>
            </div>
            {sent && <p className="bg-emerald-50 text-emerald-600 text-xs font-bold text-center py-2">✓ Opening WhatsApp...</p>}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
