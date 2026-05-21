export type VisitMode = "salon" | "home";

export interface ResolvedBooking {
  salonId: string;
  salonName: string;
  bookingSlug: string;
  imageUrl?: string;
}

export interface HomeVisitConfig {
  enabled: boolean;
  radiusKm: number;
  feeMode: "fixed" | "distance";
  fixedFee: number;
  feePerKm: number;
  minTravelFee: number;
  maxTravelFee?: number | null;
  infoMessage?: string;
}

export interface SalonDocument {
  _id: string;
  name: string;
  description?: string;
  address?: string;
  addressComplement?: string;
  commune?: string;
  city?: string;
  imageUrl?: string;
  categoryLabel?: string;
  rating?: number;
  reviewsCount?: number;
  specialties?: string[];
  homeVisitConfig?: HomeVisitConfig;
}

export interface ServiceItem {
  _id: string;
  name: string;
  description?: string;
  price: number;
  durationMinutes: number;
  imageUrl?: string | null;
  durationPricingMode?: "fixed" | "per_time_unit";
  minDurationUnits?: number;
  maxDurationUnits?: number;
}

export interface ReviewItem {
  _id: string;
  clientName?: string;
  clientAvatarUrl?: string | null;
  rating: number;
  comment?: string;
  createdAt?: string;
}

export interface SalonDetailResponse {
  salon: SalonDocument | null;
  services: ServiceItem[];
  reviews: ReviewItem[];
  proCountryCode?: string | null;
}

export interface ProductVariant {
  name: string;
  price: number;
  stock: number;
}

export interface ProductItem {
  _id: string;
  name: string;
  description?: string;
  price: number;
  stock: number;
  imageUrl?: string | null;
  category?: string;
  subcategory?: string;
  brand?: string;
  variants?: ProductVariant[];
  hasVariants?: boolean;
  currency?: string;
}

export interface AvailableSlotsResponse {
  date: string;
  durationMinutes: number;
  stepMinutes: number;
  available: string[];
  occupied: string[];
  maxConcurrent: number;
  holidayClosed?: boolean;
  holidayMessage?: string;
  holidayReopenDate?: string;
}

export interface HomeVisitEstimate {
  distanceKm: number;
  travelFee: number;
  withinRadius: boolean;
  radiusKm: number;
  feeMode: string;
  homeVisitConfig: HomeVisitConfig;
}

export interface AuthUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  countryCode?: string;
  currency?: string;
  phoneNumber?: string;
}

export interface AuthResponse {
  access_token: string;
  user: AuthUser;
  message?: string;
}

export interface OrderItemPayload {
  productId: string;
  productName: string;
  variantLabel?: string;
  quantity: number;
  priceAtPurchase: number;
}

export interface AppointmentPayload {
  serviceId: string;
  appointmentDate: string;
  visitMode?: VisitMode;
  notes?: string;
  clientName?: string;
  bookedTimeUnits?: number;
  bookedDurationMinutes?: number;
  homeVisit?: {
    address: string;
    addressComplement?: string;
    city?: string;
    commune?: string;
    phone: string;
    latitude?: number;
    longitude?: number;
    notes?: string;
  };
}

export interface ApiErrorBody {
  statusCode?: number;
  message?: string | string[];
  error?: string;
}
