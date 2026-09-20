export { haversine } from "./haversine";
export { dbscan } from "./dbscan";
export { formarTrios, formarGrupos } from "./greedytrio";
export type { CarroInput, GrupoFormado } from "./greedytrio";
export { simulatedAnnealing } from "./simulatedAnnealing";
export type { SAConfig, ProgressoSA, SAResultado } from "./simulatedAnnealing";
export { otimizarRotaTrio, custoRota } from "./rotaTrio";
export { otimizarVRP, custoVRP, vizinhoVRP, metricasVRP } from "./vrp";
export type { SolucaoVRP, ConfigVRP, MetricasVRP } from "./vrp";
export { rotaPontos, matrizDistancias } from "./osrm";
export {
  encontristaParaPonto,
  paroquiaParaPonto,
  localParaPonto,
} from "./adapters";
export {
  calcularScore,
  calcularScores,
  classificarPrioridade,
} from "./priorizacao";
export type { EncontristaComScore } from "./priorizacao";