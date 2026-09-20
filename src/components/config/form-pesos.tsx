"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";

const pesos = [
  { id: "distancia", label: "Distância", descricao: "Quem mora mais perto pontua mais" },
  { id: "fila", label: "Fila", descricao: "Ordem de inscrição" },
  { id: "presenca", label: "Presença", descricao: "Probabilidade real de comparecer" },
  { id: "indicacao", label: "Indicação", descricao: "Trazido por alguém engajado" },
];

export function FormPesos() {
  return (
    <Card>
      <CardHeader className="border-b bg-muted/30">
        <CardTitle className="text-xl">O que deve ter mais prioridade?</CardTitle>
        <CardDescription>
          Mova os controles para dizer ao sistema quais critérios pesam mais na organização das vagas.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-7 p-6">
        {pesos.map((p) => (
          <div key={p.id} className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor={p.id}>{p.label}</Label>
                <p className="text-xs text-muted-foreground">{p.descricao}</p>
              </div>
              <span className="rounded-md bg-primary/10 px-2.5 py-1 text-sm font-semibold text-primary">1,0</span>
            </div>
            <Slider id={p.id} defaultValue={[1]} min={0} max={5} step={0.1} />
          </div>
        ))}

        <div className="flex flex-col justify-end gap-3 border-t pt-5 sm:flex-row">
          <Button variant="outline">Restaurar padrão</Button>
          <Button>Salvar configuração</Button>
        </div>
      </CardContent>
    </Card>
  );
}