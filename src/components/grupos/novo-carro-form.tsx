"use client";

import { useActionState, useEffect } from "react";
import { CarFront } from "lucide-react";
import { criarCarro, type CriarCarroState } from "@/actions/carros";
import { EnderecoFields } from "@/components/config/endereco-fields";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ProcessLoading } from "@/components/ui/process-loading";

const estadoInicial: CriarCarroState = {};

export function NovoCarroForm() {
  const [state, formAction, pending] = useActionState(criarCarro, estadoInicial);

  useEffect(() => {
    if (state.success) window.location.reload();
  }, [state.success]);

  return (
    <Card className="border-primary/15 bg-linear-to-br from-primary/6 via-card to-card shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <CarFront className="h-5 w-5 text-primary" />
          Cadastrar pai de carro
        </CardTitle>
        <CardDescription>
          Informe de onde ele sai. Essa origem será usada para montar uma rota eficiente até o local do encontro.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="grid gap-5 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="motorista">Nome do pai de carro</Label>
            <Input id="motorista" name="motorista" placeholder="Ex.: João da Silva" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="capacidade">Lugares disponíveis</Label>
            <Input id="capacidade" name="capacidade" type="number" min="1" max="20" defaultValue="3" required />
            <p className="text-xs text-muted-foreground">Inclua apenas os lugares para encontristas.</p>
          </div>
          <div className="md:col-span-2">
            <EnderecoFields
              campo="origemEndereco"
              titulo="De onde esse carro sai?"
              descricao="Use o CEP para preencher o endereço automaticamente."
            />
          </div>
          {(state.error || state.success) && (
            <p className={state.error ? "text-sm text-destructive md:col-span-2" : "text-sm text-emerald-600 md:col-span-2"}>
              {state.error ?? state.success}
            </p>
          )}
          <div className="md:col-span-2">
            <ProcessLoading
              active={pending}
              steps={["Procurando ponto de saída...", "Validando endereço do motorista...", "Salvando pai de carro..."]}
            />
          </div>
          <div className="flex justify-end border-t pt-5 md:col-span-2">
            <Button type="submit" disabled={pending} className="gap-2">
              <CarFront className="h-4 w-4" />
              {pending ? "Localizando origem..." : "Cadastrar pai de carro"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
