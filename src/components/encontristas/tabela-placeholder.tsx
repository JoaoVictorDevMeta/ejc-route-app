"use client";

import { useTransition } from "react";
import { MapPin, Phone, Trash2, Car } from "lucide-react";
import { deletarEncontrista } from "@/actions/encontristas";
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
import { EditarEncontristaDialog } from "@/components/encontristas/editar-encontrista-dialog";

type EncontristaRow = {
  id: string;
  nome: string;
  telefone: string | null;
  endereco: string;
  distanciaKm: number | null;
  score: number | null;
  prioridade: string | null;
  status: string;
  notaPresenca: number;
  notaIndicacao: number;
  criadoEm: string;
};

const statusVariant: Record<
  string,
  "default" | "secondary" | "outline" | "destructive"
> = {
  CONFIRMADO: "default",
  FILA: "secondary",
  INSCRITO: "outline",
  DESISTIU: "destructive",
};

const statusLabel: Record<string, string> = {
  INSCRITO: "Inscrito",
  CONFIRMADO: "Confirmado",
  FILA: "Na fila",
  DESISTIU: "Desistiu",
};

const prioridadeLabel: Record<string, string> = {
  ALTA: "Alta",
  MEDIA: "Média",
  BAIXA: "Baixa",
};

const prioridadeVariant: Record<
  string,
  "default" | "secondary" | "outline" | "destructive"
> = {
  ALTA: "default",
  MEDIA: "secondary",
  BAIXA: "outline",
};

export function TabelaPlaceholder({
  encontristas,
}: {
  encontristas: EncontristaRow[];
}) {
  const [deletando, startDeleting] = useTransition();

  function remover(id: string, nome: string) {
    if (!window.confirm(`Remover ${nome} da lista de encontristas?`)) return;
    startDeleting(() => deletarEncontrista(id));
  }

  return (
    <div className="rounded-md border bg-background">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead className="hidden md:table-cell">Endereço</TableHead>
            <TableHead className="hidden lg:table-cell">Distância</TableHead>
            <TableHead>Prioridade</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-15" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {encontristas.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={6}
                className="h-32 text-center text-muted-foreground"
              >
                Nenhum encontrista cadastrado ainda.
              </TableCell>
            </TableRow>
          ) : (
            encontristas.map((l) => (
              <TableRow key={l.id} className="animate-row-in">
                <TableCell className="font-medium">
                  <div>{l.nome}</div>
                  {l.telefone && (
                    <div className="mt-1 flex items-center gap-1 text-xs font-normal text-muted-foreground">
                      <Phone className="h-3 w-3" />
                      {l.telefone}
                    </div>
                  )}
                </TableCell>
                <TableCell className="hidden max-w-60 truncate text-muted-foreground md:table-cell">
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="h-3 w-3 shrink-0" />
                    {l.endereco}
                  </span>
                </TableCell>
                <TableCell className="hidden lg:table-cell">
                  {l.distanciaKm != null ? `${l.distanciaKm.toFixed(1)} km` : "—"}
                </TableCell>
                <TableCell>
                  {l.prioridade ? (
                    <Badge variant={prioridadeVariant[l.prioridade] ?? "outline"}>
                      {prioridadeLabel[l.prioridade] ?? l.prioridade}
                    </Badge>
                  ) : (
                    <span className="text-xs text-muted-foreground">—</span>
                  )}
                </TableCell>
                <TableCell>
                  <Badge variant={statusVariant[l.status] ?? "outline"}>
                    {statusLabel[l.status] ?? l.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <EditarEncontristaDialog
                      id={l.id}
                      nome={l.nome}
                      telefone={l.telefone}
                      status={l.status}
                      prioridade={l.prioridade}
                      notaPresenca={l.notaPresenca}
                      notaIndicacao={l.notaIndicacao}
                    />
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      aria-label={`Excluir ${l.nome}`}
                      disabled={deletando}
                      onClick={() => remover(l.id, l.nome)}
                      className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <div className="flex items-center justify-between border-t px-4 py-3 text-xs text-muted-foreground">
        <span>
          {encontristas.length}{" "}
          {encontristas.length === 1 ? "encontrista" : "encontristas"}
        </span>
        <span className="flex items-center gap-1">
          <Car className="h-3 w-3" />
          Prioridade calculada automaticamente pelo sistema
        </span>
      </div>
    </div>
  );
}