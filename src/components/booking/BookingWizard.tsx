"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { DatePicker, DatePickerSummary } from "@/components/booking/DatePicker";
import { GuestForm, type GuestFormValues } from "@/components/booking/GuestForm";
import { ServicePicker } from "@/components/booking/ServicePicker";
import { SlotPicker } from "@/components/booking/SlotPicker";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { DuolingoProgress } from "@/components/ui/DuolingoProgress";
import { registerGuest } from "@/lib/api/auth";
import { createAppointment, getAvailableSlots } from "@/lib/api/salons";
import { getAccessToken } from "@/lib/auth/token-store";
import { formatMoney, resolveCurrency } from "@/lib/utils/currency";
import { toIsoDate, slotToIsoUtc, formatFrenchDate } from "@/lib/utils/dates";
import {
  generateGuestEmail,
  generateGuestPassword,
} from "@/lib/utils/guest";
import { messageFromApiError } from "@/lib/utils/errors";
import { isAxiosSuccess } from "@/lib/api/client";
import { initialGuest, useBookingStore } from "@/store/booking-store";
import type { AvailableSlotsResponse, SalonDetailResponse, ServiceItem } from "@/types/api";

export function BookingWizard({
  slug,
  salonId,
  salonName,
  detail,
}: {
  slug: string;
  salonId: string;
  salonName: string;
  detail: SalonDetailResponse;
}) {
  const router = useRouter();
  const currency = resolveCurrency(detail.proCountryCode);
  const {
    step,
    service,
    date,
    slot,
    guest,
    submitting,
    setSalon,
    setStep,
    setService,
    setDate,
    setSlot,
    setGuest,
    setSubmitting,
  } = useBookingStore();

  const [slotsData, setSlotsData] = useState<AvailableSlotsResponse | null>(null);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [guestForm, setGuestForm] = useState<GuestFormValues>(
    guest ?? initialGuest(),
  );
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setSalon(slug, salonId, salonName);
    if (!date) setDate(toIsoDate(new Date()));
  }, [slug, salonId, salonName, setSalon, date, setDate]);

  const loadSlots = useCallback(async () => {
    if (!service || !date) return;
    setSlotsLoading(true);
    setError(null);
    try {
      const data = await getAvailableSlots(salonId, {
        date,
        serviceId: service._id,
      });
      setSlotsData(data);
    } catch (e) {
      if (isAxiosSuccess(e)) {
        setError(messageFromApiError(e.response?.data));
      }
    } finally {
      setSlotsLoading(false);
    }
  }, [salonId, service, date]);

  useEffect(() => {
    if (step === "slot" && service && date) {
      loadSlots();
    }
  }, [step, service, date, loadSlots]);

  const goNext = () => {
    const order = ["service", "date", "slot", "guest", "confirm"] as const;
    const i = order.indexOf(step);
    if (i < order.length - 1) setStep(order[i + 1]);
  };

  const goBack = () => {
    const order = ["service", "date", "slot", "guest", "confirm"] as const;
    const i = order.indexOf(step);
    if (i > 0) setStep(order[i - 1]);
    else router.push(`/r/${slug}`);
  };

  const ensureGuestAuth = async (): Promise<boolean> => {
    if (getAccessToken()) return true;
    const f = guestForm.firstName.trim();
    const l = guestForm.lastName.trim();
    const ph = guestForm.phone.trim();
    if (!f || !l || !ph) {
      setError("Prénom, nom et téléphone sont requis.");
      return false;
    }
    const email = guestForm.email.trim() || generateGuestEmail();
    const password = generateGuestPassword();
    try {
      await registerGuest({
        firstName: f,
        lastName: l,
        email,
        passwordHash: password,
        countryCode: guestForm.countryCode,
        phoneNumber: ph,
      });
      setGuest({ ...guestForm, email });
      return true;
    } catch (e) {
      if (isAxiosSuccess(e)) {
        setError(
          messageFromApiError(
            e.response?.data,
            "Ce contact semble déjà exister. Utilisez un autre numéro.",
          ),
        );
      } else {
        setError("Inscription impossible. Réessayez.");
      }
      return false;
    }
  };

  const submitBooking = async () => {
    if (!service || !date || !slot) return;
    setSubmitting(true);
    setError(null);
    try {
      if (!(await ensureGuestAuth())) {
        setSubmitting(false);
        return;
      }
      const clientName = `${guestForm.firstName.trim()} ${guestForm.lastName.trim()}`.trim();
      await createAppointment(salonId, {
        serviceId: service._id,
        appointmentDate: slotToIsoUtc(date, slot),
        visitMode: "salon",
        clientName,
      });
      const params = new URLSearchParams({
        type: "appointment",
        service: service.name,
        when: `${formatFrenchDate(date)} · ${slot}`,
      });
      router.push(`/r/${slug}/success?${params.toString()}`);
    } catch (e) {
      if (isAxiosSuccess(e)) {
        setError(messageFromApiError(e.response?.data, "Réservation impossible."));
      }
    } finally {
      setSubmitting(false);
    }
  };

  const canNext =
    (step === "service" && service) ||
    (step === "date" && date) ||
    (step === "slot" && slot) ||
    step === "guest" ||
    step === "confirm";

  return (
    <div className="mx-auto max-w-lg space-y-6 pb-24">
      <DuolingoProgress current={step} />
      <h2 className="text-xl font-black text-foreground">
        {step === "service" && "Choisir une prestation"}
        {step === "date" && "Choisir une date"}
        {step === "slot" && "Choisir un créneau"}
        {step === "guest" && "Vos coordonnées"}
        {step === "confirm" && "Confirmer"}
      </h2>

      {step === "service" && (
        <ServicePicker
          services={detail.services}
          selectedId={service?._id}
          currency={currency}
          onSelect={(s: ServiceItem) => {
            setService(s);
            goNext();
          }}
        />
      )}

      {step === "date" && (
        <>
          <DatePicker selected={date} onSelect={setDate} />
          {date ? <DatePickerSummary date={date} /> : null}
        </>
      )}

      {step === "slot" && service && (
        <SlotPicker
          data={slotsData}
          selected={slot}
          date={date}
          onSelect={(s) => {
            setSlot(s);
            goNext();
          }}
          loading={slotsLoading}
        />
      )}

      {step === "guest" && (
        <GuestForm values={guestForm} onChange={setGuestForm} error={error} />
      )}

      {step === "confirm" && service && slot && (
        <Card className="space-y-3 animate-pop">
          <p className="font-bold text-lg">{service.name}</p>
          <p className="text-primary font-black text-xl">
            {formatMoney(service.price, currency)}
          </p>
          <p className="text-sm text-muted-foreground capitalize">
            {formatFrenchDate(date)} · {slot}
          </p>
          <p className="text-sm">{salonName}</p>
          <p className="text-xs text-muted-foreground">Paiement sur place</p>
        </Card>
      )}

      {error && step !== "guest" ? (
        <p className="text-sm text-danger">{error}</p>
      ) : null}

      <div className="fixed bottom-0 left-0 right-0 border-t border-outline/30 bg-background/95 backdrop-blur p-4">
        <div className="mx-auto flex max-w-lg gap-3">
          <Button variant="secondary" className="flex-1" onClick={goBack}>
            Retour
          </Button>
          {step === "confirm" ? (
            <Button
              className="flex-[2]"
              loading={submitting}
              onClick={submitBooking}
            >
              Confirmer le RDV
            </Button>
          ) : step === "guest" ? (
            <Button
              className="flex-[2]"
              disabled={!canNext}
              onClick={() => {
                setError(null);
                goNext();
              }}
            >
              Continuer
            </Button>
          ) : (
            <Button
              className="flex-[2]"
              disabled={!canNext}
              onClick={goNext}
            >
              Continuer
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
