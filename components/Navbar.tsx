// components/Navbar.tsx
"use client";

import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const menuVariants = {
    closed: {
      opacity: 0,
      height: 0,
      transition: { duration: 0.3, ease: "easeInOut" }
    },
    open: {
      opacity: 1,
      height: "auto",
      transition: { duration: 0.4, ease: "easeOut" }
    }
  };

  const itemVariants = {
    closed: { opacity: 0, x: -20 },
    open: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: { delay: i * 0.1 }
    })
  };

  const navItems = [
    { href: "/about", label: "About" },
    { href: "/admissions", label: "Admissions" },
    { href: "/news", label: "News" },
    { href: "/alumni", label: "Alumni" },
    { href: "/contact", label: "Contact" },
    { href: "/login", label: "Portal Login", isCta: true }
  ];

  return (
    <nav className="bg-[#1E3A8A] text-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl">🏛️</span>
          <div className="flex flex-col">
            <span className="font-bold text-lg leading-tight">CRESCENT ACADEMY</span>
            <span className="text-[10px] uppercase tracking-widest text-[#0EA5E9]">
              Authentic Education
            </span>
          </div>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          {navItems.map((item) =>
            item.isCta ? (
              <Link
                key={item.href}
                href={item.href}
                className="bg-[#0EA5E9] hover:bg-[#0284C7] px-5 py-2 rounded-full font-bold transition-all shadow-md"
              >
                {item.label}
              </Link>
            ) : (
              <Link
                key={item.href}
                href={item.href}
                className="hover:text-[#0EA5E9] transition-colors font-medium"
              >
                {item.label}
              </Link>
            )
          )}
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden text-3xl focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          {isOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* Mobile Menu with Framer Motion */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
  className="md:hidden bg-[#1E3A8A] overflow-hidden"
  
  initial="closed"
  animate="open"
  exit="closed"
>
            <div className="px-6 py-6 flex flex-col gap-5">
              {navItems.map((item, index) =>
                item.isCta ? (
                  <motion.div key={item.href} variants={itemVariants} custom={index}>
                    <Link
                      href={item.href}
                      className="block bg-[#0EA5E9] hover:bg-[#0284C7] px-6 py-3 rounded-full font-bold text-center transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      {item.label}
                    </Link>
                  </motion.div>
                ) : (
                  <motion.div key={item.href} variants={itemVariants} custom={index}>
                    <Link
                      href={item.href}
                      className="block hover:text-[#0EA5E9] transition-colors text-lg font-medium"
                      onClick={() => setIsOpen(false)}
                    >
                      {item.label}
                    </Link>
                  </motion.div>
                )
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;