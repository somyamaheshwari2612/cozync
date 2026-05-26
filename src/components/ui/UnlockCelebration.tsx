"use client";

import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { StickerImg } from "./StickerImg";
import { type StickerPack } from "@/constants/stickers";

interface UnlockCelebrationProps {
  pack: StickerPack | null;
  onDone: () => void;
  onUseStickers: () => void;
}

const PARTICLES = [
  { emoji: "🌸", x: -140, drift: 30 },
  { emoji: "✨", x: -100, drift: -40 },
  { emoji: "⭐", x: -60,  drift: 50 },
  { emoji: "🌿", x: -20,  drift: -30 },
  { emoji: "🩷", x: 20,   drift: 60 },
  { emoji: "☁️", x: 60,   drift: -50 },
  { emoji: "🌙", x: 100,  drift: 40 },
  { emoji: "✦",  x: 140,  drift: -60 },
];

function Particle({ delay, x, drift, emoji }: {
  delay: number; x: number; drift: number; emoji: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 1, y: 0, x, scale: 0.5, rotate: 0 }}
      animate={{ opacity: 0, y: -200, x: x + drift, scale: 1.4, rotate: 180 }}
      transition={{ duration: 1.8, delay, ease: [0.25, 0.1, 0.25, 1] }}
      style={{
        position: "absolute",
        bottom: "80px",
        left: "50%",
        fontSize: "22px",
        pointerEvents: "none",
        userSelect: "none",
      }}
    >
      {emoji}
    </motion.div>
  );
}

// Plays a soft, cozy chime using Web Audio API — no external file needed
function playUnlockChime() {
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;

    const ctx = new AudioCtx();

    // Resume in case context was suspended by browser autoplay policy
    const resume = ctx.state === "suspended" ? ctx.resume() : Promise.resolve();

    resume.then(() => {
      const notes = [523.25, 659.25, 783.99, 1046.50];
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.18);
        gain.gain.setValueAtTime(0, ctx.currentTime + i * 0.18);
        gain.gain.linearRampToValueAtTime(0.18, ctx.currentTime + i * 0.18 + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.18 + 0.6);
        osc.start(ctx.currentTime + i * 0.18);
        osc.stop(ctx.currentTime + i * 0.18 + 0.7);
      });

      // Finishing sparkle
      setTimeout(() => {
        const osc2 = ctx.createOscillator();
        const gain2 = ctx.createGain();
        osc2.connect(gain2);
        gain2.connect(ctx.destination);
        osc2.type = "sine";
        osc2.frequency.setValueAtTime(1568, ctx.currentTime);
        gain2.gain.setValueAtTime(0.1, ctx.currentTime);
        gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
        osc2.start(ctx.currentTime);
        osc2.stop(ctx.currentTime + 0.5);
      }, notes.length * 180 + 100);
    }).catch(() => {
      // Audio blocked — fail silently
    });

  } catch {
    // Audio not available
  }
}

export function UnlockCelebration({ pack, onDone, onUseStickers }: UnlockCelebrationProps) {
  const hasPlayed = useRef(false);

  useEffect(() => {
    if (pack && !hasPlayed.current) {
      hasPlayed.current = true;
      // Attempt to play immediately — works if user has interacted with page
      playUnlockChime();
    }
    if (!pack) hasPlayed.current = false;
  }, [pack]);

  // No auto-dismiss — stays until user clicks button or ×
  return (
    <AnimatePresence>
      {pack && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 300,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(253,248,243,0.88)",
            backdropFilter: "blur(8px)",
          }}
        >
          {/* Particles — replay on each appearance */}
          {PARTICLES.map((p, i) => (
            <Particle
              key={`${pack.id}-${i}`}
              delay={i * 0.08}
              x={p.x}
              drift={p.drift}
              emoji={p.emoji}
            />
          ))}

          {/* Card */}
          <motion.div
          onClick={playUnlockChime} 
            initial={{ scale: 0.7, opacity: 0, y: 24 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.92, opacity: 0, y: 8 }}
            transition={{ duration: 0.45, ease: [0.25, 0.1, 0.25, 1] }}
            style={{
              background: "#fffbf7",
              border: "2px solid #e8c5a8",
              borderRadius: "24px",
              padding: "36px 40px",
              textAlign: "center",
              maxWidth: "380px",
              width: "90vw",
              boxShadow: "0 16px 64px rgba(193,122,91,0.2)",
              position: "relative",
              zIndex: 1,
            }}
          >
            {/* Pulsing glow ring */}
            <motion.div
              animate={{ scale: [1, 1.06, 1], opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
              style={{
                position: "absolute",
                inset: "-14px",
                borderRadius: "34px",
                border: "2px solid #e8c5a8",
                pointerEvents: "none",
              }}
            />

            {/* Close × */}
            <button
              onClick={onDone}
              style={{
                position: "absolute",
                top: "14px",
                right: "16px",
                background: "none",
                border: "none",
                cursor: "pointer",
                fontSize: "20px",
                color: "#bba89c",
                lineHeight: 1,
                padding: "4px",
              }}
            >
              ×
            </button>

            {/* Unlocked lock */}
            <motion.div
              initial={{ scale: 0, rotate: -20 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.2, duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
              style={{ marginBottom: "12px" }}
            >
              <StickerImg openmoji="1F513" size={56} alt="unlocked" />
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              style={{
                fontFamily: "var(--font-patrick), cursive",
                fontSize: "12px",
                color: "#bba89c",
                marginBottom: "6px",
                textTransform: "uppercase",
                letterSpacing: "1px",
              }}
            >
              new pack unlocked ✦
            </motion.p>

            <motion.h2
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.42 }}
              style={{
                fontFamily: "var(--font-cormorant), serif",
                fontSize: "34px",
                fontWeight: 600,
                color: "#c17a5b",
                marginBottom: "6px",
                lineHeight: 1.1,
              }}
            >
              {pack.name}
            </motion.h2>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              style={{
                fontFamily: "var(--font-nunito), sans-serif",
                fontSize: "14px",
                color: "#9a7b6b",
                marginBottom: "24px",
                lineHeight: 1.55,
              }}
            >
              {pack.description}
            </motion.p>

            {/* Sticker preview */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.58 }}
              style={{
                display: "flex",
                justifyContent: "center",
                gap: "8px",
                flexWrap: "wrap",
                marginBottom: "28px",
              }}
            >
              {pack.stickers.slice(0, 5).map((s, i) => (
                <motion.div
                  key={s.id}
                  initial={{ scale: 0, rotate: -12 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{
                    delay: 0.65 + i * 0.08,
                    duration: 0.35,
                    ease: [0.25, 0.1, 0.25, 1],
                  }}
                  style={{
                    background: "#fdf0e8",
                    border: "1.5px solid #e8c5a8",
                    borderRadius: "14px",
                    padding: "10px",
                  }}
                >
                  <StickerImg openmoji={s.openmoji} size={34} alt={s.name} />
                </motion.div>
              ))}
            </motion.div>

            <motion.button
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.95 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                onDone();
                onUseStickers();
              }}
              style={{
                background: "#c17a5b",
                color: "#fffbf7",
                border: "none",
                borderRadius: "999px",
                padding: "12px 32px",
                fontFamily: "var(--font-patrick), cursive",
                fontSize: "15px",
                cursor: "pointer",
                boxShadow: "0 2px 14px rgba(193,122,91,0.3)",
              }}
            >
              use my new stickers ✨
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}