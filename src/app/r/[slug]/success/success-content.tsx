"use client";

import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { SuccessConfetti } from "@/components/magicui/SuccessConfetti";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { GlareCard } from "@/components/ui/GlareCard";

export function SuccessContent() {
  const params = useParams();
  const search = useSearchParams();
  const slug = params.slug as string;
  const type = search.get("type") ?? "appointment";
  const isOrder = type === "order";
  const service = search.get("service");
  const when = search.get("when");
  const code = search.get("code");
  const total = search.get("total");

  return (
    <div className="relative mx-auto max-w-lg px-4 py-16 text-center space-y-8 animate-pop">
      <SuccessConfetti isOrder={isOrder} />
      <div className="text-6xl animate-pop">🎉</div>
      <Badge tone="green" className="text-sm">
        {isOrder ? "Commande confirmée" : "Rendez-vous confirmé"}
      </Badge>
      <h1 className="text-3xl font-black text-foreground">
        C&apos;est bon !
      </h1>
      <GlareCard
        className="text-left space-y-3"
        glareColor={isOrder ? "#ff86c8" : "#58cc02"}
      >
        {isOrder ? (
          <>
            <p className="text-sm text-muted-foreground">
              Retirez votre commande au salon. Paiement sur place.
            </p>
            {total ? (
              <p className="font-bold text-primary text-xl">
                Total indicatif : {total}
              </p>
            ) : null}
            {code ? (
              <div className="rounded-2xl bg-primary/10 border border-primary/40 p-4 text-center">
                <p className="text-xs uppercase font-bold text-muted-foreground">
                  Code de retrait
                </p>
                <p className="text-2xl font-black text-primary tracking-widest mt-1">
                  {code}
                </p>
              </div>
            ) : null}
          </>
        ) : (
          <>
            {service ? (
              <p className="font-bold text-lg">{service}</p>
            ) : null}
            {when ? (
              <p className="text-sm text-muted-foreground capitalize">{when}</p>
            ) : null}
            <p className="text-sm text-muted-foreground">
              Vous recevrez une confirmation selon les préférences du salon.
            </p>
          </>
        )}
      </GlareCard>
      <Link href={`/r/${slug}`}>
        <Button className="w-full" size="lg">
          Retour au salon
        </Button>
      </Link>
    </div>
  );
}
