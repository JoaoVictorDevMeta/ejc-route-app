export type Coordenadas = {
  latitude: number;
  longitude: number;
};

type DadosCep = {
  logradouro?: string;
  bairro?: string;
  localidade?: string;
  uf?: string;
  erro?: boolean;
};

async function enderecoPorCep(cep: string): Promise<string | null> {
  try {
    const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`, {
      signal: AbortSignal.timeout(5000),
    });
    if (!response.ok) return null;

    const dados = (await response.json()) as DadosCep;
    if (dados.erro || !dados.logradouro || !dados.localidade || !dados.uf) {
      return null;
    }

    return [dados.logradouro, dados.bairro, dados.localidade, dados.uf, "Brasil"]
      .filter(Boolean)
      .join(", ");
  } catch {
    return null;
  }
}

export async function geocodificarEndereco(
  endereco: string,
  cep?: string
): Promise<Coordenadas | null> {
  const consultas: URL[] = [];
  const cepLimpo = cep?.replace(/\D/g, "");
  const enderecosParaBuscar = [endereco];

  if (cepLimpo?.length === 8) {
    const enderecoDoCep = await enderecoPorCep(cepLimpo);
    if (enderecoDoCep) enderecosParaBuscar.push(enderecoDoCep);
  }

  for (const enderecoParaBuscar of enderecosParaBuscar) {
    const urlCompleta = new URL("https://nominatim.openstreetmap.org/search");
    urlCompleta.searchParams.set(
      "q",
      [enderecoParaBuscar, "Brasil"].filter(Boolean).join(", ")
    );
    consultas.push(urlCompleta);
  }

  for (const url of consultas) {
    url.searchParams.set("format", "jsonv2");
    url.searchParams.set("limit", "1");
    url.searchParams.set("countrycodes", "br");

    try {
      const response = await fetch(url, {
        headers: {
          Accept: "application/json",
          "Accept-Language": "pt-BR",
          "User-Agent": "EJC-Externa/1.0 (app de organizacao de encontros)",
        },
        signal: AbortSignal.timeout(8000),
      });

      if (!response.ok) continue;

      const resultados = (await response.json()) as Array<{
        lat?: string;
        lon?: string;
      }>;
      const resultado = resultados[0];
      const latitude = Number(resultado?.lat);
      const longitude = Number(resultado?.lon);

      if (Number.isFinite(latitude) && Number.isFinite(longitude)) {
        return { latitude, longitude };
      }
    } catch {
      continue;
    }
  }

  const photonUrl = new URL("https://photon.komoot.io/api/");
  const enderecoCanonico = cepLimpo?.length === 8
    ? await enderecoPorCep(cepLimpo)
    : null;
  photonUrl.searchParams.set(
    "q",
    [enderecoCanonico ?? endereco, "Brasil"].filter(Boolean).join(", ")
  );
  photonUrl.searchParams.set("limit", "1");

  try {
    const response = await fetch(photonUrl, {
      headers: {
        Accept: "application/json",
        "Accept-Language": "pt-BR",
      },
      signal: AbortSignal.timeout(8000),
    });

    if (response.ok) {
      const data = (await response.json()) as {
        features?: Array<{ geometry?: { coordinates?: number[] } }>;
      };
      const coordinates = data.features?.[0]?.geometry?.coordinates;
      const longitude = Number(coordinates?.[0]);
      const latitude = Number(coordinates?.[1]);

      if (Number.isFinite(latitude) && Number.isFinite(longitude)) {
        return { latitude, longitude };
      }
    }
  } catch {
    // O segundo provedor é apenas um fallback; a action exibirá o erro útil.
  }

  return null;
}
