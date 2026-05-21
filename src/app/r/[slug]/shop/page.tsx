"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ProductCard } from "@/components/shop/ProductCard";
import { CartDrawer } from "@/components/shop/CartDrawer";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { getSalonDetail, getSalonProducts, resolveBookingSlug } from "@/lib/api/salons";
import { resolveCurrency } from "@/lib/utils/currency";
import { useCartStore } from "@/store/cart-store";
import type { ProductItem } from "@/types/api";

export default function ShopPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [currency, setCurrency] = useState("XOF");
  const [salonName, setSalonName] = useState("");
  const [loading, setLoading] = useState(true);
  const [cartOpen, setCartOpen] = useState(false);
  const addItem = useCartStore((s) => s.addItem);
  const setContext = useCartStore((s) => s.setContext);
  const itemCount = useCartStore((s) => s.itemCount());

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const resolved = await resolveBookingSlug(slug);
        const [detail, prods] = await Promise.all([
          getSalonDetail(resolved.salonId),
          getSalonProducts(resolved.salonId),
        ]);
        if (cancelled) return;
        setContext(slug, resolved.salonId, resolved.salonName);
        setSalonName(resolved.salonName);
        setProducts(prods);
        setCurrency(resolveCurrency(detail.proCountryCode));
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [slug, setContext]);

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <span className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-6 pb-24">
      <div className="flex items-center justify-between mb-6">
        <div>
          <Link href={`/r/${slug}`} className="text-sm text-primary font-semibold">
            ← {salonName}
          </Link>
          <h1 className="text-2xl font-black mt-1">Boutique</h1>
        </div>
        <button type="button" onClick={() => setCartOpen(true)} className="relative">
          <Button variant="secondary" size="sm">
            Panier
          </Button>
          {itemCount > 0 ? (
            <Badge
              tone="pink"
              className="absolute -top-2 -right-2 min-w-[1.25rem] justify-center"
            >
              {itemCount}
            </Badge>
          ) : null}
        </button>
      </div>

      {products.length === 0 ? (
        <p className="text-center text-muted-foreground py-12">
          Aucun produit disponible.
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {products.map((p) => (
            <ProductCard
              key={p._id}
              product={p}
              currency={currency}
              onAdd={(variantLabel, price) => {
                const unitPrice = price ?? p.price;
                const stock =
                  variantLabel && p.variants
                    ? p.variants.find((v) => v.name === variantLabel)?.stock ?? p.stock
                    : p.stock;
                addItem({
                  productId: p._id,
                  name: p.name,
                  variantLabel,
                  unitPrice,
                  imageUrl: p.imageUrl,
                  maxStock: Math.max(1, stock),
                });
                setCartOpen(true);
              }}
            />
          ))}
        </div>
      )}

      <CartDrawer
        slug={slug}
        currency={currency}
        open={cartOpen}
        onClose={() => setCartOpen(false)}
      />
    </div>
  );
}
