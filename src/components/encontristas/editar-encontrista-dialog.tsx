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

type Props = {
  id: string;
  nome: string;
  telefone: string | null;
  status: string;
  prioridade: string | null;
};

const estadoInicial: CriarEncontristaState = {};

export function EditarEncontristaDialog({ id, nome, telefone, status, prioridade }: Props) {
  const [aberto, setAberto] = useState(false);
  const [state, formAction, pending] = useActionState(atualizarEncontrista, estadoInicial);
  const router = useRouter();

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
            <div className="space-y-2">
              <Label htmlFor={`editar-status-${id}`}>Status</Label>
              <select id={`editar-status-${id}`} name="status" defaultValue={status} className="h-9 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50">
                <option value="INSCRITO">Inscrito</option>
                <option value="CONFIRMADO">Confirmado</option>
                <option value="FILA">Na fila</option>
                <option value="DESISTIU">Desistiu</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor={`editar-prioridade-${id}`}>Prioridade</Label>
              <select id={`editar-prioridade-${id}`} name="prioridade" defaultValue={prioridade ?? ""} className="h-9 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50">
                <option value="">Sem prioridade</option>
                <option value="ALTA">Alta</option>
                <option value="MEDIA">Média</option>
                <option value="BAIXA">Baixa</option>
              </select>
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
