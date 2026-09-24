import Link from "next/link";
import { AlertCircle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { EncontroAtual } from "@/components/config/encontro-atual";
import { FormEditarEncontro } from "@/components/config/form-editar-encontro";
import { prisma } from "@/lib/prisma";
import { parseEnderecoCompleto } from "@/lib/endereco";

export default async function EditarEncontroPage() {
  const encontro = await prisma.orm.public.Encontro.first({ ativo: true });

  // ─── Guarda: sem encontro ativo, não dá para editar ─────────────
  if (!encontro) {
    return (
      <div className="animate-page-in space-y-8">
        <div>
          <h2 className="text-3xl font-semibold tracking-tight">Editar encontro</h2>
          <p className="mt-2 text-base text-muted-foreground">
            Ajuste os dados do encontro ativo.
          </p>
        </div>

        <Card className="border-dashed border-amber-500/40 bg-amber-500/5">
          <CardContent className="flex flex-col items-center gap-4 p-10 text-center">
            <span className="rounded-full bg-amber-500/15 p-3">
              <AlertCircle className="h-6 w-6 text-amber-600" />
            </span>
            <div className="space-y-1">
              <p className="text-lg font-semibold">Nenhum encontro ativo</p>
              <p className="text-sm text-muted-foreground">
                Cadastre um encontro antes de tentar editá-lo.
              </p>
            </div>
            <Button >
              <Link href="/painel/config" >Cadastrar encontro</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // ─── Serializa para o Client Component ──────────────────────────
  // data é Temporal.Instant → string ISO → YYYY-MM-DD
  const dataISO = String(encontro.data).slice(0, 10);

  const encontroSerializado = {
    id: encontro.id,
    nome: encontro.nome,
    data: dataISO,
    vagasTotais: encontro.vagasTotais,
    paroquiaNome: encontro.paroquiaNome,
    paroquiaCep: encontro.paroquiaNome ? null : null, // reservado para futuro
    localNome: encontro.localNome,
    localCep: null,
  };

  // Endereços pré-parseados para preencher o formulário
  const enderecoParoquia = parseEnderecoCompleto(encontro.paroquiaNome);
  const enderecoLocal = parseEnderecoCompleto(encontro.localNome);

  return (
    <div className="animate-page-in space-y-8">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="text-3xl font-semibold tracking-tight">Editar encontro</h2>
          <p className="mt-2 text-base text-muted-foreground">
            Alterações nos endereços fazem nova geocodificação. Os demais campos são atualizados direto.
          </p>
        </div>
        <Button variant="outline">
          <Link href="/painel/config" className="flex">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Link>
        </Button>
      </div>

      <EncontroAtual encontro={encontro} />

      <FormEditarEncontro
        encontro={encontroSerializado}
        enderecoParoquia={enderecoParoquia}
        enderecoLocal={enderecoLocal}
      />
    </div>
  );
}