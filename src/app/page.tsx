import Image from "next/image";
import { Badge } from "@/components/ui/Badge";
import { GlareCard } from "@/components/ui/GlareCard";
import { HeroBackdrop } from "@/components/layout/HeroBackdrop";

export default function HomePage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-8 space-y-10 animate-fade-in">
      <HeroBackdrop>
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <Image
              src="/icon.png"
              alt="KOUP"
              width={72}
              height={72}
              className="rounded-2xl shadow-xl ring-2 ring-primary/40 animate-pop"
              priority
            />
          </div>
          <Badge tone="gold" className="text-sm">
            Liens publics
          </Badge>
          <h1 className="text-4xl font-black text-foreground leading-tight">
            Réservez chez votre pro avec{" "}
            <span className="text-primary">KOUP</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-md mx-auto">
            Chaque salon partage un lien unique{" "}
            <code className="text-primary font-mono text-sm">/r/mon-salon</code>.
            RDV ou boutique — sans installer l&apos;app.
          </p>
        </div>
      </HeroBackdrop>

      <div className="grid gap-4 sm:grid-cols-2">
        <GlareCard className="space-y-3 overflow-hidden p-0" glareColor="#58cc02">
          <div className="relative h-32 w-full">
            <Image
              src="/images/salon-welcome.png"
              alt="Prendre rendez-vous au salon"
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, 320px"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-surface-elevated via-transparent to-transparent" />
          </div>
          <div className="px-4 pb-4 space-y-2">
            <h2 className="font-bold text-lg">Rendez-vous</h2>
            <p className="text-sm text-muted-foreground">
              Prestation, date et créneau — checkout invité en quelques secondes.
            </p>
          </div>
        </GlareCard>

        <GlareCard className="space-y-3 overflow-hidden p-0" glareColor="#ff86c8">
          <div className="relative h-32 w-full">
            <Image
              src="/images/boutique.png"
              alt="Boutique du salon"
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, 320px"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-surface-elevated via-transparent to-transparent" />
          </div>
          <div className="px-4 pb-4 space-y-2">
            <h2 className="font-bold text-lg">Boutique</h2>
            <p className="text-sm text-muted-foreground">
              Produits du salon, panier et retrait sur place.
            </p>
          </div>
        </GlareCard>
      </div>

      <GlareCard className="bg-primary/5 border-primary/30 space-y-4" glareColor="#ffc37e">
        <h2 className="font-bold">Vous êtes professionnel ?</h2>
        <p className="text-sm text-muted-foreground">
          Activez votre lien dans l&apos;app KOUP et partagez-le sur Instagram,
          WhatsApp ou votre site.
        </p>
        <p className="text-xs font-mono text-primary break-all">
          https://koup-booking-web.vercel.app/r/votre-slug
        </p>
      </GlareCard>

      <p className="text-center text-sm text-muted-foreground">
        Vous avez reçu un lien ? Ouvrez-le directement — par exemple{" "}
        <code className="text-primary">/r/demo</code>.
      </p>
    </div>
  );
}
