"use client";

import { useState } from "react";
import { getStickerUrl } from "@/constants/stickers";

interface StickerImgProps {
  openmoji: string;
  size?: number;
  alt?: string;
  className?: string;
}

export function StickerImg({
  openmoji,
  size = 40,
  alt = "sticker",
  className = "",
}: StickerImgProps) {
  const [errored, setErrored] = useState(false);

  if (errored) {
    return (
      <span
        style={{
          width: size,
          height: size,
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: size * 0.55,
          lineHeight: 1,
        }}
      >
        ✦
      </span>
    );
  }

  return (
    <img
      src={getStickerUrl(openmoji)}
      alt={alt}
      width={size}
      height={size}
      className={className}
      onError={() => setErrored(true)}
      style={{
        width: size,
        height: size,
        objectFit: "contain",
        display: "inline-block",
        userSelect: "none",
        pointerEvents: "none",
      }}
      draggable={false}
    />
  );
}