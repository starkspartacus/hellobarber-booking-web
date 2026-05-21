import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";

export default function HomePage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-12 space-y-10 animate-fade-in">
      <section className="text-center space-y-4">
        <Badge tone="gold" className="text-sm">
          Liens publics
        </Badge>
        <h1 className="text-4xl font-black text-foreground leading-tight">
          Réservez chez votre pro avec{" "}
          <span className="text-primary">KOUP</span>
        </h1>
        <p className="text-muted-foreground text-lg max-w-md mx-auto">
          Chaque salon partage un lien unique du type{" "}
          <code className="text-primary font-mono text-sm">/r/mon-salon</code>.
          Prenez rendez-vous ou commandez en boutique — sans installer l&apos;app.
        </p>
      </section>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card className="space-y-3">
          <span className="text-2xl">📅</span>
          <h2 className="font-bold text-lg">Rendez-vous</h2>
          <p className="text-sm text-muted-foreground">
            Choisissez une prestation, une date et un créneau. Checkout invité en
            quelques secondes.
          </p>
        </Card>
        <Card className="space-y-3">
          <span className="text-2xl">🛍️</span>
          <h2 className="font-bold text-lg">Boutique</h2>
          <p className="text-sm text-muted-foreground">
            Parcourez les produits du salon, ajoutez au panier et retirez sur place.
          </p>
        </Card>
      </div>

      <Card className="bg-primary/5 border-primary/30 space-y-4">
        <h2 className="font-bold">Vous êtes professionnel ?</h2>
        <p className="text-sm text-muted-foreground">
          Activez votre lien de réservation dans l&apos;app KOUP (paramètres salon).
          Partagez-le sur Instagram, WhatsApp ou votre site.
        </p>
        <p className="text-xs font-mono text-primary break-all">
          https://booking.koup.app/r/votre-slug
        </p>
      </Card>

      <p className="text-center text-sm text-muted-foreground">
        Vous avez reçu un lien ? Ouvrez-le directement — par exemple{" "}
        <code className="text-primary">/r/demo</code> si votre pro vous l&apos;a envoyé.
      </p>
    </div>
  );
}
