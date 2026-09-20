import { Map } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";

export default function MapaPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Mapa</h2>
        <p className="text-sm text-muted-foreground">
          Distribuição geográfica, densidade e clusters.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-4">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-base">Camadas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <Label htmlFor="heatmap">Heatmap</Label>
              <Switch id="heatmap" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="clusters">Clusters (DBSCAN)</Label>
              <Switch id="clusters" />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="rotas">Rotas</Label>
              <Switch id="rotas" />
            </div>

            <div className="space-y-3 pt-4">
              <div className="flex items-center justify-between">
                <Label className="text-xs">Raio (km)</Label>
                <span className="text-xs text-muted-foreground">1.5</span>
              </div>
              <Slider defaultValue={[1.5]} min={0.5} max={5} step={0.1} />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-xs">Mín. pontos</Label>
                <span className="text-xs text-muted-foreground">3</span>
              </div>
              <Slider defaultValue={[3]} min={2} max={10} step={1} />
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3">
          <CardContent className="flex h-[600px] items-center justify-center p-0">
            <div className="flex flex-col items-center gap-2 text-muted-foreground">
              <Map className="h-12 w-12" />
              <p className="text-sm">Mapa interativo</p>
              <p className="text-xs">React Leaflet será carregado aqui (dynamic, ssr: false)</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}