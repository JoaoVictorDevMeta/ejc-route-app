import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const atividades = [
  { titulo: "Encontro criado", descricao: "EJC 2025.1 aguardando inscrições", quando: "há 2 dias" },
  { titulo: "Sistema pronto", descricao: "Configure pesos e cadastre encontristas", quando: "agora" },
];

export function AtividadeRecente() {
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