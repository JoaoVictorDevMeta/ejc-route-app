"use client";

import { useActionState } from "react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { UserPlus } from "lucide-react";
import { criarEncontrista, type CriarEncontristaState } from "@/actions/encontristas";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { EnderecoFields } from "@/components/config/endereco-fields";
import { ProcessLoading } from "@/components/ui/process-loading";

const estadoInicial: CriarEncontristaState = {};

export function NovoEncontristaForm() {
  const [state, formAction, pending] = useActionState(criarEncontrista, estadoInicial);
  const router = useRouter();

  useEffect(() => {
    if (state.success) router.refresh();
  }, [router, state.success]);

  return (
    <Card className="border-primary/15 bg-linear-to-br from-primary/6 via-card to-card shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <UserPlus className="h-5 w-5 text-primary" />
          Cadastrar encontrista
        </CardTitle>
        <CardDescription>
          O endereço será localizado no mapa para calcular distâncias e sugerir as rotas.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="nome">Nome completo</Label>
            <Input id="nome" name="nome" placeholder="Ex.: Maria da Silva" required />
          </div>
          <div className="md:col-span-2">
            <EnderecoFields
              campo="endereco"
              titulo="Onde o encontrista mora?"
              descricao="Use o CEP para preencher rua, bairro, cidade e estado automaticamente."
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="telefone">Telefone <span className="font-normal text-muted-foreground">(opcional)</span></Label>
            <Input id="telefone" name="telefone" type="tel" placeholder="(00) 00000-0000" />
          </div>
          {(state.error || state.success) && (
            <p className={state.error ? "text-sm text-destructive md:col-span-2" : "animate-pulse text-sm text-emerald-600 md:col-span-2"}>
              {state.error ?? state.success}
            </p>
          )}
          <div className="md:col-span-2">
            <ProcessLoading
              active={pending}
              steps={["Procurando endereço...", "Validando localização...", "Salvando encontrista..."]}
            />
          </div>
          <div className="flex justify-end md:col-span-2">
            <Button type="submit" disabled={pending} className="gap-2">
              <UserPlus className="h-4 w-4" />
              {pending ? "Cadastrando..." : "Cadastrar encontrista"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
