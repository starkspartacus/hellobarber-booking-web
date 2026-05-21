"use client";

import { cn } from "@/lib/cn";

export function Chip({
  label,
  selected,
  disabled,
  onClick,
}: {
  label: string;
  selected?: boolean;
  disabled?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "rounded-2xl border px-4 py-2 text-sm font-semibold transition-all",
        selected
          ? "border-primary bg-primary/15 text-primary scale-105"
          : "border-outline/40 bg-surface text-foreground hover:border-primary/50",
        disabled && "opacity-40 cursor-not-allowed",
      )}
    >
      {label}
    </button>
  );
}
