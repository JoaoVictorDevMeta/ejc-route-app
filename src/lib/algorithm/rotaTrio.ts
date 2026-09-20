import { haversine } from "./haversine";
import { simulatedAnnealing, type SAResultado } from "./simulatedAnnealing";
import type { Ponto } from "@/types";

export type Rota = Ponto[];

export function custoRota(rota: Rota): number {
  let total = 0;
  for (let i = 0; i < rota.length - 1; i++) {
    total += haversine(rota[i], rota[i + 1]);
  }
  return total;
}

export function otimizarRotaTrio(
  paroquia: Ponto,
  encontristas: Ponto[],
  encontro: Ponto
): SAResultado<Rota> {
  const estadoInicial: Rota = [paroquia, ...encontristas, encontro];

  return simulatedAnnealing<Rota>({
    estadoInicial,
    custo: custoRota,
    vizinho: (rota) => {
      const copia = [...rota];
      const n = copia.length;
      const i = 1 + Math.floor(Math.random() * (n - 2));
      let j = 1 + Math.floor(Math.random() * (n - 2));
      while (j === i) j = 1 + Math.floor(Math.random() * (n - 2));
      [copia[i], copia[j]] = [copia[j], copia[i]];
      return copia;
    },
    temperaturaInicial: 5,
    temperaturaFinal: 0.01,
    fatorResfriamento: 0.95,
    iteracoesPorTemperatura: 30,
  });
}