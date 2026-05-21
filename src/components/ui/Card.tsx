import { cn } from "@/lib/cn";
import type { HTMLAttributes } from "react";

export function Card({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-3xl border border-outline/30 bg-surface-elevated p-4 shadow-lg transition-transform hover:scale-[1.01]",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
