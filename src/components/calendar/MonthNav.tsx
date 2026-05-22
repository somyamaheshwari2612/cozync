"use client";

import { motion } from "framer-motion";

interface MonthNavProps {
  year: number;
  month: number;
  onPrev: () => void;
  onNext: () => void;
}

const MONTH_NAMES = [
  "January","February","March","April",
  "May","June","July","August",
  "September","October","November","December",
];

export function MonthNav({ year, month, onPrev, onNext }: MonthNavProps) {
  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: "24px",
    }}>
      <motion.button
        onClick={onPrev}
        whileHover={{ scale: 1.1, x: -2 }}
        whileTap={{ scale: 0.92 }}
        style={{
          width: "36px",
          height: "36px",
          borderRadius: "50%",
          border: "1.5px solid #f0e0d0",
          background: "#fffbf7",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "20px",
          color: "#9a7b6b",
          flexShrink: 0,
        }}
      >
        ‹
      </motion.button>

      <div style={{ textAlign: "center" }}>
        <motion.h2
          key={`${year}-${month}`}
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          style={{
            fontFamily: "var(--font-display), var(--font-gochi), cursive",
            fontSize: "42px",
            color: "#c17a5b",
            lineHeight: 1,
            margin: 0,
          }}
        >
          {MONTH_NAMES[month - 1]}
        </motion.h2>
        <motion.p
          key={`year-${year}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{
            fontFamily: "var(--font-patrick), cursive",
            fontSize: "14px",
            color: "#bba89c",
            margin: "3px 0 0",
          }}
        >
          {year}
        </motion.p>
      </div>

      <motion.button
        onClick={onNext}
        whileHover={{ scale: 1.1, x: 2 }}
        whileTap={{ scale: 0.92 }}
        style={{
          width: "36px",
          height: "36px",
          borderRadius: "50%",
          border: "1.5px solid #f0e0d0",
          background: "#fffbf7",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "20px",
          color: "#9a7b6b",
          flexShrink: 0,
        }}
      >
        ›
      </motion.button>
    </div>
  );
}