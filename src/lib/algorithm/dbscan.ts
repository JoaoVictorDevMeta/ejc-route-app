//Density-Based Spatial Clustering of Applications with Noise

import { haversine } from "./haversine";
import type { Ponto } from "@/types";

//>>>DBSCAN:
//Descobre o número de clusters sozinho.
//Identifica formatos arbitrários (não só esferas).
//Trata outliers como ruído (encontristas isolados).

//Tempo: O(n**2) ou O(n log n)
export function dbscan(
    pontos: Ponto[],
    raio: number,
    minPts: number
):{clusters: Ponto[][], ruido: Ponto[]}{
    const visitados = new Set<number>();
    const clusters: Ponto[][] = [];
    const ruido: Ponto[] = [];

    const vizinhos = (i: number) =>
    pontos.map((_, j) => j).filter(j => i !== j && haversine(pontos[i], pontos[j]) <= raio);

    for (let i = 0; i < pontos.length; i++) {
        if (visitados.has(i)) continue;
        visitados.add(i);

        const viz = vizinhos(i);
        if (viz.length < minPts) {
        ruido.push(pontos[i]);
        continue;
        }

        const cluster: Ponto[] = [pontos[i]];
        const fila = [...viz];

        while (fila.length > 0) {
        const j = fila.shift()!;
        if (!visitados.has(j)) {
            visitados.add(j);
            const vizJ = vizinhos(j);
            if (vizJ.length >= minPts) {
            fila.push(...vizJ.filter(k => !visitados.has(k)));
            }
        }
        if (!cluster.includes(pontos[j])) cluster.push(pontos[j]);
        }

        clusters.push(cluster);
    }

    return { clusters, ruido };
}

//Como escolher epsKm e minPts
//epsKm: olhe o mapa. Se as zonas que você vê a olho nu têm ~1 km de raio, use 1 km.
//minPts: para o EJC, 3 é razoável (3 encontristas já formam um trio). Aumentar deixa os clusters mais "puros", mas pode perder zonas pequenas.