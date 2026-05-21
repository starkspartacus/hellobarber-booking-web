import type { ApiErrorBody } from "@/types/api";

export function messageFromApiError(data: unknown, fallback = "Une erreur est survenue"): string {
  if (!data || typeof data !== "object") return fallback;
  const body = data as ApiErrorBody;
  if (Array.isArray(body.message)) return body.message.join(" ");
  if (typeof body.message === "string" && body.message.trim()) return body.message;
  return fallback;
}
