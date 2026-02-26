// components/Footer.tsx
import { MapPin, Phone, Mail } from 'lucide-react';
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
    <footer className="bg-[#1E3A8A] text-white py-16 mt-auto">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-12">
          {/* School Info */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <span className="text-4xl">🏛️</span>
              <div>
                <h3 className="font-bold text-2xl leading-tight">CRESCENT ACADEMY</h3>
                <p className="text-[#0EA5E9] text-sm uppercase tracking-widest">
                  Authentic Education
                </p>
              </div>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed mb-6">
              Nurturing the Complete Child through academic excellence and moral uprightness since 2010.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-lg mb-6">Quick Links</h4>
            <ul className="space-y-3 text-slate-300 text-sm">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="hover:text-[#0EA5E9] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-bold text-lg mb-6">Contact Us</h4>
            <ul className="space-y-4 text-slate-300 text-sm">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="mt-1 flex-shrink-0" />
                <span>Panada Area, Beside Car Wash, Along Water Works, Iwo, Osun State, Nigeria</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} />
                (+234) 803 123 4567
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} />
                info@crescentacademy.edu.ng
              </li>
            </ul>
          </div>

          {/* Social & Legal */}
          <div>
            <h4 className="font-bold text-lg mb-6">Follow Us</h4>
            <div className="flex gap-5 mb-8">
              <a href="#" className="hover:text-[#0EA5E9] transition-colors">Facebook</a>
              <a href="#" className="hover:text-[#0EA5E9] transition-colors">Instagram</a>
              <a href="#" className="hover:text-[#0EA5E9] transition-colors">Twitter</a>
            </div>
            <p className="text-slate-400 text-sm">
              © {new Date().getFullYear()} Crescent Academy.<br />
              All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}