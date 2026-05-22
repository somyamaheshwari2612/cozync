"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { DayCell } from "@/components/calendar/DayCell";
import { type Entry } from "@/db/cozync.db";

interface CalendarGridProps {
  year: number;
  month: number;
  entries: Record<string, Entry>;
  selectedDate: string | null;
  onSelectDate: (date: string) => void;
}

const DOW_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month, 0).getDate();
}

function getFirstDayOfWeek(year: number, month: number) {
  return new Date(year, month - 1, 1).getDay();
}

function padDate(n: number) {
  return String(n).padStart(2, "0");
}

export function CalendarGrid({
  year,
  month,
  entries,
  selectedDate,
  onSelectDate,
}: CalendarGridProps) {
  const today = new Date().toISOString().split("T")[0];

  const { days, leadingBlanks } = useMemo(() => {
    const total = getDaysInMonth(year, month);
    const leading = getFirstDayOfWeek(year, month);
    return {
      days: Array.from({ length: total }, (_, i) => i + 1),
      leadingBlanks: Array.from({ length: leading }),
    };
  }, [year, month]);

  const gridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(7, minmax(0, 1fr))",
  gridAutoRows: "1fr",
  gap: "5px",
  width: "100%",
};

const dowStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(7, minmax(0, 1fr))",
  marginBottom: "6px",
  width: "100%",
  gap: "5px",
};

  return (
    <div style={{ width: "100%", boxSizing: "border-box" }}>
      {/* Day-of-week headers */}
      <div style={dowStyle}>
        {DOW_LABELS.map((d) => (
          <div
            key={d}
            style={{
              textAlign: "center",
              fontFamily: "var(--font-nunito), sans-serif",
              fontSize: "11px",
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.5px",
              color: "#bba89c",
              paddingBottom: "8px",
            }}
          >
            {d}
          </div>
        ))}
      </div>

      {/* Calendar cells */}
      <motion.div
        key={`${year}-${month}`}
        style={gridStyle}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
      >
        {leadingBlanks.map((_, i) => (
          <div key={`blank-${i}`} style={{ height: "100%" }} />
        ))}

        {days.map((day, i) => {
          const date = `${year}-${padDate(month)}-${padDate(day)}`;
          const entry = entries[date];
          const isToday = date === today;
          const isSelected = date === selectedDate;
          const isFuture = date > today;

          return (
            <motion.div
              key={date}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                delay: i * 0.008,
                duration: 0.2,
                ease: [0.25, 0.1, 0.25, 1],
              }}
              style={{ height: "100%" }}   // ← add this
            >
              <DayCell
                day={day}
                date={date}
                entry={entry}
                isToday={isToday}
                isSelected={isSelected}
                isFuture={isFuture}
                hasSelection={selectedDate !== null}
                onClick={() => onSelectDate(date)}
              />
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}