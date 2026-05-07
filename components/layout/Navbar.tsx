"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Sun, Moon, ChevronDown, GraduationCap, Users, BookOpen } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/components/providers/ThemeProvider";

const mainLinks = [
  { href: "/",             label: "Home" },
  { href: "/about",        label: "About" },
  { href: "/admissions",   label: "Admissions" },
  { href: "/structure",    label: "Structure" },
  { href: "/leadership",   label: "Leadership" },
  { href: "/achievements", label: "Achievements" },
  { href: "/fees",         label: "Fees" },
  { href: "/gallery",      label: "Gallery" },
  { href: "/news",         label: "News" },
  { href: "/contact",      label: "Contact" },
];

const portalLinks = [
  { href: "/portals/dashboard/student", label: "Student Portal", icon: GraduationCap, desc: "View results & announcements" },
  { href: "/portals/dashboard/teacher", label: "Teacher Portal", icon: BookOpen,       desc: "Manage results & classes" },
  { href: "/portals/dashboard/admin",   label: "Admin Portal",   icon: Users,          desc: "School administration" },
];

export default function Navbar() {
  const [isOpen,     setIsOpen]     = useState(false);
  const [scrolled,   setScrolled]   = useState(false);
  const [portalOpen, setPortalOpen] = useState(false);
  const pathname = usePathname();
  const { theme, toggle } = useTheme();

  useEffect(() => { setIsOpen(false); setPortalOpen(false); }, [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  const isHome = pathname === "/";
  const solid  = scrolled || !isHome;

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(href + "/");

  return (
    <header className="sticky top-0 z-50 w-full">
      <nav
        style={{
          transition: "all 0.4s ease",
          background: solid ? "rgba(11,31,58,0.97)" : "transparent",
          backdropFilter: solid ? "blur(20px)" : "none",
          WebkitBackdropFilter: solid ? "blur(20px)" : "none",
          boxShadow: solid ? "0 1px 0 rgba(255,255,255,0.06)" : "none",
        }}
      >
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">
          <div
            className="flex items-center justify-between"
            style={{ height: solid ? 64 : 72, transition: "height 0.4s ease" }}
          >
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group shrink-0" aria-label="The Crescent Academy home">
              <img
                src="/logo.png"
                alt="The Crescent Academy Logo"
                className="w-10 h-10 object-contain shrink-0 drop-shadow-sm"
              />
              <div className="flex flex-col leading-none">
                <span
                  className="font-bold text-[15px] sm:text-[16px] text-white tracking-wide leading-none"
                  style={{ fontFamily: "var(--font-display, 'Cormorant Garamond', Georgia, serif)" }}
                >
                  The Crescent Academy
                </span>
                <span
                  className="text-[9px] tracking-[0.25em] uppercase mt-0.5"
                  style={{ color: "#9A9389" }}
                >
                  IWO · EST. 2010
                </span>
              </div>
            </Link>

            {/* Desktop links */}
            <div className="hidden xl:flex items-center gap-0.5">
              {mainLinks.map((link) => {
                const active = isActive(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="relative px-3 py-2 text-[0.8rem] font-medium tracking-wide rounded-lg"
                    style={{
                      fontFamily: "var(--font-body, 'Plus Jakarta Sans', sans-serif)",
                      letterSpacing: "0.06em",
                      color: active ? "#3BADD9" : "rgba(255,255,255,0.8)",
                      transition: "color 0.2s ease",
                    }}
                    onMouseEnter={e => { if (!active) e.currentTarget.style.color = "#fff"; }}
                    onMouseLeave={e => { if (!active) e.currentTarget.style.color = "rgba(255,255,255,0.8)"; }}
                  >
                    {link.label}
                    {active && (
                      <motion.span
                        layoutId="nav-indicator"
                        className="absolute bottom-0 left-1/2 -translate-x-1/2 rounded-full"
                        style={{ width: 20, height: 2, background: "#2196C4" }}
                      />
                    )}
                  </Link>
                );
              })}

              {/* Portals dropdown */}
              <div className="relative">
                <button
                  onClick={() => setPortalOpen((p) => !p)}
                  onBlur={() => setTimeout(() => setPortalOpen(false), 150)}
                  className="flex items-center gap-1 px-3 py-2 text-[0.8rem] font-medium rounded-lg"
                  style={{
                    fontFamily: "var(--font-body, 'Plus Jakarta Sans', sans-serif)",
                    letterSpacing: "0.06em",
                    color: "rgba(255,255,255,0.8)",
                    transition: "color 0.2s ease",
                  }}
                  onMouseEnter={e => (e.currentTarget.style.color = "#fff")}
                  onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.8)")}
                >
                  Portals
                  <ChevronDown
                    size={13}
                    className={`transition-transform duration-200 ${portalOpen ? "rotate-180" : ""}`}
                  />
                </button>
                <AnimatePresence>
                  {portalOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 4, scale: 0.97 }}
                      transition={{ duration: 0.18 }}
                      className="absolute right-0 top-full mt-2 w-64 rounded-2xl overflow-hidden"
                      style={{
                        background: "#fff",
                        boxShadow: "0 20px 60px rgba(11,31,58,0.15)",
                        padding: 8,
                      }}
                    >
                      {portalLinks.map(({ href, label, icon: Icon, desc }) => (
                        <Link
                          key={href}
                          href={href}
                          className="flex items-start gap-3 px-4 py-3.5 rounded-xl transition-colors"
                          style={{ transition: "background 0.15s" }}
                          onMouseEnter={e => (e.currentTarget.style.background = "#E8F6FC")}
                          onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                        >
                          <div
                            className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                            style={{ background: "#E8F6FC" }}
                          >
                            <Icon size={15} style={{ color: "#2196C4" }} />
                          </div>
                          <div>
                            <p
                              className="font-medium text-sm"
                              style={{ color: "#0B1F3A", fontFamily: "var(--font-body, sans-serif)" }}
                            >
                              {label}
                            </p>
                            <p
                              className="text-xs mt-0.5"
                              style={{ color: "#9A9389", fontFamily: "var(--font-body, sans-serif)" }}
                            >
                              {desc}
                            </p>
                          </div>
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Right cluster */}
            <div className="flex items-center gap-2">
              {/* Dark mode toggle */}
              <button
                onClick={toggle}
                aria-label="Toggle dark mode"
                className="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200"
                style={{ color: "rgba(255,255,255,0.7)" }}
                onMouseEnter={e => { e.currentTarget.style.color = "#fff"; e.currentTarget.style.background = "rgba(255,255,255,0.1)"; }}
                onMouseLeave={e => { e.currentTarget.style.color = "rgba(255,255,255,0.7)"; e.currentTarget.style.background = "transparent"; }}
              >
                {theme === "dark" ? <Sun size={17} /> : <Moon size={17} />}
              </button>

              {/* Enroll CTA */}
              <Link
                href="/admissions"
                className="hidden lg:inline-flex items-center px-5 py-2 text-sm font-semibold rounded-full whitespace-nowrap transition-all duration-200"
                style={{
                  fontFamily: "var(--font-body, sans-serif)",
                  background: solid ? "#2196C4" : "transparent",
                  border: solid ? "none" : "1px solid rgba(255,255,255,0.7)",
                  color: "#fff",
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={e => {
                  const el = e.currentTarget;
                  if (solid) { el.style.background = "#3BADD9"; el.style.transform = "translateY(-2px)"; }
                  else { el.style.background = "#fff"; el.style.color = "#0B1F3A"; }
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget;
                  el.style.transform = "translateY(0)";
                  if (solid) { el.style.background = "#2196C4"; el.style.color = "#fff"; }
                  else { el.style.background = "transparent"; el.style.color = "#fff"; }
                }}
              >
                Enroll Now
              </Link>

              {/* Hamburger */}
              <button
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Toggle menu"
                aria-expanded={isOpen}
                className="xl:hidden w-10 h-10 rounded-xl flex items-center justify-center text-white transition-colors"
                onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.1)")}
                onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
              >
                <motion.div animate={{ rotate: isOpen ? 90 : 0 }} transition={{ duration: 0.2 }}>
                  {isOpen ? <X size={22} /> : <Menu size={22} />}
                </motion.div>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile full-screen overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-40 flex flex-col pt-20 pb-8 px-6 overflow-y-auto xl:hidden"
            style={{ background: "#060E1C" }}
          >
            <nav aria-label="Mobile navigation">
              <ul className="space-y-1">
                {mainLinks.map((link, i) => {
                  const active = isActive(link.href);
                  return (
                    <motion.li
                      key={link.href}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05, duration: 0.35 }}
                    >
                      <Link
                        href={link.href}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-base transition-all"
                        style={{
                          fontFamily: "var(--font-body, sans-serif)",
                          background: active ? "rgba(33,150,196,0.12)" : "transparent",
                          color: active ? "#3BADD9" : "rgba(255,255,255,0.8)",
                          border: active ? "1px solid rgba(33,150,196,0.3)" : "1px solid transparent",
                        }}
                      >
                        {active && (
                          <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: "#2196C4" }} />
                        )}
                        {link.label}
                      </Link>
                    </motion.li>
                  );
                })}
                <motion.li
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: mainLinks.length * 0.05 }}
                >
                  <p
                    className="px-4 pt-4 pb-2 text-xs font-medium uppercase tracking-widest"
                    style={{ color: "rgba(255,255,255,0.35)", fontFamily: "var(--font-body, sans-serif)" }}
                  >
                    Portals
                  </p>
                  {portalLinks.map(({ href, label, icon: Icon }) => (
                    <Link
                      key={href}
                      href={href}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-base transition-all"
                      style={{
                        fontFamily: "var(--font-body, sans-serif)",
                        color: "rgba(255,255,255,0.8)",
                      }}
                    >
                      <Icon size={16} style={{ color: "#2A9D9D" }} className="shrink-0" />
                      {label}
                    </Link>
                  ))}
                </motion.li>
              </ul>
            </nav>

            <div className="mt-auto pt-8 space-y-3">
              <Link
                href="/admissions"
                className="w-full flex items-center justify-center py-3.5 font-semibold text-sm rounded-full transition-colors"
                style={{
                  background: "#2196C4",
                  color: "#fff",
                  fontFamily: "var(--font-body, sans-serif)",
                }}
              >
                Apply for Admission
              </Link>
              <a
                href="tel:+2348032545074"
                className="w-full flex items-center justify-center py-3 text-sm rounded-full transition-all"
                style={{
                  border: "1px solid rgba(255,255,255,0.15)",
                  color: "rgba(255,255,255,0.7)",
                  fontFamily: "var(--font-body, sans-serif)",
                }}
              >
                +234 803 254 5074
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
