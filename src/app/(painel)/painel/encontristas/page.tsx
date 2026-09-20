import { Toolbar } from "@/components/encontristas/toolbar";
import { TabelaPlaceholder } from "@/components/encontristas/tabela-placeholder";

export default function EncontristasPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Encontristas</h2>
        <p className="text-sm text-muted-foreground">
          Cadastro, priorização e acompanhamento.
        </p>
      </div>

      <Toolbar />
      <TabelaPlaceholder />
    </div>
  );
}