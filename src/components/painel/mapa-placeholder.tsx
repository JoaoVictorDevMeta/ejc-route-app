import { Map } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function MapaPlaceholder() {
  return (
    <Card className="flex h-full flex-col">
      <CardHeader>
        <CardTitle className="text-base">Mapa geral</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-1 items-center justify-center">
        <div className="flex flex-col items-center gap-2 text-muted-foreground">
          <Map className="h-10 w-10" />
          <p className="text-sm">Mapa será renderizado aqui</p>
          <p className="text-xs">React Leaflet + Heatmap</p>
        </div>
      </CardContent>
    </Card>
  );
}