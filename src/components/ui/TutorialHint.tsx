"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { StickerImg } from "./StickerImg";

export function TutorialHint() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const seen = localStorage.getItem("cz_tutorial") === "true";
    if (!seen) setTimeout(() => setVisible(true), 1200);
  }, []);

  function dismiss() {
    localStorage.setItem("cz_tutorial", "true");
    setVisible(false);
  }

  return (
    <AnimatePresence>
      {visible && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={dismiss}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 190,
              background: "rgba(61,47,37,0.2)",
            }}
          />
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
            style={{
              position: "fixed",
              bottom: 0,
              left: 0,
              right: 0,
              zIndex: 200,
              background: "#fffbf7",
              borderRadius: "20px 20px 0 0",
              border: "1.5px solid #e8c5a8",
              padding: "20px 24px 40px",
              boxShadow: "0 -8px 40px rgba(61,47,37,0.14)",
              maxHeight: "85vh",
              overflowY: "auto",
              WebkitOverflowScrolling: "touch" as any,
            }}
          >
            {/* Handle */}
            <div style={{
              width: "36px", height: "4px",
              background: "#e8c5a8", borderRadius: "999px",
              margin: "0 auto 16px",
            }} />

            <div style={{
              fontFamily: "var(--font-cormorant), serif",
              fontSize: "26px", fontWeight: 600,
              color: "#c17a5b", marginBottom: "20px",
            }}>
              welcome to Cozync ✦
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginBottom: "24px" }}>
              {[
                { openmoji: "1F4C5", title: "tap any day", desc: "Tap a date on the calendar to open it and start logging." },
                { openmoji: "1F338", title: "log how you feel", desc: "Pick a mood, write a note, add your wins for the day." },
                { openmoji: "2728",  title: "decorate it",    desc: "Place a sticker on the day — it appears right on the calendar." },
                { openmoji: "1F525", title: "build your streak", desc: "Show up daily and unlock new sticker packs as rewards." },
              ].map((step, i) => (
                <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "14px" }}>
                  <div style={{
                    background: "#fde8d8", borderRadius: "12px",
                    padding: "8px", flexShrink: 0,
                  }}>
                    <StickerImg openmoji={step.openmoji} size={28} alt={step.title} />
                  </div>
                  <div>
                    <div style={{
                      fontFamily: "var(--font-patrick), cursive",
                      fontSize: "15px", color: "#3d2f25", marginBottom: "3px",
                    }}>
                      {step.title}
                    </div>
                    <div style={{
                      fontFamily: "var(--font-nunito), sans-serif",
                      fontSize: "13px", color: "#9a7b6b", lineHeight: 1.5,
                    }}>
                      {step.desc}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={dismiss}
              style={{
                width: "100%",
                background: "#c17a5b", color: "#fffbf7",
                border: "none", borderRadius: "999px",
                padding: "13px",
                fontFamily: "var(--font-patrick), cursive",
                fontSize: "15px", cursor: "pointer",
                boxShadow: "0 2px 8px rgba(193,122,91,0.25)",
              }}
            >
              let's start my story ✦
            </motion.button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}