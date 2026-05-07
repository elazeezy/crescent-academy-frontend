"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { X, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function AnnouncementBar() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const dismissed = sessionStorage.getItem("ca-announcement-dismissed");
    if (!dismissed) setVisible(true);
  }, []);

  const dismiss = () => {
    sessionStorage.setItem("ca-announcement-dismissed", "1");
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="overflow-hidden"
        >
          <div
            className="px-4 py-2 flex items-center justify-center gap-4 text-xs font-medium"
            style={{
              background: "#2196C4",
              color: "#fff",
              fontFamily: "var(--font-body, 'Plus Jakarta Sans', sans-serif)",
            }}
          >
            <span>Admissions now open for the 2025/2026 session — Apply today</span>
            <Link
              href="/admissions"
              className="flex items-center gap-1 font-semibold underline underline-offset-2 hover:no-underline whitespace-nowrap transition-opacity hover:opacity-80"
              style={{ color: "#fff" }}
            >
              Apply Now <ArrowRight size={12} />
            </Link>
            <button
              onClick={dismiss}
              aria-label="Dismiss announcement"
              className="ml-2 p-0.5 rounded transition-opacity opacity-70 hover:opacity-100"
              style={{ color: "#fff" }}
            >
              <X size={14} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
