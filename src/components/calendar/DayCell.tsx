"use client";

import { motion } from "framer-motion";
import { MOOD_MAP } from "@/constants/moods";
import { type Entry } from "@/db/cozync.db";
import { StickerImg } from "@/components/ui/StickerImg";
import { STICKER_MAP } from "@/constants/stickers";

interface DayCellProps {
  day: number;
  date: string;
  entry?: Entry;
  isToday: boolean;
  isSelected: boolean;
  isFuture: boolean;
  hasSelection: boolean;
  onClick: () => void;
}

export function DayCell({
  day,
  entry,
  isToday,
  isSelected,
  isFuture,
  hasSelection,
  onClick,
}: DayCellProps) {
  const mood     = entry?.mood ? MOOD_MAP[entry.mood] : null;
  const topSticker = entry?.stickers?.[0];
  const stickerDef = topSticker ? STICKER_MAP[topSticker.stickerId] : null;
  const wins     = entry?.wins?.filter(w => w.trim().length > 0) ?? [];

  const showTodayRing = isToday;

  // Empty cells get a soft warm beige, logged cells get mood color
  const bgColor = isSelected
    ? mood ? mood.bg : "#fdf0e8"
    : mood
    ? mood.bg
    : "#faf5ef";   // ← warm beige for all empty cells

  const borderColor = isSelected
    ? "#c17a5b"
    : showTodayRing
    ? "#c17a5b"
    : mood
    ? "#e8c5a8"
    : "#f0e4d8";   // ← subtle warm border always visible

  const borderWidth = isSelected || showTodayRing ? "2px" : "1px";

  return (
    <motion.button
      onClick={onClick}
      whileHover={!isFuture ? { scale: 1.06, y: -2 } : { scale: 1.01 }}
      whileTap={{ scale: 0.95 }}
      transition={{ duration: 0.15, ease: [0.25, 0.1, 0.25, 1] }}
     style={{
  background: bgColor,
  borderColor,
  borderWidth,
  borderStyle: "solid",
  opacity: isFuture ? 0.4 : 1,
  height: "100%",        // ← fills full row height
  minHeight: "72px",     // ← floor so empty rows don't collapse
  width: "100%",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "flex-start",
  paddingTop: "8px",
  paddingBottom: "6px",
  paddingLeft: "3px",
  paddingRight: "3px",
  gap: "2px",
  borderRadius: "14px",
  cursor: "pointer",
  position: "relative",
  boxShadow: isSelected
    ? "0 2px 12px rgba(193,122,91,0.15)"
    : "0 1px 3px rgba(61,47,37,0.04)",
}}
    >
      {/* Sticker */}
      {stickerDef && (
        <StickerImg
          openmoji={stickerDef.openmoji}
          size={26}
          alt={stickerDef.name}
        />
      )}

      {/* Day number */}
      <span
        style={{
          fontFamily: "var(--font-patrick), cursive",
          fontSize: "13px",
          lineHeight: 1,
          userSelect: "none",
          color: showTodayRing
            ? "#a0563a"
            : mood
            ? mood.textColor
            : "#b5a090",
          fontWeight: isToday ? 700 : 400,
        }}
      >
        {day}
      </span>

      {/* Mood dot — when no sticker */}
      {mood && !stickerDef && (
        <span
          style={{
            width: "4px",
            height: "4px",
            borderRadius: "50%",
            background: mood.dot,
            display: "block",
          }}
        />
      )}

      {/* Wins preview */}
      {wins.length > 0 && (
        <div
          style={{
            width: "100%",
            padding: "0 3px",
            display: "flex",
            flexDirection: "column",
            gap: "1px",
            marginTop: "1px",
          }}
        >
          {wins.slice(0, 2).map((win, i) => (
            <span
              key={i}
              style={{
                fontFamily: "var(--font-nunito), sans-serif",
                fontSize: "7.5px",
                color: mood ? mood.textColor : "#9a7b6b",
                lineHeight: 1.3,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                display: "block",
                width: "100%",
                textAlign: "center",
                opacity: 0.9,
              }}
            >
              · {win}
            </span>
          ))}
          {wins.length > 2 && (
            <span
              style={{
                fontSize: "7px",
                color: "#bba89c",
                textAlign: "center",
                fontFamily: "var(--font-nunito), sans-serif",
              }}
            >
              +{wins.length - 2} more
            </span>
          )}
        </div>
      )}
    </motion.button>
  );
}