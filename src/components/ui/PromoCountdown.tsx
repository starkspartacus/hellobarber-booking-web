"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/Badge";

export function PromoCountdown({ endDate }: { endDate: string }) {
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    isExpired: boolean;
  }>({
    days: 0,
    hours: 0,
    minutes: 0,
    isExpired: false,
  });

  useEffect(() => {
    function update() {
      const target = new Date(endDate).getTime();
      const now = new Date().getTime();
      const diff = target - now;

      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, isExpired: true });
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

      setTimeLeft({ days, hours, minutes, isExpired: false });
    }

    update();
    const interval = setInterval(update, 60000); // update every minute
    return () => clearInterval(interval);
  }, [endDate]);

  if (timeLeft.isExpired) {
    return null;
  }

  let text = "";
  if (timeLeft.days > 0) {
    text = `Se termine dans ${timeLeft.days}j ${timeLeft.hours}h`;
  } else if (timeLeft.hours > 0) {
    text = `Se termine dans ${timeLeft.hours}h ${timeLeft.minutes}m`;
  } else {
    text = `Se termine dans ${timeLeft.minutes}m`;
  }

  return (
    <Badge tone="muted" className="text-xs py-0.5 px-2 bg-secondary/10 border-secondary/20 text-secondary-foreground flex items-center gap-1.5 w-fit">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-3 h-3"
      >
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
      {text}
    </Badge>
  );
}
