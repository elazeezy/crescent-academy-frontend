// components/Footer.tsx
import { MapPin, Phone, Mail, Facebook, Instagram, Twitter } from 'lucide-react';
import Link from 'next/link';

export default function Footer() {
  const quickLinks = [
    { href: "/about", label: "About Us" },
    { href: "/admissions", label: "Admissions" },
    { href: "/structure", label: "School Structure" },
    { href: "/leadership", label: "Leadership" },
    { href: "/policies", label: "Policies" },
    { href: "/achievements", label: "Achievements" },
    { href: "/gallery", label: "Gallery" },
    { href: "/fees", label: "Fees" },
    { href: "/alumni", label: "Alumni" },
    { href: "/portals", label: "Portals" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <footer className="bg-[#1E3A8A] text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16">
          {/* School Info + Logo */}
          <div className="space-y-6">
            <Link href="/" className="inline-flex items-center gap-4 group">
              {/* Replace with your actual logo */}
              <img
                src="/logo.png"           // ← Put your real logo here (public/logo.png)
                alt="Crescent Academy"
                className="h-12 w-auto object-contain group-hover:scale-105 transition-transform duration-300"
              />
              <div>
                <h3 className="font-extrabold text-2xl tracking-tight leading-none">
                  CRESCENT
                </h3>
                <p className="text-[#0EA5E9] text-xs uppercase tracking-widest font-semibold mt-1">
                  ACADEMY
                </p>
              </div>
            </Link>

            <p className="text-slate-300/90 text-sm leading-relaxed max-w-xs">
              Nurturing the Complete Child through academic excellence and moral uprightness since 2010.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-lg mb-6 tracking-wide">Quick Links</h4>
            <ul className="space-y-3 text-slate-300/90 text-sm">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="hover:text-[#0EA5E9] hover:pl-2 transition-all duration-300 flex items-center gap-2 group"
                  >
                    <span className="w-1.5 h-1.5 bg-[#0EA5E9]/60 rounded-full group-hover:bg-[#0EA5E9] transition-colors" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-bold text-lg mb-6 tracking-wide">Contact Us</h4>
            <ul className="space-y-5 text-slate-300/90 text-sm">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="mt-1 flex-shrink-0 text-[#0EA5E9]/80" />
                <span>
                  Panada Area, Beside Car Wash,<br />
                  Along Water Works, Iwo,<br />
                  Osun State, Nigeria
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="text-[#0EA5E9]/80" />
                (+234) 803 254 5074
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} className="text-[#0EA5E9]/80" />
                info@crescentacademy.edu.ng
              </li>
            </ul>
          </div>

          {/* Social & Copyright */}
          <div className="space-y-6">
            <div>
              <h4 className="font-bold text-lg mb-6 tracking-wide">Follow Us</h4>
              <div className="flex gap-5">
                <a
                  href="#"
                  className="text-white/80 hover:text-[#0EA5E9] transition-colors duration-300 hover:scale-110 transform"
                  aria-label="Facebook"
                >
                  <Facebook size={24} />
                </a>
                <a
                  href="#"
                  className="text-white/80 hover:text-[#0EA5E9] transition-colors duration-300 hover:scale-110 transform"
                  aria-label="Instagram"
                >
                  <Instagram size={24} />
                </a>
                <a
                  href="#"
                  className="text-white/80 hover:text-[#0EA5E9] transition-colors duration-300 hover:scale-110 transform"
                  aria-label="Twitter"
                >
                  <Twitter size={24} />
                </a>
              </div>
            </div>

            <div className="text-slate-400/80 text-sm">
              © {new Date().getFullYear()} Crescent Academy.<br />
              All rights reserved.
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10 bg-[#0F2A5E]/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 text-center text-slate-400/80 text-sm">
          Built with dedication for authentic education • Powered by Crescent Academy
        </div>
      </div>
    </footer>
  );
}