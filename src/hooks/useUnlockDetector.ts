import { useEffect, useRef, useState } from "react";
import { computeUnlockedPacks } from "@/lib/unlocks";
import { useStickerStore } from "@/store/useStickerStore";
import { useUserStore } from "@/store/useUserStore";
import { type Entry } from "@/db/cozync.db";
import { STICKER_PACKS, type StickerPack } from "@/constants/stickers";
import { db } from "@/db/cozync.db";

export function useUnlockDetector(allEntries: Entry[]) {
  const { unlockedPackIds, setUnlocked } = useStickerStore();
  const { meta } = useUserStore();
  const prevUnlocked = useRef<string[]>(unlockedPackIds);
  const [newlyUnlocked, setNewlyUnlocked] = useState<StickerPack | null>(null);

  useEffect(() => {
    if (!allEntries.length) return;
    const computed = computeUnlockedPacks(allEntries);
    const fresh = computed.filter(id => !prevUnlocked.current.includes(id));

    if (fresh.length > 0) {
      setUnlocked(computed);
      prevUnlocked.current = computed;

      // Persist to Dexie so tray shows new pack on reload
      if (meta?.id) {
        db.userMeta.update(meta.id, { unlockedPacks: computed });
      }

      const pack = STICKER_PACKS.find(p => p.id === fresh[0]);
      if (pack) setNewlyUnlocked(pack);
    }
  }, [allEntries, setUnlocked, meta]);

  // Hydrate sticker store from saved meta on mount
  useEffect(() => {
    if (meta?.unlockedPacks?.length) {
      setUnlocked(meta.unlockedPacks);
      prevUnlocked.current = meta.unlockedPacks;
    }
  }, [meta, setUnlocked]);

  return {
    newlyUnlocked,
    clearUnlock: () => setNewlyUnlocked(null),
  };
}