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
import { calcularScore } from "@/utils/CalcScore";

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
  const numCarros = Math.ceil(comScore.length / 3);
  const carrosComOrigem = encontro.carros.filter(
    (carro) => carro.origemLat != null && carro.origemLng != null
  );
  const resultadoSA = otimizarVRP({
    paroquia,
    encontro: local,
    encontristas: comScore,
    numCarros: carrosComOrigem.length || numCarros,
    capacidade: 3,
    origens: carrosComOrigem.map((carro) => ({
      latitude: carro.origemLat!,
      longitude: carro.origemLng!,
    })),
    capacidades: carrosComOrigem.map((carro) => carro.capacidade),
  });

  return {
    clusters,
    ruido,
    triosIniciais: trios,
    solucaoSA: resultadoSA,
  };
}