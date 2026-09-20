"use client";

import { useState } from "react";
import { LoaderCircle, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type EnderecoFieldsProps = {
  campo: string;
  titulo: string;
  descricao?: string;
};

type Endereco = {
  cep: string;
  rua: string;
  numero: string;
  bairro: string;
  cidade: string;
  uf: string;
};

const enderecoInicial: Endereco = {
  cep: "",
  rua: "",
  numero: "",
  bairro: "",
  cidade: "",
  uf: "",
};

export function EnderecoFields({ campo, titulo, descricao }: EnderecoFieldsProps) {
  const [endereco, setEndereco] = useState(enderecoInicial);
  const [buscandoCep, setBuscandoCep] = useState(false);
  const [mensagem, setMensagem] = useState("");

  const enderecoCompleto = [
    endereco.rua && `${endereco.rua}${endereco.numero ? `, ${endereco.numero}` : ""}`,
    endereco.bairro,
    endereco.cidade && `${endereco.cidade}${endereco.uf ? ` - ${endereco.uf}` : ""}`,
    "Brasil",
  ]
    .filter(Boolean)
    .join(", ");

  function atualizar(campoEndereco: keyof Endereco, valor: string) {
    setEndereco((atual) => ({ ...atual, [campoEndereco]: valor }));
    if (mensagem) setMensagem("");
  }

  async function buscarCep() {
    const cep = endereco.cep.replace(/\D/g, "");
    if (cep.length !== 8) {
      setMensagem("Digite um CEP com 8 números.");
      return;
    }

    setBuscandoCep(true);
    setMensagem("");

    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const resultado = (await response.json()) as {
        erro?: boolean;
        logradouro?: string;
        bairro?: string;
        localidade?: string;
        uf?: string;
      };

      if (!response.ok || resultado.erro) {
        setMensagem("CEP não encontrado. Confira os números.");
        return;
      }

      setEndereco((atual) => ({
        ...atual,
        rua: resultado.logradouro ?? atual.rua,
        bairro: resultado.bairro ?? atual.bairro,
        cidade: resultado.localidade ?? atual.cidade,
        uf: resultado.uf ?? atual.uf,
      }));
    } catch {
      setMensagem("Não foi possível consultar o CEP agora.");
    } finally {
      setBuscandoCep(false);
    }
  }

  return (
    <fieldset className="space-y-3 rounded-xl border border-primary/10 p-4">
      <legend className="px-1 text-sm font-semibold">{titulo}</legend>
      {descricao && <p className="text-xs text-muted-foreground">{descricao}</p>}
      <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto]">
        <div className="space-y-2">
          <Label htmlFor={`${campo}-cep`}>CEP</Label>
          <Input
            id={`${campo}-cep`}
            name={`${campo}Cep`}
            value={endereco.cep}
            onChange={(event) => atualizar("cep", event.target.value)}
            onBlur={buscarCep}
            inputMode="numeric"
            placeholder="00000-000"
            maxLength={9}
          />
        </div>
        <Button type="button" variant="outline" className="mt-auto gap-2" onClick={buscarCep} disabled={buscandoCep}>
          {buscandoCep ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
          Buscar CEP
        </Button>
      </div>
      <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_120px]">
        <div className="space-y-2">
          <Label htmlFor={`${campo}-rua`}>Rua ou avenida</Label>
          <Input id={`${campo}-rua`} value={endereco.rua} onChange={(event) => atualizar("rua", event.target.value)} placeholder="Ex.: Rua das Flores" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor={`${campo}-numero`}>Número</Label>
          <Input id={`${campo}-numero`} value={endereco.numero} onChange={(event) => atualizar("numero", event.target.value)} placeholder="123" required />
        </div>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor={`${campo}-bairro`}>Bairro</Label>
          <Input id={`${campo}-bairro`} value={endereco.bairro} onChange={(event) => atualizar("bairro", event.target.value)} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor={`${campo}-cidade`}>Cidade e estado</Label>
          <Input id={`${campo}-cidade`} value={endereco.cidade} onChange={(event) => atualizar("cidade", event.target.value)} placeholder="Ex.: Recife - PE" required />
        </div>
      </div>
      {mensagem && <p className="text-xs text-destructive">{mensagem}</p>}
      <input type="hidden" name={campo} value={enderecoCompleto} />
    </fieldset>
  );
}
