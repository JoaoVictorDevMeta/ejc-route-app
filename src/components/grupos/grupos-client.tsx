"use client";

import { useState, useTransition } from "react";
import { Wand2, RefreshCw, AlertTriangle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CardTrio } from "@/components/grupos/card-trio";
import { otimizarEncontro } from "@/actions/routeOtimization";
import { toast } from "sonner";
import { MetricasComparacao } from "./metricas-comparacao";

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
        toast.success("Otimização concluída!", {
          description: "As sugestões de grupos e rotas foram atualizadas."
        });
      } catch (error) {
        toast.error("Erro na otimização", {
          description: error instanceof Error ? error.message : "Ocorreu um erro desconhecido."
        });
      }
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={handleOtimizar} disabled={isPending}>
          <RefreshCw className={`mr-2 h-4 w-4 ${isPending ? "animate-spin" : ""}`} />
          Recalcular Greedy
        </Button>
        <Button onClick={handleOtimizar} disabled={isPending}>
          <Wand2 className={`mr-2 h-4 w-4 ${isPending ? "animate-pulse" : ""}`} />
          Otimizar (SA)
        </Button>
      </div>

      <Tabs defaultValue="formados">
        <TabsList>
          <TabsTrigger value="formados">Formados (SA)</TabsTrigger>
          <TabsTrigger value="sugestoes">Sugestões (Greedy)</TabsTrigger>
          <TabsTrigger value="comparacao">Comparação</TabsTrigger>
        </TabsList>

        <TabsContent value="formados" className="mt-4">
          {!resultado ? (
            <p className="text-sm text-muted-foreground">Clique em Otimizar para gerar os grupos.</p>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {resultado.gruposRota.map((grupo, idx) => (
                <CardTrio 
                  key={idx}
                  motorista={grupo.carro?.motorista ?? "—"} 
                  encontristas={grupo.encontristas.map(e => ({ id: e.id, nome: e.nome, endereco: "" }))} 
                  distanciaKm={grupo.osrm?.distanciaKm ?? undefined}
                  tempoMin={grupo.osrm?.tempoMin ?? undefined}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="sugestoes" className="mt-4">
          {!resultado ? (
            <p className="text-sm text-muted-foreground">Clique em Otimizar para gerar as sugestões.</p>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {resultado.triosIniciais.map((grupo, idx) => (
                <CardTrio 
                  key={idx}
                  motorista={`Carro (Origem mais próxima)`} 
                  encontristas={grupo.encontristas.map(e => ({ id: e.id, nome: "Encontrista", endereco: "", distanciaKm: undefined }))} 
                  distanciaKm={grupo.distanciaEstimada}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="comparacao" className="mt-4">
          {!resultado ? (
            <p className="text-sm text-muted-foreground">Resultados da comparação aparecerão aqui após otimizar.</p>
          ) : (
            <MetricasComparacao 
              greedy={resultado.comparacao.greedy} 
              sa={resultado.comparacao.sa} 
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
