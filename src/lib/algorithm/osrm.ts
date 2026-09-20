import type { Ponto } from "@/types";

const BASE = "https://router.project-osrm.org";

export type RotaOSRM = {
  distanciaKm: number;
  tempoMin: number;
  polyline: string;
};

function toCoord(p: Ponto): string {
  return `${p.longitude},${p.latitude}`;
}

// Rota A → B → C (ordem dada)
export async function rotaPontos(pontos: Ponto[]): Promise<RotaOSRM | null> {
  const coords = pontos.map(toCoord).join(";");
  const url = `${BASE}/route/v1/driving/${coords}?overview=full&geometries=polyline`;

  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const data = await res.json();
    const r = data.routes?.[0];
    if (!r) return null;

    return {
      distanciaKm: r.distance / 1000,
      tempoMin: r.duration / 60,
      polyline: r.geometry,
    };
  } catch {
    return null;
  }
}

// Matriz N×N de distâncias (metros) — alimenta o SA
export async function matrizDistancias(
  pontos: Ponto[]
): Promise<number[][] | null> {
  const coords = pontos.map(toCoord).join(";");
  const url = `${BASE}/table/v1/driving/${coords}?annotations=distance`;

  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const data = await res.json();
    return data.distances ?? null;
  } catch {
    return null;
  }
}