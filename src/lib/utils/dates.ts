export function toIsoDate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function slotToIsoUtc(date: string, time: string): string {
  const [y, mo, d] = date.split("-").map(Number);
  const [h, mi] = time.split(":").map(Number);
  return new Date(Date.UTC(y, mo - 1, d, h, mi, 0)).toISOString();
}

export function formatFrenchDate(dateStr: string): string {
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function nextDays(count = 14): string[] {
  const out: string[] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  for (let i = 0; i < count; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    out.push(toIsoDate(d));
  }
  return out;
}

export function generateDaysForMonth(year: number, monthIndex: number): string[] {
  const out: string[] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  // Start from the 1st of the month, or today if it's the current month
  let d = new Date(year, monthIndex, 1);
  if (year === today.getFullYear() && monthIndex === today.getMonth()) {
    d = new Date(today);
  }
  // If the requested month is in the past, still start from the 1st (or today if we want to block past, but let's just generate it and disable past dates in the UI)
  if (d < today && (year !== today.getFullYear() || monthIndex !== today.getMonth())) {
    d = new Date(year, monthIndex, 1); // just generate them, UI will disable
  }

  while (d.getMonth() === monthIndex) {
    out.push(toIsoDate(d));
    d.setDate(d.getDate() + 1);
  }
  return out;
}
