import { create } from "zustand";
import { db, type Entry, type MoodId } from "@/db/cozync.db";

interface EntryStore {
  entries: Record<string, Entry>;
  allEntries: Entry[];
  isLoaded: boolean;
  loadMonth: (year: number, month: number) => Promise<void>;
  loadAllEntries: () => Promise<void>;
  saveEntry: (date: string, data: Partial<Entry>) => Promise<void>;
  getEntry: (date: string) => Entry | undefined;
}

export const useEntryStore = create<EntryStore>((set, get) => ({
  entries: {},
  allEntries: [],
  isLoaded: false,

  loadMonth: async (year, month) => {
    const start = `${year}-${String(month).padStart(2, "0")}-01`;
    const end   = `${year}-${String(month).padStart(2, "0")}-31`;
    const rows  = await db.entries
      .where("date")
      .between(start, end, true, true)
      .toArray();
    const map: Record<string, Entry> = {};
    rows.forEach((e) => (map[e.date] = e));
    set({ entries: map, isLoaded: true });
  },

  loadAllEntries: async () => {
    const all = await db.entries.orderBy("date").toArray();
    set({ allEntries: all });
  },

  saveEntry: async (date, data) => {
    const existing = get().entries[date];
    const now = Date.now();
    if (existing?.id) {
      await db.entries.update(existing.id, { ...data, updatedAt: now });
      const updated = { ...existing, ...data, updatedAt: now };
      set((s) => ({
        entries: { ...s.entries, [date]: updated },
        allEntries: s.allEntries.map((e) =>
          e.date === date ? updated : e
        ),
      }));
    } else {
      const newEntry: Entry = {
        date,
        stickers: [],
        wins: [],
        createdAt: now,
        updatedAt: now,
        ...data,
      };
      const id = await db.entries.add(newEntry);
      const withId = { ...newEntry, id };
      set((s) => ({
        entries: { ...s.entries, [date]: withId },
        allEntries: [...s.allEntries, withId],
      }));
    }
  },

  getEntry: (date) => get().entries[date],
}));