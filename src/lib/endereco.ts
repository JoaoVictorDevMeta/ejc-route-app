export type EnderecoParsed = {
  cep: string;
  rua: string;
  numero: string;
  bairro: string;
  cidade: string;
  uf: string;
};

/**
 * Reconstrói os campos do EnderecoFields a partir da string concatenada.
 *
 * Formatos suportados:
 *   "Rua X, 123, Bairro, Cidade - UF, Brasil"
 *   "Rua X, Bairro, Cidade - UF, Brasil"
 *   "Rua X, Cidade - UF, Brasil"
 */
export function parseEnderecoCompleto(
  endereco: string,
  cep?: string | null
): EnderecoParsed {
  const partes = endereco
    .split(",")
    .map((p) => p.trim())
    .filter(Boolean);

  // Remove o "Brasil" final, se existir
  if (partes[partes.length - 1]?.toLowerCase() === "brasil") {
    partes.pop();
  }

  // Último item: "Cidade - UF"
  const cidadeUf = partes.pop() ?? "";
  const [cidade, uf] = cidadeUf.split(" - ").map((s) => s.trim());

  let rua = "";
  let numero = "";
  let bairro = "";

  if (partes.length > 0) {
    // Heurística: se o segundo item for só dígitos (opcionalmente com letra), é número
    const segundoEhNumero =
      partes.length > 1 && /^\d+[a-zA-Z]?$/.test(partes[1]);

    if (segundoEhNumero) {
      rua = partes[0];
      numero = partes[1];
      bairro = partes.slice(2).join(", ");
    } else {
      rua = partes[0];
      bairro = partes.slice(1).join(", ");
    }
  }

  return {
    rua,
    numero,
    bairro,
    cidade: cidade ?? "",
    uf: uf ?? "",
    cep: cep ?? "",
  };
}