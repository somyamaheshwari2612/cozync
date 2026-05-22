export interface Sticker {
  id: string;
  emoji: string;
  name: string;
  openmoji: string; // hex code from openmoji.org
}

export interface StickerPack {
  id: string;
  name: string;
  description: string;
  unlockHint?: string;
  stickers: Sticker[];
}

// Base URL for OpenMoji SVGs
export const OPENMOJI_BASE =
  "https://cdn.jsdelivr.net/npm/openmoji@15.0.0/color/svg/";

export function getStickerUrl(openmoji: string): string {
  return `${OPENMOJI_BASE}${openmoji}.svg`;
}

export const STICKER_PACKS: StickerPack[] = [
  {
    id: "default",
    name: "Starter Pack",
    description: "Always with you, from day one",
    stickers: [
      { id: "blossom",   emoji: "🌸", name: "blossom",   openmoji: "1F338" },
      { id: "star",      emoji: "⭐", name: "star",       openmoji: "2B50" },
      { id: "coffee",    emoji: "☕", name: "coffee",     openmoji: "2615" },
      { id: "books",     emoji: "📚", name: "books",      openmoji: "1F4DA" },
      { id: "plant",     emoji: "🌿", name: "plant",      openmoji: "1F33F" },
      { id: "moon",      emoji: "🌙", name: "moon",       openmoji: "1F319" },
      { id: "sparkle",   emoji: "✨", name: "sparkle",    openmoji: "2728" },
      { id: "music",     emoji: "🎵", name: "music",      openmoji: "1F3B5" },
      { id: "heart",     emoji: "🩷", name: "heart",      openmoji: "1FA77" },
      { id: "cloud",     emoji: "☁️", name: "cloud",      openmoji: "2601" },
      { id: "sun",       emoji: "🌤️", name: "sun",        openmoji: "1F324" },
      { id: "rain",      emoji: "🌧️", name: "rain",       openmoji: "1F327" },
      { id: "tulip",     emoji: "🌷", name: "tulip",      openmoji: "1F337" },
      { id: "cat",       emoji: "🐱", name: "cat",        openmoji: "1F431" },
      { id: "rainbow",   emoji: "🌈", name: "rainbow",    openmoji: "1F308" },
      { id: "butterfly", emoji: "🦋", name: "butterfly",  openmoji: "1F98B" },
    ],
  },
  {
    id: "cozy-stationery",
    name: "Cozy Stationery",
    description: "For the journaling soul",
    unlockHint: "Journal 7 days in a row to unlock",
    stickers: [
      { id: "hibiscus",  emoji: "🌺", name: "hibiscus",   openmoji: "1F33A" },
      { id: "bear",      emoji: "🧸", name: "teddy bear", openmoji: "1F9F8" },
      { id: "candle",    emoji: "🕯️", name: "candle",     openmoji: "1F56F" },
      { id: "matcha",    emoji: "🍵", name: "matcha",     openmoji: "1F375" },
      { id: "pencil",    emoji: "✏️", name: "pencil",     openmoji: "270F" },
      { id: "notebook",  emoji: "📒", name: "notebook",   openmoji: "1F4D2" },
      { id: "ribbon",    emoji: "🎀", name: "ribbon",     openmoji: "1F380" },
      { id: "letter",    emoji: "💌", name: "letter",     openmoji: "1F48C" },
    ],
  },
  {
    id: "night-sky",
    name: "Night Sky",
    description: "For those who keep going",
    unlockHint: "Log your mood 14 times to unlock",
    stickers: [
      { id: "shooting-star", emoji: "🌠", name: "shooting star", openmoji: "1F320" },
      { id: "crescent",      emoji: "🌙", name: "crescent",      openmoji: "1F319" },
      { id: "comet",         emoji: "☄️", name: "comet",         openmoji: "2604" },
      { id: "galaxy",        emoji: "🌌", name: "galaxy",        openmoji: "1F30C" },
      { id: "glowing-star",  emoji: "🌟", name: "glowing star",  openmoji: "1F31F" },
      { id: "telescope",     emoji: "🔭", name: "telescope",     openmoji: "1F52D" },
    ],
  },
  {
    id: "seasonal-comfort",
    name: "Seasonal Comfort",
    description: "Earned through a full week of showing up",
    unlockHint: "Complete a 21-day streak to unlock",
    stickers: [
      { id: "maple",     emoji: "🍂", name: "autumn",     openmoji: "1F342" },
      { id: "snowflake", emoji: "❄️", name: "snowflake",  openmoji: "2744" },
      { id: "sunflower", emoji: "🌻", name: "sunflower",  openmoji: "1F33B" },
      { id: "hot-cocoa", emoji: "🍫", name: "cocoa",      openmoji: "1F36B" },
      { id: "mushroom",  emoji: "🍄", name: "mushroom",   openmoji: "1F344" },
      { id: "leaves",    emoji: "🍃", name: "leaves",     openmoji: "1F343" },
    ],
  },
];

export const ALL_STICKERS = STICKER_PACKS.flatMap((p) =>
  p.stickers.map((s) => ({ ...s, packId: p.id }))
);

export const STICKER_MAP = Object.fromEntries(
  ALL_STICKERS.map((s) => [s.id, s])
);