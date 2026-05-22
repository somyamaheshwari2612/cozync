"use client";

import { useEffect, useRef } from "react";
import twemoji from "@twemoji/api";

interface EmojiProps {
  children: string;
  size?: number;
  className?: string;
}

export function Emoji({ children, size = 22, className = "" }: EmojiProps) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (ref.current) {
      twemoji.parse(ref.current, {
        folder: "svg",
        ext: ".svg",
        base: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/",
        className: "twemoji",
      });
    }
  }, [children]);

  return (
    <span
      ref={ref}
      className={className}
      style={{ lineHeight: 1, userSelect: "none", display: "inline-flex", alignItems: "center" }}
    >
      {children}
    </span>
  );
}