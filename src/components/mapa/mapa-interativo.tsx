"use client";

import "leaflet/dist/leaflet.css";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  MapContainer,
  TileLayer,
  CircleMarker,
  Popup,
  useMap,
} from "react-leaflet";
import type {
  LatLngBoundsExpression,
  LatLngExpression,
} from "leaflet";
import { useTheme } from "next-themes";
import { Map as MapIcon, Moon, Sun, Compass, Palette } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { AnimatedPolyline } from "./animated-polyline";
import { TILE_LAYERS, type BaseLayerKey, getRouteColor } from "@/lib/map/config";

type Point = {
  id: string;
  nome: string;
  latitude: number;
  longitude: number;
  tipo: "encontrista" | "carro" | "local" | "paroquia";
};

type Route = {
  indice: number;
  polyline: string | null;
  distanciaKm: number | null;
  tempoMin: number | null;
};

function decodePolyline(encoded: string): LatLngExpression[] {
  const points: LatLngExpression[] = [];
  let index = 0;
  let latitude = 0;
  let longitude = 0;
  while (index < encoded.length) {
    let shift = 0;
    let result = 0;
    let byte: number;
    do {
      byte = encoded.charCodeAt(index++) - 63;
      result |= (byte & 0x1f) << shift;
      shift += 5;
    } while (byte >= 0x20);
    latitude += result & 1 ? ~(result >> 1) : result >> 1;
    shift = 0;
    result = 0;
    do {
      byte = encoded.charCodeAt(index++) - 63;
      result |= (byte & 0x1f) << shift;
      shift += 5;
    } while (byte >= 0x20);
    longitude += result & 1 ? ~(result >> 1) : result >> 1;
    points.push([latitude / 1e5, longitude / 1e5]);
  }
  return points;
}

function FitMap({ points }: { points: Point[] }) {
  const map = useMap();
  useEffect(() => {
    if (points.length > 0) {
      const bounds: LatLngBoundsExpression = points.map((p) => [
        p.latitude,
        p.longitude,
      ]);
      map.fitBounds(bounds, { padding: [40, 40] });
    }
  }, [map, points]);
  return null;
}

/** Garante que o mapa redimensione ao expandir/colapsar. */
function ResizeHandler({ trigger }: { trigger: unknown }) {
  const map = useMap();
  useEffect(() => {
    const id = window.setTimeout(() => map.invalidateSize(), 220);
    return () => window.clearTimeout(id);
  }, [map, trigger]);
  return null;
}

export function MapaInterativo({
  points,
  routes,
  expanded = false,
}: {
  points: Point[];
  routes: Route[];
  expanded?: boolean;
}) {
  const { theme, systemTheme } = useTheme();
  const inicializado = useRef(false);
  const [baseLayer, setBaseLayer] = useState<BaseLayerKey>("light");
  const [replayKey, setReplayKey] = useState(0);

  // Sincroniza a primeira vez com o tema do app
  useEffect(() => {
    if (inicializado.current) return;
    const efetivo = theme === "system" ? systemTheme : theme;
    setBaseLayer(efetivo === "dark" ? "dark" : "light");
    inicializado.current = true;
  }, [theme, systemTheme]);

  const center: LatLngExpression = points[0]
    ? [points[0].latitude, points[0].longitude]
    : [-7.12, -34.85];

  const decodedRoutes = useMemo(
    () =>
      routes.map((r) => ({
        ...r,
        points: r.polyline ? decodePolyline(r.polyline) : [],
      })),
    [routes]
  );

  // Key combinada para forçar replay da animação quando rotas mudam
  const rotasKey = useMemo(
    () => decodedRoutes.map((r) => r.polyline ?? "").join("|") + `#${replayKey}`,
    [decodedRoutes, replayKey]
  );

  const layer = TILE_LAYERS[baseLayer];

  return (
    <div
      className={cn(
        "relative h-full w-full overflow-hidden",
        expanded ? "min-h-[calc(100vh-10rem)]" : "min-h-[400px]"
      )}
    >
      <MapContainer
        center={center}
        zoom={13}
        scrollWheelZoom
        className={cn(
          "h-full w-full",
          expanded ? "min-h-[calc(100vh-10rem)]" : "min-h-[400px]"
        )}
      >
        <TileLayer
          key={baseLayer}
          url={layer.url}
          attribution={layer.attribution}
        />
        <FitMap points={points} />
        <ResizeHandler trigger={expanded} />

        {decodedRoutes.map((route, i) =>
          route.points.length > 1 ? (
            <AnimatedPolyline
              key={`${rotasKey}-${route.indice}`}
              positions={route.points}
              color={getRouteColor(route.indice)}
              weight={5}
              delay={i * 180}
              duration={1400}
            />
          ) : null
        )}

        {points.map((point) => {
          const color =
            point.tipo === "local"
              ? "#dc2626"
              : point.tipo === "paroquia"
              ? "#7c3aed"
              : point.tipo === "carro"
              ? "#059669"
              : "#2563eb";
          return (
            <CircleMarker
              key={point.id}
              center={[point.latitude, point.longitude]}
              radius={
                point.tipo === "local" || point.tipo === "paroquia" ? 10 : 7
              }
              pathOptions={{
                color: "#ffffff",
                weight: 2,
                fillColor: color,
                fillOpacity: 1,
              }}
            >
              <Popup>
                <strong>{point.nome}</strong>
                <br />
                <span className="text-xs capitalize">{point.tipo}</span>
              </Popup>
            </CircleMarker>
          );
        })}
      </MapContainer>

      {/* Controle de camada flutuante (canto superior direito) */}
      <div className="pointer-events-auto absolute right-3 top-3 z-[1000] flex items-center gap-1 rounded-xl border bg-background/90 p-1 shadow-lg backdrop-blur">
        <button
          type="button"
          onClick={() => setBaseLayer("light")}
          className={cn(
            "flex h-8 w-8 items-center justify-center rounded-lg transition-colors",
            baseLayer === "light"
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:bg-accent"
          )}
          aria-label="Mapa claro"
          title="Mapa claro"
        >
          <Sun className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => setBaseLayer("dark")}
          className={cn(
            "flex h-8 w-8 items-center justify-center rounded-lg transition-colors",
            baseLayer === "dark"
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:bg-accent"
          )}
          aria-label="Mapa escuro"
          title="Mapa escuro"
        >
          <Moon className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => setBaseLayer("voyager")}
          className={cn(
            "flex h-8 w-8 items-center justify-center rounded-lg transition-colors",
            baseLayer === "voyager"
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:bg-accent"
          )}
          aria-label="Mapa voyager"
          title="Mapa colorido"
        >
          <Palette className="h-4 w-4" />
        </button>
        <div className="mx-1 h-6 w-px bg-border" />
        <button
          type="button"
          onClick={() => setReplayKey((k) => k + 1)}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-accent"
          aria-label="Reproduzir animação das rotas"
          title="Reproduzir animação"
        >
          <Compass className="h-4 w-4" />
        </button>
      </div>

      {/* Legenda (canto inferior direito) */}
      <div className="pointer-events-none absolute bottom-3 right-3 z-[1000] flex flex-wrap gap-2 rounded-lg border bg-background/90 p-2 text-xs shadow-lg backdrop-blur">
        <Badge variant="outline" className="gap-1">
          <span className="h-2 w-2 rounded-full bg-blue-600" />
          Encontrista
        </Badge>
        <Badge variant="outline" className="gap-1">
          <span className="h-2 w-2 rounded-full bg-emerald-600" />
          Carro
        </Badge>
        <Badge variant="outline" className="gap-1">
          <span className="h-2 w-2 rounded-full bg-red-600" />
          Destino
        </Badge>
        <Badge variant="outline" className="gap-1">
          <MapIcon className="h-3 w-3" />
          {layer.label}
        </Badge>
      </div>
    </div>
  );
}