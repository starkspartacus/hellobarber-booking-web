"use client";

import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { formatMoney } from "@/lib/utils/currency";
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
  const outOfStock = product.stock <= 0 && !hasVariants;

  return (
    <Card className="flex flex-col h-full animate-slide-up">
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
      <div className="mt-2 flex items-center gap-2">
        <Badge tone="gold">{formatMoney(price, product.currency ?? currency)}</Badge>
        {!outOfStock && !hasVariants ? (
          <Badge tone="green">En stock</Badge>
        ) : null}
      </div>
      {hasVariants ? (
        <div className="mt-3 space-y-2 flex-1">
          {product.variants!.map((v) => (
            <Button
              key={v.name}
              size="sm"
              variant="secondary"
              className="w-full justify-between"
              disabled={v.stock <= 0}
              onClick={() => onAdd(v.name, v.price)}
            >
              <span>{v.name}</span>
              <span>{formatMoney(v.price, product.currency ?? currency)}</span>
            </Button>
          ))}
        </div>
      ) : (
        <Button
          className="mt-auto w-full"
          size="sm"
          disabled={outOfStock}
          onClick={() => onAdd(undefined, price)}
        >
          Ajouter
        </Button>
      )}
    </Card>
  );
}
