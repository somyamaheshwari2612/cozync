"use client";

import { motion, AnimatePresence } from "framer-motion";
import { StickerImg } from "./StickerImg";

interface OnboardingToastProps {
  visible: boolean;
  onDismiss: () => void;
}

export function OnboardingToast({ visible, onDismiss }: OnboardingToastProps) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 40, scale: 0.95 }}
          transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
         style={{
          position: "fixed",
          bottom: "80px", // above mobile nav
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 200,
          width: "min(480px, calc(100vw - 32px))",
          background: "#fffbf7",
          border: "1.5px solid #e8c5a8",
          borderRadius: "20px",
          padding: "20px 24px",
          boxShadow: "0 8px 40px rgba(61,47,37,0.14)",
          display: "flex",
          flexDirection: "column",
          gap: "12px",
          maxHeight: "70vh",
          overflowY: "auto",
        }}
        >
          {/* Header */}
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <StickerImg openmoji="1F4D6" size={32} alt="journal" />
              <span style={{
                fontFamily: "var(--font-cormorant), serif",
                fontSize: "22px",
                fontWeight: 600,
                color: "#c17a5b",
              }}>
                your story is safe here
              </span>
            </div>
            <button
              onClick={onDismiss}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "#bba89c",
                fontSize: "20px",
                lineHeight: 1,
                padding: "0 4px",
              }}
            >
              ×
            </button>
          </div>

          {/* Body */}
          <p style={{
            fontFamily: "var(--font-nunito), sans-serif",
            fontSize: "14px",
            color: "#6b5044",
            lineHeight: 1.65,
            margin: 0,
          }}>
            Your entries are saved <strong>right here on this device</strong> —
            no account needed, no data sent anywhere. Cozync works entirely offline.
          </p>

          <p style={{
            fontFamily: "var(--font-nunito), sans-serif",
            fontSize: "14px",
            color: "#6b5044",
            lineHeight: 1.65,
            margin: 0,
          }}>
            Want to access your journal across devices? You can create a
            <strong> free account</strong> anytime to sync — your data migrates
            instantly, nothing is lost.
          </p>

          {/* Actions */}
          <div style={{
            display: "flex",
            gap: "10px",
            alignItems: "center",
            flexWrap: "wrap",
            marginTop: "4px",
          }}>
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={onDismiss}
              style={{
                background: "#c17a5b",
                color: "#fffbf7",
                border: "none",
                borderRadius: "999px",
                padding: "9px 20px",
                fontFamily: "var(--font-patrick), cursive",
                fontSize: "14px",
                cursor: "pointer",
                boxShadow: "0 2px 8px rgba(193,122,91,0.25)",
              }}
            >
              got it, keep going ✦
            </motion.button>
            <span style={{
              fontFamily: "var(--font-patrick), cursive",
              fontSize: "13px",
              color: "#bba89c",
            }}>
              sign up is always free & optional
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}