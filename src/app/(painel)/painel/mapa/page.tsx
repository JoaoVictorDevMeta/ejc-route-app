import { prisma } from "@/lib/prisma";
import { MapaContent } from "@/components/mapa/mapa-content";

type Point = {
  id: string;
  nome: string;
  latitude: number;
  longitude: number;
  tipo: "encontrista" | "carro" | "local" | "paroquia";
};

export default async function MapaPage() {
  const encontro = await prisma.orm.public.Encontro.include("encontristas").include("carros").first({ ativo: true });
  const points: Point[] = [];
  if (encontro?.paroquiaLat != null && encontro.paroquiaLng != null) points.push({ id: "paroquia", nome: encontro.paroquiaNome, latitude: encontro.paroquiaLat, longitude: encontro.paroquiaLng, tipo: "paroquia" });
  if (encontro?.localLat != null && encontro.localLng != null) points.push({ id: "local", nome: encontro.localNome, latitude: encontro.localLat, longitude: encontro.localLng, tipo: "local" });
  for (const encontrista of encontro?.encontristas ?? []) if (encontrista.lat != null && encontrista.lng != null) points.push({ id: `encontrista-${encontrista.id}`, nome: encontrista.nome, latitude: encontrista.lat, longitude: encontrista.lng, tipo: "encontrista" });
  for (const carro of encontro?.carros ?? []) if (carro.origemLat != null && carro.origemLng != null) points.push({ id: `carro-${carro.id}`, nome: `Saída de ${carro.motorista}`, latitude: carro.origemLat, longitude: carro.origemLng, tipo: "carro" });
  return <MapaContent encontroId={encontro?.id ?? null} nome={encontro?.nome} points={points} totalEncontristas={encontro?.encontristas.length ?? 0} totalCarros={encontro?.carros.length ?? 0} />;
}