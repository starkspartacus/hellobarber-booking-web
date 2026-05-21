"use client";

import { create } from "zustand";
import type { ServiceItem, VisitMode } from "@/types/api";

export type BookingStep = "service" | "date" | "slot" | "guest" | "confirm";

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
  visitMode: VisitMode;
  guest: GuestInfo | null;
  submitting: boolean;
  setSalon: (slug: string, salonId: string, salonName: string) => void;
  setStep: (step: BookingStep) => void;
  setService: (service: ServiceItem) => void;
  setDate: (date: string) => void;
  setSlot: (slot: string) => void;
  setGuest: (guest: GuestInfo) => void;
  setSubmitting: (v: boolean) => void;
  reset: () => void;
}

const initialGuest = (): GuestInfo => ({
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  countryCode: "cote_d_ivoire",
});

export const useBookingStore = create<BookingState>((set) => ({
  slug: "",
  salonId: "",
  salonName: "",
  step: "service",
  service: null,
  date: "",
  slot: null,
  visitMode: "salon",
  guest: null,
  submitting: false,
  setSalon: (slug, salonId, salonName) => set({ slug, salonId, salonName }),
  setStep: (step) => set({ step }),
  setService: (service) => set({ service, slot: null }),
  setDate: (date) => set({ date, slot: null }),
  setSlot: (slot) => set({ slot }),
  setGuest: (guest) => set({ guest }),
  setSubmitting: (submitting) => set({ submitting }),
  reset: () =>
    set({
      step: "service",
      service: null,
      date: "",
      slot: null,
      visitMode: "salon",
      guest: null,
      submitting: false,
    }),
}));

export { initialGuest };
