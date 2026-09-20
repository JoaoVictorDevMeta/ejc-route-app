import { Map, MapPin, Navigation, Route, Sparkles, Users } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function MapaPage() {
  return (
    <div className="animate-page-in space-y-7">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2 text-sm font-medium text-primary">
            <MapPin className="h-4 w-4" />
            Planejamento visual
          </div>
          <h2 className="text-3xl font-semibold tracking-tight">Mapa das rotas</h2>
          <p className="mt-2 max-w-2xl text-base text-muted-foreground">
            Entenda onde os encontristas estão e monte grupos de carona com mais facilidade.
          </p>
        </div>
        <Badge variant="secondary" className="w-fit gap-2 px-3 py-1.5 text-sm">
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          Encontro ativo
        </Badge>
      </div>

      <div className="grid gap-5 xl:grid-cols-[minmax(280px,0.85fr)_minmax(0,2fr)]">
        <div className="space-y-5">
          <Card className="border-primary/15 bg-linear-to-br from-primary/8 via-card to-card shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">O que você quer ver?</CardTitle>
            <CardDescription className="text-sm leading-6">
              Ligue ou desligue informações do mapa. Elas não alteram seus dados.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex gap-3 rounded-xl border bg-background/80 p-3 transition-colors hover:border-primary/40">
              <div className="mt-0.5 rounded-lg bg-amber-100 p-2 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300"><Users className="h-4 w-4" /></div>
              <div className="min-w-0 flex-1">
                <Label htmlFor="heatmap" className="text-sm font-semibold">Regiões com mais pessoas</Label>
                <p className="mt-1 text-xs leading-5 text-muted-foreground">Mostra as áreas mais concentradas, como um mapa de calor.</p>
              </div>
              <Switch id="heatmap" defaultChecked />
            </div>
            <div className="flex gap-3 rounded-xl border bg-background/80 p-3 transition-colors hover:border-primary/40">
              <div className="mt-0.5 rounded-lg bg-sky-100 p-2 text-sky-700 dark:bg-sky-500/15 dark:text-sky-300"><Sparkles className="h-4 w-4" /></div>
              <div className="min-w-0 flex-1">
                <Label htmlFor="clusters" className="text-sm font-semibold">Grupos próximos</Label>
                <p className="mt-1 text-xs leading-5 text-muted-foreground">Reúne pessoas que moram perto para facilitar as caronas.</p>
              </div>
              <Switch id="clusters" defaultChecked />
            </div>
            <div className="flex gap-3 rounded-xl border bg-background/80 p-3 transition-colors hover:border-primary/40">
              <div className="mt-0.5 rounded-lg bg-indigo-100 p-2 text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-300"><Route className="h-4 w-4" /></div>
              <div className="min-w-0 flex-1">
                <Label htmlFor="rotas" className="text-sm font-semibold">Caminhos sugeridos</Label>
                <p className="mt-1 text-xs leading-5 text-muted-foreground">Desenha a melhor ordem para buscar cada pessoa.</p>
              </div>
              <Switch id="rotas" defaultChecked />
            </div>

            <div className="space-y-3 border-t pt-5">
              <div className="flex items-center justify-between">
                <Label className="text-sm">Distância para considerar “perto”</Label>
                <span className="rounded-md bg-primary/10 px-2 py-1 text-sm font-semibold text-primary">1,5 km</span>
              </div>
              <Slider defaultValue={[1.5]} min={0.5} max={5} step={0.1} />
              <p className="text-xs leading-5 text-muted-foreground">Aumente para formar grupos maiores e mais abrangentes.</p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-sm">Pessoas mínimas por grupo</Label>
                <span className="rounded-md bg-primary/10 px-2 py-1 text-sm font-semibold text-primary">3</span>
              </div>
              <Slider defaultValue={[3]} min={2} max={10} step={1} />
            </div>
          </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Preparar uma rota</CardTitle>
              <CardDescription className="text-sm leading-6">Informe os limites e deixe o sistema sugerir uma organização.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="ponto-partida">Ponto de partida</Label>
                <Input id="ponto-partida" placeholder="Ex.: Paróquia São José" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="carros">Carros disponíveis</Label>
                  <Input id="carros" type="number" min="1" placeholder="10" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lugares">Lugares por carro</Label>
                  <Input id="lugares" type="number" min="1" placeholder="3" />
                </div>
              </div>
              <Button className="w-full gap-2" type="button">
                <Navigation className="h-4 w-4" />
                Gerar sugestão de rota
              </Button>
            </CardContent>
          </Card>
        </div>

        <Card className="min-h-155 overflow-hidden border-primary/10 shadow-sm">
          <CardHeader className="border-b bg-background/80 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="text-lg">Visão da região</CardTitle>
              <CardDescription className="mt-1">30 encontristas • 10 grupos sugeridos</CardDescription>
            </div>
            <Button variant="outline" size="sm" className="mt-3 gap-2 sm:mt-0"><Map className="h-4 w-4" />Abrir mapa completo</Button>
          </CardHeader>
          <CardContent className="relative min-h-132.5 overflow-hidden bg-[#eaf4f8] p-0 dark:bg-slate-900">
            <div className="map-grid absolute inset-0 opacity-50" />
            <div className="map-road map-road-one" />
            <div className="map-road map-road-two" />
            <div className="map-road map-road-three" />
            <div className="absolute left-[38%] top-[42%] flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-primary/15 ring-8 ring-primary/10">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg"><MapPin className="h-5 w-5" /></div>
            </div>
            <div className="absolute left-[52%] top-[35%] h-4 w-4 rounded-full border-4 border-white bg-amber-500 shadow-md" />
            <div className="absolute left-[61%] top-[52%] h-4 w-4 rounded-full border-4 border-white bg-amber-500 shadow-md" />
            <div className="absolute left-[29%] top-[63%] h-4 w-4 rounded-full border-4 border-white bg-amber-500 shadow-md" />
            <div className="absolute right-5 bottom-5 max-w-xs rounded-xl border border-white/60 bg-white/90 p-4 shadow-lg backdrop-blur dark:border-white/10 dark:bg-slate-950/85">
              <div className="flex items-start gap-3">
                <div className="rounded-lg bg-primary/10 p-2 text-primary"><Sparkles className="h-4 w-4" /></div>
                <div><p className="text-sm font-semibold">A concentração está boa</p><p className="mt-1 text-xs leading-5 text-muted-foreground">A maioria dos encontristas está a até 5 km do local.</p></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}