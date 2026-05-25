"use client";

import { Badge } from "@/components/ui/Badge";
import { GlareCard } from "@/components/ui/GlareCard";
import { PromoCountdown } from "@/components/ui/PromoCountdown";
import { formatMoney } from "@/lib/utils/currency";
import { getDiscountedPrice } from "@/lib/utils/service-pricing";
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
        const discounted = getDiscountedPrice(svc.price, svc.promoPercentage);
        const hasPromo = svc.promoPercentage && svc.promoPercentage > 0;

        return (
          <button
            key={svc._id}
            type="button"
            onClick={() => onSelect(svc)}
            className="w-full text-left"
            style={{ animationDelay: `${i * 60}ms` }}
          >
            <GlareCard
              className={cn(
                "animate-slide-up cursor-pointer",
                selected && "ring-2 ring-primary border-primary/60",
              )}
              glareColor={selected ? "#58cc02" : "#ffc37e"}
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
                    <div className="flex flex-col gap-1 items-start">
                      <h3 className="font-bold text-foreground text-left">{svc.name}</h3>
                      {hasPromo && (
                        <div className="flex items-center gap-2">
                          <Badge tone="red" className="text-[10px] font-black px-1.5 py-0">
                            -{Math.round(svc.promoPercentage!)}%
                          </Badge>
                          {svc.promoEndDate && <PromoCountdown endDate={svc.promoEndDate} />}
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col items-end gap-1 shrink-0">
                      {hasPromo && (
                        <span className="text-xs text-muted-foreground line-through">
                          {formatMoney(svc.price, currency)}
                        </span>
                      )}
                      <Badge tone={selected ? "green" : hasPromo ? "red" : "gold"}>
                        {formatMoney(discounted, currency)}
                      </Badge>
                    </div>
                  </div>
                  {svc.description ? (
                    <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
                      {svc.description}
                    </p>
                  ) : null}
                  <p className="mt-2 text-xs font-semibold text-info">
                    {svc.durationPricingMode === "per_time_unit"
                      ? `À partir de ${svc.minDurationUnits ?? 1} × ${svc.durationMinutes} min`
                      : `${svc.durationMinutes} min`}
                  </p>
                </div>
              </div>
            </GlareCard>
          </button>
        );
      })}
    </div>
  );
}
