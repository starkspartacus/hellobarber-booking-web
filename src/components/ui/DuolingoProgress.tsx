"use client";

import { cn } from "@/lib/cn";

const labels = ["Service", "Date", "Créneau", "Infos", "Confirmer"];
const steps = ["service", "date", "slot", "guest", "confirm"] as const;

export function DuolingoProgress({
  current,
}: {
  current: (typeof steps)[number];
}) {
  const idx = steps.indexOf(current);
  const pct = ((idx + 1) / steps.length) * 100;

  return (
    <div className="space-y-2 animate-fade-in">
      <div className="flex justify-between text-xs font-bold text-muted-foreground">
        {labels.map((l, i) => (
          <span
            key={l}
            className={cn(i <= idx ? "text-primary" : "")}
          >
            {l}
          </span>
        ))}
      </div>
      <div className="h-3 overflow-hidden rounded-full bg-surface border border-outline/30">
        <div
          className="h-full rounded-full bg-gradient-to-r from-primary via-accent-pink to-info transition-all duration-500 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
