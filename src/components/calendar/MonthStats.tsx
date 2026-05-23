"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { type Entry } from "@/db/cozync.db";
import { MOOD_MAP } from "@/constants/moods";
import { StickerImg } from "@/components/ui/StickerImg";

interface MonthStatsProps {
  entries: Entry[];
  year: number;
  month: number; // Expecting 1-12
}

export function MonthStats({ entries, year, month }: MonthStatsProps) {
  const stats = useMemo(() => {
    // Correctly find total days in the given month
    const daysInMonth = new Date(year, month, 0).getDate();
    const today = new Date().toISOString().split("T")[0];
    const monthStr = `${year}-${String(month).padStart(2, "0")}`;

    // Only count days that actually belong to this month
    const monthEntries = entries.filter(e => e.date.startsWith(monthStr));
    const daysLogged = monthEntries.length;

    // Days passed so far in this month (up to today)
    let daysPassed = 0;
    for (let i = 1; i <= daysInMonth; i++) {
      const d = `${monthStr}-${String(i).padStart(2, "0")}`;
      if (d <= today) daysPassed++;
    }

    // Never exceed 100%
    const logPercent = daysPassed > 0
      ? Math.min(100, Math.round((daysLogged / daysPassed) * 100))
      : 0;

    // Top mood
    const moodCounts = monthEntries.reduce((acc, e) => {
      if (e.mood) acc[e.mood] = (acc[e.mood] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const topMoodEntry = Object.entries(moodCounts)
      .sort((a, b) => b[1] - a[1])[0];

    // Total wins
    const totalWins = monthEntries.reduce(
      (sum, e) => sum + (e.wins?.filter(w => w.trim()).length ?? 0), 0
    );

    return {
      daysLogged,
      daysPassed,
      daysInMonth,
      topMoodEntry,
      totalWins,
      logPercent,
    };
  }, [entries, year, month]);

  if (stats.daysLogged === 0) return null;

  const topMoodDef = stats.topMoodEntry
    ? MOOD_MAP[stats.topMoodEntry[0] as keyof typeof MOOD_MAP]
    : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
        gap: "12px",
        marginTop: "16px",
        padding: "16px",
        background: "#fffbf7",
        border: "1.5px solid #f0e0d0",
        borderRadius: "16px",
      }}
    >
      {/* Days logged */}
      <StatChip
        openmoji="1F4C5"
        label="days logged"
        value={`${stats.daysLogged} / ${stats.daysPassed}`}
        sub={`${stats.logPercent}% of days so far`}
      />

      {/* Top mood — with human context */}
      {topMoodDef && stats.topMoodEntry && (
        <StatChip
          openmoji={MOOD_OPENMOJI[stats.topMoodEntry[0]] ?? "2728"}
          label="most felt this month"
          value={topMoodDef.label}
          sub={getMoodContext(stats.topMoodEntry[0], stats.topMoodEntry[1])}
          valueColor={topMoodDef.textColor}
          valueBg={topMoodDef.bg}
        />
      )}

      {/* Total wins */}
      {stats.totalWins > 0 && (
        <StatChip
          openmoji="1F3C6"
          label="wins collected"
          value={String(stats.totalWins)}
          sub={getWinsContext(stats.totalWins)}
        />
      )}

      {/* Affirmation */}
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "8px 14px",
        background: "#fdf0e8",
        borderRadius: "12px",
        border: "1.5px solid #f0e0d0",
        minHeight: "64px",
      }}>
        <span style={{
          fontFamily: "var(--font-patrick), cursive",
          fontSize: "13px",
          color: "#c17a5b",
          fontStyle: "italic",
          textAlign: "center",
        }}>
          {getMonthAffirmation(stats.logPercent)}
        </span>
      </div>
    </motion.div>
  );
}

// Fixed the "ffunction" typo here
function StatChip({ openmoji, label, value, sub, valueColor = "#3d2f25", valueBg }: {
  openmoji: string;
  label: string;
  value: string;
  sub: string;
  valueColor?: string;
  valueBg?: string;
}) {
  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      gap: "12px",
      padding: "10px 14px",
      background: "#fdf8f3",
      borderRadius: "12px",
      border: "1.5px solid #f0e0d0",
      width: "100%",
    }}>
      <StickerImg openmoji={openmoji} size={24} alt={label} />
      <div>
        <div style={{
          fontFamily: "var(--font-patrick), cursive",
          fontSize: "10px",
          color: "#bba89c",
          textTransform: "uppercase",
          letterSpacing: "0.5px",
          marginBottom: "2px",
        }}>
          {label}
        </div>
        <div style={{
          display: "inline-block",
          fontFamily: "var(--font-cormorant), serif",
          fontSize: "20px",
          fontWeight: 600,
          color: valueColor,
          lineHeight: 1,
          background: valueBg ?? "transparent",
          borderRadius: valueBg ? "6px" : "0",
          padding: valueBg ? "2px 6px" : "0",
        }}>
          {value}
        </div>
        <div style={{
          fontFamily: "var(--font-nunito), sans-serif",
          fontSize: "11px",
          color: "#9a7b6b",
          marginTop: "4px",
          lineHeight: 1.3,
        }}>
          {sub}
        </div>
      </div>
    </div>
  );
}

const MOOD_OPENMOJI: Record<string, string> = {
  radiant: "1F338",
  good:    "1F33F",
  meh:     "2601",
  low:     "1F30A",
  hard:    "1F319",
};

function getMoodContext(moodId: string, count: number): string {
  const days = `${count} day${count > 1 ? "s" : ""}`;
  const map: Record<string, string> = {
    radiant: `glowing for ${days} ✦`,
    good:    `at peace for ${days} 🌿`,
    meh:     `floating through ${days} ☁️`,
    low:     `gentle with yourself for ${days} 🌊`,
    hard:    `kept going for ${days} 🌙`,
  };
  return map[moodId] ?? `${days} logged`;
}

function getWinsContext(count: number): string {
  if (count >= 20) return "you're unstoppable ✨";
  if (count >= 10) return "look at you go 🌸";
  if (count >= 5)  return "building momentum 🌿";
  return "every one counts ✦";
}

function getMonthAffirmation(percent: number): string {
  if (percent >= 80) return "you're showing up beautifully ✦";
  if (percent >= 50) return "more than halfway there 🌿";
  if (percent >= 25) return "every page counts 🌸";
  return "a story worth starting ☁️";
}