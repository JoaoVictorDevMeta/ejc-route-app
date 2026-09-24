"use client";

import dynamic from "next/dynamic";
import { useState, useTransition } from "react";
import {
  Map,
  Maximize2,
  Minimize2,
  Navigation,
  Route,
  Sparkles,
  Users,
  X,
} from "lucide-react";
import { otimizarEncontro } from "@/actions/routeOtimization";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { ProcessLoading } from "@/components/ui/process-loading";

const MapaInterativo = dynamic(
  () =>
    import("@/components/mapa/mapa-interativo").then((mod) => mod.MapaInterativo),
  {
    ssr: false,
    loading: () => (
      <div className="flex min-h-[400px] items-center justify-center bg-sky-50 text-sm text-muted-foreground dark:bg-slate-900">
        Carregando mapa...
      </div>
    ),
  }
);

type Point = {
  id: string;
  nome: string;
  latitude: number;
  longitude: number;
  tipo: "encontrista" | "carro" | "local" | "paroquia";
};

type RouteResult = {
  indice: number;
  encontristas: Array<{ id: string; nome: string }>;
  carro: { motorista: string; capacidade: number } | null;
  osrm: { distanciaKm: number; tempoMin: number; polyline: string } | null;
};

type RouteSummary = {
  encontristas: number;
  gruposNecessarios: number;
  carrosDisponiveis: number;
  carrosNecessarios: number;
  carrosFaltantes: number;
  carrosSobressalentes: number;
  lugaresDisponiveis: number;
  lugaresFaltantes: number;
  temCarroParaTodos: boolean;
};

export function MapaContent({
  encontroId,
  points,
  nome,
  totalEncontristas,
  totalCarros,
}: {
  encontroId: string | null;
  points: Point[];
  nome?: string;
  totalEncontristas: number;
  totalCarros: number;
}) {
  const [showPeople, setShowPeople] = useState(true);
  const [showCars, setShowCars] = useState(true);
  const [showRoutes, setShowRoutes] = useState(true);
  const [selectedRoute, setSelectedRoute] = useState<number | null>(null);
  const [expanded, setExpanded] = useState(false);
  const [routes, setRoutes] = useState<RouteResult[]>([]);
  const [summary, setSummary] = useState<RouteSummary | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const visiblePoints = points
    .filter((point) => point.tipo !== "encontrista" || showPeople)
    .filter((point) => point.tipo !== "carro" || showCars);

  const routeData = routes
    .filter((route) => selectedRoute === null || route.indice === selectedRoute)
    .map((route) => ({
      indice: route.indice,
      polyline: showRoutes ? (route.osrm?.polyline ?? null) : null,
      distanciaKm: route.osrm?.distanciaKm ?? null,
      tempoMin: route.osrm?.tempoMin ?? null,
    }));

  const totalDistance = routes.reduce(
    (total, route) => total + (route.osrm?.distanciaKm ?? 0),
    0
  );
  const totalTime = routes.reduce(
    (total, route) => total + (route.osrm?.tempoMin ?? 0),
    0
  );

  function gerarRotas() {
    if (!encontroId) return;
    setError(null);
    startTransition(async () => {
      try {
        const result = await otimizarEncontro(encontroId);
        setRoutes(result.gruposRota);
        setSummary(result.resumo);
      } catch {
        setError(
          "Não foi possível gerar as rotas agora. Confira se há coordenadas e pais de carro cadastrados."
        );
      }
    });
  }

  return (
    <div className="animate-page-in space-y-7">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2 text-sm font-medium text-primary">
            <Map className="h-4 w-4" />
            Planejamento visual
          </div>
          <h2 className="text-3xl font-semibold tracking-tight">Mapa das rotas</h2>
          <p className="mt-2 max-w-2xl text-base text-muted-foreground">
            {nome
              ? `Organize as caronas para ${nome}.`
              : "Cadastre um encontro para começar a planejar as caronas."}
          </p>
        </div>
        <Badge variant="secondary" className="w-fit gap-2 px-3 py-1.5 text-sm">
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          {encontroId ? "Encontro ativo" : "Sem encontro ativo"}
        </Badge>
      </div>

      <div className="grid gap-5 xl:grid-cols-[minmax(280px,0.85fr)_minmax(0,2fr)]">
        {/* Coluna lateral */}
        <div className="space-y-5">
          <Card className="border-primary/15 bg-linear-to-br from-primary/8 via-card to-card shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">Camadas do mapa</CardTitle>
              <CardDescription>
                Escolha o que deseja visualizar. Nada é alterado no cadastro.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3 rounded-xl border bg-background/80 p-3">
                <Users className="h-4 w-4 text-primary" />
                <div className="flex-1">
                  <Label htmlFor="map-people">Encontristas</Label>
                  <p className="text-xs text-muted-foreground">
                    {totalEncontristas} pessoas com endereço localizado.
                  </p>
                </div>
                <Switch id="map-people" checked={showPeople} onCheckedChange={setShowPeople} />
              </div>
              <div className="flex items-center gap-3 rounded-xl border bg-background/80 p-3">
                <Navigation className="h-4 w-4 text-emerald-600" />
                <div className="flex-1">
                  <Label htmlFor="map-cars">Pais de carro</Label>
                  <p className="text-xs text-muted-foreground">
                    {totalCarros} origens cadastradas.
                  </p>
                </div>
                <Switch id="map-cars" checked={showCars} onCheckedChange={setShowCars} />
              </div>
              <div className="flex items-center gap-3 rounded-xl border bg-background/80 p-3">
                <Route className="h-4 w-4 text-indigo-600" />
                <div className="flex-1">
                  <Label htmlFor="map-routes">Rotas sugeridas</Label>
                  <p className="text-xs text-muted-foreground">
                    Linhas calculadas pela malha viária.
                  </p>
                </div>
                <Switch id="map-routes" checked={showRoutes} onCheckedChange={setShowRoutes} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Otimizar caronas</CardTitle>
              <CardDescription>
                O sistema agrupa quem mora perto e calcula a rota de cada carro.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                className="w-full gap-2"
                onClick={gerarRotas}
                disabled={!encontroId || pending}
                size="lg"
              >
                {pending ? (
                  <>
                    <Sparkles className="h-4 w-4 animate-pulse" />
                    Calculando...
                  </>
                ) : (
                  <>
                    <Route className="h-4 w-4" />
                    {routes.length ? "Recalcular rotas" : "Gerar rotas sugeridas"}
                  </>
                )}
              </Button>

              <ProcessLoading
                active={pending}
                steps={[
                  "Priorizando encontristas...",
                  "Separando grupos de até 3...",
                  "Calculando rota de cada grupo...",
                ]}
              />

              {error && <p className="text-sm text-destructive">{error}</p>}

              {summary && (
                <div className="space-y-3 rounded-xl bg-primary/8 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-semibold">Como estão as caronas</p>
                    <Badge
                      variant={summary.temCarroParaTodos ? "default" : "destructive"}
                    >
                      {summary.temCarroParaTodos ? "Tudo certo" : "Faltam carros"}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                    <span>
                      Grupos necessários:{" "}
                      <strong className="text-foreground">
                        {summary.gruposNecessarios}
                      </strong>
                    </span>
                    <span>
                      Carros disponíveis:{" "}
                      <strong className="text-foreground">
                        {summary.carrosDisponiveis}
                      </strong>
                    </span>
                    <span>
                      Lugares disponíveis:{" "}
                      <strong className="text-foreground">
                        {summary.lugaresDisponiveis}
                      </strong>
                    </span>
                    <span>
                      Lugares que faltam:{" "}
                      <strong
                        className={
                          summary.lugaresFaltantes
                            ? "text-destructive"
                            : "text-foreground"
                        }
                      >
                        {summary.lugaresFaltantes}
                      </strong>
                    </span>
                  </div>
                  {summary.carrosFaltantes > 0 && (
                    <p className="text-xs font-medium text-destructive">
                      Cadastre mais {summary.carrosFaltantes}{" "}
                      {summary.carrosFaltantes === 1 ? "carro" : "carros"} para levar
                      todos.
                    </p>
                  )}
                  {summary.carrosSobressalentes > 0 && (
                    <p className="text-xs font-medium text-emerald-600">
                      Há {summary.carrosSobressalentes} carro(s) a mais do que o
                      necessário.
                    </p>
                  )}
                  <div className="border-t pt-3">
                    <p className="text-sm font-semibold">Estimativa total</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {totalDistance.toFixed(1)} km • {Math.round(totalTime)} min
                      somados nas rotas disponíveis
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Coluna principal — mapa + grupos */}
        <div
          className={
            expanded
              ? "fixed inset-4 z-50 space-y-3 overflow-y-auto rounded-2xl bg-background p-3 shadow-2xl ring-1 ring-primary/20"
              : "space-y-5"
          }
        >
          <Card
            className={
              expanded
                ? "overflow-hidden border-primary/10 shadow-sm"
                : "min-h-[400px] overflow-hidden border-primary/10 shadow-sm"
            }
          >
            <CardHeader className="border-b bg-background/95 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <CardTitle className="text-lg">Visão da região</CardTitle>
                <CardDescription className="mt-1">
                  {totalEncontristas} encontristas • {totalCarros} pais de carro
                  {selectedRoute !== null ? ` • Grupo ${selectedRoute + 1}` : ""}
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={routes.length ? "default" : "outline"}>
                  {routes.length
                    ? `${routes.length} grupos formados`
                    : "Aguardando cálculo"}
                </Badge>
                <Button
                  variant="outline"
                  size="icon-sm"
                  aria-label={expanded ? "Fechar mapa expandido" : "Expandir mapa"}
                  onClick={() => setExpanded((value) => !value)}
                >
                  {expanded ? (
                    <Minimize2 className="h-4 w-4" />
                  ) : (
                    <Maximize2 className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="relative overflow-hidden p-0">
              <MapaInterativo points={visiblePoints} routes={routeData} expanded={expanded} />
            </CardContent>
          </Card>

          {routes.length > 0 && (
            <Card>
              <CardHeader className="flex flex-row items-start justify-between gap-3">
                <div>
                  <CardTitle className="text-lg">Grupos e estimativas</CardTitle>
                  <CardDescription>
                    Clique em um grupo para mostrar somente a rota dele.
                  </CardDescription>
                </div>
                {selectedRoute !== null && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedRoute(null)}
                  >
                    <X className="mr-1 h-4 w-4" />
                    Mostrar todas
                  </Button>
                )}
              </CardHeader>
              <CardContent className="grid gap-3 md:grid-cols-2">
                {routes.map((route) => (
                  <button
                    type="button"
                    key={route.indice}
                    onClick={() => setSelectedRoute(route.indice)}
                    className={`rounded-xl border p-4 text-left transition-all hover:-translate-y-0.5 hover:border-primary/50 ${
                      selectedRoute === route.indice
                        ? "border-primary bg-primary/8 shadow-md"
                        : "border-primary/10"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <p className="font-semibold">Grupo {route.indice + 1}</p>
                      <Badge variant={route.carro ? "secondary" : "destructive"}>
                        {route.carro ? route.carro.motorista : "Sem carro"}
                      </Badge>
                    </div>
                    <p className="mt-2 text-xs text-muted-foreground">
                      {route.encontristas.map((person) => person.nome).join(" • ")}
                    </p>
                    <p className="mt-3 text-xs font-medium text-primary">
                      {route.osrm
                        ? `${route.osrm.distanciaKm.toFixed(1)} km • ${Math.round(
                            route.osrm.tempoMin
                          )} min`
                        : "Estimativa indisponível"}
                    </p>
                  </button>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}