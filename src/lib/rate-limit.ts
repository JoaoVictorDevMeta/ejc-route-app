// src/lib/rate-limit.ts
const chamadas = new Map<string, number[]>();

export function verificarRateLimit(
  chave: string,
  limite: number,
  janelaMs: number
): boolean {
  const agora = Date.now();
  const historico = (chamadas.get(chave) ?? []).filter(
    (t) => agora - t < janelaMs
  );

  if (historico.length >= limite) return false;

  historico.push(agora);
  chamadas.set(chave, historico);
  return true;
}