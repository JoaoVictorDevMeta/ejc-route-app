"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

export async function salvarPesos(
  encontroId: string,
  pesos: {
    distancia: number;
    fila: number;
    presenca: number;
    indicacao: number;
  },
  permitirRemanejamento?: boolean
) {
  await prisma.orm.public.Configuracao.where({ encontroId }).update({
    pesoDistancia: pesos.distancia,
    pesoFila: pesos.fila,
    pesoPresenca: pesos.presenca,
    pesoIndicacao: pesos.indicacao,
    ...(permitirRemanejamento !== undefined && { permitirRemanejamento }),
  });

  revalidatePath("/painel/config");
  revalidatePath("/painel/encontristas");
  revalidatePath("/painel/grupos");
}
