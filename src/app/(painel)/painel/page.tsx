import Link from "next/link";
import { ArrowRight, Plus, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatsGrid } from "@/components/painel/stats-grid";
import { MapaPlaceholder } from "@/components/painel/mapa-placeholder";
import { AtividadeRecente } from "@/components/painel/atividade-recente";
import { EncontroAtual } from "@/components/config/encontro-atual";
import { prisma } from "@/lib/prisma";

export default async function PainelPage() {
  const encontroAtual = await prisma.orm.public.Encontro
    .include("encontristas")
    .include("carros")
    .first({ ativo: true });
  const encontristas = encontroAtual?.encontristas ?? [];
  const carros = encontroAtual?.carros ?? [];
  const confirmados = encontristas.filter((encontrista) => encontrista.status === "CONFIRMADO").length;
  const fila = encontristas.filter((encontrista) => encontrista.status === "FILA").length;

  return (
    <div className="animate-page-in space-y-8">
      <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2 text-sm font-medium text-primary"><Sparkles className="h-4 w-4" />Bom dia, equipe</div>
          <h2 className="text-3xl font-semibold tracking-tight">Visão geral</h2>
          <p className="mt-2 text-base text-muted-foreground">
            Acompanhe o encontro ativo e organize a próxima carona.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button
            variant="outline"
            nativeButton={false}
            render={<Link href="/painel/encontristas" />}
          >
            Ver encontristas <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          <Button
            nativeButton={false}
            render={<Link href="/painel/encontristas" />}
          >
            <Plus className="mr-2 h-4 w-4" /> Novo encontrista
          </Button>
        </div>
      </div>

      <EncontroAtual encontro={encontroAtual} />

      <StatsGrid encontristas={encontristas.length} confirmados={confirmados} fila={fila} carros={carros.length} />

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <MapaPlaceholder encontristas={encontristas.length} carros={carros.length} local={encontroAtual?.localNome} />
        </div>
        <AtividadeRecente encontroNome={encontroAtual?.nome} encontristas={encontristas.length} carros={carros.length} />
      </div>
    </div>
  );
}