"use client";

import { cn } from "@/lib/cn";
import { useMemo } from "react";

type MeteorStyle = {
  top: string;
  left: string;
  delay: string;
  duration: string;
};

function buildMeteors(count: number): MeteorStyle[] {
  return Array.from({ length: count }, () => ({
    top: `${Math.floor(Math.random() * 100)}%`,
    left: `${Math.floor(Math.random() * 100)}%`,
    delay: `${(Math.random() * 1.2 + 0.2).toFixed(2)}s`,
    duration: `${(Math.random() * 8 + 2).toFixed(2)}s`,
  }));
}

export function Meteors({
  number = 18,
  className,
  angle = 215,
}: {
  number?: number;
  className?: string;
  angle?: number;
}) {
  const meteors = useMemo(() => buildMeteors(number), [number]);

  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden",
        className,
      )}
      aria-hidden
    >
      {meteors.map((m, i) => (
        <span
          key={i}
          className="meteor animate-meteor absolute h-20 w-0.5 opacity-0"
          style={{
            top: m.top,
            left: m.left,
            animationDelay: m.delay,
            animationDuration: m.duration,
            transform: `rotate(${angle}deg)`,
          }}
        />
      ))}
    </div>
  );
}
