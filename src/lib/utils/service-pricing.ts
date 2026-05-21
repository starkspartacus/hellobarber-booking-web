import type { ServiceItem } from "@/types/api";

export function isPerTimeUnitPricing(service: ServiceItem): boolean {
  return service.durationPricingMode === "per_time_unit";
}

export function clampTimeUnits(
  units: number,
  minUnits: number,
  maxUnits: number,
): number {
  return Math.min(maxUnits, Math.max(minUnits, units));
}

export function defaultTimeUnits(service: ServiceItem): number {
  return service.minDurationUnits ?? 1;
}

export function bookedDurationForUnits(service: ServiceItem, units: number): number {
  const u = clampTimeUnits(
    units,
    service.minDurationUnits ?? 1,
    service.maxDurationUnits ?? 8,
  );
  return service.durationMinutes * u;
}

export function bookedPriceForUnits(service: ServiceItem, units: number): number {
  const u = clampTimeUnits(
    units,
    service.minDurationUnits ?? 1,
    service.maxDurationUnits ?? 8,
  );
  return service.price * u;
}
