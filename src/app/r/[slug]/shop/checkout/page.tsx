"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { GuestForm, type GuestFormValues } from "@/components/booking/GuestForm";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { DuolingoProgress } from "@/components/ui/DuolingoProgress";
import { registerGuest } from "@/lib/api/auth";
import { createOrder } from "@/lib/api/salons";
import { getAccessToken } from "@/lib/auth/token-store";
import { formatMoney, resolveCurrency } from "@/lib/utils/currency";
import {
  generateGuestEmail,
  generateGuestPassword,
} from "@/lib/utils/guest";
import { messageFromApiError } from "@/lib/utils/errors";
import { isAxiosSuccess } from "@/lib/api/client";
import { initialGuest } from "@/store/booking-store";
import { useCartStore } from "@/store/cart-store";
import { getSalonDetail } from "@/lib/api/salons";

export default function ShopCheckoutPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const items = useCartStore((s) => s.items);
  const salonId = useCartStore((s) => s.salonId);
  const subtotal = useCartStore((s) => s.subtotal());
  const clearCart = useCartStore((s) => s.clear);
  const [currency, setCurrency] = useState("XOF");
  const [guestForm, setGuestForm] = useState<GuestFormValues>(initialGuest());
  const [pickupDate, setPickupDate] = useState("");
  const [pickupTime, setPickupTime] = useState("10:00");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    setPickupDate(
      `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`,
    );
    if (salonId) {
      getSalonDetail(salonId).then((detail) => {
        setCurrency(resolveCurrency(detail.proCountryCode));
      });
    }
  }, [salonId]);

  const ensureGuestAuth = async (): Promise<boolean> => {
    if (getAccessToken()) return true;
    const f = guestForm.firstName.trim();
    const l = guestForm.lastName.trim();
    const ph = guestForm.phone.trim();
    if (!f || !l || !ph) {
      setError("Prénom, nom et téléphone sont requis.");
      return false;
    }
    try {
      await registerGuest({
        firstName: f,
        lastName: l,
        email: guestForm.email.trim() || generateGuestEmail(),
        passwordHash: generateGuestPassword(),
        countryCode: guestForm.countryCode,
        phoneNumber: ph,
      });
      return true;
    } catch (e) {
      if (isAxiosSuccess(e)) {
        setError(
          messageFromApiError(
            e.response?.data,
            "Ce contact semble déjà exister.",
          ),
        );
      }
      return false;
    }
  };

  const submit = async () => {
    if (!salonId || items.length === 0) {
      setError("Panier vide ou salon inconnu.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      if (!(await ensureGuestAuth())) {
        setLoading(false);
        return;
      }
      const [y, mo, d] = pickupDate.split("-").map(Number);
      const [h, mi] = pickupTime.split(":").map(Number);
      const pickupAt = new Date(Date.UTC(y, mo - 1, d, h, mi, 0)).toISOString();
      const result = await createOrder(salonId, {
        items: items.map((it) => ({
          productId: it.productId,
          productName: it.name,
          variantLabel: it.variantLabel,
          quantity: it.quantity,
          priceAtPurchase: it.unitPrice,
        })),
        totalPrice: subtotal,
        pickupAt,
        notes: notes.trim() || undefined,
      });
      clearCart();
      const code = result.pickupCompletionCode ?? "";
      const q = new URLSearchParams({
        type: "order",
        code,
        total: String(subtotal),
      });
      router.push(`/r/${slug}/success?${q.toString()}`);
    } catch (e) {
      if (isAxiosSuccess(e)) {
        setError(messageFromApiError(e.response?.data, "Commande impossible."));
      }
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-lg px-4 py-12 text-center space-y-4">
        <p className="text-muted-foreground">Votre panier est vide.</p>
        <Link href={`/r/${slug}/shop`}>
          <Button>Retour boutique</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-6 space-y-6 pb-24">
      <DuolingoProgress current="guest" />
      <h1 className="text-2xl font-black">Finaliser la commande</h1>

      <Card className="space-y-2">
        {items.map((it) => (
          <div
            key={`${it.productId}-${it.variantLabel}`}
            className="flex justify-between text-sm"
          >
            <span>
              {it.name} × {it.quantity}
            </span>
            <span className="text-primary font-bold">
              {formatMoney(it.unitPrice * it.quantity, currency)}
            </span>
          </div>
        ))}
        <div className="border-t border-outline/30 pt-2 flex justify-between font-black">
          <span>Total</span>
          <span className="text-primary">{formatMoney(subtotal, currency)}</span>
        </div>
      </Card>

      <Card className="space-y-3">
        <h2 className="font-bold">Retrait sur place</h2>
        <label className="block space-y-1">
          <span className="text-xs font-bold text-muted-foreground uppercase">
            Date
          </span>
          <input
            type="date"
            value={pickupDate}
            onChange={(e) => setPickupDate(e.target.value)}
            className="w-full rounded-2xl border border-outline/40 bg-surface px-4 py-2"
          />
        </label>
        <label className="block space-y-1">
          <span className="text-xs font-bold text-muted-foreground uppercase">
            Heure
          </span>
          <input
            type="time"
            value={pickupTime}
            onChange={(e) => setPickupTime(e.target.value)}
            className="w-full rounded-2xl border border-outline/40 bg-surface px-4 py-2"
          />
        </label>
        <label className="block space-y-1">
          <span className="text-xs font-bold text-muted-foreground uppercase">
            Notes (optionnel)
          </span>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={2}
            className="w-full rounded-2xl border border-outline/40 bg-surface px-4 py-2"
          />
        </label>
      </Card>

      <GuestForm values={guestForm} onChange={setGuestForm} error={error} />

      <div className="fixed bottom-0 left-0 right-0 border-t border-outline/30 bg-background/95 p-4">
        <div className="mx-auto flex max-w-lg gap-3">
          <Link href={`/r/${slug}/shop`} className="flex-1">
            <Button variant="secondary" className="w-full">
              Retour
            </Button>
          </Link>
          <Button className="flex-[2]" loading={loading} onClick={submit}>
            Valider la commande
          </Button>
        </div>
      </div>
    </div>
  );
}
