"use client";

import { useState, useMemo } from "react";
import { Toolbar, type Ordenacao } from "@/components/encontristas/toolbar";
import { NovoEncontristaForm } from "@/components/encontristas/novo-encontrista-form";
import { TabelaPlaceholder } from "@/components/encontristas/tabela-placeholder";

type EncontristaRow = {
  id: string;
  nome: string;
  telefone: string | null;
  endereco: string;
  distanciaKm: number | null;
  score: number | null;
  prioridade: string | null;
  status: string;
  notaPresenca: number;
  notaIndicacao: number;
  criadoEm: string;
};

export function EncontristasContent({
  encontristas,
}: {
  encontristas: EncontristaRow[];
}) {
  const [formAberto, setFormAberto] = useState(false);
  const [busca, setBusca] = useState("");
  const [status, setStatus] = useState("todos");
  const [prioridade, setPrioridade] = useState("todas");
  const [ordenacao, setOrdenacao] = useState<Ordenacao>("alfabeto");

  const encontristasFiltrados = useMemo(() => {
    let resultado = [...encontristas];

    if (busca.trim()) {
      const termo = busca.toLowerCase().trim();
      resultado = resultado.filter(
        (e) =>
          e.nome.toLowerCase().includes(termo) ||
          e.endereco.toLowerCase().includes(termo)
      );
    }

    if (status !== "todos") {
      const statusUpper = status.toUpperCase();
      resultado = resultado.filter((e) => e.status === statusUpper);
    }

    if (prioridade !== "todas") {
      const prioridadeUpper = prioridade.toUpperCase();
      resultado = resultado.filter((e) => e.prioridade === prioridadeUpper);
    }

    if (ordenacao === "alfabeto") {
      resultado.sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR"));
    } else {
      resultado.sort((a, b) => a.criadoEm.localeCompare(b.criadoEm));
    }

    return resultado;
  }, [encontristas, busca, status, prioridade, ordenacao]);

  return (
    <>
      <Toolbar
        formAberto={formAberto}
        onNovoEncontrista={() => setFormAberto((aberto) => !aberto)}
        busca={busca}
        onBuscaChange={setBusca}
        status={status}
        onStatusChange={(v) => setStatus(v ?? "todos")}
        prioridade={prioridade}
        onPrioridadeChange={(v) => setPrioridade(v ?? "todas")}
        ordenacao={ordenacao}
        onOrdenacaoChange={(v) => setOrdenacao(v ?? "alfabeto")}
      />
      <div
        aria-hidden={!formAberto}
        className={`grid transition-[grid-template-rows,opacity,transform] duration-500 ease-out ${
          formAberto
            ? "grid-rows-[1fr] opacity-100"
            : "pointer-events-none grid-rows-[0fr] -translate-y-3 opacity-0"
        }`}
      >
        <div className="min-h-0 overflow-hidden origin-top transition-transform duration-500 ease-out">
          <NovoEncontristaForm />
        </div>
      </div>
      <TabelaPlaceholder encontristas={encontristasFiltrados} />
    </>
  );
}