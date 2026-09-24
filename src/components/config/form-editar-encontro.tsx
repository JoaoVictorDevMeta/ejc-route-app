"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Save } from "lucide-react";
import {
  atualizarEncontro,
  type CriarEncontroState,
} from "@/actions/encontros";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { EnderecoFields } from "@/components/config/endereco-fields";
import { ProcessLoading } from "@/components/ui/process-loading";
import type { EnderecoParsed } from "@/lib/endereco";

type EncontroEditavel = {
  id: string;
  nome: string;
  data: string; // YYYY-MM-DD
  vagasTotais: number;
  paroquiaNome: string;
  localNome: string;
};

type Props = {
  encontro: EncontroEditavel;
  enderecoParoquia: EnderecoParsed;
  enderecoLocal: EnderecoParsed;
};

const estadoInicial: CriarEncontroState = {};

export function FormEditarEncontro({
  encontro,
  enderecoParoquia,
  enderecoLocal,
}: Props) {
  const [state, formAction, pending] = useActionState(
    atualizarEncontro,
    estadoInicial
  );
  const router = useRouter();

  useEffect(() => {
    if (state.success) router.refresh();
  }, [router, state.success]);

  return (
    <Card>
      <CardHeader className="border-b bg-muted/30">
        <CardTitle className="flex items-center gap-2 text-xl">
          <Save className="h-5 w-5 text-primary" />
          Dados do encontro
        </CardTitle>
        <CardDescription>
          Altere os campos abaixo. Se o endereço não mudar, ele não será geocodificado de novo.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <form action={formAction} className="grid gap-5 md:grid-cols-2">
          <input type="hidden" name="id" value={encontro.id} />

          <div className="space-y-2">
            <Label htmlFor="nome">Nome do encontro</Label>
            <Input
              id="nome"
              name="nome"
              defaultValue={encontro.nome}
              placeholder="Ex.: EJC 2026.1"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="data">Data do encontro</Label>
            <Input
              id="data"
              name="data"
              type="date"
              defaultValue={encontro.data}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="vagas">Vagas totais</Label>
            <Input
              id="vagas"
              name="vagas"
              type="number"
              min="1"
              defaultValue={encontro.vagasTotais}
              placeholder="30"
              required
            />
          </div>

          <div className="md:col-span-2">
            <EnderecoFields
              campo="paroquia"
              titulo="Onde fica a paróquia?"
              descricao="Será usada como ponto de referência para calcular as distâncias."
              defaultValue={enderecoParoquia}
            />
          </div>

          <div className="md:col-span-2">
            <EnderecoFields
              campo="local"
              titulo="Onde será o encontro?"
              descricao="Será usado como destino das rotas sugeridas."
              defaultValue={enderecoLocal}
            />
          </div>

          {(state.error || state.success) && (
            <p
              className={
                state.error
                  ? "text-sm text-destructive md:col-span-2"
                  : "text-sm text-emerald-600 md:col-span-2"
              }
            >
              {state.error ?? state.success}
            </p>
          )}

          <div className="md:col-span-2">
            <ProcessLoading
              active={pending}
              steps={[
                "Validando alterações...",
                "Verificando endereços...",
                "Salvando encontro...",
              ]}
            />
          </div>

          <div className="flex justify-end border-t pt-5 md:col-span-2">
            <Button type="submit" disabled={pending} className="gap-2">
              <Save className="h-4 w-4" />
              {pending ? "Salvando alterações..." : "Salvar alterações"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}