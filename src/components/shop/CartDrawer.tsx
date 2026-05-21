"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { formatMoney } from "@/lib/utils/currency";
import { useCartStore } from "@/store/cart-store";

export function CartDrawer({
  slug,
  currency,
  open,
  onClose,
}: {
  slug: string;
  currency: string;
  open: boolean;
  onClose: () => void;
}) {
  const items = useCartStore((s) => s.items);
  const updateQty = useCartStore((s) => s.updateQty);
  const removeItem = useCartStore((s) => s.removeItem);
  const subtotal = useCartStore((s) => s.subtotal());

  if (!open) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-black/60 animate-fade-in"
        onClick={onClose}
        aria-hidden
      />
      <aside className="fixed bottom-0 left-0 right-0 z-50 max-h-[80vh] overflow-y-auto rounded-t-3xl border border-outline/30 bg-surface-elevated p-5 animate-slide-up">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-black">Panier</h3>
          <button
            type="button"
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground"
          >
            ✕
          </button>
        </div>
        {items.length === 0 ? (
          <p className="text-sm text-muted-foreground py-8 text-center">
            Votre panier est vide.
          </p>
        ) : (
          <ul className="space-y-3">
            {items.map((it) => (
              <li
                key={`${it.productId}-${it.variantLabel ?? ""}`}
                className="flex gap-3 rounded-2xl bg-surface p-3"
              >
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm truncate">{it.name}</p>
                  {it.variantLabel ? (
                    <p className="text-xs text-muted-foreground">{it.variantLabel}</p>
                  ) : null}
                  <p className="text-sm text-primary font-bold mt-1">
                    {formatMoney(it.unitPrice * it.quantity, currency)}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    className="h-8 w-8 rounded-xl bg-surface-elevated font-bold"
                    onClick={() =>
                      updateQty(it.productId, it.variantLabel, it.quantity - 1)
                    }
                  >
                    −
                  </button>
                  <span className="w-6 text-center font-bold">{it.quantity}</span>
                  <button
                    type="button"
                    className="h-8 w-8 rounded-xl bg-primary/20 font-bold text-primary"
                    onClick={() =>
                      updateQty(it.productId, it.variantLabel, it.quantity + 1)
                    }
                  >
                    +
                  </button>
                  <button
                    type="button"
                    className="text-xs text-danger ml-1"
                    onClick={() => removeItem(it.productId, it.variantLabel)}
                  >
                    Retirer
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
        <div className="mt-6 border-t border-outline/30 pt-4">
          <div className="flex justify-between font-black text-lg mb-4">
            <span>Total</span>
            <span className="text-primary">{formatMoney(subtotal, currency)}</span>
          </div>
          <Link href={`/r/${slug}/shop/checkout`} onClick={onClose}>
            <Button className="w-full" disabled={items.length === 0}>
              Commander
            </Button>
          </Link>
        </div>
      </aside>
    </>
  );
}
