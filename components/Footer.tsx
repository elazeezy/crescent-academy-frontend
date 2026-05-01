"use client";

import { useState } from "react";
import { MapPin, Phone, Mail, Facebook, Instagram, Twitter, Youtube, ArrowRight, Heart } from "lucide-react";
import Link from "next/link";

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

const socials = [
  { icon: Facebook,  label: "Facebook",  href: "#" },
  { icon: Instagram, label: "Instagram", href: "#" },
  { icon: Twitter,   label: "Twitter/X", href: "#" },
  { icon: Youtube,   label: "YouTube",   href: "#" },
];

export default function Footer() {
  const [email, setEmail] = useState("");
  const [sent,  setSent]  = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) { setSent(true); setEmail(""); }
  };

  return (
    <footer className="bg-[#0F1E4A] text-white relative overflow-hidden">

      {/* Ambient glows */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-[#0EA5E9]/8 rounded-full blur-[100px]" />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-[#1E3A8A]/30 rounded-full blur-[80px]" />
      </div>

      {/* ── Newsletter strip ── */}
      <div className="relative border-b border-white/10 bg-[#1E3A8A]/40">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 py-10 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <p className="text-[#0EA5E9] text-xs font-bold uppercase tracking-widest mb-1">Stay Updated</p>
            <h3 className="text-xl sm:text-2xl font-extrabold tracking-tight">Get School News & Announcements</h3>
          </div>
          <form
            onSubmit={handleSubscribe}
            className="flex gap-2 w-full sm:w-auto min-w-0 sm:min-w-[360px]"
          >
            {sent ? (
              <p className="text-emerald-400 font-semibold text-sm py-2">
                ✓ Thank you! We'll keep you informed.
              </p>
            ) : (
              <>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  required
                  className="flex-1 bg-white/10 border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-[#0EA5E9]/40 focus:bg-white/15 transition min-w-0"
                />
                <button
                  type="submit"
                  className="shrink-0 flex items-center gap-1.5 bg-[#0EA5E9] hover:bg-[#0284C7] text-white font-bold px-5 py-2.5 rounded-xl text-sm transition-all duration-200 hover:scale-105"
                >
                  Subscribe <ArrowRight size={14} />
                </button>
              </>
            )}
          </form>
        </div>
      </div>

      {/* ── Main footer body ── */}
      <div className="relative max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 py-16 md:py-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">

          {/* Col 1 — Brand */}
          <div className="sm:col-span-2 lg:col-span-1 space-y-5">
            <Link href="/" className="inline-flex items-center gap-3 group">
              <img
                src="/logo.png"
                alt="The Crescent Academy"
                className="h-11 w-auto object-contain group-hover:scale-105 transition-transform duration-300"
                onError={e => { e.currentTarget.style.display = "none"; }}
              />
              <div>
                <p className="text-[#0145F2]/60 text-[8px] uppercase tracking-[0.3em] font-black leading-none">THE</p>
                <h3 className="font-black text-xl tracking-tight leading-none">CRESCENT</h3>
                <p className="text-[#0145F2]/70 text-[10px] uppercase tracking-[0.35em] font-bold mt-0.5">ACADEMY</p>
              </div>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
              Nurturing the Complete Child through academic excellence, authentic Islamic values, and strong moral character — since 2010.
            </p>

            {/* Social icons */}
            <div className="flex gap-3 pt-1">
              {socials.map(({ icon: Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-9 h-9 rounded-xl bg-white/8 border border-white/10 flex items-center justify-center text-slate-400 hover:text-[#0EA5E9] hover:bg-[#0EA5E9]/10 hover:border-[#0EA5E9]/30 transition-all duration-200 hover:scale-110"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Col 2 — Quick Links */}
          <div>
            <h4 className="font-bold text-sm uppercase tracking-widest text-white/60 mb-5">Quick Links</h4>
            <ul className="space-y-2.5">
              {quickLinks.map(link => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-400 hover:text-white flex items-center gap-2 group transition-colors duration-200"
                  >
                    <span className="w-1 h-1 rounded-full bg-[#0EA5E9]/50 group-hover:bg-[#0EA5E9] transition-colors shrink-0" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3 — More */}
          <div>
            <h4 className="font-bold text-sm uppercase tracking-widest text-white/60 mb-5">Explore</h4>
            <ul className="space-y-2.5">
              {moreLinks.map(link => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-400 hover:text-white flex items-center gap-2 group transition-colors duration-200"
                  >
                    <span className="w-1 h-1 rounded-full bg-[#0EA5E9]/50 group-hover:bg-[#0EA5E9] transition-colors shrink-0" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4 — Contact */}
          <div>
            <h4 className="font-bold text-sm uppercase tracking-widest text-white/60 mb-5">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-sm text-slate-400">
                <MapPin size={16} className="mt-0.5 shrink-0 text-[#0EA5E9]/70" />
                <span className="leading-relaxed">
                  Panada Area, Beside Car Wash,<br />
                  Along Water Works, Iwo,<br />
                  Osun State, Nigeria
                </span>
              </li>
              <li>
                <a
                  href="tel:+2348032545074"
                  className="flex items-center gap-3 text-sm text-slate-400 hover:text-white transition-colors group"
                >
                  <Phone size={15} className="text-[#0EA5E9]/70 group-hover:text-[#0EA5E9] transition-colors shrink-0" />
                  (+234) 803 254 5074
                </a>
              </li>
              <li>
                <a
                  href="mailto:info@crescentacademy.edu.ng"
                  className="flex items-center gap-3 text-sm text-slate-400 hover:text-white transition-colors group"
                >
                  <Mail size={15} className="text-[#0EA5E9]/70 group-hover:text-[#0EA5E9] transition-colors shrink-0" />
                  <span className="break-all">info@crescentacademy.edu.ng</span>
                </a>
              </li>
            </ul>

            {/* WhatsApp CTA */}
            <a
              href="https://wa.me/2348032545074"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex items-center gap-2 bg-emerald-500/15 border border-emerald-500/25 text-emerald-400 hover:bg-emerald-500/25 hover:text-emerald-300 px-4 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 hover:scale-105"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Chat on WhatsApp
            </a>
          </div>
        </div>
      </div>

      {/* ── Bottom bar ── */}
      <div className="relative border-t border-white/8 bg-[#0a1628]/60">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Crescent Academy, Iwo. All rights reserved.</p>
          <p className="flex items-center gap-1.5">
            Built with <Heart size={11} className="text-red-400 fill-red-400" /> for authentic education
          </p>
        </div>
      </div>
    </footer>
  );
}
