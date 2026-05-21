"use client";

import { Meteors } from "@/components/magicui/Meteors";
import Image from "next/image";
import type { ReactNode } from "react";

export function HeroBackdrop({
  children,
  imageSrc = "/images/salon-welcome.png",
  imageAlt = "Salon KOUP",
}: {
  children: ReactNode;
  imageSrc?: string;
  imageAlt?: string;
}) {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-outline/40">
      <div className="absolute inset-0">
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          className="object-cover opacity-40"
          priority
          sizes="(max-width: 768px) 100vw, 672px"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-background/75 to-background" />
        <Meteors number={22} />
      </div>
      <div className="relative z-10 px-6 py-10 sm:py-12">{children}</div>
    </section>
  );
}
