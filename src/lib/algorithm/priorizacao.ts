import type { Models } from "@/prisma/contract";
import type { Pesos, PontoWID } from "@/types";
import { haversine } from "./haversine";

// ─── Tipos ───────────────────────────────────────────────────────────
export type EncontristaComScore = {
  id: string;
  nome: string;
  score: number;
  prioridade: "ALTA" | "MEDIA" | "BAIXA";
  notas: {
    distancia: number;
    fila: number;
    presenca: number;
    indicacao: number;
  };
};

type EncontristaInput = Pick<
  Models.public_Encontrista,
  "id" | "nome" | "distanciaKm" | "posicaoFila" | "notaPresenca" | "notaIndicacao"
>;

// ─── Normalização ────────────────────────────────────────────────────
// Normaliza um valor para a escala 0–10.
// Quanto menor o valor bruto, maior a nota (inversamente proporcional).
function normalizarInverso(valor: number, maximo: number): number {
  if (maximo <= 0) return 0;
  return 10 - Math.min(10, (valor / maximo) * 10);
}

// ─── Cálculo de Score ────────────────────────────────────────────────
// Fórmula:
//   score = (peso_distancia × nota_distancia)
//         + (peso_fila      × nota_fila)
//         + (peso_presenca  × nota_presenca)
//         + (peso_indicacao × nota_indicacao)
//
// Cada nota é normalizada para 0–10.
// O score final é a soma ponderada.
export function calcularScore(
  e: EncontristaInput,
  pesos: Pesos,
  totalInscritos: number,
  maxDistanciaKm: number
): { score: number; notas: EncontristaComScore["notas"] } {
  const distanciaKm = e.distanciaKm ?? maxDistanciaKm;
  const posicaoFila = e.posicaoFila ?? totalInscritos;

  const notaDistancia = normalizarInverso(distanciaKm, maxDistanciaKm);
  const notaFila = normalizarInverso(posicaoFila, totalInscritos);
  const notaPresenca = e.notaPresenca;
  const notaIndicacao = e.notaIndicacao;

  const score =
    pesos.distancia * notaDistancia +
    (pesos.fila ?? 0) * notaFila +
    (pesos.presenca ?? 0) * notaPresenca +
    (pesos.indicacao ?? 0) * notaIndicacao;

  return {
    score,
    notas: {
      distancia: notaDistancia,
      fila: notaFila,
      presenca: notaPresenca,
      indicacao: notaIndicacao,
    },
  };
}

// ─── Classificação de Prioridade ─────────────────────────────────────
// ALTA  → top 33% dos scores
// MEDIA → 33–66%
// BAIXA → bottom 33%
export function classificarPrioridade(
  score: number,
  todosScores: number[]
): "ALTA" | "MEDIA" | "BAIXA" {
  if (todosScores.length === 0) return "MEDIA";

  const sorted = [...todosScores].sort((a, b) => b - a);
  const posicao = sorted.findIndex((s) => score >= s);
  const percentil = posicao / sorted.length;

  if (percentil <= 0.33) return "ALTA";
  if (percentil <= 0.66) return "MEDIA";
  return "BAIXA";
}

// ─── Pipeline Completo ───────────────────────────────────────────────
// Recebe lista de encontristas + pesos → retorna lista com scores e tiers.
export function calcularScores(
  encontristas: EncontristaInput[],
  pesos: Pesos
): EncontristaComScore[] {
  if (encontristas.length === 0) return [];

  const totalInscritos = encontristas.length;
  const maxDistanciaKm = Math.max(
    ...encontristas.map((e) => e.distanciaKm ?? 0),
    1
  );

  // Primeiro passo: calcular scores brutos
  const comScores = encontristas.map((e) => {
    const { score, notas } = calcularScore(e, pesos, totalInscritos, maxDistanciaKm);
    return { id: e.id, nome: e.nome, score, notas };
  });

  // Segundo passo: classificar prioridades com base no conjunto
  const todosScores = comScores.map((e) => e.score);

  return comScores.map((e) => ({
    ...e,
    prioridade: classificarPrioridade(e.score, todosScores),
  }));
}
