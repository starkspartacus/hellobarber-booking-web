"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { DatePicker, DatePickerSummary } from "@/components/booking/DatePicker";
import { DurationUnitsPicker } from "@/components/booking/DurationUnitsPicker";
import { GuestForm, type GuestFormValues } from "@/components/booking/GuestForm";
import { ServicePicker } from "@/components/booking/ServicePicker";
import { SlotPicker } from "@/components/booking/SlotPicker";
import { VisitModeSection } from "@/components/booking/VisitModeSection";
import { Button } from "@/components/ui/Button";
import { GlareCard } from "@/components/ui/GlareCard";
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
import {
  bookedDurationForUnits,
  bookedPriceForUnits,
  isPerTimeUnitPricing,
  getDiscountedPrice,
} from "@/lib/utils/service-pricing";
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
  const homeVisitConfig = detail.salon?.homeVisitConfig;
  const homeVisitEnabled = homeVisitConfig?.enabled === true;
  const defaultCountry =
    detail.proCountryCode?.trim() || "cote_d_ivoire";

  const {
    step,
    service,
    date,
    slot,
    guest,
    bookedTimeUnits,
    visitMode,
    visitModeChosen,
    homeVisit,
    submitting,
    setSalon,
    setStep,
    setService,
    setDate,
    setSlot,
    setBookedTimeUnits,
    setVisitMode,
    resetVisitMode,
    setGuest,
    setSubmitting,
  } = useBookingStore();

  const [slotsData, setSlotsData] = useState<AvailableSlotsResponse | null>(null);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [guestForm, setGuestForm] = useState<GuestFormValues>(() => ({
    ...(guest ?? initialGuest(defaultCountry)),
    countryCode: guest?.countryCode ?? defaultCountry,
  }));
  const [error, setError] = useState<string | null>(null);

  const bookedDurationMinutes = useMemo(() => {
    if (!service) return undefined;
    if (isPerTimeUnitPricing(service)) {
      return bookedDurationForUnits(service, bookedTimeUnits);
    }
    return service.durationMinutes;
  }, [service, bookedTimeUnits]);

  const servicePrice = useMemo(() => {
    if (!service) return 0;
    let base = service.price;
    if (isPerTimeUnitPricing(service)) {
      base = bookedPriceForUnits(service, bookedTimeUnits);
    }
    return getDiscountedPrice(base, service.promoPercentage);
  }, [service, bookedTimeUnits]);

  const baseServicePrice = useMemo(() => {
    if (!service) return 0;
    if (isPerTimeUnitPricing(service)) {
      return bookedPriceForUnits(service, bookedTimeUnits);
    }
    return service.price;
  }, [service, bookedTimeUnits]);

  useEffect(() => {
    setSalon(slug, salonId, salonName);
    if (!date) setDate(toIsoDate(new Date()));
    if (!homeVisitEnabled) {
      setVisitMode("salon", null);
    }
  }, [slug, salonId, salonName, setSalon, date, setDate, homeVisitEnabled, setVisitMode]);

  const loadSlots = useCallback(async () => {
    if (!service || !date) return;
    setSlotsLoading(true);
    setError(null);
    try {
      const data = await getAvailableSlots(salonId, {
        date,
        serviceId: service._id,
        durationMinutes: bookedDurationMinutes,
      });
      setSlotsData(data);
    } catch (e) {
      if (isAxiosSuccess(e)) {
        setError(messageFromApiError(e.response?.data));
      }
    } finally {
      setSlotsLoading(false);
    }
  }, [salonId, service, date, bookedDurationMinutes]);

  useEffect(() => {
    if (step === "date" && service && date) {
      loadSlots();
    }
  }, [step, service, date, loadSlots]);

  const goNext = () => {
    const order = ["service", "date", "guest", "confirm"] as const;
    const i = order.indexOf(step);
    if (i < order.length - 1) setStep(order[i + 1]);
  };

  const goBack = () => {
    const order = ["service", "date", "guest", "confirm"] as const;
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
      const payload: Parameters<typeof createAppointment>[1] = {
        serviceId: service._id,
        appointmentDate: slotToIsoUtc(date, slot),
        visitMode,
        clientName,
      };
      if (isPerTimeUnitPricing(service)) {
        payload.bookedTimeUnits = bookedTimeUnits;
        payload.bookedDurationMinutes = bookedDurationMinutes;
      }
      if (visitMode === "home" && homeVisit) {
        payload.homeVisit = {
          address: homeVisit.address,
          addressComplement: homeVisit.addressComplement,
          city: homeVisit.city,
          commune: homeVisit.commune,
          phone: homeVisit.phone,
          latitude: homeVisit.latitude,
          longitude: homeVisit.longitude,
          notes: homeVisit.notes,
        };
      }
      await createAppointment(salonId, payload);
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

  const visitReady = !homeVisitEnabled || visitModeChosen;

  const canNext =
    (step === "service" && service && visitReady) ||
    (step === "date" && date && slot) ||
    step === "guest" ||
    step === "confirm";

  return (
    <div className="mx-auto max-w-lg space-y-6 pb-24">
      <DuolingoProgress current={step} />
      <h2 className="text-xl font-black text-foreground">
        {step === "service" && "Choisir une prestation"}
        {step === "date" && "Date & Heure"}
        {step === "guest" && "Vos coordonnées"}
        {step === "confirm" && "Confirmer"}
      </h2>

      {step === "service" && (
        <div className="space-y-5">
          <ServicePicker
            services={detail.services}
            selectedId={service?._id}
            currency={currency}
            onSelect={(s: ServiceItem) => {
              setService(s);
              if (homeVisitEnabled) {
                resetVisitMode();
              }
            }}
          />
          {service && isPerTimeUnitPricing(service) ? (
            <DurationUnitsPicker
              service={service}
              units={bookedTimeUnits}
              currency={currency}
              onChange={setBookedTimeUnits}
            />
          ) : null}
          {service && homeVisitEnabled && homeVisitConfig ? (
            <VisitModeSection
              salonId={salonId}
              config={homeVisitConfig}
              salonName={salonName}
              currency={currency}
              visitMode={visitMode}
              homeVisit={homeVisit}
              onSelect={setVisitMode}
            />
          ) : null}
        </div>
      )}

      {step === "date" && (
        <div className="space-y-6 animate-fade-in">
          <div className="space-y-2">
            <DatePicker selected={date} onSelect={setDate} />
            {date ? <DatePickerSummary date={date} /> : null}
          </div>
          {service && (
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
        </div>
      )}

      {step === "guest" && (
        <GuestForm
          values={guestForm}
          onChange={setGuestForm}
          error={error}
        />
      )}

      {step === "confirm" && service && slot && (
        <GlareCard className="space-y-3 animate-pop" glareColor="#58cc02">
          <p className="font-bold text-lg">{service.name}</p>
          <div className="flex items-end gap-3">
            <p className="text-primary font-black text-xl">
              {formatMoney(servicePrice, currency)}
            </p>
            {service.promoPercentage && service.promoPercentage > 0 && (
              <p className="text-sm font-semibold text-muted-foreground line-through pb-0.5">
                {formatMoney(baseServicePrice, currency)}
              </p>
            )}
          </div>
          {isPerTimeUnitPricing(service) ? (
            <p className="text-xs text-muted-foreground">
              {bookedTimeUnits} bloc{bookedTimeUnits > 1 ? "s" : ""} ·{" "}
              {bookedDurationMinutes} min
            </p>
          ) : null}
          <p className="text-sm text-muted-foreground capitalize">
            {formatFrenchDate(date)} · {slot}
          </p>
          <p className="text-sm">{salonName}</p>
          <p className="text-sm font-semibold">
            {visitMode === "home" ? "🏠 À domicile" : "🏪 Au salon"}
          </p>
          {visitMode === "home" && homeVisit ? (
            <p className="text-xs text-muted-foreground">{homeVisit.address}</p>
          ) : null}
          <p className="text-xs text-muted-foreground">Paiement sur place</p>
        </GlareCard>
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
