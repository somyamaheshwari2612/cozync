"use client";

import { motion } from "framer-motion";
import { STICKER_PACKS } from "@/constants/stickers";
import { useStickerStore } from "@/store/useStickerStore";
import { StickerImg } from "@/components/ui/StickerImg";

export function StickersPage() {
  const { isUnlocked } = useStickerStore();

  return (
    <div style={{ maxWidth: "680px" }}>
      <h1 style={{
        fontFamily: "var(--font-cormorant), serif",
        fontSize: "38px",
        fontWeight: 600,
        color: "#c17a5b",
        marginBottom: "6px",
      }}>
        your sticker collection ✦
      </h1>
      <p style={{
        fontFamily: "var(--font-patrick), cursive",
        fontSize: "14px",
        color: "#9a7b6b",
        marginBottom: "28px",
      }}>
        keep showing up — new packs unlock as your story grows 🌸
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
        {STICKER_PACKS.map((pack, pi) => {
          const unlocked = isUnlocked(pack.id);
          return (
            <motion.div
              key={pack.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: pi * 0.08 }}
              style={{
                background: unlocked ? "#fffbf7" : "#fdf8f3",
                border: `1.5px ${unlocked ? "solid" : "dashed"} ${unlocked ? "#e8c5a8" : "#f0e0d0"}`,
                borderRadius: "18px",
                padding: "20px 24px",
                opacity: unlocked ? 1 : 0.7,
              }}
            >
              {/* Pack header */}
              <div style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                marginBottom: "14px",
              }}>
                {!unlocked && (
                  <StickerImg openmoji="1F512" size={20} alt="locked" />
                )}
                <div>
                  <p style={{
                    fontFamily: "var(--font-cormorant), serif",
                    fontSize: "22px",
                    fontWeight: 600,
                    color: unlocked ? "#c17a5b" : "#bba89c",
                    lineHeight: 1,
                  }}>
                    {pack.name}
                  </p>
                  <p style={{
                    fontFamily: "var(--font-patrick), cursive",
                    fontSize: "12px",
                    color: "#bba89c",
                    marginTop: "2px",
                  }}>
                    {unlocked ? pack.description : pack.unlockHint}
                  </p>
                </div>
                {unlocked && (
                  <span style={{
                    marginLeft: "auto",
                    background: "#e8f5e9",
                    border: "1.5px solid #a8d8a8",
                    borderRadius: "999px",
                    padding: "3px 10px",
                    fontFamily: "var(--font-patrick), cursive",
                    fontSize: "11px",
                    color: "#2e6b2e",
                  }}>
                    unlocked ✓
                  </span>
                )}
              </div>

              {/* Stickers grid */}
              <div style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "8px",
              }}>
                {pack.stickers.map((s, i) => (
                  <motion.div
                    key={s.id}
                    whileHover={unlocked ? { scale: 1.12, rotate: -3, y: -2 } : {}}
                    style={{
                      background: unlocked ? "#fdf0e8" : "#f5ece4",
                      border: "1.5px solid #f0e0d0",
                      borderRadius: "12px",
                      padding: "10px",
                      filter: unlocked ? "none" : "grayscale(1) opacity(0.5)",
                      cursor: unlocked ? "default" : "not-allowed",
                    }}
                    title={s.name}
                  >
                    <StickerImg openmoji={s.openmoji} size={32} alt={s.name} />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}