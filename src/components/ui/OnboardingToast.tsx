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
        <>
          {/* Backdrop — tap to dismiss on mobile */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onDismiss}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 190,
              background: "rgba(61,47,37,0.15)",
            }}
          />

          {/* Sheet */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
            style={{
              position: "fixed",
              bottom: 0,
              left: 0,
              right: 0,
              zIndex: 200,
              background: "#fffbf7",
              border: "1.5px solid #e8c5a8",
              borderRadius: "20px 20px 0 0",
              padding: "24px 24px 40px",
              boxShadow: "0 -8px 40px rgba(61,47,37,0.14)",
              display: "flex",
              flexDirection: "column",
              gap: "14px",
              maxHeight: "80vh",
              overflowY: "auto",
              WebkitOverflowScrolling: "touch",
            }}
          >
            {/* Drag handle */}
            <div style={{
              width: "36px",
              height: "4px",
              background: "#e8c5a8",
              borderRadius: "999px",
              margin: "0 auto 4px",
              flexShrink: 0,
            }} />

            {/* Header */}
            <div style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexShrink: 0,
            }}>
              <div style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
              }}>
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
                  fontSize: "22px",
                  lineHeight: 1,
                  padding: "0 4px",
                  flexShrink: 0,
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
              lineHeight: 1.7,
              margin: 0,
              flexShrink: 0,
            }}>
              Your entries are saved{" "}
              <strong>right here on this device</strong> — no account needed,
              no data sent anywhere. Cozync works entirely offline.
            </p>

            <p style={{
              fontFamily: "var(--font-nunito), sans-serif",
              fontSize: "14px",
              color: "#6b5044",
              lineHeight: 1.7,
              margin: 0,
              flexShrink: 0,
            }}>
              Want to access your journal across devices? You can create a{" "}
              <strong>free account</strong> anytime to sync — your data
              migrates instantly, nothing is lost.
            </p>

            {/* Actions */}
            <div style={{
              display: "flex",
              gap: "12px",
              alignItems: "center",
              flexWrap: "wrap",
              flexShrink: 0,
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
                  padding: "11px 24px",
                  fontFamily: "var(--font-patrick), cursive",
                  fontSize: "14px",
                  cursor: "pointer",
                  boxShadow: "0 2px 8px rgba(193,122,91,0.25)",
                  whiteSpace: "nowrap",
                }}
              >
                got it, keep going ✦
              </motion.button>
              <span style={{
                fontFamily: "var(--font-patrick), cursive",
                fontSize: "12px",
                color: "#bba89c",
              }}>
                sign up is always free & optional
              </span>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}