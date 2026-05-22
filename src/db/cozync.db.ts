import Dexie, { type Table } from "dexie";

export type MoodId = "radiant" | "good" | "meh" | "low" | "hard";

export interface StickerToken {
  packId: string;
  stickerId: string;
}

export interface Entry {
  id?: number;
  date: string; // "YYYY-MM-DD"
  mood?: MoodId;
  note?: string;
  stickers: StickerToken[];
  wins?: string[];
  createdAt: number;
  updatedAt: number;
}

export interface UserMeta {
  id?: number;
  streaks: {
    journaling: number;
    mood: number;
    lastLoggedDate?: string;
  };
  unlockedPacks: string[];
  preferences: {
    theme: "warm";
    accentColor?: string;
  };
}

export class CozyncDatabase extends Dexie {
  entries!: Table<Entry>;
  userMeta!: Table<UserMeta>;

  constructor() {
    super("CozyncDB");
    this.version(1).stores({
      entries: "++id, date, mood, createdAt",
      userMeta: "++id",
    });
  }
}

export const db = new CozyncDatabase();