import { CalendarDays, MapPin, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";

type EncontroAtualData = {
  nome: string;
  data: unknown;
  vagasTotais: number;
  paroquiaNome: string;
  localNome: string;
};

function formatarData(data: unknown) {
  const valor = String(data).slice(0, 10);
  const [ano, mes, dia] = valor.split("-");
  if (!ano || !mes || !dia) return "Data não informada";
  return `${dia}/${mes}/${ano}`;
}

export function EncontroAtual({ encontro }: { encontro: EncontroAtualData | null }) {
  if (!encontro) {
    return (
      <Card className="border-dashed border-primary/25 bg-primary/3">
        <CardContent className="flex items-center gap-3 p-5 text-sm text-muted-foreground">
          <CalendarDays className="h-5 w-5 text-primary" />
          Nenhum encontro ativo. Cadastre um encontro para começar a organizar as rotas.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-primary/20 bg-linear-to-r from-primary/8 via-card to-card shadow-sm">
      <CardHeader className="flex flex-row items-start justify-between gap-4 pb-3">
        <div>
          <div className="mb-1 flex items-center gap-2 text-sm font-medium text-primary">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            Encontro atual
          </div>
          <CardTitle className="text-xl">{encontro.nome}</CardTitle>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary">Ativo</Badge>
          <Button variant="outline" size="sm" >
            <Link href="/painel/config/encontro" className="flex">
              <Pencil className="mr-1.5 h-3.5 w-3.5" />
              Editar
            </Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="grid gap-3 text-sm text-muted-foreground sm:grid-cols-3">
        <div className="flex items-start gap-2"><CalendarDays className="mt-0.5 h-4 w-4 shrink-0 text-primary" /><span>Data: <strong className="font-medium text-foreground">{formatarData(encontro.data)}</strong></span></div>
        <div className="flex items-start gap-2"><Users className="mt-0.5 h-4 w-4 shrink-0 text-primary" /><span>Vagas: <strong className="font-medium text-foreground">{encontro.vagasTotais}</strong></span></div>
        <div className="flex items-start gap-2"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" /><span className="truncate" title={encontro.localNome}>Local: <strong className="font-medium text-foreground">{encontro.localNome}</strong></span></div>
      </CardContent>
    </Card>
  );
}
