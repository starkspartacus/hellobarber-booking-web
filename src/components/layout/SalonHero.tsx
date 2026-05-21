"use client";

import { Badge } from "@/components/ui/Badge";
import { GlareCard } from "@/components/ui/GlareCard";
import { Meteors } from "@/components/magicui/Meteors";
import type { SalonDocument } from "@/types/api";
import Image from "next/image";

export function SalonHero({
  salon,
  rating,
  reviewsCount,
}: {
  salon: SalonDocument;
  rating?: number;
  reviewsCount?: number;
}) {
  const location = [salon.commune, salon.city].filter(Boolean).join(", ");
  const cover = salon.imageUrl || "/images/salon-welcome.png";

  return (
    <GlareCard className="overflow-hidden p-0" glareColor="#ffc37e">
      <div className="relative aspect-[21/9] bg-surface overflow-hidden">
        <Image
          src={cover}
          alt={salon.name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 672px"
          unoptimized={cover.startsWith("http")}
        />
        <Meteors number={12} />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-5 z-10">
          {salon.categoryLabel ? (
            <Badge tone="pink" className="mb-2">
              {salon.categoryLabel}
            </Badge>
          ) : null}
          <h1 className="text-2xl font-black text-foreground">{salon.name}</h1>
          {location ? (
            <p className="mt-1 text-sm text-muted-foreground">{location}</p>
          ) : null}
          {rating != null && rating > 0 ? (
            <p className="mt-2 text-sm font-bold text-primary">
              ★ {rating.toFixed(1)}
              {reviewsCount ? ` · ${reviewsCount} avis` : ""}
            </p>
          ) : null}
        </div>
      </div>
      {salon.description ? (
        <p className="p-4 text-sm text-muted-foreground leading-relaxed">
          {salon.description}
        </p>
      ) : null}
    </GlareCard>
  );
}
