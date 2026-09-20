import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { FormPesos } from "@/components/config/form-pesos";

export default function ConfigPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Configurações</h2>
        <p className="text-sm text-muted-foreground">
          Ajustes do encontro, pesos de priorização e equipe.
        </p>
      </div>

      <Tabs defaultValue="encontro">
        <TabsList>
          <TabsTrigger value="encontro">Encontro</TabsTrigger>
          <TabsTrigger value="pesos">Pesos</TabsTrigger>
          <TabsTrigger value="equipe">Equipe</TabsTrigger>
        </TabsList>

        <TabsContent value="encontro" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Dados do encontro</CardTitle>
              <CardDescription>Informações usadas em todas as análises.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome do encontro</Label>
                <Input id="nome" placeholder="EJC 2025.1" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="vagas">Vagas totais</Label>
                <Input id="vagas" type="number" placeholder="30" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="paroquia">Paróquia (endereço)</Label>
                <Input id="paroquia" placeholder="Endereço da paróquia" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="local">Local do encontro</Label>
                <Input id="local" placeholder="Endereço do local" />
              </div>

              <div className="flex justify-end gap-2 md:col-span-2">
                <Button variant="outline">Cancelar</Button>
                <Button>Salvar</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pesos" className="mt-4">
          <FormPesos />
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