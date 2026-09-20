import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

type AtividadeRecenteProps = {
  encontroNome?: string;
  encontristas: number;
  carros: number;
};

export function AtividadeRecente({ encontroNome, encontristas, carros }: AtividadeRecenteProps) {
  const atividades = [
    { titulo: encontroNome ? "Encontro ativo" : "Nenhum encontro ativo", descricao: encontroNome ?? "Cadastre um encontro para começar", quando: "agora" },
    { titulo: "Encontristas cadastrados", descricao: `${encontristas} ${encontristas === 1 ? "pessoa pronta" : "pessoas prontas"} para organização`, quando: "atual" },
    { titulo: "Pais de carro", descricao: `${carros} ${carros === 1 ? "origem configurada" : "origens configuradas"} para as rotas`, quando: "atual" },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Atividade recente</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {atividades.map((a, i) => (
          <div key={i}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-medium">{a.titulo}</p>
                <p className="text-xs text-muted-foreground">{a.descricao}</p>
              </div>
              <span className="whitespace-nowrap text-xs text-muted-foreground">
                {a.quando}
              </span>
            </div>
            {i < atividades.length - 1 && <Separator className="mt-3" />}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}