"use client";

import { useState } from "react";
import { Toolbar } from "@/components/encontristas/toolbar";
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
};

export function EncontristasContent({ encontristas }: { encontristas: EncontristaRow[] }) {
  const [formAberto, setFormAberto] = useState(false);

  return (
    <>
      <Toolbar
        formAberto={formAberto}
        onNovoEncontrista={() => setFormAberto((aberto) => !aberto)}
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
      <TabelaPlaceholder encontristas={encontristas} />
    </>
  );
}
