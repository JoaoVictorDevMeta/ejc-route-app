import { CarFront, MapPin, Users, Wand2, RefreshCw, AlertTriangle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CardTrio } from "@/components/grupos/card-trio";
import { NovoCarroForm } from "@/components/grupos/novo-carro-form";
import { GruposClient } from "@/components/grupos/grupos-client";
import { prisma } from "@/lib/prisma";

export default async function GruposPage() {
  const encontro = await prisma.orm.public.Encontro.include("carros").include("encontristas").first({ ativo: true });
  const carros = (encontro?.carros ?? []).map((carro) => ({
    id: carro.id,
    motorista: carro.motorista,
    origemEndereco: carro.origemEndereco,
    capacidade: carro.capacidade,
  }));
  const totalEncontristas = encontro?.encontristas.length ?? 0;
  const lugaresDisponiveis = carros.reduce((total, carro) => total + carro.capacidade, 0);
  const gruposNecessarios = Math.ceil(totalEncontristas / 3);
  const carrosFaltantes = Math.max(0, gruposNecessarios - carros.length);
  const lugaresFaltantes = Math.max(0, totalEncontristas - lugaresDisponiveis);
  const capacidadeSuficiente = carrosFaltantes === 0 && lugaresFaltantes === 0;

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
          {/* Botões movidos para o GruposClient */}
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
        <Card className={capacidadeSuficiente ? "border-emerald-500/25 bg-emerald-500/5" : "border-amber-500/30 bg-amber-500/5"}>
          <CardContent className="pt-6">
            <p className="flex items-center gap-2 text-sm text-muted-foreground">
              {capacidadeSuficiente ? <CheckCircle2 className="h-4 w-4 text-emerald-600" /> : <AlertTriangle className="h-4 w-4 text-amber-600" />}
              Capacidade para o encontro
            </p>
            <p className={`mt-1 text-lg font-semibold ${capacidadeSuficiente ? "text-emerald-700" : "text-amber-700"}`}>
              {capacidadeSuficiente ? "Suficiente" : "Ainda insuficiente"}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              {totalEncontristas} encontristas • {lugaresDisponiveis} lugares • {gruposNecessarios} grupos
            </p>
          </CardContent>
        </Card>
      </div>

      {!capacidadeSuficiente && (
        <Card className="border-amber-500/30 bg-amber-500/5">
          <CardContent className="flex items-start gap-3 p-4 text-sm">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
            <div>
              <p className="font-semibold text-amber-800 dark:text-amber-300">Ainda faltam carros para transportar todos</p>
              <p className="mt-1 text-muted-foreground">
                {carrosFaltantes > 0 && `Cadastre mais ${carrosFaltantes} ${carrosFaltantes === 1 ? "pai de carro" : "pais de carro"}. `}
                {lugaresFaltantes > 0 && `Também faltam ${lugaresFaltantes} ${lugaresFaltantes === 1 ? "lugar" : "lugares"}.`}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

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

      {carros.length > 0 && encontro && (
        <GruposClient encontroId={encontro.id} />
      )}
    </div>
  );
}