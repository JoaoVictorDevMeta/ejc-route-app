import { prisma } from "@/lib/prisma";
import { EncontristasContent } from "@/components/encontristas/encontristas-content";

export default async function EncontristasPage() {
  const encontro = await prisma.orm.public.Encontro
    .include("encontristas")
    .first({ ativo: true });

  const encontristas = (encontro?.encontristas ?? []).map((encontrista) => ({
    id: encontrista.id,
    nome: encontrista.nome,
    telefone: encontrista.telefone,
    endereco: encontrista.endereco,
    distanciaKm: encontrista.distanciaKm,
    score: encontrista.score,
    prioridade: encontrista.prioridade,
    status: encontrista.status,
    notaPresenca: encontrista.notaPresenca,
    notaIndicacao: encontrista.notaIndicacao,
    criadoEm: encontrista.criadoEm.toString(),
  }));

  return (
    <div className="animate-page-in space-y-7">
      <div>
        <h2 className="text-3xl font-semibold tracking-tight">Encontristas</h2>
        <p className="mt-2 text-base text-muted-foreground">
          Cadastre pessoas, acompanhe os dados e prepare a organização das caronas.
        </p>
      </div>

      <EncontristasContent encontristas={encontristas} />
    </div>
  );
}