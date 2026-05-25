"use client";

import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { GlareCard } from "@/components/ui/GlareCard";
import { PromoCountdown } from "@/components/ui/PromoCountdown";
import { formatMoney } from "@/lib/utils/currency";
import { getDiscountedPrice } from "@/lib/utils/service-pricing";
import type { ProductItem } from "@/types/api";

export function ProductCard({
  product,
  currency,
  onAdd,
}: {
  product: ProductItem;
  currency: string;
  onAdd: (variantLabel?: string, price?: number) => void;
}) {
  const hasVariants = product.hasVariants && product.variants?.length;
  const price = product.price;
  const hasPromo = product.promoPercentage && product.promoPercentage > 0;
  const discounted = getDiscountedPrice(price, product.promoPercentage);
  const outOfStock = product.stock <= 0 && !hasVariants;

  return (
    <GlareCard className="flex flex-col h-full animate-slide-up" glareColor="#ff86c8">
      <div className="aspect-square rounded-2xl bg-surface overflow-hidden mb-3">
        {product.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={product.imageUrl}
            alt={product.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-3xl opacity-30">
            🛍️
          </div>
        )}
      </div>
      <h3 className="font-bold text-foreground line-clamp-2">{product.name}</h3>
      {product.brand ? (
        <p className="text-xs text-muted-foreground mt-0.5">{product.brand}</p>
      ) : null}
      <div className="flex flex-col gap-1 items-start mt-2">
        <div className="flex items-center gap-2 flex-wrap">
          <Badge tone={hasPromo ? "red" : "gold"}>{formatMoney(discounted, product.currency ?? currency)}</Badge>
          {!outOfStock && !hasVariants ? (
            <Badge tone="green">En stock</Badge>
          ) : null}
          {hasPromo && (
            <Badge tone="red" className="text-[10px] font-black px-1.5 py-0">
              -{Math.round(product.promoPercentage!)}%
            </Badge>
          )}
        </div>
        {hasPromo && (
          <span className="text-xs text-muted-foreground line-through">
            {formatMoney(price, product.currency ?? currency)}
          </span>
        )}
        {hasPromo && product.promoEndDate && (
          <PromoCountdown endDate={product.promoEndDate} />
        )}
      </div>
      {hasVariants ? (
        <div className="mt-3 space-y-2 flex-1">
          {product.variants!.map((v) => {
            const vPrice = hasPromo ? getDiscountedPrice(v.price, product.promoPercentage) : v.price;
            return (
              <Button
                key={v.name}
                size="sm"
                variant="secondary"
                className="w-full justify-between"
                disabled={v.stock <= 0}
                onClick={() => onAdd(v.name, vPrice)}
              >
                <span>{v.name}</span>
                <div className="flex flex-col items-end">
                  <span>{formatMoney(vPrice, product.currency ?? currency)}</span>
                  {hasPromo && (
                    <span className="text-[10px] text-muted-foreground line-through">
                      {formatMoney(v.price, product.currency ?? currency)}
                    </span>
                  )}
                </div>
              </Button>
            );
          })}
        </div>
      ) : (
        <Button
          className="mt-auto w-full"
          size="sm"
          disabled={outOfStock}
          onClick={() => onAdd(undefined, discounted)}
        >
          Ajouter
        </Button>
      )}
    </GlareCard>
  );
}
