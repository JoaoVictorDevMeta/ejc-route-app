"use client";

import { useState, useTransition } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { salvarPesos } from "@/actions/config";
import { atualizarScores } from "@/actions/scores";
import { toast } from "sonner";
import { Loader2, AlertCircle } from "lucide-react";

const criterios = [
  {
    id: "distancia",
    label: "Mora perto da paróquia",
    descricao: "Quem mora mais perto ganha mais prioridade.",
    obrigatorio: true,
  },
  {
    id: "fila",
    label: "Ordem de inscrição",
    descricao: "Quem se inscreveu primeiro ganha prioridade.",
    obrigatorio: false,
  },
  {
    id: "presenca",
    label: "Chance de comparecer",
    descricao: "Considera quem tem maior probabilidade de ir ao encontro.",
    obrigatorio: false,
  },
  {
    id: "indicacao",
    label: "Indicação da equipe",
    descricao: "Considera quem foi trazido ou indicado por alguém engajado.",
    obrigatorio: false,
  },
] as const;

type Props = {
  encontroId: string;
  configuracao?: {
    pesoDistancia: number;
    pesoFila: number;
    pesoPresenca: number;
    pesoIndicacao: number;
    permitirRemanejamento: boolean;
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
  const [permitirRemanejamento, setPermitirRemanejamento] = useState(
    configuracao?.permitirRemanejamento ?? false
  );

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

        await salvarPesos(encontroId, pesosParaSalvar, permitirRemanejamento);
        await atualizarScores();
        toast.success("Preferências salvas", {
          description:
            "A prioridade dos encontristas foi recalculada automaticamente.",
        });
      } catch {
        toast.error("Não foi possível salvar", {
          description: "Tente novamente em alguns instantes.",
        });
      }
    });
  }

  return (
    <Card>
      <CardHeader className="border-b bg-muted/30">
        <CardTitle className="text-xl">O que é mais importante ao escolher?</CardTitle>
        <CardDescription>
          A distância da paróquia é sempre considerada. Você pode ligar ou
          desligar os outros critérios e ajustar o quanto cada um pesa.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-7 p-6">
        {criterios.map((p) => {
          const ativo = p.id === "distancia" ? true : ativos[p.id];

          return (
            <div
              key={p.id}
              className="space-y-3 rounded-xl border border-primary/10 p-4 transition-colors hover:border-primary/30"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0 pr-2">
                  <Label htmlFor={p.id} className="text-sm font-semibold">
                    {p.label}
                  </Label>
                  <p className="text-xs text-muted-foreground">{p.descricao}</p>
                </div>
                {p.obrigatorio ? (
                  <span className="whitespace-nowrap rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
                    Sempre
                  </span>
                ) : (
                  <Switch
                    id={`${p.id}-ativo`}
                    checked={ativo}
                    aria-label={`Usar critério ${p.label}`}
                    onCheckedChange={(checked) =>
                      setAtivos((atual) => ({ ...atual, [p.id]: checked }))
                    }
                  />
                )}
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-muted-foreground">Menos</span>
                <Slider
                  id={p.id}
                  value={[valores[p.id]]}
                  onValueChange={(value) =>
                    atualizarPeso(
                      p.id,
                      Array.isArray(value) ? [...value] : [value]
                    )
                  }
                  min={0}
                  max={5}
                  step={0.5}
                  disabled={!ativo}
                  className="flex-1"
                />
                <span className="text-xs text-muted-foreground">Mais</span>
              </div>
            </div>
          );
        })}

        {/* Remanejamento — explicação clara */}
        <div className="space-y-3 rounded-xl border border-amber-500/20 bg-amber-500/5 p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 pr-2">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-amber-600" />
                <Label
                  htmlFor="remanejamento"
                  className="text-sm font-semibold text-amber-900 dark:text-amber-300"
                >
                  Permitir carros mais cheios
                </Label>
              </div>
              <p className="mt-1 text-xs text-amber-800/80 dark:text-amber-400/80">
                Quando ligado, o sistema pode colocar mais gente por carro do que
                a capacidade normal para ninguém ficar de fora. Use com
                moderação.
              </p>
            </div>
            <Switch
              id="remanejamento"
              checked={permitirRemanejamento}
              onCheckedChange={setPermitirRemanejamento}
              aria-label="Permitir carros mais cheios"
            />
          </div>
        </div>

        <div className="flex flex-col justify-end gap-3 border-t pt-5 sm:flex-row">
          <Button variant="outline" onClick={restaurarPadrao} disabled={isPending}>
            Restaurar padrão
          </Button>
          <Button onClick={handleSalvar} disabled={isPending || !encontroId}>
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Salvar preferências
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}