"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MoodPicker } from "./MoodPicker";
import { StickerTray } from "./StickerTray";
import { useEntryStore } from "@/store/useEntryStore";
import { useUserStore } from "@/store/useUserStore";
import { type MoodId } from "@/db/cozync.db";

interface ChipType {
  label: string;
}

const REMINDER_CHIPS: ChipType[] = [
  { label: "drink water 💧" },
  { label: "get some rest 🌙" },
  { label: "go outside 🌿" },
  { label: "call someone 🩷" },
  { label: "take it slow ☁️" },
  { label: "celebrate yourself ✨" },
  { label: "eat well 🍵" },
  { label: "move your body 🌸" },
  { label: "journal tonight 📒" },
  { label: "be kind to yourself 🧸" },
];

function ReminderChip({
  chip,
  isSelected,
  onToggle,
}: {
  chip: ChipType;
  isSelected: boolean;
  onToggle: () => void;
}) {
  return (
    <motion.button
      onClick={onToggle}
      whileHover={{ scale: 1.06, y: -1 }}
      whileTap={{ scale: 0.94 }}
      style={{
        background: isSelected ? "#f3e5f5" : "#fffbf7",
        border: `${isSelected ? "2px" : "1.5px"} solid ${isSelected ? "#9b6cb0" : "#e8c5a8"}`,
        borderRadius: "999px",
        padding: "5px 12px",
        fontFamily: "var(--font-patrick), cursive",
        fontSize: "12px",
        color: isSelected ? "#4a2860" : "#9a7b6b",
        cursor: "pointer",
        transition: "all 0.15s ease",
        whiteSpace: "nowrap",
      }}
    >
      {chip.label}
    </motion.button>
  );
}

interface DayPanelProps {
  date: string;
  onClose?: () => void;
}

const PANEL_VARIANTS = {
  hidden: { opacity: 0, x: 32 },
  visible: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 32 },
};

function formatDisplayDate(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

function getAffirmation(date: string): string {
  const today = new Date().toISOString().split("T")[0];
  const past = [
    "you showed up that day ✦",
    "this day is part of your story 🌸",
    "look how far you've come 🌿",
    "you made it through ☁️",
    "another page written ✨",
    "that day was yours 🌙",
    "progress, however small 🌱",
  ];
  const present = [
    "you showed up today ✦",
    "this day is worth remembering 🌸",
    "small moments matter 🌿",
    "you made it through ☁️",
    "another page in your story ✨",
    "today is yours 🌙",
    "progress, however small 🌱",
  ];
  const pool = date < today ? past : present;
  const seed = new Date(date).getDate() % pool.length;
  return pool[seed];
}

export function DayPanel({ date, onClose }: DayPanelProps) {
  const { getEntry, saveEntry } = useEntryStore();
  const { meta } = useUserStore();

  const entry = getEntry(date);

  const [mood, setMood] = useState<MoodId | undefined>(entry?.mood);
  const [note, setNote] = useState(entry?.note ?? "");
  const [wins, setWins] = useState<string[]>(entry?.wins ?? ["", "", ""]);
  const [selectedSticker, setSelectedSticker] = useState(
    entry?.stickers?.[0]?.stickerId ?? ""
  );
  const [isSaving, setIsSaving] = useState(false);
  const [savedOnce, setSavedOnce] = useState(!!entry);

  const unlockedPackIds = meta?.unlockedPacks ?? ["default"];

  // Sync state when date changes
  useEffect(() => {
    const e = getEntry(date);
    setMood(e?.mood);
    setNote(e?.note ?? "");
    setWins(e?.wins ?? ["", "", ""]);
    setSelectedSticker(e?.stickers?.[0]?.stickerId ?? "");
    setSavedOnce(!!e);
  }, [date, getEntry]);

  const handleSave = useCallback(async () => {
    setIsSaving(true);
    const stickers = selectedSticker
      ? [{ packId: "default", stickerId: selectedSticker }]
      : [];
    const cleanWins = wins.filter((w) => w.trim().length > 0);

    await saveEntry(date, {
      mood,
      note: note.trim(),
      stickers,
      wins: cleanWins,
    });

    setIsSaving(false);
    setSavedOnce(true);
  }, [date, mood, note, wins, selectedSticker, saveEntry]);

  // Derived tracking point to break array reference lifecycle loop
  const winsString = JSON.stringify(wins);

  // Auto-save 1.2s after any change
  useEffect(() => {
    if (!mood && !note && !selectedSticker && wins.every((w) => !w)) return;
    const timer = setTimeout(() => {
      handleSave();
    }, 1200);
    return () => clearTimeout(timer);
  }, [mood, note, selectedSticker, winsString, handleSave]);

  const today = new Date().toISOString().split("T")[0];
  const isFuture = date > today;

  return (
    <motion.div
      key={date}
      variants={PANEL_VARIANTS}
      initial="hidden"
      animate="visible"
      exit="exit"
      transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        overflowY: "auto",
      }}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-1">
        <div>
          <p className="font-journal text-sm text-muted">
            {formatDisplayDate(date)}
          </p>
          <h2 className="font-display text-3xl text-terracotta leading-tight">
            {isFuture ? "a day ahead ✦" : "how was your day?"}
          </h2>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="text-hint hover:text-muted transition-colors mt-1
              font-journal text-xl leading-none focus:outline-none"
          >
            ×
          </button>
        )}
      </div>

      {/* Affirmation */}
      <AnimatePresence mode="wait">
        {savedOnce && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="font-journal text-xs mb-4"
            style={{ color: "#c17a5b" }}
          >
            {getAffirmation(date)}
          </motion.p>
        )}
      </AnimatePresence>

      {isFuture ? (
        /* Future date — reminder/intention setter */
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <p
            style={{
              fontFamily: "var(--font-patrick), cursive",
              fontSize: "14px",
              color: "#bba89c",
              lineHeight: 1.6,
            }}
          >
            this page hasn't been written yet —<br />
            but you can leave yourself a note for when it arrives 🌙
          </p>

          {/* Intention / reminder input */}
          <div>
            <p
              style={{
                fontFamily: "var(--font-patrick), cursive",
                fontSize: "13px",
                color: "#9a7b6b",
                marginBottom: "8px",
              }}
            >
              set an intention ✦
            </p>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="what do you want to remember to do? what are you looking forward to?"
              maxLength={300}
              rows={3}
              style={{
                width: "100%",
                background: "#fffbf7",
                border: "1.5px solid #e8c5a8",
                borderRadius: "14px",
                padding: "12px 14px",
                fontFamily: "var(--font-nunito), sans-serif",
                fontSize: "14px",
                color: "#3d2f25",
                lineHeight: "1.6",
                resize: "none",
                outline: "none",
                transition: "border-color 0.15s",
              }}
              onFocus={(e) => (e.target.style.borderColor = "#c17a5b")}
              onBlur={(e) => (e.target.style.borderColor = "#e8c5a8")}
            />
            <p
              style={{
                textAlign: "right",
                fontFamily: "var(--font-nunito), sans-serif",
                fontSize: "11px",
                color: "#bba89c",
                marginTop: "4px",
              }}
            >
              {note.length}/300
            </p>
          </div>

          {/* Reminder chips — quick intentions */}
          <div>
            <p
              style={{
                fontFamily: "var(--font-patrick), cursive",
                fontSize: "13px",
                color: "#9a7b6b",
                marginBottom: "8px",
              }}
            >
              quick reminders
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
              {REMINDER_CHIPS.map((chip) => (
                <ReminderChip
                  key={chip.label}
                  chip={chip}
                  isSelected={wins.includes(chip.label)}
                  onToggle={() => {
                    setWins((prev) => {
                      const exists = prev.includes(chip.label);
                      if (exists) {
                        const filtered = prev.filter((w) => w !== chip.label);
                        // Maintain the base layout array structure if it gets empty
                        return filtered.length === 0 ? ["", "", ""] : filtered;
                      } else {
                        // Strip empty structural fields before appending explicit text values
                        const activeChips = prev.filter((w) => w.trim().length > 0);
                        return [...activeChips, chip.label];
                      }
                    });
                  }}
                />
              ))}
            </div>
          </div>

          {/* Save intention button */}
          <motion.button
            onClick={handleSave}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            style={{
              background: "#c9b8d8",
              color: "#4a3660",
              border: "none",
              borderRadius: "999px",
              padding: "10px 22px",
              fontFamily: "var(--font-patrick), cursive",
              fontSize: "14px",
              cursor: "pointer",
              alignSelf: "flex-end",
              boxShadow: "0 2px 8px rgba(201,184,216,0.3)",
            }}
          >
            save intention 🌙
          </motion.button>

          {/* Saved confirm */}
          <AnimatePresence mode="wait">
            {savedOnce && (
              <motion.p
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                style={{
                  fontFamily: "var(--font-patrick), cursive",
                  fontSize: "12px",
                  color: "#9b6cb0",
                  textAlign: "right",
                  marginTop: "-8px",
                }}
              >
                ✓ intention saved
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {/* Mood */}
          <MoodPicker selected={mood} onChange={setMood} />

          {/* Note */}
          <div>
            <p className="font-journal text-sm text-muted mb-2">
              a note to yourself
            </p>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder={
                date === new Date().toISOString().split("T")[0]
                  ? "what happened today? how did it feel?"
                  : date < new Date().toISOString().split("T")[0]
                  ? "what do you remember about this day?"
                  : "this page hasn't been written yet..."
              }
              maxLength={500}
              rows={4}
              style={{
                width: "100%",
                background: "#fffbf7",
                border: "1.5px solid #e8c5a8",
                borderRadius: "14px",
                padding: "12px 14px",
                fontFamily: "var(--font-nunito), sans-serif",
                fontSize: "14px",
                color: "#3d2f25",
                lineHeight: "1.6",
                resize: "none",
                outline: "none",
                transition: "border-color 0.15s",
              }}
              onFocus={(e) => (e.target.style.borderColor = "#c17a5b")}
              onBlur={(e) => (e.target.style.borderColor = "#e8c5a8")}
            />
            <p
              className="text-right font-sans mt-1"
              style={{ fontSize: "11px", color: "#bba89c" }}
            >
              {note.length}/500
            </p>
          </div>

          {/* Top 3 wins */}
          <div>
            <p className="font-journal text-sm text-muted mb-2">
              wins of the day 🏆
            </p>
            <div className="flex flex-col gap-2">
              {wins.map((win, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span
                    style={{
                      fontFamily: "var(--font-patrick), cursive",
                      fontSize: "13px",
                      color: "#c17a5b",
                      minWidth: "18px",
                    }}
                  >
                    {i + 1}.
                  </span>
                  <input
                    type="text"
                    value={win}
                    onChange={(e) => {
                      const updated = [...wins];
                      updated[i] = e.target.value;
                      setWins(updated);
                    }}
                    placeholder={
                      i === 0
                        ? "something you did well..."
                        : i === 1
                        ? "a small victory..."
                        : i === 2
                        ? "even tiny things count..."
                        : "one more win..."
                    }
                    maxLength={100}
                    style={{
                      flex: 1,
                      background: "#fffbf7",
                      border: "1.5px solid #e8c5a8",
                      borderRadius: "10px",
                      padding: "8px 12px",
                      fontFamily: "var(--font-nunito), sans-serif",
                      fontSize: "13px",
                      color: "#3d2f25",
                      outline: "none",
                      transition: "border-color 0.15s",
                    }}
                    onFocus={(e) => (e.target.style.borderColor = "#c17a5b")}
                    onBlur={(e) => (e.target.style.borderColor = "#e8c5a8")}
                  />
                  {wins.length > 1 && (
                    <button
                      onClick={() =>
                        setWins(wins.filter((_, idx) => idx !== i))
                      }
                      style={{
                        color: "#bba89c",
                        fontSize: "16px",
                        lineHeight: 1,
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        padding: "0 2px",
                      }}
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}
            </div>
            <motion.button
              onClick={() => setWins([...wins, ""])}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              style={{
                marginTop: "8px",
                background: "transparent",
                border: "1.5px dashed #e8c5a8",
                borderRadius: "10px",
                padding: "6px 14px",
                fontFamily: "var(--font-patrick), cursive",
                fontSize: "13px",
                color: "#bba89c",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "6px",
                width: "100%",
                justifyContent: "center",
              }}
            >
              <span style={{ fontSize: "16px", lineHeight: 1 }}>+</span>
              add another win
            </motion.button>
          </div>

          {/* Sticker tray */}
          <StickerTray
            selectedStickerId={selectedSticker}
            unlockedPackIds={unlockedPackIds}
            onSelect={setSelectedSticker}
          />

          {/* Save indicator */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              paddingBottom: "24px",
              paddingTop: "8px",
              gap: "12px",
            }}
          >
            <AnimatePresence mode="wait">
              {isSaving ? (
                <motion.span
                  key="saving"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  style={{
                    fontFamily: "var(--font-patrick), cursive",
                    fontSize: "12px",
                    color: "#bba89c",
                  }}
                >
                  saving...
                </motion.span>
              ) : savedOnce ? (
                <motion.span
                  key="saved"
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  style={{
                    fontFamily: "var(--font-patrick), cursive",
                    fontSize: "12px",
                    color: "#72b872",
                    whiteSpace: "nowrap",
                  }}
                >
                  ✓ saved locally
                </motion.span>
              ) : (
                <span />
              )}
            </AnimatePresence>

            <motion.button
              onClick={handleSave}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              style={{
                background: "#c17a5b",
                color: "#fffbf7",
                border: "none",
                borderRadius: "999px",
                padding: "10px 22px",
                fontFamily: "var(--font-patrick), cursive",
                fontSize: "14px",
                cursor: "pointer",
                whiteSpace: "nowrap",
                flexShrink: 0,
                boxShadow: "0 2px 8px rgba(193,122,91,0.25)",
              }}
            >
              save entry ✦
            </motion.button>
          </div>
        </div>
      )}
    </motion.div>
  );
}