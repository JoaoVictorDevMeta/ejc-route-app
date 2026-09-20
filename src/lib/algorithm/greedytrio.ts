import { haversine } from "./haversine";
import type { PontoWID } from "@/types";

//tempo: O(n² log n) — para cada semente, ordena os candidatos.
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
      .filter(e => !usados.has(e.id))
      .map(e => ({ e, dist: haversine(semente, e) }))
      .sort((a, b) => a.dist - b.dist)
      .slice(0, capacidade - 1);

    const trio = [semente, ...candidatos.map(c => c.e)];
    candidatos.forEach(c => usados.add(c.e.id));
    trios.push(trio);
  }

  return trios;
}

//>>>Aplicação no EJC
//Forma os grupos iniciais.
//A equipe pode arrastar pessoas entre trios depois (drag-and-drop).