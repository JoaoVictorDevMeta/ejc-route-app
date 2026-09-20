"use client";

import "leaflet/dist/leaflet.css";
import { useEffect, useMemo } from "react";
import { MapContainer, TileLayer, CircleMarker, Popup, Polyline, useMap } from "react-leaflet";
import type { LatLngBoundsExpression, LatLngExpression } from "leaflet";
import { Badge } from "@/components/ui/badge";

type Point = { id: string; nome: string; latitude: number; longitude: number; tipo: "encontrista" | "carro" | "local" | "paroquia" };
type Route = { indice: number; polyline: string | null; distanciaKm: number | null; tempoMin: number | null };

function decodePolyline(encoded: string): LatLngExpression[] {
  const points: LatLngExpression[] = [];
  let index = 0;
  let latitude = 0;
  let longitude = 0;
  while (index < encoded.length) {
    let shift = 0;
    let result = 0;
    let byte: number;
    do { byte = encoded.charCodeAt(index++) - 63; result |= (byte & 0x1f) << shift; shift += 5; } while (byte >= 0x20);
    latitude += result & 1 ? ~(result >> 1) : result >> 1;
    shift = 0; result = 0;
    do { byte = encoded.charCodeAt(index++) - 63; result |= (byte & 0x1f) << shift; shift += 5; } while (byte >= 0x20);
    longitude += result & 1 ? ~(result >> 1) : result >> 1;
    points.push([latitude / 1e5, longitude / 1e5]);
  }
  return points;
}

function FitMap({ points }: { points: Point[] }) {
  const map = useMap();
  useEffect(() => {
    if (points.length > 0) {
      const bounds: LatLngBoundsExpression = points.map((point) => [point.latitude, point.longitude]);
      map.fitBounds(bounds, { padding: [32, 32] });
    }
  }, [map, points]);
  return null;
}

const colors = ["#2563eb", "#e11d48", "#059669", "#d97706", "#7c3aed", "#0891b2"];

export function MapaInterativo({ points, routes, expanded = false }: { points: Point[]; routes: Route[]; expanded?: boolean }) {
  const center: LatLngExpression = points[0] ? [points[0].latitude, points[0].longitude] : [-7.12, -34.85];
  const decodedRoutes = useMemo(() => routes.map((route) => ({ ...route, points: route.polyline ? decodePolyline(route.polyline) : [] })), [routes]);

  return (
    <div className={`relative h-full w-full overflow-hidden ${expanded ? "min-h-[calc(100vh-10rem)]" : "min-h-155"}`}>
      <MapContainer center={center} zoom={13} scrollWheelZoom className={`h-full w-full ${expanded ? "min-h-[calc(100vh-10rem)]" : "min-h-155"}`}>
        <TileLayer attribution='&copy; OpenStreetMap contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <FitMap points={points} />
        {decodedRoutes.map((route) => route.points.length > 1 && (
          <Polyline key={route.indice} positions={route.points} pathOptions={{ color: colors[route.indice % colors.length], weight: 5, opacity: 0.8 }} />
        ))}
        {points.map((point) => {
          const color = point.tipo === "local" ? "#dc2626" : point.tipo === "paroquia" ? "#7c3aed" : point.tipo === "carro" ? "#059669" : "#2563eb";
          return <CircleMarker key={point.id} center={[point.latitude, point.longitude]} radius={point.tipo === "local" || point.tipo === "paroquia" ? 10 : 7} pathOptions={{ color, fillColor: color, fillOpacity: 0.85 }}><Popup><strong>{point.nome}</strong><br /><span className="text-xs capitalize">{point.tipo}</span></Popup></CircleMarker>;
        })}
      </MapContainer>
      <div className="absolute right-3 bottom-3 z-1000 flex flex-wrap gap-2 rounded-lg border bg-background/90 p-2 text-xs shadow-lg backdrop-blur">
        <Badge variant="outline" className="gap-1"><span className="h-2 w-2 rounded-full bg-blue-600" />Encontrista</Badge>
        <Badge variant="outline" className="gap-1"><span className="h-2 w-2 rounded-full bg-emerald-600" />Carro</Badge>
        <Badge variant="outline" className="gap-1"><span className="h-2 w-2 rounded-full bg-red-600" />Destino</Badge>
      </div>
    </div>
  );
}
