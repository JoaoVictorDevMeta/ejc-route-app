import { haversine } from "./haversine";
import { simulatedAnnealing, type SAResultado } from "./simulatedAnnealing";
import type { Ponto } from "@/types";

export type SolucaoVRP = {
  carros: Ponto[][]; // [paroquia, ...encontristas, encontro]
};

export type ConfigVRP = {
  paroquia: Ponto;
  encontro: Ponto;
  encontristas: Ponto[];
  numCarros: number;
  capacidade: number;
  origens?: Ponto[];
  capacidades?: number[];
};

export function custoVRP(solucao: SolucaoVRP, config: ConfigVRP): number {
  let total = 0;

  for (const [indice, rota] of solucao.carros.entries()) {
    for (let i = 0; i < rota.length - 1; i++) {
      total += haversine(rota[i], rota[i + 1]);
    }

    const passageiros = rota.length - 2;
    const capacidade = config.capacidades?.[indice] ?? config.capacidade;
    if (passageiros > capacidade) {
      total += 100 * (passageiros - capacidade);
    }
  }

  const carrosVazios = solucao.carros.filter((r) => r.length === 2).length;
  total += 50 * carrosVazios;

  return total;
}

export function vizinhoVRP(solucao: SolucaoVRP): SolucaoVRP {
  const copia: SolucaoVRP = { carros: solucao.carros.map((r) => [...r]) };
  const operacao = Math.random();

  // 1) Mover encontrista entre carros
  if (operacao < 0.4) {
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

  // 2) Trocar dois entre carros
  else if (operacao < 0.7) {
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

  // 3) Inverter segmento dentro de um carro (2-opt intra)
  else {
    const idx = Math.floor(Math.random() * copia.carros.length);
    const rota = copia.carros[idx];
    if (rota.length < 4) return copia;

    const i = 1 + Math.floor(Math.random() * (rota.length - 3));
    const j = i + 1 + Math.floor(Math.random() * (rota.length - i - 2));
    const segmento = rota.slice(i, j + 1).reverse();
    rota.splice(i, segmento.length, ...segmento);
  }

  return copia;
}

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

  return simulatedAnnealing<SolucaoVRP>({
    estadoInicial: { carros },
    custo: (s) => custoVRP(s, config),
    vizinho: vizinhoVRP,
    temperaturaInicial: 30,
    temperaturaFinal: 0.05,
    fatorResfriamento: 0.995,
    iteracoesPorTemperatura: 100,
  });
}