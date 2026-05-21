import { GlareHover } from "@/components/magicui/GlareHover";
import { cn } from "@/lib/cn";
import type { HTMLAttributes } from "react";
import { Card } from "./Card";

export function GlareCard({
  className,
  children,
  glareColor = "#ffc37e",
  glareOpacity = 0.28,
  ...props
}: HTMLAttributes<HTMLDivElement> & {
  glareColor?: string;
  glareOpacity?: number;
}) {
  return (
    <GlareHover
      className="rounded-3xl"
      color={glareColor}
      opacity={glareOpacity}
      duration={600}
    >
      <Card
        className={cn(
          "h-full border-outline/30 shadow-lg hover:scale-[1.01]",
          className,
        )}
        {...props}
      >
        {children}
      </Card>
    </GlareHover>
  );
}
