import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";
import { getAccessToken } from "@/lib/auth/token-store";

const baseURL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ||
  "http://127.0.0.1:7700/api";

export const apiClient = axios.create({
  baseURL,
  headers: { "Content-Type": "application/json" },
  timeout: 30_000,
});

apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export function isAxiosSuccess(error: unknown): error is AxiosError {
  return axios.isAxiosError(error);
}

export { baseURL };
