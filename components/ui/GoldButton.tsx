"use client";

import { ReactNode } from "react";
import { clsx } from "clsx";
import Link from "next/link";

type Variant = "primary" | "secondary" | "ghost";

interface Props {
  children: ReactNode;
  variant?: Variant;
  href?: string;
  onClick?: () => void;
  className?: string;
  type?: "button" | "submit";
  disabled?: boolean;
  external?: boolean;
  "aria-label"?: string;
}

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-sans font-medium text-sm tracking-wide transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[--ca-gold] focus-visible:ring-offset-2 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none";

const variants: Record<Variant, string> = {
  primary:
    "px-7 py-3 bg-[--ca-gold] text-[--ca-navy] hover:-translate-y-0.5 hover:shadow-gold hover:bg-[--ca-gold-light]",
  secondary:
    "px-7 py-3 border-2 border-[--ca-gold] text-[--ca-gold] hover:-translate-y-0.5 hover:bg-[--ca-gold]/10",
  ghost:
    "px-5 py-2 text-[--ca-gold] hover:text-[--ca-gold-light] underline-offset-4 hover:underline",
};

export default function GoldButton({
  children,
  variant = "primary",
  href,
  onClick,
  className,
  type = "button",
  disabled,
  external,
  "aria-label": ariaLabel,
}: Props) {
  const cls = clsx(base, variants[variant], className);

  if (href) {
    return external ? (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={cls}
        aria-label={ariaLabel}
      >
        {children}
      </a>
    ) : (
      <Link href={href} className={cls} aria-label={ariaLabel}>
        {children}
      </Link>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cls}
      aria-label={ariaLabel}
    >
      {children}
    </button>
  );
}
