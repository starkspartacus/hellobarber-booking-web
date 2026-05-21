const DEFAULT_CURRENCY: Record<string, string> = {
  cote_d_ivoire: "XOF",
  senegal: "XOF",
  mali: "XOF",
  burkina_faso: "XOF",
  guinee: "GNF",
  france: "EUR",
};

export function resolveCurrency(countryCode?: string | null, fallback = "XOF"): string {
  if (!countryCode) return fallback;
  return DEFAULT_CURRENCY[countryCode] ?? fallback;
}

export function formatMoney(amount: number, currency = "XOF"): string {
  try {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency,
      maximumFractionDigits: currency === "XOF" ? 0 : 2,
    }).format(amount);
  } catch {
    return `${Math.round(amount)} ${currency}`;
  }
}
