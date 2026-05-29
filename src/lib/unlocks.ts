import { type Entry } from "@/db/cozync.db";
import { getTodayLocal } from "./dateUtils";

export interface UnlockRule {
  packId: string;
  description: string;
  requirement: (entries: Entry[]) => boolean;
}

export const UNLOCK_RULES: UnlockRule[] = [
  {
    packId: "cozy-stationery",
    description: "Journal 7 days in a row",
    requirement: (entries) => getLongestStreak(entries) >= 7,
  },
  {
    packId: "night-sky",
    description: "Log your mood 14 times",
    requirement: (entries) => entries.filter((e) => e.mood).length >= 14,
  },
  {
    packId: "seasonal-comfort",
    description: "Complete a 21-day journaling streak",
    requirement: (entries) => getLongestStreak(entries) >= 21,
  },
];

export function computeUnlockedPacks(entries: Entry[]): string[] {
  const base = ["default"];
  const earned = UNLOCK_RULES.filter((r) => r.requirement(entries)).map(
    (r) => r.packId
  );
  return [...base, ...earned];
}

export function getLongestStreak(entries: Entry[]): number {
  if (!entries.length) return 0;
  
  // Sort entries chronologically safely
  const dates = [...new Set(entries.map((e) => e.date))].sort();
  let longest = 1;
  let current = 1;

  for (let i = 1; i < dates.length; i++) {
    const prev = new Date(dates[i - 1] + "T00:00:00");
    const curr = new Date(dates[i] + "T00:00:00");
    const diff = (curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24);

    if (diff === 1) {
      current++;
      longest = Math.max(longest, current);
    } else if (diff > 1) {
      current = 1;
    }
  }
  return longest;
}

export function getCurrentStreak(entries: Entry[]): number {
  if (!entries.length) return 0;
  
  const todayStr = getTodayLocal();
  const yesterdayStr = getYesterday();
  const dateSet = new Set(entries.map((e) => e.date));

  // Determine starting anchor node point matching application logic
  let cursor = dateSet.has(todayStr) ? todayStr : yesterdayStr;
  let streak = 0;

  while (dateSet.has(cursor)) {
    streak++;
    cursor = getPreviousDay(cursor);
  }
  return streak;
}

// Fixed standard manual local date string builder utility formatter
function formatLocalDate(d: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function getYesterday(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function getPreviousDay(dateStr: string): string {
  const d = new Date(dateStr + "T12:00:00"); // noon prevents DST edge cases
  d.setDate(d.getDate() - 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}