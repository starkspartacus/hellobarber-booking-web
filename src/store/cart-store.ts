"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartLine {
  productId: string;
  name: string;
  variantLabel?: string;
  quantity: number;
  unitPrice: number;
  imageUrl?: string | null;
  maxStock: number;
}

interface CartState {
  slug: string;
  salonId: string;
  salonName: string;
  items: CartLine[];
  setContext: (slug: string, salonId: string, salonName: string) => void;
  addItem: (line: Omit<CartLine, "quantity"> & { quantity?: number }) => void;
  updateQty: (productId: string, variantLabel: string | undefined, qty: number) => void;
  removeItem: (productId: string, variantLabel?: string) => void;
  clear: () => void;
  subtotal: () => number;
  itemCount: () => number;
}

function lineKey(productId: string, variantLabel?: string) {
  return `${productId}::${variantLabel ?? ""}`;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      slug: "",
      salonId: "",
      salonName: "",
      items: [],
      setContext: (slug, salonId, salonName) => set({ slug, salonId, salonName }),
      addItem: (line) => {
        const key = lineKey(line.productId, line.variantLabel);
        set((state) => {
          const idx = state.items.findIndex(
            (i) => lineKey(i.productId, i.variantLabel) === key,
          );
          const addQty = line.quantity ?? 1;
          if (idx >= 0) {
            const next = [...state.items];
            const cur = next[idx];
            const qty = Math.min(cur.maxStock, cur.quantity + addQty);
            next[idx] = { ...cur, quantity: qty };
            return { items: next };
          }
          return {
            items: [
              ...state.items,
              {
                productId: line.productId,
                name: line.name,
                variantLabel: line.variantLabel,
                quantity: Math.min(addQty, line.maxStock),
                unitPrice: line.unitPrice,
                imageUrl: line.imageUrl,
                maxStock: line.maxStock,
              },
            ],
          };
        });
      },
      updateQty: (productId, variantLabel, qty) => {
        const key = lineKey(productId, variantLabel);
        set((state) => ({
          items: state.items
            .map((i) =>
              lineKey(i.productId, i.variantLabel) === key
                ? { ...i, quantity: Math.max(0, Math.min(qty, i.maxStock)) }
                : i,
            )
            .filter((i) => i.quantity > 0),
        }));
      },
      removeItem: (productId, variantLabel) => {
        const key = lineKey(productId, variantLabel);
        set((state) => ({
          items: state.items.filter(
            (i) => lineKey(i.productId, i.variantLabel) !== key,
          ),
        }));
      },
      clear: () => set({ items: [] }),
      subtotal: () =>
        get().items.reduce((s, i) => s + i.unitPrice * i.quantity, 0),
      itemCount: () => get().items.reduce((s, i) => s + i.quantity, 0),
    }),
    { name: "koup-booking-cart" },
  ),
);
