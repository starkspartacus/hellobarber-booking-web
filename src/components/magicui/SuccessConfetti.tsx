"use client";

import confetti from "canvas-confetti";
import { useEffect } from "react";

const KOUP_COLORS = ["#FFC37E", "#E8A653", "#FDFFB8", "#58CC02", "#FF86C8"];

function fireKoupCelebration(isOrder: boolean) {
  const defaults = {
    spread: 360,
    ticks: 80,
    gravity: 0.8,
    decay: 0.92,
    startVelocity: 28,
    colors: KOUP_COLORS,
    zIndex: 9999,
  };

  confetti({
    ...defaults,
    particleCount: 80,
    origin: { x: 0.5, y: 0.55 },
  });

  setTimeout(() => {
    confetti({
      ...defaults,
      particleCount: 40,
      scalar: 1.1,
      shapes: ["star"],
      origin: { x: 0.35, y: 0.4 },
    });
    confetti({
      ...defaults,
      particleCount: 40,
      scalar: 1.1,
      shapes: ["star"],
      origin: { x: 0.65, y: 0.4 },
    });
  }, 180);

  if (isOrder) {
    setTimeout(() => {
      confetti({
        particleCount: 25,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.65 },
        colors: KOUP_COLORS,
      });
      confetti({
        particleCount: 25,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.65 },
        colors: KOUP_COLORS,
      });
    }, 400);
  }
}

export function SuccessConfetti({ isOrder }: { isOrder: boolean }) {
  useEffect(() => {
    fireKoupCelebration(isOrder);
  }, [isOrder]);

  return null;
}
