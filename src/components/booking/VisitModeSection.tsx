"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { GlareCard } from "@/components/ui/GlareCard";
import { estimateHomeVisit } from "@/lib/api/salons";
import { formatMoney } from "@/lib/utils/currency";
import { messageFromApiError } from "@/lib/utils/errors";
import { isAxiosSuccess } from "@/lib/api/client";
import type { HomeVisitPayload } from "@/store/booking-store";
import type { HomeVisitConfig, VisitMode } from "@/types/api";
import { cn } from "@/lib/cn";

function feeSummary(config: HomeVisitConfig, currency: string): string {
  if (config.feeMode === "fixed") {
    return `Frais fixes ${formatMoney(config.fixedFee, currency)}`;
  }
  return `À partir de ${formatMoney(config.minTravelFee, currency)}`;
}

export function VisitModeSection({
  salonId,
  config,
  salonName,
  currency,
  visitMode,
  homeVisit,
  onSelect,
}: {
  salonId: string;
  config: HomeVisitConfig;
  salonName: string;
  currency: string;
  visitMode: VisitMode;
  homeVisit: HomeVisitPayload | null;
  onSelect: (mode: VisitMode, payload?: HomeVisitPayload | null) => void;
}) {
  const [showHomeForm, setShowHomeForm] = useState(visitMode === "home");
  const [address, setAddress] = useState(homeVisit?.address ?? "");
  const [complement, setComplement] = useState(homeVisit?.addressComplement ?? "");
  const [city, setCity] = useState(homeVisit?.city ?? "");
  const [commune, setCommune] = useState(homeVisit?.commune ?? "");
  const [phone, setPhone] = useState(homeVisit?.phone ?? "");
  const [notes, setNotes] = useState(homeVisit?.notes ?? "");
  const [lat, setLat] = useState<number | null>(homeVisit?.latitude ?? null);
  const [lng, setLng] = useState<number | null>(homeVisit?.longitude ?? null);
  const [travelFee, setTravelFee] = useState<number | null>(
    homeVisit?.travelFee ?? null,
  );
  const [distanceKm, setDistanceKm] = useState<number | null>(
    homeVisit?.distanceKm ?? null,
  );
  const [locating, setLocating] = useState(false);
  const [estimating, setEstimating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refreshEstimate = async (latitude: number, longitude: number) => {
    setEstimating(true);
    setError(null);
    try {
      const est = await estimateHomeVisit(salonId, latitude, longitude);
      setTravelFee(est.travelFee);
      setDistanceKm(est.distanceKm);
      if (!est.withinRadius) {
        setError(
          `Adresse hors zone (${Math.round(est.radiusKm)} km autour du salon)`,
        );
      }
    } catch (e) {
      if (isAxiosSuccess(e)) {
        setError(messageFromApiError(e.response?.data, "Estimation impossible"));
      } else {
        setError("Estimation impossible.");
      }
    } finally {
      setEstimating(false);
    }
  };

  const useMyPosition = () => {
    if (!navigator.geolocation) {
      setError("La géolocalisation n'est pas disponible sur cet appareil.");
      return;
    }
    setLocating(true);
    setError(null);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        setLat(pos.coords.latitude);
        setLng(pos.coords.longitude);
        setLocating(false);
        await refreshEstimate(pos.coords.latitude, pos.coords.longitude);
      },
      () => {
        setLocating(false);
        setError("Autorisez la localisation pour calculer les frais.");
      },
      { enableHighAccuracy: false, timeout: 12000 },
    );
  };

  const confirmHome = () => {
    const addr = address.trim();
    const ph = phone.trim();
    if (!addr || !ph) {
      setError("Adresse et téléphone sur place sont obligatoires.");
      return;
    }
    if (lat == null || lng == null) {
      setError('Utilisez « Ma position » pour valider la zone.');
      return;
    }
    if (travelFee == null || error?.includes("hors zone")) {
      setError("Vérifiez que vous êtes dans la zone couverte.");
      return;
    }
    onSelect("home", {
      address: addr,
      addressComplement: complement.trim() || undefined,
      city: city.trim() || undefined,
      commune: commune.trim() || undefined,
      phone: ph,
      latitude: lat,
      longitude: lng,
      notes: notes.trim() || undefined,
      travelFee,
      distanceKm: distanceKm ?? undefined,
    });
  };

  return (
    <div className="space-y-3 animate-fade-in">
      <p className="text-xs font-black uppercase tracking-widest text-primary">
        Mode de rendez-vous
      </p>
      <div className="grid gap-3 sm:grid-cols-2">
        <button
          type="button"
          onClick={() => {
            setShowHomeForm(false);
            setError(null);
            onSelect("salon", null);
          }}
          className="text-left"
        >
          <GlareCard
            className={cn(
              "cursor-pointer",
              visitMode === "salon" && "ring-2 ring-primary border-primary/60",
            )}
            glareColor="#2d2d35"
          >
            <p className="text-lg font-black">🏪 Au salon</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Réservation classique sur place · {salonName}
            </p>
          </GlareCard>
        </button>
        <button
          type="button"
          onClick={() => {
            setShowHomeForm(true);
            setError(null);
            onSelect("home", null);
          }}
          className="text-left"
        >
          <GlareCard
            className={cn(
              "cursor-pointer",
              visitMode === "home" && "ring-2 ring-primary border-primary/60",
            )}
            glareColor="#58cc02"
          >
            <p className="text-lg font-black">🏠 À domicile</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Zone {Math.round(config.radiusKm)} km · {feeSummary(config, currency)}
            </p>
          </GlareCard>
        </button>
      </div>
      {config.infoMessage ? (
        <p className="rounded-2xl bg-surface px-4 py-3 text-sm text-muted-foreground">
          {config.infoMessage}
        </p>
      ) : null}
      {showHomeForm && visitMode === "home" ? (
        <GlareCard className="space-y-3" glareColor="#ffc37e">
          <p className="font-bold">Lieu du rendez-vous</p>
          <p className="text-sm text-muted-foreground">
            Indiquez où le professionnel doit se rendre.
          </p>
          <input
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Adresse *"
            className="w-full rounded-2xl border border-outline/40 bg-surface px-4 py-2.5"
          />
          <input
            value={complement}
            onChange={(e) => setComplement(e.target.value)}
            placeholder="Complément (étage, porte…)"
            className="w-full rounded-2xl border border-outline/40 bg-surface px-4 py-2.5"
          />
          <div className="grid grid-cols-2 gap-3">
            <input
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Ville"
              className="w-full rounded-2xl border border-outline/40 bg-surface px-4 py-2.5"
            />
            <input
              value={commune}
              onChange={(e) => setCommune(e.target.value)}
              placeholder="Commune"
              className="w-full rounded-2xl border border-outline/40 bg-surface px-4 py-2.5"
            />
          </div>
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Téléphone sur place *"
            type="tel"
            className="w-full rounded-2xl border border-outline/40 bg-surface px-4 py-2.5"
          />
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Instructions (digicode, repères…)"
            rows={2}
            className="w-full rounded-2xl border border-outline/40 bg-surface px-4 py-2.5"
          />
          <Button
            type="button"
            variant="secondary"
            loading={locating || estimating}
            onClick={useMyPosition}
          >
            {locating ? "Localisation…" : "Utiliser ma position"}
          </Button>
          {travelFee != null && distanceKm != null && !error?.includes("hors zone") ? (
            <div className="rounded-2xl border border-primary/30 bg-primary/10 px-4 py-3">
              <p className="text-xs text-muted-foreground">Frais de déplacement</p>
              <p className="font-black text-primary">
                {formatMoney(travelFee, currency)} · {distanceKm.toFixed(1)} km
              </p>
            </div>
          ) : null}
          {error ? <p className="text-sm text-danger">{error}</p> : null}
          <Button type="button" onClick={confirmHome}>
            Confirmer le lieu
          </Button>
        </GlareCard>
      ) : null}
    </div>
  );
}
