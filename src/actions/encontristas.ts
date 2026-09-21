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
  const notaPresenca = parseInt(String(formData.get("notaPresenca") ?? "5"), 10);
  const indicado = formData.get("indicado") === "on";
  const notaIndicacao = indicado ? 10 : 0;
  const statusPermitidos = ["INSCRITO", "CONFIRMADO", "FILA", "DESISTIU"] as const;
  const prioridadePermitida = ["ALTA", "MEDIA", "BAIXA"] as const;

  if (!id || !nome) return { error: "Informe o nome do encontrista." };
  if (!statusPermitidos.includes(status as (typeof statusPermitidos)[number])) {
    return { error: "Status inválido." };
  }
  if (prioridade && !prioridadePermitida.includes(prioridade as (typeof prioridadePermitida)[number])) {
    return { error: "Prioridade inválida." };
  }

  const encontrista = await prisma.orm.public.Encontrista.first({ id });
  if (encontrista) {
    const config = await prisma.orm.public.Configuracao.first({ encontroId: encontrista.encontroId });
    const pesoPresenca = config?.pesoPresenca ?? 1.0;
    const pesoIndicacao = config?.pesoIndicacao ?? 1.0;
    // O score real precisaria considerar a distância também, mas como pedido, atualizamos apenas
    // as partes de presença e indicação. Para manter a parte da distância caso exista, 
    // podemos apenas adicionar a parte da distância atual.
    // Usamos um cálculo simples apenas como base:
    const notaDistancia = encontrista.score ? (encontrista.score - ((pesoPresenca * encontrista.notaPresenca) + (pesoIndicacao * encontrista.notaIndicacao))) : 0;
    const score = notaDistancia + (pesoPresenca * notaPresenca) + (pesoIndicacao * notaIndicacao);

    await prisma.orm.public.Encontrista.where({ id }).update({
      nome,
      telefone: telefone || null,
      status: status as (typeof statusPermitidos)[number],
      prioridade: prioridade ? prioridade as (typeof prioridadePermitida)[number] : null,
      notaPresenca,
      notaIndicacao,
      score,
    });
  }

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
  const notaPresenca = parseInt(String(formData.get("notaPresenca") ?? "5"), 10);
  const indicado = formData.get("indicado") === "on";
  const notaIndicacao = indicado ? 10 : 0;

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

  const config = await prisma.orm.public.Configuracao.first({ encontroId: encontro.id });
  const pesoPresenca = config?.pesoPresenca ?? 1.0;
  const pesoIndicacao = config?.pesoIndicacao ?? 1.0;
  const score = (pesoPresenca * notaPresenca) + (pesoIndicacao * notaIndicacao);

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

  revalidatePath("/painel/encontristas");
  revalidatePath("/painel");

  return { success: `${nome} foi cadastrado com sucesso.` };
}
