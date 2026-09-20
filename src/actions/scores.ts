"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { calcularScores } from "@/lib/algorithm/priorizacao";
import type { Pesos } from "@/types";

export async function atualizarScores() {
  const encontro = await prisma.orm.public.Encontro
    .include("encontristas")
    .include("configuracao")
    .first({ ativo: true });

  if (!encontro || !encontro.configuracao) return;

  const pesos: Pesos = {
    distancia: encontro.configuracao.pesoDistancia,
    fila: encontro.configuracao.pesoFila,
    presenca: encontro.configuracao.pesoPresenca,
    indicacao: encontro.configuracao.pesoIndicacao,
  };

  const scoresCalc = calcularScores(encontro.encontristas, pesos);

  await prisma.transaction(async (tx) => {
    for (const calc of scoresCalc) {
      await tx.orm.public.Encontrista.where({ id: calc.id }).update({
        score: calc.score,
        prioridade: calc.prioridade,
      });
    }
  });

  revalidatePath("/painel/encontristas");
  revalidatePath("/painel/grupos");
}
