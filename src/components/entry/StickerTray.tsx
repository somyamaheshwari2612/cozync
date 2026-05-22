"use client";

import { motion, AnimatePresence } from "framer-motion";
import { STICKER_PACKS } from "@/constants/stickers";
import { StickerImg } from "@/components/ui/StickerImg";

interface StickerTrayProps {
  selectedStickerId?: string;
  unlockedPackIds: string[];
  onSelect: (stickerId: string) => void;
}

export function StickerTray({
  selectedStickerId,
  unlockedPackIds,
  onSelect,
}: StickerTrayProps) {
  const unlockedPacks = STICKER_PACKS.filter((p) =>
    unlockedPackIds.includes(p.id)
  );
  const lockedPacks = STICKER_PACKS.filter(
    (p) => !unlockedPackIds.includes(p.id)
  );

  return (
    <div>
      <p className="font-journal text-sm text-muted mb-3">
        add a sticker ✦
      </p>

      {unlockedPacks.map((pack) => (
        <div key={pack.id} className="mb-4">
          <p
            style={{
              fontFamily: "var(--font-patrick), cursive",
              fontSize: "11px",
              color: "#bba89c",
              textTransform: "uppercase",
              letterSpacing: "0.6px",
              marginBottom: "8px",
            }}
          >
            {pack.name}
          </p>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "8px",
            }}
          >
            <AnimatePresence>
              {pack.stickers.map((sticker, i) => {
                const isSelected = selectedStickerId === sticker.id;
                return (
                  <motion.button
                    key={sticker.id}
                    initial={{ opacity: 0, scale: 0.7 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.025, duration: 0.2 }}
                    whileHover={{
                      scale: 1.18,
                      rotate: [-2, 2, -2][i % 3],
                      y: -3,
                    }}
                    whileTap={{ scale: 0.88 }}
                    onClick={() =>
                      onSelect(isSelected ? "" : sticker.id)
                    }
                    title={sticker.name}
                    style={{
                      background: isSelected ? "#fde8d8" : "#fffbf7",
                      border: `${isSelected ? "2px" : "1.5px"} solid ${
                        isSelected ? "#c17a5b" : "#f0e0d0"
                      }`,
                      borderRadius: "14px",
                      padding: "8px",
                      cursor: "pointer",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: "4px",
                      width: "64px",
                      boxShadow: isSelected
                        ? "0 2px 8px rgba(193,122,91,0.2)"
                        : "none",
                      transition: "all 0.15s ease",
                    }}
                  >
                    <StickerImg
                      openmoji={sticker.openmoji}
                      size={36}
                      alt={sticker.name}
                    />
                    <span
                      style={{
                        fontFamily: "var(--font-patrick), cursive",
                        fontSize: "10px",
                        color: isSelected ? "#a0563a" : "#bba89c",
                        textAlign: "center",
                        lineHeight: 1.2,
                        maxWidth: "100%",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {sticker.name}
                    </span>
                  </motion.button>
                );
              })}
            </AnimatePresence>
          </div>
        </div>
      ))}

      {/* Locked packs */}
      {lockedPacks.length > 0 && (
        <div className="flex flex-col gap-2 mt-2">
          {lockedPacks.map((pack) => (
            <motion.div
              key={pack.id}
              whileHover={{ opacity: 0.9 }}
              style={{
                background: "#fdf8f3",
                border: "1.5px dashed #e8c5a8",
                borderRadius: "12px",
                padding: "10px 14px",
                display: "flex",
                alignItems: "center",
                gap: "10px",
                opacity: 0.65,
              }}
            >
              {/* Preview first 3 stickers blurred */}
              <div style={{ display: "flex", gap: "4px" }}>
                {pack.stickers.slice(0, 3).map((s) => (
                  <div
                    key={s.id}
                    style={{ filter: "grayscale(1) opacity(0.4)" }}
                  >
                    <StickerImg
                      openmoji={s.openmoji}
                      size={24}
                      alt={s.name}
                    />
                  </div>
                ))}
              </div>
              <div>
                <p
                  style={{
                    fontFamily: "var(--font-patrick), cursive",
                    fontSize: "12px",
                    color: "#9a7b6b",
                    marginBottom: "2px",
                  }}
                >
                  🔒 {pack.name}
                </p>
                <p
                  style={{
                    fontFamily: "var(--font-nunito), sans-serif",
                    fontSize: "11px",
                    color: "#bba89c",
                  }}
                >
                  {pack.unlockHint}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}