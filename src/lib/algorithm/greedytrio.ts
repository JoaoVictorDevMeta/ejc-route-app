import { haversine } from "./haversine";
import type { Ponto, PontoWID } from "@/types";

// ─── Tipos ───────────────────────────────────────────────────────────
export type CarroInput = {
  id: string;
  origem: Ponto;
  capacidade: number;
};

export type GrupoFormado = {
  carroId: string;
  origem: Ponto;
  encontristas: PontoWID[];
  distanciaEstimada: number; // soma Haversine da rota (origem → e1 → e2 → ... → destino)
};

// ─── Greedy com Origens de Carros ────────────────────────────────────
// Para cada encontrista (do maior score ao menor), atribui ao carro
// cuja ORIGEM está mais próxima e ainda tem capacidade.
// Dentro de cada grupo, ordena por nearest-neighbor para dar
// uma boa rota inicial.
//
// Tempo: O(n × k) onde n = encontristas, k = carros
export function formarGrupos(
  encontristas: PontoWID[],
  carros: CarroInput[],
  destino: Ponto
): GrupoFormado[] {
  if (carros.length === 0 || encontristas.length === 0) return [];

  // Ordena por score decrescente (quem tem maior prioridade é alocado primeiro)
  const ordenados = [...encontristas].sort((a, b) => b.score - a.score);

  // Inicializa grupos vazios
  const grupos: Map<string, { carro: CarroInput; membros: PontoWID[] }> = new Map();
  for (const carro of carros) {
    grupos.set(carro.id, { carro, membros: [] });
  }

  // Atribui cada encontrista ao carro mais próximo com capacidade
  for (const enc of ordenados) {
    let melhorCarroId: string | null = null;
    let melhorDist = Infinity;

    for (const [carroId, grupo] of grupos) {
      if (grupo.membros.length >= grupo.carro.capacidade) continue;

      const distOrigem = haversine(grupo.carro.origem, enc);
      if (distOrigem < melhorDist) {
        melhorDist = distOrigem;
        melhorCarroId = carroId;
      }
    }

    // Se todos os carros estão cheios, coloca no mais próximo (vai exceder)
    if (melhorCarroId === null) {
      let fallbackId: string | null = null;
      let fallbackDist = Infinity;
      for (const [carroId, grupo] of grupos) {
        const d = haversine(grupo.carro.origem, enc);
        if (d < fallbackDist) {
          fallbackDist = d;
          fallbackId = carroId;
        }
      }
      melhorCarroId = fallbackId;
    }

    if (melhorCarroId) {
      grupos.get(melhorCarroId)!.membros.push(enc);
    }
  }

  // Ordena membros de cada grupo por nearest-neighbor a partir da origem
  const resultado: GrupoFormado[] = [];
  for (const [carroId, grupo] of grupos) {
    if (grupo.membros.length === 0) continue;

    const ordenadoPorRota = ordenarNearestNeighbor(grupo.carro.origem, grupo.membros);

    // Calcula distância estimada da rota completa
    let dist = 0;
    const rota = [grupo.carro.origem, ...ordenadoPorRota, destino];
    for (let i = 0; i < rota.length - 1; i++) {
      dist += haversine(rota[i], rota[i + 1]);
    }

    resultado.push({
      carroId,
      origem: grupo.carro.origem,
      encontristas: ordenadoPorRota,
      distanciaEstimada: dist,
    });
  }

  return resultado;
}

// ─── Nearest Neighbor ────────────────────────────────────────────────
// Ordena os encontristas de forma que cada próximo seja o mais perto
// do anterior, começando pela origem do carro.
function ordenarNearestNeighbor(origem: Ponto, membros: PontoWID[]): PontoWID[] {
  const restantes = [...membros];
  const ordenados: PontoWID[] = [];
  let atual: Ponto = origem;

  while (restantes.length > 0) {
    let melhorIdx = 0;
    let melhorDist = Infinity;

    for (let i = 0; i < restantes.length; i++) {
      const d = haversine(atual, restantes[i]);
      if (d < melhorDist) {
        melhorDist = d;
        melhorIdx = i;
      }
    }

    const proximo = restantes.splice(melhorIdx, 1)[0];
    ordenados.push(proximo);
    atual = proximo;
  }

  return ordenados;
}

// ─── Greedy Simples (sem carros) ─────────────────────────────────────
// Mantém a versão original para quando não há carros cadastrados.
// Forma trios por proximidade, priorizando quem tem maior score.
//
// Tempo: O(n² log n)
export function formarTrios(
  encontristas: PontoWID[],
  capacidade: number = 3
): PontoWID[][] {
  const ordenados = [...encontristas].sort((a, b) => b.score - a.score);
  const usados = new Set<string>();
  const trios: PontoWID[][] = [];

  for (const semente of ordenados) {
    if (usados.has(semente.id)) continue;
    usados.add(semente.id);

    const candidatos = ordenados
      .filter((e) => !usados.has(e.id))
      .map((e) => ({ e, dist: haversine(semente, e) }))
      .sort((a, b) => a.dist - b.dist)
      .slice(0, capacidade - 1);

    const trio = [semente, ...candidatos.map((c) => c.e)];
    candidatos.forEach((c) => usados.add(c.e.id));
    trios.push(trio);
  }

  return trios;
}