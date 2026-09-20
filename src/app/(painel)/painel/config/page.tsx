import { prisma } from "@/lib/prisma";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FormPesos } from "@/components/config/form-pesos";
import { FormEncontro } from "@/components/config/form-encontro";
import { EncontroAtual } from "@/components/config/encontro-atual";

export default async function ConfigPage() {
  const encontroAtual = await prisma.orm.public.Encontro.include("configuracao").first({ ativo: true });

  return (
    <div className="animate-page-in space-y-8">
      <div>
        <h2 className="text-3xl font-semibold tracking-tight">Configurações</h2>
        <p className="mt-2 max-w-2xl text-base text-muted-foreground">
          Deixe o encontro com a sua cara e explique ao sistema o que é mais importante para a equipe.
        </p>
      </div>

      <EncontroAtual encontro={encontroAtual} />

      <Tabs defaultValue="encontro">
        <TabsList className="h-11 bg-primary/8 p-1">
          <TabsTrigger value="encontro">Encontro</TabsTrigger>
          <TabsTrigger value="pesos">Pesos</TabsTrigger>
          <TabsTrigger value="equipe">Equipe</TabsTrigger>
        </TabsList>

        <TabsContent value="encontro" className="mt-4">
          <FormEncontro />
        </TabsContent>

        <TabsContent value="pesos" className="mt-4">
          <FormPesos 
            encontroId={encontroAtual?.id ?? ""} 
            configuracao={encontroAtual?.configuracao} 
          />
        </TabsContent>

        <TabsContent value="equipe" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Equipe</CardTitle>
              <CardDescription>
                Usuários com acesso ao painel (gerenciados via Supabase).
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Gestão de usuários virá aqui.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}