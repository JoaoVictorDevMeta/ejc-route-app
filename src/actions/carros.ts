"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { geocodificarEndereco } from "@/lib/geocoding";

export type CriarCarroState = {
  error?: string;
  success?: string;
};

export async function criarCarro(
  _previousState: CriarCarroState,
  formData: FormData
): Promise<CriarCarroState> {
  const motorista = String(formData.get("motorista") ?? "").trim();
  const origemEndereco = String(formData.get("origemEndereco") ?? "").trim();
  const origemCep = String(formData.get("origemEnderecoCep") ?? "").trim();
  const capacidade = Number(formData.get("capacidade") ?? 3);

  if (!motorista || !origemEndereco || !Number.isInteger(capacidade) || capacidade < 1) {
    return { error: "Informe o nome, a origem e uma capacidade válida." };
  }

  const encontro = await prisma.orm.public.Encontro.first({ ativo: true });
  if (!encontro) {
    return { error: "Cadastre um encontro ativo antes de adicionar pais de carro." };
  }

  const coordenadas = await geocodificarEndereco(origemEndereco, origemCep);
  if (!coordenadas) {
    return { error: "Não encontramos a origem do carro. Confira o endereço e o CEP." };
  }

  await prisma.orm.public.Carro.create({
    encontroId: encontro.id,
    motorista,
    origemEndereco,
    ...(origemCep ? { origemCep } : {}),
    origemLat: coordenadas.latitude,
    origemLng: coordenadas.longitude,
    capacidade,
  });

  revalidatePath("/painel/grupos");
  revalidatePath("/painel/mapa");

  return { success: `${motorista} foi cadastrado como pai de carro.` };
}
