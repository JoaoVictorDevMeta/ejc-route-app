import { Wand2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CardTrio } from "@/components/grupos/card-trio";

export default function GruposPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Grupos</h2>
          <p className="text-sm text-muted-foreground">
            Formação de trios por proximidade e otimização de rotas.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <RefreshCw className="mr-2 h-4 w-4" />
            Recalcular
          </Button>
          <Button>
            <Wand2 className="mr-2 h-4 w-4" />
            Otimizar (SA)
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Carros formados</p>
            <p className="text-2xl font-bold">—</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Distância total</p>
            <p className="text-2xl font-bold">—</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Tempo estimado</p>
            <p className="text-2xl font-bold">—</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="formados">
        <TabsList>
          <TabsTrigger value="formados">Formados</TabsTrigger>
          <TabsTrigger value="sugestoes">Sugestões (greedy)</TabsTrigger>
          <TabsTrigger value="otimizado">Otimizado (SA)</TabsTrigger>
        </TabsList>

        <TabsContent value="formados" className="mt-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <CardTrio motorista="—" encontristas={[]} />
          </div>
        </TabsContent>

        <TabsContent value="sugestoes" className="mt-4">
          <p className="text-sm text-muted-foreground">Sugestões do greedy aparecerão aqui.</p>
        </TabsContent>

        <TabsContent value="otimizado" className="mt-4">
          <p className="text-sm text-muted-foreground">
            Resultado do Simulated Annealing aparecerá aqui.
          </p>
        </TabsContent>
      </Tabs>
    </div>
  );
}