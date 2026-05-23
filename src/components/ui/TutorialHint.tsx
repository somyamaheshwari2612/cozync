"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { StickerImg } from "./StickerImg";

const TUTORIAL_KEY = "cz_tutorial_v2";

interface TutorialHintProps {
  forceOpen?: boolean;
  onClose?: () => void;
}

export function TutorialHint({ forceOpen = false, onClose }: TutorialHintProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (forceOpen) {
      setVisible(true);
      return;
    }
    try {
      const seen = localStorage.getItem(TUTORIAL_KEY) === "true";
      if (!seen) setVisible(true);
    } catch { /* private browsing */ }
  }, [forceOpen]);

  function dismiss() {
    try { localStorage.setItem(TUTORIAL_KEY, "true"); } catch { /* ignore */ }
    setVisible(false);
    onClose?.();
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
              position: "fixed", inset: 0,
              zIndex: 9998,
              background: "rgba(61,47,37,0.25)",
              touchAction: "none",
            }}
          />
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
            style={{
              position: "fixed",
              bottom: 0, left: 0, right: 0,
              zIndex: 9999,
              background: "#fffbf7",
              borderRadius: "20px 20px 0 0",
              border: "1.5px solid #e8c5a8",
              padding: "20px 24px 48px",
              boxShadow: "0 -8px 40px rgba(61,47,37,0.16)",
              maxHeight: "88vh",
              overflowY: "auto",
            }}
          >
            {/* Handle */}
            <div style={{
              width: "36px", height: "4px",
              background: "#e8c5a8", borderRadius: "999px",
              margin: "0 auto 20px",
            }} />

            <div style={{
              fontFamily: "var(--font-cormorant), serif",
              fontSize: "26px", fontWeight: 600,
              color: "#c17a5b", marginBottom: "20px",
            }}>
              how Cozync works ✦
            </div>

            <div style={{
              display: "flex", flexDirection: "column",
              gap: "16px", marginBottom: "28px",
            }}>
              {[
                { openmoji: "1F4C5", title: "tap any day",
                  desc: "Tap a date on the calendar to open it and start logging." },
                { openmoji: "1F338", title: "log how you feel",
                  desc: "Pick a mood, write a note, add your wins for the day." },
                { openmoji: "2728",  title: "decorate it",
                  desc: "Place a sticker — it appears right on the calendar cell." },
                { openmoji: "1F525", title: "build your streak",
                  desc: "Show up daily and unlock new sticker packs as rewards." },
                { openmoji: "1F4BE", title: "your data is yours",
                  desc: "Everything saves locally on your device. No account needed. Ever." },
              ].map((step, i) => (
                <div key={i} style={{
                  display: "flex", alignItems: "flex-start", gap: "14px",
                }}>
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
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={dismiss}
              style={{
                width: "100%",
                background: "#c17a5b", color: "#fffbf7",
                border: "none", borderRadius: "999px",
                padding: "14px",
                fontFamily: "var(--font-patrick), cursive",
                fontSize: "15px", cursor: "pointer",
                boxShadow: "0 2px 10px rgba(193,122,91,0.3)",
              }}
            >
              got it, let's go ✦
            </motion.button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}