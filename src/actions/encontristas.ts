"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { geocodificarEndereco } from "@/lib/geocoding";
import { haversine } from "@/lib/algorithm/haversine";

export type CriarEncontristaState = {
  error?: string;
  success?: string;
};

export async function atualizarEncontrista(
  _previousState: CriarEncontristaState,
  formData: FormData
): Promise<CriarEncontristaState> {
  const id = String(formData.get("id") ?? "").trim();
  const nome = String(formData.get("nome") ?? "").trim();
  const telefone = String(formData.get("telefone") ?? "").trim();
  const status = String(formData.get("status") ?? "INSCRITO");
  const prioridade = String(formData.get("prioridade") ?? "");
  const statusPermitidos = ["INSCRITO", "CONFIRMADO", "FILA", "DESISTIU"] as const;
  const prioridadePermitida = ["ALTA", "MEDIA", "BAIXA"] as const;

  if (!id || !nome) return { error: "Informe o nome do encontrista." };
  if (!statusPermitidos.includes(status as (typeof statusPermitidos)[number])) {
    return { error: "Status inválido." };
  }
  if (prioridade && !prioridadePermitida.includes(prioridade as (typeof prioridadePermitida)[number])) {
    return { error: "Prioridade inválida." };
  }

  await prisma.orm.public.Encontrista.where({ id }).update({
    nome,
    telefone: telefone || null,
    status: status as (typeof statusPermitidos)[number],
    prioridade: prioridade ? prioridade as (typeof prioridadePermitida)[number] : null,
  });

  revalidatePath("/painel/encontristas");
  revalidatePath("/painel");
  return { success: "Encontrista atualizado com sucesso." };
}

export async function deletarEncontrista(id: string) {
  if (!id) return;
  await prisma.orm.public.Encontrista.where({ id }).delete();
  revalidatePath("/painel/encontristas");
  revalidatePath("/painel");
}

export async function criarEncontrista(
  _previousState: CriarEncontristaState,
  formData: FormData
): Promise<CriarEncontristaState> {
  const nome = String(formData.get("nome") ?? "").trim();
  const endereco = String(formData.get("endereco") ?? "").trim();
  const telefone = String(formData.get("telefone") ?? "").trim();
  const cep = String(formData.get("enderecoCep") ?? formData.get("cep") ?? "").trim();

  if (!nome || !endereco) {
    return { error: "Informe o nome e o endereço do encontrista." };
  }

  const encontro = await prisma.orm.public.Encontro.first({ ativo: true });

  if (!encontro) {
    return { error: "Nenhum encontro ativo foi configurado ainda." };
  }

  const coordenadas = await geocodificarEndereco(endereco, cep);

  if (!coordenadas) {
    return {
      error: "Não encontramos esse endereço. Confira a rua, número, bairro e CEP.",
    };
  }

  const distanciaKm =
    encontro.paroquiaLat != null && encontro.paroquiaLng != null
      ? haversine(
          { latitude: encontro.paroquiaLat, longitude: encontro.paroquiaLng },
          coordenadas
        )
      : null;

  await prisma.orm.public.Encontrista.create({
    encontroId: encontro.id,
    nome,
    endereco,
    lat: coordenadas.latitude,
    lng: coordenadas.longitude,
    distanciaKm,
    ...(telefone ? { telefone } : {}),
    ...(cep ? { cep } : {}),
  });

  revalidatePath("/painel/encontristas");
  revalidatePath("/painel");

  return { success: `${nome} foi cadastrado com sucesso.` };
}
