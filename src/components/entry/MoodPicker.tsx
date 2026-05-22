"use client";

import { motion } from "framer-motion";
import { MOODS, type MoodDef } from "@/constants/moods";
import { type MoodId } from "@/db/cozync.db";
import { Emoji } from "@/components/ui/Emoji";

interface MoodPickerProps {
  selected?: MoodId;
  onChange: (mood: MoodId) => void;
}

export function MoodPicker({ selected, onChange }: MoodPickerProps) {
  return (
    <div>
      <p className="font-journal text-sm text-muted mb-3">
        how are you feeling?
      </p>
     <div style={{
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap",
        gap: "8px",
      }}>
        {MOODS.map((mood) => (
          <MoodChip
            key={mood.id}
            mood={mood}
            isSelected={selected === mood.id}
            onSelect={() => onChange(mood.id)}
          />
        ))}
      </div>
    </div>
  );
}

function MoodChip({
  mood,
  isSelected,
  onSelect,
}: {
  mood: MoodDef;
  isSelected: boolean;
  onSelect: () => void;
}) {
  const MOOD_EMOJIS: Record<string, string> = {
    radiant: "🌸",
    good: "🌿",
    meh: "☁️",
    low: "🌊",
    hard: "🌙",
  };

  return (
    <motion.button
      onClick={onSelect}
      whileHover={{ scale: 1.08, y: -1 }}
      whileTap={{ scale: 0.94 }}
      transition={{ duration: 0.15 }}
      style={{
        background: isSelected ? mood.bg : "#fffbf7",
        borderColor: isSelected ? mood.dot : "#e8c5a8",
        borderWidth: "2px",
        borderStyle: "solid",
        color: isSelected ? mood.textColor : "#9a7b6b",
        borderRadius: "999px",
        padding: "6px 12px",
        display: "flex",
        alignItems: "center",
        gap: "5px",
        cursor: "pointer",
        fontFamily: "var(--font-patrick), cursive",
        fontSize: "13px",
        transition: "all 0.15s ease",
        whiteSpace: "nowrap",
      }}
    >
      <span style={{ fontSize: "18px", lineHeight: 1 }}>
        {MOOD_EMOJIS[mood.id]}
      </span>
      <span>{mood.label}</span>
    </motion.button>
  );
}