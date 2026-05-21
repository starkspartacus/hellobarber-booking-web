const GUEST_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

export function generateGuestPassword(): string {
  let code = "";
  for (let i = 0; i < 7; i++) {
    code += GUEST_CHARS[Math.floor(Math.random() * GUEST_CHARS.length)];
  }
  return code;
}

export function generateGuestEmail(): string {
  return `guest_${Date.now()}@hellobarber.guest`;
}

export const COUNTRY_OPTIONS = [
  { code: "cote_d_ivoire", label: "Côte d'Ivoire", phoneCode: "+225" },
  { code: "senegal", label: "Sénégal", phoneCode: "+221" },
  { code: "mali", label: "Mali", phoneCode: "+223" },
  { code: "burkina_faso", label: "Burkina Faso", phoneCode: "+226" },
  { code: "guinee", label: "Guinée", phoneCode: "+224" },
  { code: "france", label: "France", phoneCode: "+33" },
] as const;
