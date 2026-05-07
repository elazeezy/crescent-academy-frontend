"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";

interface Props {
  target: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
  label: string;
  icon?: React.ReactNode;
  light?: boolean;
}

function easeOutQuart(t: number) {
  return 1 - Math.pow(1 - t, 4);
}

export default function AnimatedCounter({
  target,
  suffix = "",
  prefix = "",
  duration = 2000,
  label,
  icon,
  light = true,
}: Props) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });
  const started = useRef(false);

  useEffect(() => {
    if (!inView || started.current) return;
    started.current = true;
    let raf: number;
    const t0 = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - t0) / duration, 1);
      setCount(Math.round(easeOutQuart(p) * target));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, target, duration]);

  return (
    <div ref={ref} className="flex flex-col items-center text-center group">
      {icon && (
        <div
          className={`w-14 h-14 mb-4 rounded-2xl flex items-center justify-center border transition-all duration-300 ${
            light
              ? "bg-white/8 border-ca-gold/25 group-hover:border-ca-gold/60"
              : "bg-ca-gold/10 border-ca-gold/20 group-hover:border-ca-gold/50"
          }`}
        >
          {icon}
        </div>
      )}
      <p
        className={`text-4xl md:text-5xl font-bold tabular-nums leading-none ${
          light ? "text-white" : "text-ca-navy"
        }`}
      >
        {prefix}{count}{suffix}
      </p>
      <div className="w-8 h-0.5 bg-ca-gold/50 my-3 rounded-full" />
      <p className={`text-xs font-medium tracking-wide ${light ? "text-white/55" : "text-slate-500"}`}>
        {label}
      </p>
    </div>
  );
}
