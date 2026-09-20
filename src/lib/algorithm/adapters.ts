import type { Models } from "@/prisma/contract";
import type { Ponto, PontoWID } from "@/types";

export function encontristaParaPonto(
  e: Pick<Models.public_Encontrista, "id" | "lat" | "lng" | "score">
): PontoWID | null {
  if (e.lat == null || e.lng == null) return null;
  return {
    id: e.id,
    latitude: e.lat,
    longitude: e.lng,
    score: e.score ?? 0,
  };
}

export function paroquiaParaPonto(
  encontro: Pick<Models.public_Encontro, "paroquiaLat" | "paroquiaLng">
): Ponto | null {
  if (encontro.paroquiaLat == null || encontro.paroquiaLng == null) return null;
  return { latitude: encontro.paroquiaLat, longitude: encontro.paroquiaLng };
}

export function localParaPonto(
  encontro: Pick<Models.public_Encontro, "localLat" | "localLng">
): Ponto | null {
  if (encontro.localLat == null || encontro.localLng == null) return null;
  return { latitude: encontro.localLat, longitude: encontro.localLng };
}