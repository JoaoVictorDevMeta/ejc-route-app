import { Ponto } from "@/types/PontoCoordenada";

// Tempo: O(1)
export function haversine(a: Ponto, b: Ponto): number {
  const R = 6371;
  const dLat = ((b.latitude - a.latitude) * Math.PI) / 180;
  const dLng = ((b.longitude - a.longitude) * Math.PI) / 180;
  const lat1 = (a.latitude * Math.PI) / 180;
  const lat2 = (b.latitude * Math.PI) / 180;
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

//>>>Aplicação no EJC
//Calcular distanciaKm de cada encontrista até a paróquia.
//Servir como função de custo para o Simulated Annealing.
//Fallback quando o OSRM não está disponível.

//Uso do OSRM deve ser preferido