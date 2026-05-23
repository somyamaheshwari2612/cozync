"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const NAMES = ["Somya", "SaMi", "SM","Suha"];

export function Footer() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex(i => (i + 1) % NAMES.length);
    }, 2200);
    return () => clearInterval(timer);
  }, []);

  return (
    <div style={{
      textAlign: "center",
      padding: "12px 16px",
      borderTop: "1px solid #f0e0d0",
      background: "#fdf8f3",
      flexShrink: 0,
    }}>
      <div style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "5px",
        fontFamily: "var(--font-patrick), cursive",
        fontSize: "12px",
        color: "#bba89c",
      }}>
        <span>Made with soft chaos by</span>

        {/* Rotating name with cube flip */}
        <span style={{
          display: "inline-block",
          width: "52px",
          height: "18px",
          position: "relative",
          overflow: "hidden",
          verticalAlign: "middle",
        }}>
          <AnimatePresence mode="wait">
            <motion.span
              key={NAMES[index]}
              initial={{ rotateX: -90, opacity: 0, y: 8 }}
              animate={{ rotateX: 0,   opacity: 1, y: 0 }}
              exit={{   rotateX: 90,   opacity: 0, y: -8 }}
              transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
              style={{
                position: "absolute",
                left: 0, right: 0,
                display: "block",
                fontFamily: "var(--font-cormorant), serif",
                fontSize: "14px",
                fontWeight: 600,
                color: "#c17a5b",
                textAlign: "center",
                transformOrigin: "center",
              }}
            >
              {NAMES[index]}
            </motion.span>
          </AnimatePresence>
        </span>

        <span>✿</span>
      </div>
    </div>
  );
}