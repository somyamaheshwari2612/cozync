"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface QOTDData {
  id: number;
  text: string;
  category: string;
  date: string;
}

const CATEGORY_COLORS: Record<string, { bg: string; text: string }> = {
  "self-love":       { bg: "#fde8f2", text: "#8a3060" },
  "savage":          { bg: "#fde8d8", text: "#a0563a" },
  "motivational":    { bg: "#e8f5e9", text: "#2e6b2e" },
  "soft":            { bg: "#f3e5f5", text: "#4a2860" },
  "flirty":          { bg: "#fef9e7", text: "#7a5f10" },
  "reality-check":   { bg: "#e8f0fe", text: "#2a3f8a" },
  "healing":         { bg: "#e8f5e9", text: "#2e6b2e" },
  "chaotic":         { bg: "#fde8d8", text: "#a0563a" },
  "funny":           { bg: "#fef9e7", text: "#7a5f10" },
  "delulu":          { bg: "#e0f7fa", text: "#006064" },
  "thought":         { bg: "#eceff1", text: "#37474f" },
  "roast":           { bg: "#ffebee", text: "#c62828" },
  "dreamy":          { bg: "#f3e5f5", text: "#6a1b9a" },
  "villain":         { bg: "#ede7f6", text: "#4527a0" },
  "cozy":            { bg: "#efebe9", text: "#4e342e" },
  "digital":         { bg: "#e8eaf6", text: "#283593" },
  "absurdist":       { bg: "#f1f8e9", text: "#33691e" },
  "midnight":        { bg: "#eceff1", text: "#263238" },
  "feral":           { bg: "#fff3e0", text: "#e65100" },
  "cosmic":          { bg: "#e8f0fe", text: "#1a237e" },
  "chaos-romantic":  { bg: "#fce4ec", text: "#880e4f" },
  "poetic":          { bg: "#f3e5f5", text: "#4a148c" },
  "recovery":        { bg: "#e8f5e9", text: "#1b5e20" },
  "rebel":           { bg: "#ffebee", text: "#b71c1c" },
  "tiny-win":        { bg: "#e8f5e9", text: "#2e6b2e" }
};

function getCategoryStyle(category: string) {
  return CATEGORY_COLORS[category.toLowerCase()] ?? { bg: "#fdf0e8", text: "#9a7b6b" };
}

export function DeluluQuote() {
  const [quote, setQuote] = useState<QOTDData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Cache in sessionStorage — one fetch per session
    const cached = sessionStorage.getItem("cz_delulu_qotd");
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        // Only use cache if it's from today
        const today = new Date();
        const todayStr = [
          today.getFullYear(),
          String(today.getMonth() + 1).padStart(2, "0"),
          String(today.getDate()).padStart(2, "0"),
        ].join("-");
        if (parsed.date === todayStr) {
          setQuote(parsed);
          setLoading(false);
          return;
        }
      } catch { /* ignore bad cache */ }
    }

    fetch("https://delulu-dose.vercel.app/api/qotd")
      .then(r => r.json())
      .then(data => {
        setQuote(data);
        sessionStorage.setItem("cz_delulu_qotd", JSON.stringify(data));
      })
      .catch(() => { /* fail silently — quote just won't show */ })
      .finally(() => setLoading(false));
  }, []);

  if (loading || !quote) return null;

  const style = getCategoryStyle(quote.category);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
        style={{
          margin: "0 0 20px 0",
          padding: "12px 16px",
          background: style.bg,
          borderRadius: "14px",
          border: `1.5px solid ${style.bg}`,
          display: "flex",
          flexDirection: "column",
          gap: "4px",
        }}
      >
        {/* Category badge */}
        <div style={{
          fontFamily: "var(--font-patrick), cursive",
          fontSize: "10px",
          textTransform: "uppercase",
          letterSpacing: "0.8px",
          color: style.text,
          opacity: 0.75,
        }}>
          {quote.category}
        </div>

        {/* Quote text */}
        <p style={{
          fontFamily: "var(--font-nunito), sans-serif",
          fontSize: "13px",
          color: style.text,
          lineHeight: 1.55,
          margin: 0,
          fontStyle: "italic",
        }}>
          "{quote.text}"
        </p>

        {/* Attribution */}
        <div style={{
          fontFamily: "var(--font-patrick), cursive",
          fontSize: "11px",
          color: style.text,
          opacity: 0.6,
          textAlign: "right",
        }}>
          via{" "}
          <a
            href="https://delulu-dose.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: style.text,
              textDecoration: "underline",
              textUnderlineOffset: "2px",
            }}
          >
            DeluluDose
          </a>
          {" "}✦
        </div>
      </motion.div>
    </AnimatePresence>
  );
}