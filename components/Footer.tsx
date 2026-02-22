// components/Footer.tsx
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-[#1E3A8A] text-white py-12">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-10">
          
          {/* School Info */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-3xl">🏛️</span>
              <div>
                <h3 className="font-bold text-xl">CRESCENT ACADEMY</h3>
                <p className="text-[#0EA5E9] text-xs uppercase tracking-widest">Authentic Education</p>
              </div>
            </div>
            <p className="text-slate-300 text-sm mb-4">
              Nurturing the complete child through academic excellence and moral uprightness since 2010.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-lg mb-6">Quick Links</h4>
            <ul className="space-y-3 text-slate-300 text-sm">
              <li><Link href="/about" className="hover:text-[#0EA5E9] transition-colors">About Us</Link></li>
              <li><Link href="/admissions" className="hover:text-[#0EA5E9] transition-colors">Admissions</Link></li>
              <li><Link href="/news" className="hover:text-[#0EA5E9] transition-colors">News & Events</Link></li>
              <li><Link href="/alumni" className="hover:text-[#0EA5E9] transition-colors">Alumni</Link></li>
              <li><Link href="/contact" className="hover:text-[#0EA5E9] transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-bold text-lg mb-6">Contact Us</h4>
            <ul className="space-y-3 text-slate-300 text-sm">
              <li>Ajegbe Close, Panada Area, Iwo</li>
              <li>Osun State, Nigeria</li>
              <li className="mt-4">+234 803 123 4567</li>
              <li>info@crescentacademy.edu.ng</li>
            </ul>
          </div>

          {/* Social & Legal */}
          <div>
            <h4 className="font-bold text-lg mb-6">Follow Us</h4>
            <div className="flex gap-4 mb-6">
              <a href="#" className="hover:text-[#0EA5E9] transition-colors">Facebook</a>
              <a href="#" className="hover:text-[#0EA5E9] transition-colors">Instagram</a>
              <a href="#" className="hover:text-[#0EA5E9] transition-colors">Twitter</a>
            </div>
            <p className="text-slate-400 text-sm">
              © {new Date().getFullYear()} Crescent Academy.<br/>
              All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}