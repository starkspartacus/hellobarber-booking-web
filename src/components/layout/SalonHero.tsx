import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import type { SalonDocument } from "@/types/api";

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
  return (
    <Card className="overflow-hidden p-0">
      <div className="relative aspect-[21/9] bg-surface">
        {salon.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={salon.imageUrl}
            alt={salon.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-4xl font-black text-primary/30">
            KOUP
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-5">
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
    </Card>
  );
}
