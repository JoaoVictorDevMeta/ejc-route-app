import { Pesos } from "@/types/PesosPonderado";
import type { Models } from "@/prisma/contract";

//tempo: O(n)
export function calcularScore(
  e: Pick<
    Models.public_Encontrista,
    "distanciaKm" | "posicaoFila" | "notaPresenca" | "notaIndicacao"
  >,
  pesos: Pesos,
  totalInscritos: number,
  maxDistanciaKm: number
): number {
  const distanciaKm = e.distanciaKm ?? maxDistanciaKm;
  const posicaoFila = e.posicaoFila ?? totalInscritos;
  const notaDistancia = maxDistanciaKm > 0
    ? 10 - Math.min(10, (distanciaKm / maxDistanciaKm) * 10)
    : 0;
  const notaFila = totalInscritos > 0
    ? 10 - (posicaoFila / totalInscritos) * 10
    : 0;
  const notaPresenca = e.notaPresenca;
  const notaIndicacao = e.notaIndicacao;

  return (
    pesos.distancia * notaDistancia +
    (pesos.fila ?? 0) * notaFila +
    (pesos.presenca ?? 0) * notaPresenca +
    (pesos.indicacao ?? 0) * notaIndicacao
  );
}

//>>>Aplicação no EJC
//Recalcula em tempo real quando a equipe move os sliders.
//Define quem entra nas vagas e quem vai para a fila.
//Ordena a fila para promoção automática em caso de desistência.