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
      <CardHeader>
        <CardTitle>Pesos de priorização</CardTitle>
        <CardDescription>
          Ajuste os pesos de cada critério. O score recalculado em tempo real.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {pesos.map((p) => (
          <div key={p.id} className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor={p.id}>{p.label}</Label>
                <p className="text-xs text-muted-foreground">{p.descricao}</p>
              </div>
              <span className="text-sm font-medium">1.0</span>
            </div>
            <Slider id={p.id} defaultValue={[1]} min={0} max={5} step={0.1} />
          </div>
        ))}

        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline">Restaurar padrão</Button>
          <Button>Salvar configuração</Button>
        </div>
      </CardContent>
    </Card>
  );
}