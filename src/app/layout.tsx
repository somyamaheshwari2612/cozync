import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import React from "react";
import {
  Gochi_Hand,
  Patrick_Hand,
  Nunito,
  Noto_Emoji,
  Cormorant_Upright,
} from "next/font/google";

const cormorant = Cormorant_Upright({
  weight: ["300", "400", "500", "600"],
  subsets: ["latin"],
  variable: "--font-cormorant",
  display: "swap",
});

const gochiHand = Gochi_Hand({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-gochi",
  display: "swap",
});

const patrickHand = Patrick_Hand({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-patrick",
  display: "swap",
});

const nunito = Nunito({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-nunito",
  display: "swap",
});

// Note: Google's Noto Emoji font often relies heavily on the "emoji" subset,
// which is perfectly fine here.
const notoEmoji = Noto_Emoji({
  weight: ["400", "700"],
  subsets: ["emoji"],
  variable: "--font-emoji",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Cozync — visible proof of becoming someone",
  description:
    "A cozy visual life-logging webapp. Transform your days into a comforting visual scrapbook.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${gochiHand.variable} ${patrickHand.variable} ${nunito.variable} ${notoEmoji.variable} ${cormorant.variable}`}
    >
      <body>{children}</body>
      <Analytics />
      <SpeedInsights />
    </html>
  );
}