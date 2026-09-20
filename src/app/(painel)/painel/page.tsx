import Link from "next/link";
import { ArrowRight, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatsGrid } from "@/components/painel/stats-grid";
import { MapaPlaceholder } from "@/components/painel/mapa-placeholder";
import { AtividadeRecente } from "@/components/painel/atividade-recente";

export default function PainelPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Painel</h2>
          <p className="text-sm text-muted-foreground">
            Visão geral do encontro ativo.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Link href="/painel/encontristas">
              Ver encontristas
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button >
            <Link href="/painel/encontristas">
              <Plus className="mr-2 h-4 w-4" />
              Novo encontrista
            </Link>
          </Button>
        </div>
      </div>

      <StatsGrid />

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <MapaPlaceholder />
        </div>
        <AtividadeRecente />
      </div>
    </div>
  );
}