import { apiClient } from "@/lib/api/client";
import { setAuthSession } from "@/lib/auth/token-store";
import type { AuthResponse } from "@/types/api";

export interface RegisterPayload {
  firstName: string;
  lastName: string;
  email: string;
  passwordHash: string;
  countryCode: string;
  phoneNumber: string;
  role?: string;
}

export interface LoginPayload {
  email: string;
  passwordHash: string;
}

export async function registerGuest(payload: RegisterPayload): Promise<AuthResponse> {
  const { data } = await apiClient.post<AuthResponse>("auth/register", {
    ...payload,
    role: payload.role ?? "client",
  });
  setAuthSession(data.access_token, data.user);
  return data;
}

export async function login(payload: LoginPayload): Promise<AuthResponse> {
  const { data } = await apiClient.post<AuthResponse>("auth/login", payload);
  setAuthSession(data.access_token, data.user);
  return data;
}
