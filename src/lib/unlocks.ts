import { type Entry } from "@/db/cozync.db";

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
  const dates = [...new Set(entries.map((e) => e.date))].sort();
  let longest = 1;
  let current = 1;
  for (let i = 1; i < dates.length; i++) {
    const prev = new Date(dates[i - 1]);
    const curr = new Date(dates[i]);
    const diff = (curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24);
    if (diff === 1) {
      current++;
      longest = Math.max(longest, current);
    } else {
      current = 1;
    }
  }
  return longest;
}

export function getCurrentStreak(entries: Entry[]): number {
  if (!entries.length) return 0;
  const dates = [...new Set(entries.map((e) => e.date))].sort().reverse();
  const today = new Date().toISOString().split("T")[0];
  if (dates[0] !== today && dates[0] !== getYesterday()) return 0;
  let streak = 0;
  let expected = dates[0] === today ? today : getYesterday();
  for (const date of dates) {
    if (date === expected) {
      streak++;
      expected = getPreviousDay(expected);
    } else break;
  }
  return streak;
}

function getYesterday(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().split("T")[0];
}

function getPreviousDay(dateStr: string): string {
  const d = new Date(dateStr);
  d.setDate(d.getDate() - 1);
  return d.toISOString().split("T")[0];
}