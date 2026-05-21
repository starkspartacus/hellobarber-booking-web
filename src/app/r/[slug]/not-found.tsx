import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function SalonNotFound() {
  return (
    <div className="mx-auto max-w-md px-4 py-20 text-center space-y-6">
      <p className="text-5xl">🔍</p>
      <h1 className="text-2xl font-black">Salon introuvable</h1>
      <p className="text-muted-foreground text-sm">
        Ce lien de réservation n&apos;existe pas ou n&apos;est plus actif.
      </p>
      <Link href="/">
        <Button>Accueil KOUP</Button>
      </Link>
    </div>
  );
}
