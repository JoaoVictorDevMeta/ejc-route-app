"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil } from "lucide-react";
import { useActionState } from "react";
import { atualizarEncontrista, type CriarEncontristaState } from "@/actions/encontristas";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
  { value: "INSCRITO", label: "Inscrito" },
  { value: "CONFIRMADO", label: "Confirmado" },
  { value: "FILA", label: "Na fila" },
  { value: "DESISTIU", label: "Desistiu" },
] as const;

const PRIORIDADE_OPCOES = [
  { value: null, label: "Sem prioridade" },
  { value: "ALTA", label: "Alta" },
  { value: "MEDIA", label: "Média" },
  { value: "BAIXA", label: "Baixa" },
] as const;

export function EditarEncontristaDialog({ id, nome, telefone, status, prioridade, notaPresenca, notaIndicacao }: Props) {
  const [aberto, setAberto] = useState(false);
  const [indicado, setIndicado] = useState(notaIndicacao >= 10);
  const [statusValue, setStatusValue] = useState(status);
  const [prioridadeValue, setPrioridadeValue] = useState<string | null>(prioridade);
  const [state, formAction, pending] = useActionState(atualizarEncontrista, estadoInicial);
  const router = useRouter();

  useEffect(() => {
    if (!aberto) return;
    setIndicado(notaIndicacao >= 10);
    setStatusValue(status);
    setPrioridadeValue(prioridade);
  }, [aberto, notaIndicacao, status, prioridade]);

  useEffect(() => {
    if (state.success) router.refresh();
  }, [router, state.success]);

  return (
    <Dialog open={aberto} onOpenChange={setAberto}>
      <DialogTrigger render={<Button variant="ghost" size="icon-sm" aria-label={`Editar ${nome}`} />}>
        <Pencil className="h-4 w-4" />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar encontrista</DialogTitle>
          <DialogDescription>Atualize os dados de acompanhamento. O endereço permanece vinculado à rota calculada.</DialogDescription>
        </DialogHeader>
        <form action={formAction} className="space-y-4">
          <input type="hidden" name="id" value={id} />
          <div className="space-y-2">
            <Label htmlFor={`editar-nome-${id}`}>Nome completo</Label>
            <Input id={`editar-nome-${id}`} name="nome" defaultValue={nome} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor={`editar-telefone-${id}`}>Telefone</Label>
            <Input id={`editar-telefone-${id}`} name="telefone" type="tel" defaultValue={telefone ?? ""} placeholder="(00) 00000-0000" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {/*<div className="space-y-2">
              <Label htmlFor={`editar-notaPresenca-${id}`}>Nota de presença (0 a 10)</Label>
              <Input id={`editar-notaPresenca-${id}`} name="notaPresenca" type="number" min="0" max="10" defaultValue={notaPresenca} />
            </div>*/}
            <div className="flex items-center gap-3 rounded-lg border bg-background/50 p-3">
              <div className="flex-1 space-y-1">
                <Label htmlFor={`editar-indicado-${id}`} className="text-sm">Indicado</Label>
              </div>
              <Switch
                id={`editar-indicado-${id}`}
                name="indicado"
                checked={indicado}
                onCheckedChange={setIndicado}
              />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor={`editar-status-${id}`}>Status</Label>
              <input type="hidden" name="status" value={statusValue} />
              <Select
                value={statusValue}
                onValueChange={(value) => setStatusValue(String(value ?? status))}
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
            <div className="space-y-2">
              <Label htmlFor={`editar-prioridade-${id}`}>Prioridade</Label>
              <input type="hidden" name="prioridade" value={prioridadeValue ?? ""} />
              <Select
                value={prioridadeValue}
                onValueChange={(value) => setPrioridadeValue(value == null ? null : String(value))}
                items={[...PRIORIDADE_OPCOES]}
              >
                <SelectTrigger id={`editar-prioridade-${id}`} className="h-9 w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent align="start" alignItemWithTrigger={false}>
                  {PRIORIDADE_OPCOES.map((opcao) => (
                    <SelectItem key={opcao.label} value={opcao.value}>
                      {opcao.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          {state.error && <p className="text-sm text-destructive">{state.error}</p>}
          {state.success && <p className="text-sm text-emerald-600">{state.success}</p>}
          <div className="flex justify-end gap-2 border-t pt-4">
            <Button type="button" variant="outline" onClick={() => setAberto(false)}>Cancelar</Button>
            <Button type="submit" disabled={pending}>{pending ? "Salvando..." : "Salvar alterações"}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
