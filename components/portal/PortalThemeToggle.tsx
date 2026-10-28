'use client';

import { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';

const KEY = 'ca-portal-theme';
type PortalTheme = 'light' | 'dark';

function apply(theme: PortalTheme) {
  document.documentElement.setAttribute('data-portal-theme', theme);
  try { localStorage.setItem(KEY, theme); } catch { /* ignore */ }
}

/**
 * Toggles the portal between dark (default) and light.
 * Writes `data-portal-theme` on <html>; the scoped light-mode rules in
 * globals.css only react inside `.portal-shell`, so the public site is
 * unaffected. The no-flash script in app/layout.tsx sets the attribute
 * before paint, so this just syncs the icon + flips on click.
 */
export default function PortalThemeToggle({ className = '' }: { className?: string }) {
  const [theme, setTheme] = useState<PortalTheme>('dark');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const current = (document.documentElement.getAttribute('data-portal-theme') as PortalTheme) ?? 'dark';
    setTheme(current);
    setMounted(true);
  }, []);

  const toggle = () => {
    const next: PortalTheme = theme === 'dark' ? 'light' : 'dark';
    apply(next);
    setTheme(next);
  };

  const isDark = theme === 'dark';

  return (
    <button
      onClick={toggle}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className={`p-2.5 rounded-xl bg-white/5 border border-white/8 hover:bg-white/10 transition-colors text-slate-400 hover:text-emerald-400 ${className}`}
    >
      {/* Render a stable icon until mounted to avoid hydration mismatch */}
      {!mounted ? <Moon size={18} /> : isDark ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}
