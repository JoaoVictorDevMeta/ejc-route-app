import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { MoreHorizontal } from "lucide-react";

// TODO: substituir por TanStack Table com dados reais
const linhasDemo = [
  { nome: "—", endereco: "—", distancia: "—", score: "—", prioridade: "—", status: "—" },
];

const statusVariant: Record<string, "default" | "secondary" | "outline" | "destructive"> = {
  CONFIRMADO: "default",
  FILA: "secondary",
  INSCRITO: "outline",
  DESISTIU: "destructive",
};

export function TabelaPlaceholder() {
  return (
    <div className="rounded-md border bg-background">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead className="hidden md:table-cell">Endereço</TableHead>
            <TableHead className="hidden lg:table-cell">Distância</TableHead>
            <TableHead>Score</TableHead>
            <TableHead className="hidden md:table-cell">Prioridade</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-[60px]" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {linhasDemo.map((l, i) => (
            <TableRow key={i}>
              <TableCell className="font-medium">{l.nome}</TableCell>
              <TableCell className="hidden md:table-cell text-muted-foreground">
                {l.endereco}
              </TableCell>
              <TableCell className="hidden lg:table-cell">{l.distancia}</TableCell>
              <TableCell>{l.score}</TableCell>
              <TableCell className="hidden md:table-cell">
                <Badge variant="outline">{l.prioridade}</Badge>
              </TableCell>
              <TableCell>
                <Badge variant={statusVariant[l.status] ?? "outline"}>
                  {l.status}
                </Badge>
              </TableCell>
              <TableCell>
                <Button variant="ghost" size="icon" aria-label="Ações">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="flex items-center justify-between border-t px-4 py-3 text-xs text-muted-foreground">
        <span>0 encontristas</span>
        <span>Página 1 de 1</span>
      </div>
    </div>
  );
}