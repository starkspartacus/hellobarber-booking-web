import { apiClient } from "@/lib/api/client";
import type {
  AppointmentPayload,
  AvailableSlotsResponse,
  HomeVisitEstimate,
  OrderItemPayload,
  ProductItem,
  ResolvedBooking,
  SalonDetailResponse,
} from "@/types/api";

export async function resolveBookingSlug(slug: string): Promise<ResolvedBooking> {
  const { data } = await apiClient.get<ResolvedBooking>(
    `salons/resolve-booking/${encodeURIComponent(slug)}`,
  );
  return data;
}

export async function getSalonDetail(salonId: string): Promise<SalonDetailResponse> {
  const { data } = await apiClient.get<SalonDetailResponse>(
    `salons/${salonId}/detail`,
  );
  return data;
}

export async function getSalonProducts(salonId: string): Promise<ProductItem[]> {
  const { data } = await apiClient.get<ProductItem[] | { products?: ProductItem[] }>(
    `salons/${salonId}/products`,
  );
  if (Array.isArray(data)) return data;
  return data.products ?? [];
}

export async function getAvailableSlots(
  salonId: string,
  params: { date: string; serviceId?: string; durationMinutes?: number },
): Promise<AvailableSlotsResponse> {
  const { data } = await apiClient.get<AvailableSlotsResponse>(
    `salons/${salonId}/available-slots`,
    { params },
  );
  return data;
}

export async function createAppointment(
  salonId: string,
  body: AppointmentPayload,
): Promise<unknown> {
  const { data } = await apiClient.post(`salons/${salonId}/appointments`, body);
  return data;
}

export async function estimateHomeVisit(
  salonId: string,
  latitude: number,
  longitude: number,
): Promise<HomeVisitEstimate> {
  const { data } = await apiClient.get<HomeVisitEstimate>(
    `salons/${salonId}/home-visit/estimate`,
    { params: { latitude, longitude } },
  );
  return data;
}

export interface CreateOrderPayload {
  items: OrderItemPayload[];
  totalPrice: number;
  pickupAt: string;
  notes?: string;
}

export async function createOrder(
  salonId: string,
  body: CreateOrderPayload,
): Promise<{ pickupCompletionCode?: string } & Record<string, unknown>> {
  const { data } = await apiClient.post(`salons/${salonId}/orders`, body);
  return data as { pickupCompletionCode?: string } & Record<string, unknown>;
}
