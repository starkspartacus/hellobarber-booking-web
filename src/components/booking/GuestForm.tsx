"use client";

import { COUNTRY_OPTIONS } from "@/lib/utils/guest";

export interface GuestFormValues {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  countryCode: string;
}

export function GuestForm({
  values,
  onChange,
  error,
}: {
  values: GuestFormValues;
  onChange: (v: GuestFormValues) => void;
  error?: string | null;
}) {
  const field = (
    label: string,
    key: keyof GuestFormValues,
    opts?: { type?: string; placeholder?: string },
  ) => (
    <label className="block space-y-1.5">
      <span className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
        {label}
      </span>
      <input
        type={opts?.type ?? "text"}
        value={values[key]}
        onChange={(e) => onChange({ ...values, [key]: e.target.value })}
        placeholder={opts?.placeholder}
        className="w-full rounded-2xl border border-outline/40 bg-surface px-4 py-2.5 text-foreground outline-none focus:border-primary"
      />
    </label>
  );

  return (
    <div className="space-y-4 animate-fade-in">
      <p className="text-sm text-muted-foreground">
        Réservation express — pas besoin de mot de passe. Renseignez vos coordonnées.
      </p>
      {error ? (
        <div className="rounded-2xl border border-danger/50 bg-danger/10 px-4 py-3 text-sm text-danger">
          {error}
        </div>
      ) : null}
      <div className="grid grid-cols-2 gap-3">
        {field("Prénom", "firstName", { placeholder: "Alexandre" })}
        {field("Nom", "lastName", { placeholder: "Dupont" })}
      </div>
      {field("Email (optionnel)", "email", {
        type: "email",
        placeholder: "email@exemple.com",
      })}
      <div className="grid grid-cols-5 gap-3">
        <label className="col-span-2 block space-y-1.5">
          <span className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
            Pays
          </span>
          <select
            value={values.countryCode}
            onChange={(e) =>
              onChange({ ...values, countryCode: e.target.value })
            }
            className="w-full rounded-2xl border border-outline/40 bg-surface px-3 py-2.5 text-foreground"
          >
            {COUNTRY_OPTIONS.map((c) => (
              <option key={c.code} value={c.code}>
                {c.label}
              </option>
            ))}
          </select>
        </label>
        <div className="col-span-3">{field("Téléphone", "phone", { type: "tel", placeholder: "07 00 00 00 00" })}</div>
      </div>
    </div>
  );
}
