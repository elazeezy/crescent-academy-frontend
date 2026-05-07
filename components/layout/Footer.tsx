"use client";

import { useState } from "react";
import Link from "next/link";
import { MapPin, Phone, Mail, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import PrayerTimes from "@/components/ui/PrayerTimes";
import { SCHOOL } from "@/lib/constants";

const quickLinks = [
  { href: "/about",        label: "About Us" },
  { href: "/admissions",   label: "Admissions" },
  { href: "/structure",    label: "School Structure" },
  { href: "/leadership",   label: "Leadership" },
  { href: "/achievements", label: "Achievements" },
  { href: "/fees",         label: "Fees & Charges" },
];

const moreLinks = [
  { href: "/policies",  label: "School Policies" },
  { href: "/alumni",    label: "Alumni" },
  { href: "/gallery",   label: "Gallery" },
  { href: "/news",      label: "News & Events" },
  { href: "/portals",   label: "Student Portals" },
  { href: "/contact",   label: "Contact Us" },
];

const WHATSAPP_SVG = (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

export default function Footer() {
  const [email, setEmail] = useState("");
  const [sent,  setSent]  = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) { setSent(true); setEmail(""); }
  };

  const linkStyle = {
    color: "#9A9389",
    fontFamily: "var(--font-body, 'Plus Jakarta Sans', sans-serif)",
    fontSize: 14,
    transition: "color 0.2s ease",
  };

  const headingStyle = {
    color: "#9A9389",
    fontFamily: "var(--font-body, 'Plus Jakarta Sans', sans-serif)",
    fontSize: 11,
    fontWeight: 600,
    letterSpacing: "0.1em",
    textTransform: "uppercase" as const,
    marginBottom: 20,
  };

  return (
    <footer style={{ background: "#060E1C", color: "#fff", position: "relative", overflow: "hidden" }}>
      {/* Subtle dot grid watermark */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none select-none"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.03) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />

      {/* Prayer Times Strip — navy-800 bg */}
      <div style={{ background: "#112847", position: "relative", zIndex: 1 }}>
        <PrayerTimes />
      </div>

      {/* Newsletter */}
      <div
        style={{
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          background: "rgba(17,40,71,0.5)",
          position: "relative",
          zIndex: 1,
        }}
      >
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 py-10 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <p
              className="text-xs font-medium uppercase tracking-widest mb-1"
              style={{ color: "#2196C4", fontFamily: "var(--font-body, sans-serif)" }}
            >
              Stay Updated
            </p>
            <h3
              className="text-xl sm:text-2xl font-semibold text-white"
              style={{ fontFamily: "var(--font-display, 'Cormorant Garamond', serif)" }}
            >
              Get School News & Announcements
            </h3>
          </div>
          <form onSubmit={handleSubscribe} className="flex gap-2 w-full sm:w-auto min-w-0 sm:min-w-[360px]">
            {sent ? (
              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="font-medium text-sm py-2"
                style={{ color: "#3BADD9", fontFamily: "var(--font-body, sans-serif)" }}
              >
                ✓ Thank you! We&apos;ll keep you informed.
              </motion.p>
            ) : (
              <>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  required
                  aria-label="Email for newsletter"
                  className="flex-1 rounded-full px-4 py-2.5 text-sm text-white placeholder:text-white/35 focus:outline-none transition min-w-0"
                  style={{
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    fontFamily: "var(--font-body, sans-serif)",
                  }}
                  onFocus={e => { e.currentTarget.style.borderColor = "rgba(33,150,196,0.5)"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(33,150,196,0.1)"; }}
                  onBlur={e  => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";  e.currentTarget.style.boxShadow = "none"; }}
                />
                <button
                  type="submit"
                  className="shrink-0 flex items-center gap-1.5 font-semibold px-5 py-2.5 rounded-full text-sm transition-all hover:scale-105"
                  style={{
                    background: "#2196C4",
                    color: "#fff",
                    fontFamily: "var(--font-body, sans-serif)",
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = "#3BADD9")}
                  onMouseLeave={e => (e.currentTarget.style.background = "#2196C4")}
                >
                  Subscribe <ArrowRight size={14} />
                </button>
              </>
            )}
          </form>
        </div>
      </div>

      {/* Main body */}
      <div className="relative max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 py-16 md:py-20" style={{ zIndex: 1 }}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">

          {/* Col 1 — Brand */}
          <div className="sm:col-span-2 lg:col-span-1 space-y-5">
            <Link href="/" className="inline-flex items-center gap-3 group" aria-label="Home">
              <svg viewBox="0 0 36 36" fill="none" className="w-9 h-9 shrink-0">
                <path d="M18 4 A14 14 0 1 1 18 32 A10 10 0 1 0 18 4 Z" fill="#C4973A" />
                <circle cx="25" cy="10" r="2.5" fill="#C4973A" />
                <circle cx="28" cy="16" r="1.5" fill="#C4973A" />
              </svg>
              <div>
                <p
                  className="font-bold text-lg leading-none text-white"
                  style={{ fontFamily: "var(--font-display, 'Cormorant Garamond', serif)" }}
                >
                  The Crescent Academy
                </p>
                <p
                  className="text-[9px] tracking-[0.25em] uppercase mt-0.5"
                  style={{ color: "#9A9389" }}
                >
                  Iwo · Est. 2010
                </p>
              </div>
            </Link>
            <p
              className="text-sm leading-relaxed max-w-xs"
              style={{ color: "rgba(255,255,255,0.45)", fontFamily: "var(--font-body, sans-serif)" }}
            >
              Nurturing the Complete Child through academic excellence, authentic Islamic values, and strong moral character — since 2010.
            </p>
            <a
              href={SCHOOL.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-2 px-4 py-2.5 rounded-full text-xs font-medium transition-all hover:scale-105"
              style={{
                background: "rgba(37,211,102,0.12)",
                border: "1px solid rgba(37,211,102,0.2)",
                color: "#4ade80",
                fontFamily: "var(--font-body, sans-serif)",
              }}
            >
              {WHATSAPP_SVG}
              Chat on WhatsApp
            </a>
          </div>

          {/* Col 2 — Quick Links */}
          <div>
            <p style={headingStyle}>Quick Links</p>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="flex items-center gap-2 group"
                    style={linkStyle}
                    onMouseEnter={e => (e.currentTarget.style.color = "#3BADD9")}
                    onMouseLeave={e => (e.currentTarget.style.color = "#9A9389")}
                  >
                    <span
                      className="w-1 h-1 rounded-full shrink-0 transition-colors"
                      style={{ background: "rgba(33,150,196,0.35)" }}
                    />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3 — Explore */}
          <div>
            <p style={headingStyle}>Explore</p>
            <ul className="space-y-2.5">
              {moreLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="flex items-center gap-2 group"
                    style={linkStyle}
                    onMouseEnter={e => (e.currentTarget.style.color = "#3BADD9")}
                    onMouseLeave={e => (e.currentTarget.style.color = "#9A9389")}
                  >
                    <span
                      className="w-1 h-1 rounded-full shrink-0 transition-colors"
                      style={{ background: "rgba(33,150,196,0.35)" }}
                    />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4 — Contact */}
          <div>
            <p style={headingStyle}>Contact Us</p>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin size={15} className="mt-0.5 shrink-0" style={{ color: "#2196C4" }} />
                <span
                  className="leading-relaxed"
                  style={{ ...linkStyle, fontSize: 13 }}
                >
                  Panada Area, Beside Car Wash,<br />
                  Along Water Works, Iwo,<br />
                  Osun State, Nigeria
                </span>
              </li>
              <li>
                <a
                  href={`tel:${SCHOOL.phone.replace(/\s/g, "")}`}
                  className="flex items-center gap-3"
                  style={linkStyle}
                  onMouseEnter={e => (e.currentTarget.style.color = "#3BADD9")}
                  onMouseLeave={e => (e.currentTarget.style.color = "#9A9389")}
                >
                  <Phone size={14} style={{ color: "#2196C4" }} className="shrink-0" />
                  {SCHOOL.phone}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${SCHOOL.email}`}
                  className="flex items-center gap-3"
                  style={linkStyle}
                  onMouseEnter={e => (e.currentTarget.style.color = "#3BADD9")}
                  onMouseLeave={e => (e.currentTarget.style.color = "#9A9389")}
                >
                  <Mail size={14} style={{ color: "#2196C4" }} className="shrink-0" />
                  <span className="break-all">{SCHOOL.email}</span>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div
        style={{
          borderTop: "1px solid rgba(255,255,255,0.06)",
          background: "rgba(17,40,71,0.3)",
          position: "relative",
          zIndex: 1,
        }}
      >
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p
            className="text-xs"
            style={{ color: "rgba(255,255,255,0.3)", fontFamily: "var(--font-body, sans-serif)" }}
          >
            © {new Date().getFullYear()} The Crescent Academy, Iwo. All rights reserved.
          </p>
          <p
            className="text-xs flex items-center gap-1.5"
            style={{ color: "rgba(255,255,255,0.3)", fontFamily: "var(--font-body, sans-serif)" }}
          >
            Built by{" "}
            <span style={{ color: "#3BADD9" }}>Webcore Agency</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
