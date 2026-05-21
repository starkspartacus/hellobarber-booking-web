"use client";

import { Chip } from "@/components/ui/Chip";
import type { AvailableSlotsResponse } from "@/types/api";

function sortSlots(slots: string[]) {
  return [...slots].sort((a, b) => {
    const [ah, am] = a.split(":").map(Number);
    const [bh, bm] = b.split(":").map(Number);
    return ah * 60 + am - (bh * 60 + bm);
  });
}

export function SlotPicker({
  data,
  selected,
  date,
  onSelect,
  loading,
}: {
  data: AvailableSlotsResponse | null;
  selected: string | null;
  date: string;
  onSelect: (slot: string) => void;
  loading?: boolean;
}) {
  if (loading) {
    return (
      <div className="grid grid-cols-3 gap-2">
        {Array.from({ length: 9 }).map((_, i) => (
          <div
            key={i}
            className="h-10 rounded-2xl bg-surface-elevated animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (!data) return null;

  if (data.holidayClosed) {
    return (
      <p className="text-sm text-danger font-medium text-center py-6">
        {data.holidayMessage ?? "Salon fermé ce jour."}
      </p>
    );
  }

  const available = new Set(data.available ?? []);
  const occupied = new Set(data.occupied ?? []);
  const all = sortSlots([
    ...Array.from(available),
    ...Array.from(occupied),
  ]);

  if (all.length === 0) {
    return (
      <p className="text-sm text-muted-foreground text-center py-6">
        Aucun créneau pour cette date.
      </p>
    );
  }

  const today = new Date().toISOString().slice(0, 10);
  const now = new Date();

  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
      {all.map((slot) => {
        const isAvail = available.has(slot);
        const isPast =
          date === today &&
          (() => {
            const [h, m] = slot.split(":").map(Number);
            const slotDate = new Date();
            slotDate.setHours(h, m, 0, 0);
            return slotDate <= now;
          })();
        const disabled = !isAvail || isPast;
        return (
          <Chip
            key={slot}
            label={slot}
            selected={slot === selected}
            disabled={disabled}
            onClick={() => !disabled && onSelect(slot)}
          />
        );
      })}
    </div>
  );
}
