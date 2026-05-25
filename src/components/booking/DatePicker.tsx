"use client";

import { useState } from "react";
import { formatFrenchDate, generateDaysForMonth } from "@/lib/utils/dates";

export function DatePicker({
  selected,
  onSelect,
}: {
  selected: string;
  onSelect: (date: string) => void;
}) {
  const [monthStr, setMonthStr] = useState(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
  });

  const [year, month] = monthStr.split("-").map(Number);
  const days = generateDaysForMonth(year, month - 1);
  const todayIso = new Date().toISOString().slice(0, 10);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-foreground">
          Sélectionnez une date
        </p>
        <input
          type="month"
          value={monthStr}
          min={new Date().toISOString().slice(0, 7)}
          onChange={(e) => {
            if (e.target.value) setMonthStr(e.target.value);
          }}
          className="rounded-xl border border-outline/40 bg-surface px-3 py-1.5 text-sm font-medium text-foreground outline-none focus:border-primary"
        />
      </div>
      
      {days.length === 0 ? (
        <p className="text-sm text-muted-foreground py-4">Aucune date disponible pour ce mois.</p>
      ) : (
        <div className="flex gap-3 overflow-x-auto pb-4 pt-2 -mx-4 px-4 snap-x snap-mandatory [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-outline/50 hover:[&::-webkit-scrollbar-thumb]:bg-outline">
          {days.map((d) => {
            const dateObj = new Date(d + "T12:00:00");
            const weekday = dateObj.toLocaleDateString("fr-FR", { weekday: "short" }).replace(".", "");
            const dayNum = dateObj.toLocaleDateString("fr-FR", { day: "numeric" });
            const monthName = dateObj.toLocaleDateString("fr-FR", { month: "short" }).replace(".", "");
            
            const isSelected = d === selected;
            const isPast = d < todayIso;

            return (
              <button
                key={d}
                type="button"
                disabled={isPast}
                onClick={() => !isPast && onSelect(d)}
                className={`flex-shrink-0 snap-center w-[72px] flex flex-col items-center justify-center rounded-2xl border py-3 transition-all ${
                  isPast ? "opacity-30 cursor-not-allowed border-outline/20 bg-surface/50" :
                  isSelected
                    ? "border-primary bg-primary/15 text-primary scale-105 shadow-sm"
                    : "border-outline/40 bg-surface text-muted-foreground hover:border-primary/50 hover:text-foreground"
                }`}
              >
                <span className="text-xs font-medium capitalize">{weekday}</span>
                <span className={`text-lg font-black my-0.5 ${isSelected ? "text-primary" : "text-foreground"}`}>
                  {dayNum}
                </span>
                <span className="text-xs font-medium capitalize">{monthName}</span>
              </button>
            );
          })}
        </div>
      )}
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
