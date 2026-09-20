export { haversine } from "./haversine";
export { dbscan } from "./dbscan";
export { formarTrios } from "./greedytrio";
export { simulatedAnnealing } from "./simulatedAnnealing";
export type { SAConfig, ProgressoSA, SAResultado } from "./simulatedAnnealing";
export { otimizarRotaTrio, custoRota } from "./rotaTrio";
export { otimizarVRP, custoVRP, vizinhoVRP } from "./vrp";
export type { SolucaoVRP, ConfigVRP } from "./vrp";
export { rotaPontos, matrizDistancias } from "./osrm";
export {
  encontristaParaPonto,
  paroquiaParaPonto,
  localParaPonto,
} from "./adapters";