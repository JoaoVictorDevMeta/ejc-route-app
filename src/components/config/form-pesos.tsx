"use client";

import { useState, useTransition } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { salvarPesos } from "@/actions/config";
import { atualizarScores } from "@/actions/scores";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const criterios = [
  { id: "distancia", label: "Distância", descricao: "Quem mora mais perto pontua mais", obrigatorio: true },
  { id: "fila", label: "Fila", descricao: "Valoriza a ordem de inscrição", obrigatorio: false },
  { id: "presenca", label: "Presença", descricao: "Considera a probabilidade de comparecer", obrigatorio: false },
  { id: "indicacao", label: "Indicação", descricao: "Considera quem foi trazido por alguém engajado", obrigatorio: false },
] as const;

type Props = {
  encontroId: string;
  configuracao?: {
    pesoDistancia: number;
    pesoFila: number;
    pesoPresenca: number;
    pesoIndicacao: number;
  } | null;
};

export function FormPesos({ encontroId, configuracao }: Props) {
  const [isPending, startTransition] = useTransition();
  const [valores, setValores] = useState({
    distancia: configuracao?.pesoDistancia ?? 1,
    fila: configuracao?.pesoFila ?? 1,
    presenca: configuracao?.pesoPresenca ?? 1,
    indicacao: configuracao?.pesoIndicacao ?? 1,
  });
  const [ativos, setAtivos] = useState({
    fila: (configuracao?.pesoFila ?? 1) > 0,
    presenca: (configuracao?.pesoPresenca ?? 1) > 0,
    indicacao: (configuracao?.pesoIndicacao ?? 1) > 0,
  });

  function atualizarPeso(id: keyof typeof valores, value: number[]) {
    setValores((atual) => ({ ...atual, [id]: value[0] ?? 0 }));
  }

  function restaurarPadrao() {
    setValores({ distancia: 1, fila: 1, presenca: 1, indicacao: 1 });
    setAtivos({ fila: true, presenca: true, indicacao: true });
  }

  function handleSalvar() {
    if (!encontroId) return;

    startTransition(async () => {
      try {
        const pesosParaSalvar = {
          distancia: valores.distancia,
          fila: ativos.fila ? valores.fila : 0,
          presenca: ativos.presenca ? valores.presenca : 0,
          indicacao: ativos.indicacao ? valores.indicacao : 0,
        };

        await salvarPesos(encontroId, pesosParaSalvar);
        await atualizarScores();
        toast.success("Pesos atualizados com sucesso", {
          description: "Os scores dos encontristas foram recalculados."
        });
      } catch (error) {
        toast.error("Erro ao salvar", {
          description: "Ocorreu um erro ao salvar as configurações."
        });
      }
    });
  }

  return (
    <Card>
      <CardHeader className="border-b bg-muted/30">
        <CardTitle className="text-xl">O que deve ter mais prioridade?</CardTitle>
        <CardDescription>
          A distância é sempre considerada. Os outros critérios podem ser ativados apenas quando fizerem sentido para este encontro.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-7 p-6">
        {criterios.map((p) => {
          const ativo = p.id === "distancia" ? true : ativos[p.id];

          return (
          <div key={p.id} className="space-y-3 rounded-xl border border-primary/10 p-4 transition-colors hover:border-primary/30">
            <div className="flex items-center justify-between">
              <div className="min-w-0 pr-4">
                <div className="flex items-center gap-2">
                  <Label htmlFor={p.id} className="text-sm font-semibold">{p.label}</Label>
                  {p.obrigatorio && <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary">Obrigatório</span>}
                </div>
                <p className="text-xs text-muted-foreground">{p.descricao}</p>
              </div>
              {p.obrigatorio ? (
                <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">Sempre ativo</span>
              ) : (
                <Switch
                  id={`${p.id}-ativo`}
                  checked={ativo}
                  aria-label={`Usar critério ${p.label}`}
                  onCheckedChange={(checked) => {
                    setAtivos((atual) => ({ ...atual, [p.id]: checked }));
                  }}
                />
              )}
            </div>
            <div className="flex items-center gap-3">
              <Slider id={p.id} value={[valores[p.id]]} onValueChange={(value) => atualizarPeso(p.id, Array.isArray(value) ? [...value] : [value])} min={0} max={5} step={0.1} disabled={!ativo} className="flex-1" />
              <span className="min-w-10 rounded-md bg-primary/10 px-2 py-1 text-center text-sm font-semibold text-primary">{ativo ? valores[p.id].toFixed(1).replace(".", ",") : "0,0"}</span>
            </div>
          </div>
          );
        })}

        <div className="flex flex-col justify-end gap-3 border-t pt-5 sm:flex-row">
          <Button variant="outline" onClick={restaurarPadrao} disabled={isPending}>Restaurar padrão</Button>
          <Button onClick={handleSalvar} disabled={isPending || !encontroId}>
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Salvar configuração
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}