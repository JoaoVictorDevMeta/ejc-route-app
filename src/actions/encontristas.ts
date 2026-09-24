"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { geocodificarEndereco } from "@/lib/geocoding";
import { haversine } from "@/lib/algorithm/haversine";
import { atualizarScores } from "@/actions/scores";

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
  const indicado = formData.get("indicado") === "on";
  const notaIndicacao = indicado ? 10 : 0;
  const statusPermitidos = ["INSCRITO", "CONFIRMADO", "FILA", "DESISTIU"] as const;

  if (!id || !nome) return { error: "Informe o nome do encontrista." };
  if (!statusPermitidos.includes(status as (typeof statusPermitidos)[number])) {
    return { error: "Situação inválida." };
  }

  const encontrista = await prisma.orm.public.Encontrista.first({ id });
  if (!encontrista) return { error: "Encontrista não encontrado." };

  await prisma.orm.public.Encontrista.where({ id }).update({
    nome,
    telefone: telefone || null,
    status: status as (typeof statusPermitidos)[number],
    notaIndicacao,
  });

  // Recalcula prioridades de TODOS (a classificação ALTA/MÉDIA/BAIXA depende
  // da distribuição dos scores, então muda quando alguém é incluído ou alterado).
  await atualizarScores();

  revalidatePath("/painel/encontristas");
  revalidatePath("/painel");
  revalidatePath("/painel/grupos");

  return { success: "Encontrista atualizado com sucesso." };
}

export async function deletarEncontrista(id: string) {
  if (!id) return;
  await prisma.orm.public.Encontrista.where({ id }).delete();
  await atualizarScores();

  revalidatePath("/painel/encontristas");
  revalidatePath("/painel");
  revalidatePath("/painel/grupos");
}

export async function criarEncontrista(
  _previousState: CriarEncontristaState,
  formData: FormData
): Promise<CriarEncontristaState> {
  const nome = String(formData.get("nome") ?? "").trim();
  const endereco = String(formData.get("endereco") ?? "").trim();
  const telefone = String(formData.get("telefone") ?? "").trim();
  const cep = String(formData.get("enderecoCep") ?? formData.get("cep") ?? "").trim();
  const notaPresenca = parseInt(String(formData.get("notaPresenca") ?? "5"), 10);
  const indicado = formData.get("indicado") === "on";
  const notaIndicacao = indicado ? 10 : 0;

  if (!nome || !endereco) {
    return { error: "Informe o nome e o endereço do encontrista." };
  }

  const encontro = await prisma.orm.public.Encontro.first({ ativo: true });

  if (!encontro) {
    return {
      error:
        "Ainda não existe um encontro ativo. Cadastre o encontro antes de adicionar pessoas.",
    };
  }

  const coordenadas = await geocodificarEndereco(endereco, cep);

  if (!coordenadas) {
    return {
      error:
        "Não encontramos esse endereço. Confira a rua, número, bairro e CEP.",
    };
  }

  const distanciaKm =
    encontro.paroquiaLat != null && encontro.paroquiaLng != null
      ? haversine(
          { latitude: encontro.paroquiaLat, longitude: encontro.paroquiaLng },
          coordenadas
        )
      : null;

  const config = await prisma.orm.public.Configuracao.first({
    encontroId: encontro.id,
  });
  const pesoPresenca = config?.pesoPresenca ?? 1.0;
  const pesoIndicacao = config?.pesoIndicacao ?? 1.0;
  const score = pesoPresenca * notaPresenca + pesoIndicacao * notaIndicacao;

  await prisma.orm.public.Encontrista.create({
    encontroId: encontro.id,
    nome,
    endereco,
    lat: coordenadas.latitude,
    lng: coordenadas.longitude,
    distanciaKm,
    notaPresenca,
    notaIndicacao,
    score,
    ...(telefone ? { telefone } : {}),
    ...(cep ? { cep } : {}),
  });

  // Recalcula a classificação de prioridade de todos.
  await atualizarScores();

  revalidatePath("/painel/encontristas");
  revalidatePath("/painel");
  revalidatePath("/painel/grupos");

  return { success: `${nome} foi cadastrado com sucesso.` };
}