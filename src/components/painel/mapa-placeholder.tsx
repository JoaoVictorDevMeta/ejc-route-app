import { Map } from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function MapaPlaceholder({ encontristas, carros, local }: { encontristas: number; carros: number; local?: string }) {
  return (
    <Card className="flex h-full flex-col">
      <CardHeader className="flex flex-row items-start justify-between gap-3">
        <div>
          <CardTitle className="text-lg">Mapa geral</CardTitle>
          <p className="mt-1 text-sm text-muted-foreground">{encontristas} encontristas e {carros} origens de carro</p>
        </div>
        <Button variant="outline" size="sm" nativeButton={false} render={<Link href="/painel/mapa" />}>Abrir mapa</Button>
      </CardHeader>
      <CardContent className="flex flex-1 items-center justify-center">
        <div className="flex flex-col items-center gap-2 text-muted-foreground">
          <Map className="h-10 w-10" />
          <p className="text-sm font-medium">Mapa da operação</p>
          <p className="max-w-xs text-center text-xs leading-5">As rotas serão organizadas com base nas origens dos pais de carro e no destino {local ? `“${local}”` : "do encontro"}.</p>
        </div>
      </CardContent>
    </Card>
  );
}