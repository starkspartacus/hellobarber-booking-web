import { cn } from "@/lib/cn";

const tones = {
  gold: "bg-primary/20 text-primary border-primary/40",
  green: "bg-success/20 text-success border-success/40",
  blue: "bg-info/20 text-info border-info/40",
  pink: "bg-accent-pink/20 text-accent-pink border-accent-pink/40",
  muted: "bg-muted/30 text-muted-foreground border-outline/30",
} as const;

export function Badge({
  children,
  tone = "gold",
  className,
}: {
  children: React.ReactNode;
  tone?: keyof typeof tones;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-bold uppercase tracking-wide",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
