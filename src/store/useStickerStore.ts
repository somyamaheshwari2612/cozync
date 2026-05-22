import { create } from "zustand";

interface StickerStore {
  unlockedPackIds: string[];
  setUnlocked: (packIds: string[]) => void;
  isUnlocked: (packId: string) => boolean;
}

export const useStickerStore = create<StickerStore>((set, get) => ({
  unlockedPackIds: ["default"],

  setUnlocked: (packIds) => set({ unlockedPackIds: packIds }),

  isUnlocked: (packId) => get().unlockedPackIds.includes(packId),
}));