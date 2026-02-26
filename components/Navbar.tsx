// components/Navbar.tsx (updated – fewer links)
"use client";

import { useState } from "react";
import Link from "next/link";
import { Phone, Mail, Menu, X } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { href: "/about", label: "About" },
    { href: "/admissions", label: "Admissions" },
    { href: "/structure", label: "Structure" },
    { href: "/leadership", label: "Leadership" },
    { href: "/policies", label: "Policies" },
    { href: "/achievements", label: "Achievements" },
    { href: "/fees", label: "Fees" },
    { href: "/alumni", label: "Alumni" },
    { href: "/portals", label: "Portals" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#1E3A8A] shadow-md">
      {/* Top Contact Bar */}
      <div className="bg-[#0F2A5E] text-white text-sm">
        <div className="container mx-auto px-4 py-2 flex flex-wrap justify-center sm:justify-between items-center gap-4">
          <div className="flex items-center gap-6 flex-wrap justify-center">
            <a href="tel:+2348031234567" className="flex items-center gap-2 hover:text-[#0EA5E9]">
              <Phone size={16} /> (+234) 803 123 4567
            </a>
            <a href="mailto:info@crescentacademy.edu.ng" className="flex items-center gap-2 hover:text-[#0EA5E9]">
              <Mail size={16} /> info@crescentacademy.edu.ng
            </a>
          </div>

          <Link
            href="/portals"
            className="hidden sm:block bg-[#0EA5E9] hover:bg-[#0284C7] px-5 py-1.5 rounded-full font-medium transition-all"
          >
            Portal Login
          </Link>
        </div>
      </div>

      {/* Main Nav */}
      <nav className="bg-[#1E3A8A]">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <span className="text-3xl">🏛️</span>
            <div className="flex flex-col">
              <span className="font-bold text-xl leading-tight">CRESCENT ACADEMY</span>
              <span className="text-xs uppercase tracking-widest text-[#0EA5E9]">
                AUTHENTIC EDUCATION
              </span>
            </div>
          </Link>

          {/* Desktop Links – reduced */}
          <div className="hidden lg:flex items-center gap-8 text-white">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="hover:text-[#0EA5E9] transition-colors font-medium"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Mobile */}
          <div className="flex items-center gap-4 lg:hidden">
            <Link
              href="/portals"
              className="bg-[#0EA5E9] hover:bg-white hover:text-[#1E3A8A] px-4 py-2 rounded-full text-sm font-medium transition-all"
            >
              Portal
            </Link>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-white text-3xl focus:outline-none"
              aria-label="Toggle menu"
            >
              {isOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="lg:hidden bg-[#1E3A8A] border-t border-[#0EA5E9]/30">
            <div className="px-6 py-6 flex flex-col gap-5 text-white">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="hover:text-[#0EA5E9] transition-colors text-lg"
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}