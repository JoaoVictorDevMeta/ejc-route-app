"use server";

import { revalidatePath } from "next/cache";
import { Temporal } from "temporal-polyfill";
import { prisma } from "@/lib/prisma";
import { geocodificarEndereco } from "@/lib/geocoding";

export type CriarEncontroState = {
  error?: string;
  success?: string;
};

export async function criarEncontro(
  _previousState: CriarEncontroState,
  formData: FormData
): Promise<CriarEncontroState> {
  const nome = String(formData.get("nome") ?? "").trim();
  const data = String(formData.get("data") ?? "").trim();
  const vagas = Number(formData.get("vagas") ?? 0);
  const paroquia = String(formData.get("paroquia") ?? "").trim();
  const local = String(formData.get("local") ?? "").trim();
  const paroquiaCep = String(formData.get("paroquiaCep") ?? "").trim();
  const localCep = String(formData.get("localCep") ?? "").trim();

  if (!nome || !data || !paroquia || !local || !Number.isInteger(vagas) || vagas < 1) {
    return { error: "Preencha todos os campos com valores válidos." };
  }

  let dataEncontro: Temporal.Instant;
  try {
    dataEncontro = Temporal.Instant.from(`${data}T12:00:00Z`);
  } catch {
    return { error: "Informe uma data válida para o encontro." };
  }

  const coordenadasParoquia = await geocodificarEndereco(paroquia, paroquiaCep);

  // O Nominatim limita requisições consecutivas; a pausa evita que a segunda
  // busca seja recusada quando o evento tem dois endereços novos.
  await new Promise((resolve) => setTimeout(resolve, 1100));
  const coordenadasLocal = await geocodificarEndereco(local, localCep);

  if (!coordenadasParoquia) {
    return { error: "Não encontramos a paróquia. Confira o endereço informado." };
  }

  if (!coordenadasLocal) {
    return { error: "Não encontramos o local. Confira o endereço informado." };
  }

  await prisma.transaction(async (tx) => {
    const encontrosAtivos = await tx.orm.public.Encontro.where({ ativo: true }).all();

    for (const encontroAtivo of encontrosAtivos) {
      await tx.orm.public.Encontro.where({ id: encontroAtivo.id }).update({ ativo: false });
    }

    const encontro = await tx.orm.public.Encontro.create({
      nome,
      data: dataEncontro,
      paroquiaNome: paroquia,
      paroquiaLat: coordenadasParoquia.latitude,
      paroquiaLng: coordenadasParoquia.longitude,
      localNome: local,
      localLat: coordenadasLocal.latitude,
      localLng: coordenadasLocal.longitude,
      vagasTotais: vagas,
      ativo: true,
    });

    await tx.orm.public.Configuracao.create({ encontroId: encontro.id });
  });

  revalidatePath("/painel");
  revalidatePath("/painel/config");
  revalidatePath("/painel/encontristas");
  revalidatePath("/painel/mapa");

  return { success: `${nome} foi cadastrado e ativado com sucesso.` };
}

export async function atualizarEncontro(
  _previousState: CriarEncontroState,
  formData: FormData
): Promise<CriarEncontroState> {
  const id = String(formData.get("id") ?? "").trim();
  const nome = String(formData.get("nome") ?? "").trim();
  const data = String(formData.get("data") ?? "").trim();
  const vagas = Number(formData.get("vagas") ?? 0);
  const paroquia = String(formData.get("paroquia") ?? "").trim();
  const local = String(formData.get("local") ?? "").trim();
  const paroquiaCep = String(formData.get("paroquiaCep") ?? "").trim();
  const localCep = String(formData.get("localCep") ?? "").trim();

  if (!id) {
    return { error: "Nenhum encontro foi informado para atualização." };
  }

  if (!nome || !data || !paroquia || !local || !Number.isInteger(vagas) || vagas < 1) {
    return { error: "Preencha todos os campos com valores válidos." };
  }

  let dataEncontro: Temporal.Instant;
  try {
    dataEncontro = Temporal.Instant.from(`${data}T12:00:00Z`);
  } catch {
    return { error: "Informe uma data válida para o encontro." };
  }

  const existente = await prisma.orm.public.Encontro.first({ id });
  if (!existente) {
    return { error: "Encontro não encontrado." };
  }

  // ─── Paróquia: só geocodifica se o endereço mudou ───────────────
  let coordenadasParoquia: { latitude: number; longitude: number } | null = null;

  if (
    existente.paroquiaNome === paroquia &&
    existente.paroquiaLat != null &&
    existente.paroquiaLng != null
  ) {
    coordenadasParoquia = {
      latitude: existente.paroquiaLat,
      longitude: existente.paroquiaLng,
    };
  } else {
    coordenadasParoquia = await geocodificarEndereco(paroquia, paroquiaCep);
    if (!coordenadasParoquia) {
      return { error: "Não encontramos a paróquia. Confira o endereço informado." };
    }
    // Respeita rate limit do Nominatim antes do próximo endereço
    await new Promise((resolve) => setTimeout(resolve, 1100));
  }

  // ─── Local: só geocodifica se o endereço mudou ──────────────────
  let coordenadasLocal: { latitude: number; longitude: number } | null = null;

  if (
    existente.localNome === local &&
    existente.localLat != null &&
    existente.localLng != null
  ) {
    coordenadasLocal = {
      latitude: existente.localLat,
      longitude: existente.localLng,
    };
  } else {
    coordenadasLocal = await geocodificarEndereco(local, localCep);
    if (!coordenadasLocal) {
      return { error: "Não encontramos o local. Confira o endereço informado." };
    }
  }

  await prisma.orm.public.Encontro.where({ id }).update({
    nome,
    data: dataEncontro,
    paroquiaNome: paroquia,
    paroquiaLat: coordenadasParoquia.latitude,
    paroquiaLng: coordenadasParoquia.longitude,
    localNome: local,
    localLat: coordenadasLocal.latitude,
    localLng: coordenadasLocal.longitude,
    vagasTotais: vagas,
  });

  revalidatePath("/painel");
  revalidatePath("/painel/config");
  revalidatePath("/painel/config/encontro");
  revalidatePath("/painel/encontristas");
  revalidatePath("/painel/grupos");
  revalidatePath("/painel/mapa");

  return { success: `${nome} foi atualizado com sucesso.` };
}