import { useEffect, useRef, useState } from "react";
import { computeUnlockedPacks } from "@/lib/unlocks";
import { useStickerStore } from "@/store/useStickerStore";
import { useUserStore } from "@/store/useUserStore";
import { type Entry } from "@/db/cozync.db";
import { db } from "@/db/cozync.db";
import { STICKER_PACKS, type StickerPack } from "@/constants/stickers";

const SEEN_UNLOCKS_KEY = "cz_seen_unlocks";

function getSeenUnlocks(): string[] {
  try {
    return JSON.parse(localStorage.getItem(SEEN_UNLOCKS_KEY) ?? "[]");
  } catch { return []; }
}

function markUnlockSeen(packId: string) {
  const seen = getSeenUnlocks();
  if (!seen.includes(packId)) {
    localStorage.setItem(SEEN_UNLOCKS_KEY, JSON.stringify([...seen, packId]));
  }
}

export function useUnlockDetector(allEntries: Entry[]) {
  const { unlockedPackIds, setUnlocked } = useStickerStore();
  const { meta } = useUserStore();
  const initialized = useRef(false);
  const [newlyUnlocked, setNewlyUnlocked] = useState<StickerPack | null>(null);

  // Hydrate sticker store from saved meta on mount
  useEffect(() => {
    if (meta?.unlockedPacks?.length) {
      setUnlocked(meta.unlockedPacks);
    }
  }, [meta, setUnlocked]);

  // Detect new unlocks
  useEffect(() => {
    if (!allEntries.length) return;

    const computed = computeUnlockedPacks(allEntries);
    const seenUnlocks = getSeenUnlocks();

    // Find packs that are newly computed but never celebrated before
    const fresh = computed.filter(
      id => id !== "default" && !seenUnlocks.includes(id)
    );

    if (fresh.length > 0) {
      // Update store + Dexie
      setUnlocked(computed);
      if (meta?.id) {
        db.userMeta.update(meta.id, { unlockedPacks: computed });
      }

      // Only show celebration for first unseen pack
      const pack = STICKER_PACKS.find(p => p.id === fresh[0]);
      if (pack && !initialized.current) {
        // Small delay so UI is settled
        setTimeout(() => setNewlyUnlocked(pack), 600);
      }
    }

    initialized.current = true;
  }, [allEntries, setUnlocked, meta]);

  function clearUnlock() {
    if (newlyUnlocked) {
      markUnlockSeen(newlyUnlocked.id);
    }
    setNewlyUnlocked(null);
  }

  return { newlyUnlocked, clearUnlock };
}