"use client";

import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { formatMoney } from "@/lib/utils/currency";
import { cn } from "@/lib/cn";
import type { ServiceItem } from "@/types/api";

export function ServicePicker({
  services,
  selectedId,
  currency,
  onSelect,
}: {
  services: ServiceItem[];
  selectedId?: string;
  currency: string;
  onSelect: (s: ServiceItem) => void;
}) {
  if (services.length === 0) {
    return (
      <p className="text-sm text-muted-foreground text-center py-8">
        Aucune prestation disponible pour le moment.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {services.map((svc, i) => {
        const selected = svc._id === selectedId;
        return (
          <button
            key={svc._id}
            type="button"
            onClick={() => onSelect(svc)}
            className="w-full text-left"
            style={{ animationDelay: `${i * 60}ms` }}
          >
            <Card
              className={cn(
                "animate-slide-up cursor-pointer",
                selected && "ring-2 ring-primary border-primary/60",
              )}
            >
              <div className="flex gap-3">
                {svc.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={svc.imageUrl}
                    alt=""
                    className="h-16 w-16 rounded-2xl object-cover"
                  />
                ) : (
                  <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center text-xl">
                    ✂️
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-bold text-foreground">{svc.name}</h3>
                    <Badge tone={selected ? "green" : "gold"}>
                      {formatMoney(svc.price, currency)}
                    </Badge>
                  </div>
                  {svc.description ? (
                    <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
                      {svc.description}
                    </p>
                  ) : null}
                  <p className="mt-2 text-xs font-semibold text-info">
                    {svc.durationMinutes} min
                  </p>
                </div>
              </div>
            </Card>
          </button>
        );
      })}
    </div>
  );
}
