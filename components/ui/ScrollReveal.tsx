"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ReactNode } from "react";

interface Props {
  children: ReactNode;
  delay?: number;
  direction?: "up" | "left" | "right" | "none";
  className?: string;
}

const directionVariants = {
  up:    { hidden: { y: 40, opacity: 0 }, visible: { y: 0, opacity: 1 } },
  left:  { hidden: { x: -40, opacity: 0 }, visible: { x: 0, opacity: 1 } },
  right: { hidden: { x: 40, opacity: 0 }, visible: { x: 0, opacity: 1 } },
  none:  { hidden: { opacity: 0 }, visible: { opacity: 1 } },
};

export default function ScrollReveal({ children, delay = 0, direction = "up", className }: Props) {
  const reduced = useReducedMotion();
  const variants = directionVariants[direction];

  return (
    <motion.div
      initial={reduced ? "visible" : "hidden"}
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={variants}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
