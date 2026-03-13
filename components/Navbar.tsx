// components/Navbar.tsx
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
    <header className="sticky top-0 z-50 w-full">
      {/* Top Contact Bar – subtle glass effect */}
      <div className="bg-[#0F2A5E]/95 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex flex-wrap items-center justify-between gap-4 text-white text-sm">
          <div className="flex items-center gap-6 sm:gap-8">
            <a
              href="tel:+2348031234567"
              className="flex items-center gap-2 hover:text-[#0EA5E9] transition-colors duration-200"
            >
              <Phone size={16} className="opacity-90" />
              (+234) 803 254 5074
            </a>
            <a
              href="mailto:info@crescentacademy.edu.ng"
              className="flex items-center gap-2 hover:text-[#0EA5E9] transition-colors duration-200"
            >
              <Mail size={16} className="opacity-90" />
              info@crescentacademy.edu.ng
            </a>
          </div>

          {/* Desktop Portal Button */}
          <Link
            href="/portals"
            className="hidden sm:inline-flex items-center px-6 py-2 bg-[#0EA5E9] hover:bg-[#0284C7] text-white font-medium rounded-full shadow-md hover:shadow-lg transition-all duration-300 text-sm"
          >
            Portal Login
          </Link>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="bg-[#1E3A8A]/95 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
           {/* Logo */}
<Link href="/" className="flex items-center gap-3 group">
  {/* Logo Image – always visible */}
  <img
    src="/logo.png"           // your working logo path
    alt="Crescent Academy"
    className="h-9 w-auto object-contain sm:h-10 group-hover:scale-105 transition-transform duration-300"
  />
  
  {/* School Name – visible on all screens now */}
  <div className="flex flex-col">
    <span className="font-extrabold text-lg sm:text-xl md:text-2xl tracking-tight text-white leading-none">
      CRESCENT
    </span>
    <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-widest text-[#0EA5E9]/90">
      ACADEMY
    </span>
  </div>
</Link>

            {/* Desktop Links */}
            <div className="hidden lg:flex items-center gap-8 text-white font-medium">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="relative py-2 px-1 text-white/90 hover:text-white transition-colors duration-200 after:absolute after:bottom-0 after:left-0 after:h-0.5 after:bg-[#0EA5E9] after:w-0 hover:after:w-full after:transition-all after:duration-300"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Mobile Controls */}
            <div className="flex items-center gap-4 lg:hidden">
              <Link
                href="/portals"
                className="inline-flex items-center px-5 py-2 bg-[#0EA5E9] hover:bg-white hover:text-[#1E3A8A] text-white hover:shadow-md rounded-full text-sm font-medium transition-all duration-300"
              >
                Portal
              </Link>

              <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-white p-2 rounded-lg hover:bg-white/10 transition-colors"
                aria-label="Toggle menu"
              >
                {isOpen ? <X size={28} /> : <Menu size={28} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {isOpen && (
          <div className="lg:hidden bg-[#1E3A8A]/95 backdrop-blur-md border-t border-white/10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 flex flex-col gap-5 text-white text-lg font-medium">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="py-3 px-4 hover:bg-white/10 rounded-xl transition-colors duration-200 flex items-center justify-between"
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                  <span className="text-[#0EA5E9] text-xl opacity-70">→</span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}