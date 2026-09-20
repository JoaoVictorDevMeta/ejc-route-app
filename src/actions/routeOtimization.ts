"use server";

import { prisma } from "@/lib/prisma";
import {
  dbscan,
  formarTrios,
  otimizarVRP,
  encontristaParaPonto,
  paroquiaParaPonto,
  localParaPonto,
} from "@/lib/algorithm";
import { rotaPontos } from "@/lib/algorithm/osrm";
import type { Ponto } from "@/types";
import { calcularScore } from "@/utils/CalcScore";

type GrupoRota = {
  indice: number;
  encontristas: Array<{ id: string; nome: string }>;
  carro: {
    id: string;
    motorista: string;
    capacidade: number;
    origem: Ponto | null;
  } | null;
  osrm: Awaited<ReturnType<typeof rotaPontos>>;
};

export async function otimizarEncontro(encontroId: string) {
  // 1. Busca dados do banco
  const encontro = await prisma.orm.public.Encontro
    .include('encontristas')
    .include('carros')
    .include('configuracao')
    .first({ id: encontroId });

  if (!encontro) {
    throw new Error(`Encontro não encontrado: ${encontroId}`);
  }

  const config = encontro.configuracao!;

  // 2. Converte Prisma → Ponto (adapter)
  const paroquia = paroquiaParaPonto(encontro);
  const local = localParaPonto(encontro);

  if (!paroquia || !local) {
    throw new Error("Paróquia ou local do encontro sem coordenadas.");
  }

  const encontristas = encontro.encontristas
    .filter((e) => e.lat != null && e.lng != null)
    .map(encontristaParaPonto)
    .filter((p): p is NonNullable<typeof p> => p !== null);

  // 3. Calcula score de cada um (utils)
  const total = encontristas.length;
  const maxDistancia = Math.max(...encontristas.map((e) => e.score), 1);

  const comScore = encontristas.map((e) => ({
    ...e,
    score: calcularScore(
      // Precisamos do model original para o calcScore
      encontro.encontristas.find((x) => x.id === e.id)!,
      {
        distancia: config.pesoDistancia,
        fila: config.pesoFila,
        presenca: config.pesoPresenca,
        indicacao: config.pesoIndicacao,
      },
      total,
      maxDistancia
    ),
  }));

  // 4. DBSCAN → zonas de concentração (análise visual)
  const { clusters, ruido } = dbscan(
    comScore,
    config.raioClusteringKm,
    3
  );

  // 5. Greedy → trios iniciais
  const trios = formarTrios(comScore, 3);

  // 6. SA → solução refinada (VRP completo)
  const carrosComOrigem = encontro.carros.filter(
    (carro) => carro.origemLat != null && carro.origemLng != null
  );
  const gruposNecessarios = Math.ceil(comScore.length / 3);
  const carrosNecessarios = gruposNecessarios;
  const carrosFaltantes = Math.max(0, carrosNecessarios - carrosComOrigem.length);
  const carrosSobressalentes = Math.max(0, carrosComOrigem.length - carrosNecessarios);
  const lugaresDisponiveis = encontro.carros.reduce((total, carro) => total + carro.capacidade, 0);
  const lugaresFaltantes = Math.max(0, comScore.length - lugaresDisponiveis);

  const resultadoSA = otimizarVRP({
    paroquia,
    encontro: local,
    encontristas: comScore,
    numCarros: Math.max(1, carrosComOrigem.length || gruposNecessarios),
    capacidade: 3,
    origens: carrosComOrigem.map((carro) => ({
      latitude: carro.origemLat!,
      longitude: carro.origemLng!,
    })),
    capacidades: carrosComOrigem.map((carro) => carro.capacidade),
  });

  const gruposRota: GrupoRota[] = [];
  for (const [indice, grupo] of trios.entries()) {
    const carro = carrosComOrigem[indice] ?? null;
    const origem = carro && carro.origemLat != null && carro.origemLng != null
      ? { latitude: carro.origemLat, longitude: carro.origemLng }
      : null;
    const pontos = origem
      ? [origem, ...grupo, local]
      : [paroquia, ...grupo, local];

    gruposRota.push({
      indice,
      encontristas: grupo.map((ponto) => ({
        id: ponto.id,
        nome: encontro.encontristas.find((encontrista) => encontrista.id === ponto.id)?.nome ?? "Encontrista",
      })),
      carro: carro
        ? {
            id: carro.id,
            motorista: carro.motorista,
            capacidade: carro.capacidade,
            origem,
          }
        : null,
      osrm: await rotaPontos(pontos),
    });
  }

  return {
    clusters,
    ruido,
    triosIniciais: trios,
    solucaoSA: resultadoSA,
    gruposRota,
    resumo: {
      encontristas: comScore.length,
      gruposNecessarios,
      carrosDisponiveis: carrosComOrigem.length,
      carrosNecessarios,
      carrosFaltantes,
      carrosSobressalentes,
      lugaresDisponiveis,
      lugaresFaltantes,
      temCarroParaTodos: carrosFaltantes === 0 && lugaresFaltantes === 0,
    },
  };
}