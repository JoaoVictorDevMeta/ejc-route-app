export type SAConfig<T> = {
  estadoInicial: T;
  custo: (estado: T) => number;
  vizinho: (estado: T) => T;
  temperaturaInicial: number;
  temperaturaFinal: number;
  fatorResfriamento: number;
  iteracoesPorTemperatura: number;
  onProgresso?: (info: ProgressoSA) => void;
};

export type ProgressoSA = {
  iteracao: number;
  temperatura: number;
  custoAtual: number;
  melhorCusto: number;
};

export type SAResultado<T> = {
  melhorEstado: T;
  melhorCusto: number;
  historico: number[];
  iteracoes: number;
};

export function simulatedAnnealing<T>(config: SAConfig<T>): SAResultado<T> {
  let estadoAtual = config.estadoInicial;
  let custoAtual = config.custo(estadoAtual);
  let melhorEstado = estadoAtual;
  let melhorCusto = custoAtual;
  let temperatura = config.temperaturaInicial;
  let iteracao = 0;
  const historico: number[] = [melhorCusto];

  while (temperatura > config.temperaturaFinal) {
    for (let i = 0; i < config.iteracoesPorTemperatura; i++) {
      const candidato = config.vizinho(estadoAtual);
      const custoCandidato = config.custo(candidato);
      const delta = custoCandidato - custoAtual;

      if (delta < 0 || Math.random() < Math.exp(-delta / temperatura)) {
        estadoAtual = candidato;
        custoAtual = custoCandidato;

        if (custoAtual < melhorCusto) {
          melhorEstado = estadoAtual;
          melhorCusto = custoAtual;
          historico.push(melhorCusto);
        }
      }
      iteracao++;
    }

    temperatura *= config.fatorResfriamento;
    config.onProgresso?.({ iteracao, temperatura, custoAtual, melhorCusto });
  }

  return { melhorEstado, melhorCusto, historico, iteracoes: iteracao };
}