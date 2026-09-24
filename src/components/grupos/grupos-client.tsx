"use client";

import { useState, useTransition } from "react";
import { Wand2, AlertTriangle, CheckCircle2, Users, Car, Route } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CardTrio } from "@/components/grupos/card-trio";
import { otimizarEncontro } from "@/actions/routeOtimization";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";

type Props = {
  encontroId: string;
};

export function GruposClient({ encontroId }: Props) {
  const [isPending, startTransition] = useTransition();
  const [resultado, setResultado] = useState<Awaited<ReturnType<typeof otimizarEncontro>> | null>(null);

  function handleOtimizar() {
    startTransition(async () => {
      try {
        const res = await otimizarEncontro(encontroId);
        setResultado(res);
        toast.success("Grupos organizados!", {
          description: "Os encontristas foram distribuídos nos carros automaticamente.",
        });
      } catch (error) {
        toast.error("Não foi possível organizar agora", {
          description:
            error instanceof Error
              ? error.message
              : "Verifique se há carros cadastrados e tente novamente.",
        });
      }
    });
  }

  const algumSobrou =
    resultado &&
    !resultado.resumo.permitirRemanejamento &&
    resultado.resumo.sobra &&
    resultado.resumo.sobra.length > 0;

  return (
    <div className="space-y-6">
      {/* Ação principal — um único botão, sem jargão */}
      <Card>
        <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <p className="font-semibold">Distribuir encontristas nos carros</p>
            <p className="mt-1 text-sm text-muted-foreground">
              O sistema junta quem mora perto e monta a rota de cada carro automaticamente.
            </p>
          </div>
          <Button
            onClick={handleOtimizar}
            disabled={isPending}
            size="lg"
            className="gap-2 whitespace-nowrap"
          >
            <Wand2 className={`h-4 w-4 ${isPending ? "animate-pulse" : ""}`} />
            {isPending
              ? "Organizando..."
              : resultado
                ? "Organizar novamente"
                : "Organizar caronas"}
          </Button>
        </CardContent>
      </Card>

      {/* Aviso de capacidade insuficiente */}
      {algumSobrou && (
        <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
            <div className="min-w-0">
              <p className="font-semibold text-amber-800 dark:text-amber-300">
                Faltam lugares para {resultado!.resumo.sobra.length}{" "}
                {resultado!.resumo.sobra.length === 1 ? "pessoa" : "pessoas"}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Ainda não há carros suficientes para levar todos. As pessoas abaixo
                ficaram de fora porque têm prioridade menor:
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {resultado!.resumo.sobra.map((s) => (
                  <span
                    key={s.id}
                    className="inline-flex items-center rounded-md bg-amber-500/10 px-2 py-1 text-xs font-medium text-amber-800 dark:text-amber-400"
                  >
                    {s.nome}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Estado vazio */}
      {!resultado && (
        <div className="rounded-xl border border-dashed border-primary/20 bg-muted/30 p-10 text-center">
          <Users className="mx-auto h-10 w-10 text-muted-foreground" />
          <p className="mt-3 font-medium">Nenhum grupo foi organizado ainda</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Clique em <strong>Organizar caronas</strong> para o sistema distribuir
            os encontristas automaticamente.
          </p>
        </div>
      )}

      {/* Resumo + grupos */}
      {resultado && (
        <>
          <div className="grid gap-3 sm:grid-cols-3">
            <Card>
              <CardContent className="pt-5">
                <p className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Car className="h-4 w-4 text-primary" /> Carros em uso
                </p>
                <p className="mt-1 text-2xl font-bold">
                  {resultado.gruposRota.length}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-5">
                <p className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Users className="h-4 w-4 text-primary" /> Encontristas alocados
                </p>
                <p className="mt-1 text-2xl font-bold">
                  {resultado.gruposRota.reduce(
                    (t, g) => t + g.encontristas.length,
                    0
                  )}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-5">
                <p className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Route className="h-4 w-4 text-primary" /> Distância total
                </p>
                <p className="mt-1 text-2xl font-bold">
                  {resultado.gruposRota
                    .reduce((t, g) => t + (g.osrm?.distanciaKm ?? 0), 0)
                    .toFixed(0)}{" "}
                  km
                </p>
              </CardContent>
            </Card>
          </div>

          {resultado.gruposRota.length === 0 ? (
            <div className="rounded-xl border border-dashed border-primary/20 bg-muted/30 p-10 text-center">
              <p className="font-medium">Nenhum grupo foi formado</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Confira se há encontristas e carros cadastrados com endereços
                localizados.
              </p>
            </div>
          ) : (
            <div>
              <h3 className="mb-3 flex items-center gap-2 text-lg font-semibold">
                <Car className="h-5 w-5 text-primary" />
                Grupos formados
              </h3>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {resultado.gruposRota.map((grupo, idx) => (
                  <CardTrio
                    key={idx}
                    motorista={grupo.carro?.motorista ?? "Sem motorista"}
                    encontristas={grupo.encontristas.map((e) => ({
                      id: e.id,
                      nome: e.nome,
                      endereco: "",
                    }))}
                    distanciaKm={grupo.osrm?.distanciaKm ?? undefined}
                    tempoMin={grupo.osrm?.tempoMin ?? undefined}
                  />
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}