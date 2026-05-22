import { type MoodId } from "@/db/cozync.db";

export interface MoodDef {
  id: MoodId;
  label: string;
  emoji: string;
  bg: string;
  dot: string;
  textColor: string;
}

export const MOODS: MoodDef[] = [
  {
    id: "radiant",
    label: "radiant",
    emoji: "✦",
    bg: "#fde8f2",
    dot: "#e87daa",
    textColor: "#8a3060",
  },
  {
    id: "good",
    label: "good",
    emoji: "🌿",
    bg: "#e8f5e9",
    dot: "#72b872",
    textColor: "#2e6b2e",
  },
  {
    id: "meh",
    label: "meh",
    emoji: "☁️",
    bg: "#fef9e7",
    dot: "#e0b840",
    textColor: "#7a5f10",
  },
  {
    id: "low",
    label: "low",
    emoji: "🌊",
    bg: "#e8f0fe",
    dot: "#6b93e8",
    textColor: "#2a3f8a",
  },
  {
    id: "hard",
    label: "hard",
    emoji: "🌙",
    bg: "#f3e5f5",
    dot: "#9b6cb0",
    textColor: "#4a2860",
  },
];

export const MOOD_MAP = Object.fromEntries(MOODS.map((m) => [m.id, m])) as Record<MoodId, MoodDef>;