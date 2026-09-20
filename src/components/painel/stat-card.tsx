import type { LucideIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Props = {
  titulo: string;
  valor: string | number;
  descricao?: string;
  icone: LucideIcon;
  tendencia?: { valor: string; positivo: boolean };
};

export function StatCard({ titulo, valor, descricao, icone: Icon, tendencia }: Props) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {titulo}
        </CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{valor}</div>
        {(descricao || tendencia) && (
          <p className="text-xs text-muted-foreground">
            {tendencia && (
              <span className={tendencia.positivo ? "text-emerald-600" : "text-destructive"}>
                {tendencia.valor}{" "}
              </span>
            )}
            {descricao}
          </p>
        )}
      </CardContent>
    </Card>
  );
}