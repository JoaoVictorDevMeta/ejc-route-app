import type { Ponto } from "./PontoCoordenada";

export type PontoWID = Ponto & {
  id: string;
  score: number;
};