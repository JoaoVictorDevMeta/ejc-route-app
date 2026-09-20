import { haversine } from "./haversine";
import { simulatedAnnealing, type SAResultado } from "./simulatedAnnealing";
import type { Ponto } from "@/types";

export type SolucaoVRP = {
  carros: Ponto[][]; // [origem, ...encontristas, destino]
};

export type ConfigVRP = {
  paroquia: Ponto;
  encontro: Ponto;
  encontristas: Ponto[];
  numCarros: number;
  capacidade: number;
  origens?: Ponto[];
  capacidades?: number[];
  pesoFairness?: number; // peso da penalidade de desigualdade (default: 30)
  matrizDist?: number[][]; // matriz de distâncias OSRM (se disponível)
};

// ─── Distância entre dois pontos ─────────────────────────────────────
// Usa matriz OSRM se disponível, senão fallback para Haversine.
function dist(
  a: Ponto,
  b: Ponto,
  pontosIndex?: Map<Ponto, number>,
  matriz?: number[][]
): number {
  if (pontosIndex && matriz) {
    const iA = pontosIndex.get(a);
    const iB = pontosIndex.get(b);
    if (iA != null && iB != null && matriz[iA]?.[iB] != null) {
      return matriz[iA][iB] / 1000; // metros → km
    }
  }
  return haversine(a, b);
}

// ─── Custo com Fairness ──────────────────────────────────────────────
// custo = soma_distâncias
//       + 100 × excesso_capacidade
//       + 50  × carros_vazios
//       + pesoFairness × desvio_padrão_das_distâncias_por_carro
export function custoVRP(
  solucao: SolucaoVRP,
  config: ConfigVRP,
  pontosIndex?: Map<Ponto, number>
): number {
  let total = 0;
  const distanciasPorCarro: number[] = [];

  for (const [indice, rota] of solucao.carros.entries()) {
    let distCarro = 0;
    for (let i = 0; i < rota.length - 1; i++) {
      distCarro += dist(rota[i], rota[i + 1], pontosIndex, config.matrizDist);
    }
    distanciasPorCarro.push(distCarro);
    total += distCarro;

    // Penalidade de capacidade excedida
    const passageiros = rota.length - 2; // exclui origem e destino
    const capacidade = config.capacidades?.[indice] ?? config.capacidade;
    if (passageiros > capacidade) {
      total += 100 * (passageiros - capacidade);
    }
  }

  // Penalidade de carros vazios (sem passageiros)
  const carrosVazios = solucao.carros.filter((r) => r.length === 2).length;
  total += 50 * carrosVazios;

  // ★ Penalidade de desigualdade (fairness)
  // Minimiza o desvio padrão das distâncias entre carros,
  // forçando o SA a encontrar soluções equilibradas.
  const carrosComPassageiros = distanciasPorCarro.filter(
    (_, i) => solucao.carros[i].length > 2
  );
  if (carrosComPassageiros.length > 1) {
    const media =
      carrosComPassageiros.reduce((a, b) => a + b, 0) /
      carrosComPassageiros.length;
    const variancia =
      carrosComPassageiros.reduce((a, d) => a + (d - media) ** 2, 0) /
      carrosComPassageiros.length;
    const desvioPadrao = Math.sqrt(variancia);
    total += (config.pesoFairness ?? 30) * desvioPadrao;
  }

  return total;
}

// ─── Métricas de uma solução ─────────────────────────────────────────
export type MetricasVRP = {
  distanciaTotal: number;
  distanciasPorCarro: number[];
  desvioPadrao: number;
  maiorRota: number;
  menorRota: number;
};

export function metricasVRP(
  solucao: SolucaoVRP,
  config: ConfigVRP,
  pontosIndex?: Map<Ponto, number>
): MetricasVRP {
  const distanciasPorCarro: number[] = [];

  for (const rota of solucao.carros) {
    let distCarro = 0;
    for (let i = 0; i < rota.length - 1; i++) {
      distCarro += dist(rota[i], rota[i + 1], pontosIndex, config.matrizDist);
    }
    distanciasPorCarro.push(distCarro);
  }

  const comPassageiros = distanciasPorCarro.filter(
    (_, i) => solucao.carros[i].length > 2
  );
  const distanciaTotal = distanciasPorCarro.reduce((a, b) => a + b, 0);

  let desvioPadrao = 0;
  if (comPassageiros.length > 1) {
    const media = comPassageiros.reduce((a, b) => a + b, 0) / comPassageiros.length;
    const variancia =
      comPassageiros.reduce((a, d) => a + (d - media) ** 2, 0) /
      comPassageiros.length;
    desvioPadrao = Math.sqrt(variancia);
  }

  return {
    distanciaTotal,
    distanciasPorCarro,
    desvioPadrao,
    maiorRota: Math.max(...comPassageiros, 0),
    menorRota: Math.min(...comPassageiros, 0),
  };
}

// ─── Operadores de Vizinhança ────────────────────────────────────────
export function vizinhoVRP(solucao: SolucaoVRP): SolucaoVRP {
  const copia: SolucaoVRP = { carros: solucao.carros.map((r) => [...r]) };
  const operacao = Math.random();

  // 1) Mover encontrista de um carro para outro (40%)
  if (operacao < 0.35) {
    const deIdx = Math.floor(Math.random() * copia.carros.length);
    const paraIdx = Math.floor(Math.random() * copia.carros.length);
    if (deIdx === paraIdx) return copia;

    const de = copia.carros[deIdx];
    const para = copia.carros[paraIdx];
    if (de.length <= 2) return copia;

    const pos = 1 + Math.floor(Math.random() * (de.length - 2));
    const [movido] = de.splice(pos, 1);
    const insercao = 1 + Math.floor(Math.random() * (para.length - 1));
    para.splice(insercao, 0, movido);
  }

  // 2) Trocar dois entre carros (25%)
  else if (operacao < 0.6) {
    const aIdx = Math.floor(Math.random() * copia.carros.length);
    const bIdx = Math.floor(Math.random() * copia.carros.length);
    if (aIdx === bIdx) return copia;

    const a = copia.carros[aIdx];
    const b = copia.carros[bIdx];
    if (a.length <= 2 || b.length <= 2) return copia;

    const i = 1 + Math.floor(Math.random() * (a.length - 2));
    const j = 1 + Math.floor(Math.random() * (b.length - 2));
    [a[i], b[j]] = [b[j], a[i]];
  }

  // 3) Inverter segmento dentro de um carro — 2-opt intra (20%)
  else if (operacao < 0.8) {
    const idx = Math.floor(Math.random() * copia.carros.length);
    const rota = copia.carros[idx];
    if (rota.length < 4) return copia;

    const i = 1 + Math.floor(Math.random() * (rota.length - 3));
    const j = i + 1 + Math.floor(Math.random() * (rota.length - i - 2));
    const segmento = rota.slice(i, j + 1).reverse();
    rota.splice(i, segmento.length, ...segmento);
  }

  // 4) ★ Rebalancear: mover do carro mais longo para o mais curto (20%)
  else {
    let maxIdx = 0;
    let minIdx = 0;
    let maxLen = 0;
    let minLen = Infinity;

    for (let i = 0; i < copia.carros.length; i++) {
      const len = copia.carros[i].length;
      if (len > maxLen) { maxLen = len; maxIdx = i; }
      if (len < minLen) { minLen = len; minIdx = i; }
    }

    if (maxIdx === minIdx || copia.carros[maxIdx].length <= 2) return copia;

    const de = copia.carros[maxIdx];
    const para = copia.carros[minIdx];
    const pos = 1 + Math.floor(Math.random() * (de.length - 2));
    const [movido] = de.splice(pos, 1);
    const insercao = 1 + Math.floor(Math.random() * (para.length - 1));
    para.splice(insercao, 0, movido);
  }

  return copia;
}

// ─── Otimizador VRP ──────────────────────────────────────────────────
export function otimizarVRP(config: ConfigVRP): SAResultado<SolucaoVRP> {
  // Solução inicial: distribui round-robin
  const carros: Ponto[][] = Array.from({ length: config.numCarros }, (_, indice) => [
    config.origens?.[indice] ?? config.paroquia,
    config.encontro,
  ]);

  config.encontristas.forEach((e, i) => {
    const idx = i % config.numCarros;
    carros[idx].splice(carros[idx].length - 1, 0, e);
  });

  // Constrói index de pontos para lookup na matriz
  let pontosIndex: Map<Ponto, number> | undefined;
  if (config.matrizDist) {
    pontosIndex = new Map<Ponto, number>();
    const todosPontos = [
      config.paroquia,
      config.encontro,
      ...(config.origens ?? []),
      ...config.encontristas,
    ];
    todosPontos.forEach((p, i) => pontosIndex!.set(p, i));
  }

  return simulatedAnnealing<SolucaoVRP>({
    estadoInicial: { carros },
    custo: (s) => custoVRP(s, config, pontosIndex),
    vizinho: vizinhoVRP,
    temperaturaInicial: 30,
    temperaturaFinal: 0.05,
    fatorResfriamento: 0.995,
    iteracoesPorTemperatura: 100,
  });
}