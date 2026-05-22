import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        parchment: "#fdf8f3",
        linen: "#fffbf7",
        terracotta: {
          DEFAULT: "#c17a5b",
          light: "#fde8d8",
          dark: "#a0563a",
        },
        sand: "#e8c5a8",
        sage: {
          DEFAULT: "#b5cdb0",
          dark: "#3d5c38",
        },
        lavender: {
          DEFAULT: "#c9b8d8",
          dark: "#4a3660",
        },
        walnut: "#3d2f25",
        muted: "#9a7b6b",
        hint: "#bba89c",
        mood: {
          radiant: "#fde8f2",
          good: "#e8f5e9",
          meh: "#fef9e7",
          low: "#e8f0fe",
          hard: "#f3e5f5",
        },
      },
      fontFamily: {
        display: ["var(--font-gochi)", "cursive"],
        journal: ["var(--font-patrick)", "cursive"],
        sans: ["var(--font-nunito)", "sans-serif"],
        royal: ["var(--font-cormorant)", "serif"],
      },
      borderRadius: {
        cozy: "18px",
        soft: "14px",
        pill: "999px",
      },
      boxShadow: {
        cozy: "0 2px 16px 0 rgba(193,122,91,0.08)",
        panel: "0 4px 32px 0 rgba(61,47,37,0.10)",
      },
    },
  },
  plugins: [],
};

export default config;