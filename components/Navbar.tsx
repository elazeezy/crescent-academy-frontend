"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Phone, Mail, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { href: "/about",        label: "About" },
  { href: "/admissions",   label: "Admissions" },
  { href: "/structure",    label: "Structure" },
  { href: "/leadership",   label: "Leadership" },
  { href: "/policies",     label: "Policies" },
  { href: "/achievements", label: "Achievements" },
  { href: "/fees",         label: "Fees" },
  { href: "/alumni",       label: "Alumni" },
  { href: "/contact",      label: "Contact" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => { setIsOpen(false); }, [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`sticky top-0 z-50 w-full transition-shadow duration-300 ${scrolled ? "shadow-[0_4px_30px_rgba(1,69,242,0.18)]" : ""}`}>

      {/* ── Top bar — colored, hides on scroll ── */}
      <div className={`overflow-hidden transition-all duration-500 ease-in-out ${scrolled ? "max-h-0 opacity-0 pointer-events-none" : "max-h-14 opacity-100"}`}>
        <div className="bg-[#0145F2]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex items-center justify-between gap-4 text-[#EDF1F5] text-xs sm:text-sm">
            <div className="flex items-center gap-5 sm:gap-8 min-w-0">
              <a href="tel:+2348032545074" className="flex items-center gap-1.5 hover:text-white transition-colors duration-200 font-medium">
                <Phone size={13} className="shrink-0" />
                <span className="hidden sm:inline">(+234) 803 254 5074</span>
              </a>
              <a href="mailto:info@crescentacademy.edu.ng" className="flex items-center gap-1.5 hover:text-white transition-colors duration-200 font-medium truncate">
                <Mail size={13} className="shrink-0" />
                <span className="hidden sm:inline">info@crescentacademy.edu.ng</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* ── Main nav — white ── */}
      <nav className="bg-white border-b border-slate-100 shadow-sm transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-[72px]">

            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group shrink-0">
              <img src="/logo.png" alt="The Crescent Academy" className="h-10 w-auto object-contain group-hover:scale-105 transition-transform duration-300"
                onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
              <div className="flex flex-col leading-none">
                <span className="text-[9px] font-black uppercase tracking-[0.3em] text-[#0145F2]/60">THE</span>
                <span className="font-black text-lg sm:text-xl tracking-tight text-[#0145F2]">CRESCENT</span>
                <span className="text-[8px] font-black uppercase tracking-[0.4em] text-slate-400 mt-0.5">ACADEMY</span>
              </div>
            </Link>

            {/* Desktop links */}
            <div className="hidden lg:flex items-center gap-0.5 xl:gap-1">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link key={link.href} href={link.href}
                    className={`relative px-3 py-2 text-[0.82rem] font-bold tracking-wide transition-colors duration-200 rounded-lg
                      ${isActive ? "text-[#0145F2] bg-[#0145F2]/6" : "text-slate-600 hover:text-[#0145F2] hover:bg-[#0145F2]/5"}`}
                  >
                    {link.label}
                    {isActive && <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-5 h-0.5 bg-[#0145F2] rounded-full" />}
                  </Link>
                );
              })}
            </div>

            {/* CTA + mobile toggle */}
            <div className="flex items-center gap-2 lg:hidden">
              <button onClick={() => setIsOpen(!isOpen)}
                className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                aria-label="Toggle menu" aria-expanded={isOpen}>
                <motion.div animate={{ rotate: isOpen ? 90 : 0 }} transition={{ duration: 0.2 }}>
                  {isOpen ? <X size={22} /> : <Menu size={22} />}
                </motion.div>
              </button>
            </div>

            {/* Desktop admission CTA */}
            <div className="hidden lg:flex items-center gap-2 ml-3">
              <Link href="/admissions"
                className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-[#0145F2] hover:bg-[#0030C9] text-white rounded-xl text-sm font-bold transition-all shadow-lg shadow-[#0145F2]/20 whitespace-nowrap hover:scale-105">
                Enroll Now
              </Link>
            </div>
          </div>
        </div>

        {/* ── Mobile dropdown ── */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="lg:hidden overflow-hidden border-t border-slate-100 bg-white"
            >
              <div className="max-w-7xl mx-auto px-4 py-3 grid grid-cols-2 gap-1.5">
                {navLinks.map((link, i) => {
                  const isActive = pathname === link.href;
                  return (
                    <motion.div key={link.href} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.03 }}>
                      <Link href={link.href}
                        className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                          isActive ? "bg-[#0145F2]/10 text-[#0145F2] border border-[#0145F2]/20" : "text-slate-600 hover:bg-slate-50 hover:text-[#0145F2]"
                        }`}>
                        {isActive && <span className="w-1.5 h-1.5 bg-[#0145F2] rounded-full shrink-0" />}
                        {link.label}
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
              <div className="border-t border-slate-100 px-4 py-3 flex items-center gap-6 text-xs text-slate-500 bg-slate-50">
                <a href="tel:+2348032545074" className="flex items-center gap-1.5 hover:text-[#0145F2] transition-colors font-medium">
                  <Phone size={12} /> 0803 254 5074
                </a>
                <a href="mailto:info@crescentacademy.edu.ng" className="flex items-center gap-1.5 hover:text-[#0145F2] transition-colors font-medium truncate">
                  <Mail size={12} /> info@crescentacademy.edu.ng
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
}
