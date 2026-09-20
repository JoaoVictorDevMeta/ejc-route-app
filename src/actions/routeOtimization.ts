"use server";

import { prisma } from "@/lib/prisma";
import {
  dbscan,
  formarGrupos,
  otimizarVRP,
  metricasVRP,
  encontristaParaPonto,
  paroquiaParaPonto,
  localParaPonto,
  calcularScores,
  matrizDistancias,
  rotaPontos
} from "@/lib/algorithm";
import type { Ponto, Pesos, PontoWID } from "@/types";
import type { SolucaoVRP } from "@/lib/algorithm/vrp";

type GrupoRota = {
  indice: number;
  encontristas: Array<{ id: string; nome: string }>;
  carro: {
    id: string;
    motorista: string;
    capacidade: number;
    origem: Ponto;
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

  const encontristasRaw = encontro.encontristas.filter(
    (e) => e.lat != null && e.lng != null
  );

  const pesos: Pesos = {
    distancia: config.pesoDistancia,
    fila: config.pesoFila,
    presenca: config.pesoPresenca,
    indicacao: config.pesoIndicacao,
  };

  // 3. Calcula score de cada um (utils)
  const comScoresCalc = calcularScores(encontristasRaw, pesos);

  const comScore: PontoWID[] = encontristasRaw.map((e) => {
    const calc = comScoresCalc.find((c) => c.id === e.id)!;
    return {
      id: e.id,
      latitude: e.lat!,
      longitude: e.lng!,
      score: calc.score,
    };
  });

  // 4. DBSCAN → zonas de concentração (análise visual)
  const { clusters, ruido } = dbscan(
    comScore,
    config.raioClusteringKm,
    3
  );

  const carrosComOrigem = encontro.carros.filter(
    (carro) => carro.origemLat != null && carro.origemLng != null
  );

  // 5. Greedy → trios iniciais orientados pela origem do carro
  const carrosInput = carrosComOrigem.map((c) => ({
    id: c.id,
    origem: { latitude: c.origemLat!, longitude: c.origemLng! },
    capacidade: c.capacidade,
  }));
  const gruposGreedy = formarGrupos(comScore, carrosInput, local);

  // 6. Matriz de Distâncias OSRM para SA (opcional, fallback interno para Haversine se falhar)
  const todosPontos = [
    paroquia,
    local,
    ...carrosInput.map((c) => c.origem),
    ...comScore,
  ];
  const matrizDist = await matrizDistancias(todosPontos) ?? undefined;

  // 7. SA → solução refinada (VRP completo)
  const gruposNecessarios = Math.ceil(comScore.length / 3);
  const carrosNecessarios = gruposNecessarios;
  const carrosFaltantes = Math.max(0, carrosNecessarios - carrosComOrigem.length);
  const carrosSobressalentes = Math.max(0, carrosComOrigem.length - carrosNecessarios);
  const lugaresDisponiveis = encontro.carros.reduce((total, carro) => total + carro.capacidade, 0);
  const lugaresFaltantes = Math.max(0, comScore.length - lugaresDisponiveis);

  const configVRP = {
    paroquia,
    encontro: local,
    encontristas: comScore,
    numCarros: Math.max(1, carrosComOrigem.length || gruposNecessarios),
    capacidade: 3,
    origens: carrosInput.map((c) => c.origem),
    capacidades: carrosInput.map((c) => c.capacidade),
    pesoFairness: 30, // Penalidade para manter as rotas com distâncias similares
    matrizDist,
  };

  const resultadoSA = otimizarVRP(configVRP);

  // 8. Montar grupos finais a partir do resultado do SA
  const gruposRota: GrupoRota[] = [];
  for (const [indice, rota] of resultadoSA.melhorEstado.carros.entries()) {
    // a rota do SA é [origem, ...encontristas, destino]
    const membros = rota.slice(1, -1) as PontoWID[]; 
    if (membros.length === 0) continue; // Carro vazio, ignora na rota final

    const carro = carrosComOrigem[indice] ?? null;
    const origem = carro
      ? { latitude: carro.origemLat!, longitude: carro.origemLng! }
      : paroquia;
    const pontosRota = [origem, ...membros, local];

    gruposRota.push({
      indice,
      encontristas: membros.map((m) => ({
        id: m.id,
        nome: encontro.encontristas.find((e) => e.id === m.id)?.nome ?? "Encontrista",
      })),
      carro: carro
        ? {
            id: carro.id,
            motorista: carro.motorista,
            capacidade: carro.capacidade,
            origem,
          }
        : null,
      osrm: await rotaPontos(pontosRota),
    });
  }

  // Métricas
  const metricasSA = metricasVRP(resultadoSA.melhorEstado, configVRP);
  
  // Para comparar, precisamos converter o resultado do greedy pro formato SolucaoVRP
  const solucaoGreedy: SolucaoVRP = {
    carros: gruposGreedy.map(g => [g.origem, ...g.encontristas, local])
  };
  const metricasGreedy = metricasVRP(solucaoGreedy, configVRP);

  return {
    clusters,
    ruido,
    triosIniciais: gruposGreedy,
    solucaoSA: resultadoSA,
    gruposRota,
    comparacao: {
      greedy: metricasGreedy,
      sa: metricasSA,
    },
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