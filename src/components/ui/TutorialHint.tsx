"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { StickerImg } from "./StickerImg";

export function TutorialHint() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const seen = localStorage.getItem("cz_tutorial") === "true";
    if (!seen) {
      setTimeout(() => setVisible(true), 1200);
    }
  }, []);

  function dismiss() {
    localStorage.setItem("cz_tutorial", "true");
    setVisible(false);
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.3 }}
          style={{
            position: "fixed",
            top: "80px",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 150,
            width: "min(400px, calc(100vw - 32px))",
            background: "#fffbf7",
            border: "1.5px solid #e8c5a8",
            borderRadius: "20px",
            padding: "20px 24px",
            boxShadow: "0 8px 32px rgba(61,47,37,0.12)",
          }}
        >
          {/* Steps */}
          <div style={{
            fontFamily: "var(--font-cormorant), serif",
            fontSize: "22px",
            fontWeight: 600,
            color: "#c17a5b",
            marginBottom: "16px",
          }}>
            welcome to Cozync ✦
          </div>

          <div style={{
            display: "flex",
            flexDirection: "column",
            gap: "12px",
            marginBottom: "20px",
          }}>
            {[
              {
                openmoji: "1F4C5",
                title: "tap any day",
                desc: "Click or tap a date on the calendar to open it.",
              },
              {
                openmoji: "1F338",
                title: "log how you feel",
                desc: "Pick a mood, write a note, add your wins for the day.",
              },
              {
                openmoji: "2728",
                title: "decorate it",
                desc: "Place a sticker on the day — it appears right on the calendar.",
              },
              {
                openmoji: "1F525",
                title: "build your streak",
                desc: "Show up daily and unlock new sticker packs as rewards.",
              },
            ].map((step, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "12px",
                }}
              >
                <div style={{
                  background: "#fde8d8",
                  borderRadius: "10px",
                  padding: "6px",
                  flexShrink: 0,
                }}>
                  <StickerImg openmoji={step.openmoji} size={24} alt={step.title} />
                </div>
                <div>
                  <div style={{
                    fontFamily: "var(--font-patrick), cursive",
                    fontSize: "14px",
                    color: "#3d2f25",
                    marginBottom: "2px",
                  }}>
                    {step.title}
                  </div>
                  <div style={{
                    fontFamily: "var(--font-nunito), sans-serif",
                    fontSize: "12px",
                    color: "#9a7b6b",
                    lineHeight: 1.5,
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
              background: "#c17a5b",
              color: "#fffbf7",
              border: "none",
              borderRadius: "999px",
              padding: "11px",
              fontFamily: "var(--font-patrick), cursive",
              fontSize: "14px",
              cursor: "pointer",
              boxShadow: "0 2px 8px rgba(193,122,91,0.25)",
            }}
          >
            let's start my story ✦
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}