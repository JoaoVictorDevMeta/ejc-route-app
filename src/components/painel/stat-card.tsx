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
    <Card className="transition-all duration-200 hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/5">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <CardTitle className="text-[0.95rem] font-medium text-muted-foreground">
          {titulo}
        </CardTitle>
        <span className="rounded-lg bg-primary/10 p-2 text-primary"><Icon className="h-5 w-5" /></span>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold tracking-tight">{valor}</div>
        {(descricao || tendencia) && (
          <p className="text-sm text-muted-foreground">
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