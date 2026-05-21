import Link from "next/link";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";
import { AppOpenBanner } from "@/components/layout/AppOpenBanner";
import { SalonHero } from "@/components/layout/SalonHero";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import {
  getSalonDetail,
  getSalonProducts,
  resolveBookingSlug,
} from "@/lib/api/salons";
import { formatMoney, resolveCurrency } from "@/lib/utils/currency";

export default async function SalonPublicPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  let resolved;
  try {
    resolved = await resolveBookingSlug(slug);
  } catch {
    notFound();
  }

  const [detail, products] = await Promise.all([
    getSalonDetail(resolved.salonId),
    getSalonProducts(resolved.salonId).catch(() => []),
  ]);

  if (!detail.salon) notFound();

  const salon = detail.salon;
  const currency = resolveCurrency(detail.proCountryCode);
  const previewProducts = products.slice(0, 4);

  return (
    <div className="mx-auto max-w-2xl px-4 py-6 space-y-8 animate-fade-in">
      <AppOpenBanner slug={slug} />
      <SalonHero
        salon={salon}
        rating={salon.rating}
        reviewsCount={salon.reviewsCount}
      />

      <div className="flex flex-wrap gap-3">
        <Link href={`/r/${slug}/book`} className="flex-1 min-w-[140px]">
          <Button className="w-full" size="lg">
            Prendre RDV
          </Button>
        </Link>
        {products.length > 0 ? (
          <Link href={`/r/${slug}/shop`} className="flex-1 min-w-[140px]">
            <Button variant="secondary" className="w-full" size="lg">
              Boutique
            </Button>
          </Link>
        ) : null}
      </div>

      <section className="space-y-3">
        <h2 className="text-lg font-black flex items-center gap-2">
          Prestations
          <Badge tone="blue">{detail.services.length}</Badge>
        </h2>
        <div className="space-y-2">
          {detail.services.slice(0, 6).map((svc) => (
            <Card key={svc._id} className="flex justify-between items-center py-3">
              <div>
                <p className="font-semibold">{svc.name}</p>
                <p className="text-xs text-muted-foreground">
                  {svc.durationMinutes} min
                </p>
              </div>
              <Badge tone="gold">{formatMoney(svc.price, currency)}</Badge>
            </Card>
          ))}
        </div>
        {detail.services.length > 6 ? (
          <Link href={`/r/${slug}/book`}>
            <Button variant="ghost" className="w-full">
              Voir tout et réserver
            </Button>
          </Link>
        ) : null}
      </section>

      {detail.reviews.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-lg font-black">Avis clients</h2>
          {detail.reviews.slice(0, 3).map((r) => (
            <Card key={r._id} className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-primary font-bold">★ {r.rating}</span>
                <span className="text-sm font-semibold">
                  {r.clientName ?? "Client"}
                </span>
              </div>
              {r.comment ? (
                <p className="text-sm text-muted-foreground">{r.comment}</p>
              ) : null}
            </Card>
          ))}
        </section>
      ) : null}

      {previewProducts.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-lg font-black">Boutique</h2>
          <div className="grid grid-cols-2 gap-3">
            {previewProducts.map((p) => (
              <Card key={p._id} className="p-3">
                <p className="font-semibold text-sm line-clamp-2">{p.name}</p>
                <p className="text-primary font-bold text-sm mt-1">
                  {formatMoney(p.price, p.currency ?? currency)}
                </p>
              </Card>
            ))}
          </div>
          <Link href={`/r/${slug}/shop`}>
            <Button variant="secondary" className="w-full">
              Voir la boutique
            </Button>
          </Link>
        </section>
      ) : null}
    </div>
  );
}
