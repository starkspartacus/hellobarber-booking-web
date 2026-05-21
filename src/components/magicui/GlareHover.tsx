"use client";

import { cn } from "@/lib/cn";
import type { CSSProperties, HTMLAttributes, ReactNode } from "react";

function hexToRgba(hex: string, alpha: number): string {
  const h = hex.replace("#", "");
  const full =
    h.length === 3
      ? h
          .split("")
          .map((c) => c + c)
          .join("")
      : h;
  const n = parseInt(full, 16);
  const r = (n >> 16) & 255;
  const g = (n >> 8) & 255;
  const b = n & 255;
  return `rgba(${r},${g},${b},${alpha})`;
}

export type GlareHoverProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
  color?: string;
  opacity?: number;
  angle?: number;
  size?: number;
  duration?: number;
  playOnce?: boolean;
  background?: string;
};

export function GlareHover({
  children,
  className,
  color = "#ffc37e",
  opacity = 0.35,
  angle = -45,
  size = 250,
  duration = 650,
  playOnce = false,
  background = "transparent",
  style,
  ...props
}: GlareHoverProps) {
  const glareStyle: CSSProperties = {
    ...style,
    ["--gh-angle" as string]: `${angle}deg`,
    ["--gh-size" as string]: `${size}%`,
    ["--gh-duration" as string]: `${duration}ms`,
    ["--gh-rgba" as string]: hexToRgba(color, opacity),
    background,
  };

  return (
    <div
      className={cn(
        "glare-hover group relative overflow-hidden",
        playOnce && "glare-play-once",
        className,
      )}
      style={glareStyle}
      {...props}
    >
      <div className="relative z-0">{children}</div>
    </div>
  );
}
