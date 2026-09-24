"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Star } from "lucide-react";
import { useActionState } from "react";
import {
  atualizarEncontrista,
  type CriarEncontristaState,
} from "@/actions/encontristas";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

type Props = {
  id: string;
  nome: string;
  telefone: string | null;
  status: string;
  prioridade: string | null;
  notaPresenca: number;
  notaIndicacao: number;
};

const estadoInicial: CriarEncontristaState = {};

const STATUS_OPCOES = [
  { value: "INSCRITO", label: "Inscrito (aguardando confirmação)" },
  { value: "CONFIRMADO", label: "Confirmado (vai participar)" },
  { value: "FILA", label: "Na fila (aguardando vaga)" },
  { value: "DESISTIU", label: "Desistiu" },
] as const;

export function EditarEncontristaDialog({
  id,
  nome,
  telefone,
  status,
  prioridade,
  notaPresenca,
  notaIndicacao,
}: Props) {
  const [aberto, setAberto] = useState(false);
  const [indicado, setIndicado] = useState(notaIndicacao >= 10);
  const [statusValue, setStatusValue] = useState(status);
  const [state, formAction, pending] = useActionState(
    atualizarEncontrista,
    estadoInicial
  );
  const router = useRouter();

  useEffect(() => {
    if (!aberto) return;
    setIndicado(notaIndicacao >= 10);
    setStatusValue(status);
  }, [aberto, notaIndicacao, status]);

  useEffect(() => {
    if (state.success) router.refresh();
  }, [router, state.success]);

  return (
    <Dialog open={aberto} onOpenChange={setAberto}>
      <DialogTrigger
        render={
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label={`Editar ${nome}`}
          />
        }
      >
        <Pencil className="h-4 w-4" />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar encontrista</DialogTitle>
          <DialogDescription>
            Atualize os dados de acompanhamento. O endereço permanece vinculado
            à rota calculada.
          </DialogDescription>
        </DialogHeader>
        <form action={formAction} className="space-y-4">
          <input type="hidden" name="id" value={id} />
          <input type="hidden" name="notaPresenca" value={notaPresenca} />

          <div className="space-y-2">
            <Label htmlFor={`editar-nome-${id}`}>Nome completo</Label>
            <Input
              id={`editar-nome-${id}`}
              name="nome"
              defaultValue={nome}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor={`editar-telefone-${id}`}>
              Telefone <span className="font-normal text-muted-foreground">(opcional)</span>
            </Label>
            <Input
              id={`editar-telefone-${id}`}
              name="telefone"
              type="tel"
              defaultValue={telefone ?? ""}
              placeholder="(00) 00000-0000"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor={`editar-status-${id}`}>Situação</Label>
            <input type="hidden" name="status" value={statusValue} />
            <Select
              value={statusValue}
              onValueChange={(value) =>
                setStatusValue(String(value ?? status))
              }
              items={[...STATUS_OPCOES]}
            >
              <SelectTrigger id={`editar-status-${id}`} className="h-9 w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent align="start" alignItemWithTrigger={false}>
                {STATUS_OPCOES.map((opcao) => (
                  <SelectItem key={opcao.value} value={opcao.value}>
                    {opcao.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Indicado é a única informação que ajuda a priorizar */}
          <div className="flex items-center gap-3 rounded-lg border bg-background/50 p-3">
            <Star className="h-4 w-4 shrink-0 text-amber-500" />
            <div className="flex-1">
              <Label htmlFor={`editar-indicado-${id}`} className="text-sm">
                Foi indicado por alguém da equipe?
              </Label>
              <p className="text-xs text-muted-foreground">
                Ganha prioridade na hora de escolher quem entra no carro.
              </p>
            </div>
            <Switch
              id={`editar-indicado-${id}`}
              name="indicado"
              checked={indicado}
              onCheckedChange={setIndicado}
            />
          </div>

          {state.error && (
            <p className="text-sm text-destructive">{state.error}</p>
          )}
          {state.success && (
            <p className="text-sm text-emerald-600">{state.success}</p>
          )}
          <div className="flex justify-end gap-2 border-t pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setAberto(false)}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={pending}>
              {pending ? "Salvando..." : "Salvar alterações"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}