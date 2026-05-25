"use client";

import { Button } from "@/components/ui/Button";
import { GlareCard } from "@/components/ui/GlareCard";
import { formatMoney } from "@/lib/utils/currency";
import {
  bookedDurationForUnits,
  bookedPriceForUnits,
  clampTimeUnits,
  isPerTimeUnitPricing,
  getDiscountedPrice,
} from "@/lib/utils/service-pricing";
import type { ServiceItem } from "@/types/api";

export function DurationUnitsPicker({
  service,
  units,
  currency,
  onChange,
}: {
  service: ServiceItem;
  units: number;
  currency: string;
  onChange: (units: number) => void;
}) {
  if (!isPerTimeUnitPricing(service)) return null;

  const min = service.minDurationUnits ?? 1;
  const max = service.maxDurationUnits ?? 8;
  const clamped = clampTimeUnits(units, min, max);
  const unitMin = service.durationMinutes;
  const totalDur = bookedDurationForUnits(service, clamped);
  const basePrice = bookedPriceForUnits(service, clamped);
  const totalPrice = getDiscountedPrice(basePrice, service.promoPercentage);
  const hasPromo = service.promoPercentage && service.promoPercentage > 0;

  return (
    <GlareCard className="space-y-4 animate-fade-in" glareColor="#58cc02">
      <div>
        <p className="text-xs font-black uppercase tracking-widest text-primary">
          Durée souhaitée
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          Tarif au bloc de {unitMin} min — choisissez le nombre de blocs.
        </p>
      </div>
      <div className="flex items-center gap-3">
        <Button
          type="button"
          variant="secondary"
          className="h-12 w-12 shrink-0 rounded-2xl p-0 text-xl font-black"
          disabled={clamped <= min}
          onClick={() => onChange(clamped - 1)}
        >
          −
        </Button>
        <div className="flex-1 text-center">
          <p className="text-xl font-black text-foreground">
            {clamped} × {unitMin} min
          </p>
          <p className="text-sm text-muted-foreground">Total : {totalDur} min</p>
        </div>
        <Button
          type="button"
          variant="secondary"
          className="h-12 w-12 shrink-0 rounded-2xl p-0 text-xl font-black"
          disabled={clamped >= max}
          onClick={() => onChange(clamped + 1)}
        >
          +
        </Button>
      </div>
      <div className="flex items-end gap-3">
        <p className="text-2xl font-black text-primary">
          {formatMoney(totalPrice, currency)}
        </p>
        {hasPromo && (
          <p className="text-sm font-semibold text-muted-foreground line-through pb-1">
            {formatMoney(basePrice, currency)}
          </p>
        )}
      </div>
    </GlareCard>
  );
}
