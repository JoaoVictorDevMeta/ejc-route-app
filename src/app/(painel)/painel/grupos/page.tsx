import { CarFront, MapPin, Users, Wand2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CardTrio } from "@/components/grupos/card-trio";
import { NovoCarroForm } from "@/components/grupos/novo-carro-form";
import { prisma } from "@/lib/prisma";

export default async function GruposPage() {
  const encontro = await prisma.orm.public.Encontro.include("carros").first({ ativo: true });
  const carros = (encontro?.carros ?? []).map((carro) => ({
    id: carro.id,
    motorista: carro.motorista,
    origemEndereco: carro.origemEndereco,
    capacidade: carro.capacidade,
  }));

  return (
    <div className="animate-page-in space-y-7">
      <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2 text-sm font-medium text-primary"><CarFront className="h-4 w-4" /> Organização das caronas</div>
          <h2 className="text-3xl font-semibold tracking-tight">Carros e grupos</h2>
          <p className="mt-2 max-w-2xl text-base text-muted-foreground">
            Primeiro cadastre quem vai dirigir e de onde ele sai. Depois, o sistema distribui os encontristas e monta as rotas.
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
            <p className="flex items-center gap-2 text-sm text-muted-foreground"><CarFront className="h-4 w-4 text-primary" />Pais de carro cadastrados</p>
            <p className="mt-1 text-3xl font-bold">{carros.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="flex items-center gap-2 text-sm text-muted-foreground"><Users className="h-4 w-4 text-primary" />Lugares disponíveis</p>
            <p className="mt-1 text-3xl font-bold">{carros.reduce((total, carro) => total + carro.capacidade, 0)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="flex items-center gap-2 text-sm text-muted-foreground"><MapPin className="h-4 w-4 text-primary" />Origem das rotas</p>
            <p className="mt-1 text-lg font-semibold">{carros.length ? "Configurada" : "Pendente"}</p>
          </CardContent>
        </Card>
      </div>

      <NovoCarroForm />

      {carros.length > 0 && (
        <Card>
          <CardContent className="grid gap-3 p-5 md:grid-cols-2 lg:grid-cols-3">
            {carros.map((carro) => (
              <div key={carro.id} className="rounded-xl border border-primary/10 p-4 transition-colors hover:border-primary/35">
                <div className="flex items-start justify-between gap-3">
                  <div><p className="font-semibold">{carro.motorista}</p><p className="mt-1 flex items-start gap-1 text-xs text-muted-foreground"><MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0" />{carro.origemEndereco}</p></div>
                  <span className="whitespace-nowrap rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary">{carro.capacidade} lugares</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

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