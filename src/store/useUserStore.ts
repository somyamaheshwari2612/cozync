import { create } from "zustand";
import { db, type UserMeta } from "@/db/cozync.db";

interface UserStore {
  meta: UserMeta | null;
  hasSeenOnboarding: boolean;
  isLoaded: boolean;
  load: () => Promise<void>;
  markOnboardingSeen: () => void;
  updateStreaks: (lastDate: string) => Promise<void>;
}

export const useUserStore = create<UserStore>((set, get) => ({
  meta: null,
  hasSeenOnboarding: false,
  isLoaded: false,

  load: async () => {
    const seen = localStorage.getItem("cz_onboarding") === "true";
    let meta = await db.userMeta.toCollection().first();
    if (!meta) {
      meta = {
        streaks: { journaling: 0, mood: 0 },
        unlockedPacks: ["default"],
        preferences: { theme: "warm" },
      };
      await db.userMeta.add(meta);
    }
    set({ meta, hasSeenOnboarding: seen, isLoaded: true });
  },

  markOnboardingSeen: () => {
    localStorage.setItem("cz_onboarding", "true");
    set({ hasSeenOnboarding: true });
  },

  updateStreaks: async (lastDate) => {
    const { meta } = get();
    if (!meta?.id) return;
    const updated = {
      ...meta,
      streaks: { ...meta.streaks, lastLoggedDate: lastDate },
    };
    await db.userMeta.update(meta.id, updated);
    set({ meta: updated });
  },
}));