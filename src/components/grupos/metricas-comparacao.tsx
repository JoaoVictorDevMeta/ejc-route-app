import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Route, TrendingDown, Scale } from "lucide-react";
import type { MetricasVRP } from "@/lib/algorithm/vrp";

type Props = {
  greedy: MetricasVRP;
  sa: MetricasVRP;
};

export function MetricasComparacao({ greedy, sa }: Props) {
  const melhoriaDistancia = ((greedy.distanciaTotal - sa.distanciaTotal) / greedy.distanciaTotal) * 100;
  const melhoriaDesvio = greedy.desvioPadrao > 0 ? ((greedy.desvioPadrao - sa.desvioPadrao) / greedy.desvioPadrao) * 100 : 0;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Distância Total</CardTitle>
          <Route className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{sa.distanciaTotal.toFixed(1)} km</div>
          <p className="text-xs text-muted-foreground mt-1">
            vs {greedy.distanciaTotal.toFixed(1)} km do Greedy
          </p>
          {melhoriaDistancia > 0 && (
            <div className="mt-2 flex items-center text-xs text-emerald-600 font-medium">
              <TrendingDown className="mr-1 h-3 w-3" />
              {melhoriaDistancia.toFixed(1)}% menor
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Equilíbrio (Fairness)</CardTitle>
          <Scale className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{sa.desvioPadrao.toFixed(1)} km</div>
          <p className="text-xs text-muted-foreground mt-1">
            Desvio padrão das rotas. vs {greedy.desvioPadrao.toFixed(1)} km
          </p>
          {melhoriaDesvio > 0 && (
            <div className="mt-2 flex items-center text-xs text-emerald-600 font-medium">
              <TrendingDown className="mr-1 h-3 w-3" />
              {melhoriaDesvio.toFixed(1)}% mais equilibrado
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Extremos</CardTitle>
          <Route className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm mt-1">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Maior Rota SA:</span>
              <span className="font-medium">{sa.maiorRota.toFixed(1)} km</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Maior Rota Greedy:</span>
              <span>{greedy.maiorRota.toFixed(1)} km</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
