"use client";

import { create } from "zustand";
import type { ServiceItem, VisitMode } from "@/types/api";

export type BookingStep = "service" | "date" | "slot" | "guest" | "confirm";

export interface HomeVisitPayload {
  address: string;
  addressComplement?: string;
  city?: string;
  commune?: string;
  phone: string;
  latitude: number;
  longitude: number;
  notes?: string;
  travelFee?: number;
  distanceKm?: number;
}

interface GuestInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  countryCode: string;
}

interface BookingState {
  slug: string;
  salonId: string;
  salonName: string;
  step: BookingStep;
  service: ServiceItem | null;
  date: string;
  slot: string | null;
  bookedTimeUnits: number;
  visitMode: VisitMode;
  visitModeChosen: boolean;
  homeVisit: HomeVisitPayload | null;
  guest: GuestInfo | null;
  submitting: boolean;
  setSalon: (slug: string, salonId: string, salonName: string) => void;
  setStep: (step: BookingStep) => void;
  setService: (service: ServiceItem) => void;
  setDate: (date: string) => void;
  setSlot: (slot: string) => void;
  setBookedTimeUnits: (units: number) => void;
  setVisitMode: (mode: VisitMode, homeVisit?: HomeVisitPayload | null) => void;
  resetVisitMode: () => void;
  setGuest: (guest: GuestInfo) => void;
  setSubmitting: (v: boolean) => void;
  reset: () => void;
}

const initialGuest = (countryCode = "cote_d_ivoire"): GuestInfo => ({
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  countryCode,
});

export const useBookingStore = create<BookingState>((set) => ({
  slug: "",
  salonId: "",
  salonName: "",
  step: "service",
  service: null,
  date: "",
  slot: null,
  bookedTimeUnits: 1,
  visitMode: "salon",
  visitModeChosen: false,
  homeVisit: null,
  guest: null,
  submitting: false,
  setSalon: (slug, salonId, salonName) => set({ slug, salonId, salonName }),
  setStep: (step) => set({ step }),
  setService: (service) =>
    set({
      service,
      slot: null,
      bookedTimeUnits: service.minDurationUnits ?? 1,
    }),
  setDate: (date) => set({ date, slot: null }),
  setSlot: (slot) => set({ slot }),
  setBookedTimeUnits: (bookedTimeUnits) => set({ bookedTimeUnits, slot: null }),
  setVisitMode: (visitMode, homeVisit = null) =>
    set({
      visitMode,
      homeVisit: visitMode === "home" ? homeVisit : null,
      visitModeChosen:
        visitMode === "salon" || (visitMode === "home" && homeVisit != null),
      slot: null,
    }),
  resetVisitMode: () =>
    set({ visitMode: "salon", homeVisit: null, visitModeChosen: false, slot: null }),
  setGuest: (guest) => set({ guest }),
  setSubmitting: (submitting) => set({ submitting }),
  reset: () =>
    set({
      step: "service",
      service: null,
      date: "",
      slot: null,
      bookedTimeUnits: 1,
      visitMode: "salon",
      visitModeChosen: false,
      homeVisit: null,
      guest: null,
      submitting: false,
    }),
}));

export { initialGuest };
