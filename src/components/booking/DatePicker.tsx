"use client";

import { Chip } from "@/components/ui/Chip";
import { formatFrenchDate, nextDays } from "@/lib/utils/dates";

export function DatePicker({
  selected,
  onSelect,
}: {
  selected: string;
  onSelect: (date: string) => void;
}) {
  const days = nextDays(14);

  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
      {days.map((d) => {
        const label = new Date(d + "T12:00:00").toLocaleDateString("fr-FR", {
          weekday: "short",
          day: "numeric",
          month: "short",
        });
        return (
          <Chip
            key={d}
            label={label}
            selected={d === selected}
            onClick={() => onSelect(d)}
          />
        );
      })}
    </div>
  );
}

export function DatePickerSummary({ date }: { date: string }) {
  return (
    <p className="text-sm text-muted-foreground capitalize">
      {formatFrenchDate(date)}
    </p>
  );
}
