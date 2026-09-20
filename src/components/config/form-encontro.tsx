"use client";

import { useActionState } from "react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { CalendarPlus } from "lucide-react";
import { criarEncontro, type CriarEncontroState } from "@/actions/encontros";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { EnderecoFields } from "@/components/config/endereco-fields";

const estadoInicial: CriarEncontroState = {};

export function FormEncontro() {
  const [state, formAction, pending] = useActionState(criarEncontro, estadoInicial);
  const router = useRouter();

  useEffect(() => {
    if (state.success) router.refresh();
  }, [router, state.success]);

  return (
    <Card>
      <CardHeader className="border-b bg-muted/30">
        <CardTitle className="flex items-center gap-2 text-xl">
          <CalendarPlus className="h-5 w-5 text-primary" />
          Cadastrar encontro
        </CardTitle>
        <CardDescription>
          Os endereços serão localizados no mapa para habilitar distâncias e sugestões de rota.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <form action={formAction} className="grid gap-5 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="nome">Nome do encontro</Label>
            <Input id="nome" name="nome" placeholder="Ex.: EJC 2026.1" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="data">Data do encontro</Label>
            <Input id="data" name="data" type="date" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="vagas">Vagas totais</Label>
            <Input id="vagas" name="vagas" type="number" min="1" placeholder="30" required />
          </div>
          <div className="md:col-span-2">
            <EnderecoFields
              campo="paroquia"
              titulo="Onde fica a paróquia?"
              descricao="Será usada como ponto de referência para calcular as distâncias."
            />
          </div>
          <div className="md:col-span-2">
            <EnderecoFields
              campo="local"
              titulo="Onde será o encontro?"
              descricao="Será usado como destino das rotas sugeridas."
            />
          </div>
          {(state.error || state.success) && (
            <p className={state.error ? "text-sm text-destructive md:col-span-2" : "text-sm text-emerald-600 md:col-span-2"}>
              {state.error ?? state.success}
            </p>
          )}
          <div className="flex justify-end border-t pt-5 md:col-span-2">
            <Button type="submit" disabled={pending} className="gap-2">
              <CalendarPlus className="h-4 w-4" />
              {pending ? "Localizando endereços..." : "Cadastrar encontro"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
