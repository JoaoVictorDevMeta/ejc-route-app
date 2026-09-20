import { Car, MapPin, Clock, Route } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

type Encontrista = {
  id: string;
  nome: string;
  endereco: string;
  distanciaKm?: number;
};

type Props = {
  motorista: string;
  encontristas: Encontrista[];
  distanciaKm?: number;
  tempoMin?: number;
};

// TODO: integrar com SA/OSRM
export function CardTrio({ motorista, encontristas, distanciaKm, tempoMin }: Props) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle className="flex items-center gap-2 text-base">
          <Car className="h-4 w-4 text-primary" />
          {motorista || "Sem motorista"}
        </CardTitle>
        <Badge variant="secondary">{encontristas.length}/3</Badge>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="space-y-2">
          {encontristas.map((e) => (
            <div key={e.id} className="flex items-start gap-2 text-sm">
              <MapPin className="mt-0.5 h-3.5 w-3.5 text-muted-foreground" />
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium">{e.nome}</p>
                <p className="truncate text-xs text-muted-foreground">{e.endereco}</p>
              </div>
              {e.distanciaKm != null && (
                <span className="whitespace-nowrap text-xs text-muted-foreground">
                  {e.distanciaKm.toFixed(1)} km
                </span>
              )}
            </div>
          ))}
        </div>

        <Separator />

        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Route className="h-3.5 w-3.5" />
            {distanciaKm != null ? `${distanciaKm.toFixed(1)} km` : "—"}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            {tempoMin != null ? `${tempoMin.toFixed(0)} min` : "—"}
          </span>
        </div>

        <Button variant="outline" size="sm" className="w-full">
          Estimar rota
        </Button>
      </CardContent>
    </Card>
  );
}