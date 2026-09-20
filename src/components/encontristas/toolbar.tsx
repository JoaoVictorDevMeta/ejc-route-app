"use client";

import { Search, Filter, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function Toolbar({
  formAberto,
  onNovoEncontrista,
}: {
  formAberto: boolean;
  onNovoEncontrista: () => void;
}) {
  return (
    <div className="rounded-xl border border-primary/10 bg-card p-4 shadow-sm transition-shadow hover:shadow-md md:p-5">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <div className="flex flex-1 flex-wrap items-center gap-2">
        <div className="relative w-full max-w-xs">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Buscar por nome ou endereço..." className="h-10 pl-9 text-sm" />
        </div>

        <Select>
          <SelectTrigger className="h-10 w-37.5">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos</SelectItem>
            <SelectItem value="confirmado">Confirmado</SelectItem>
            <SelectItem value="fila">Fila</SelectItem>
            <SelectItem value="desistiu">Desistiu</SelectItem>
          </SelectContent>
        </Select>

        <Select>
          <SelectTrigger className="h-10 w-37.5">
            <SelectValue placeholder="Prioridade" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todas">Todas</SelectItem>
            <SelectItem value="alta">Alta</SelectItem>
            <SelectItem value="media">Média</SelectItem>
            <SelectItem value="baixa">Baixa</SelectItem>
          </SelectContent>
        </Select>

        <Button variant="outline" size="icon" aria-label="Filtros avançados">
          <Filter className="h-4 w-4" />
        </Button>
      </div>

      <Button className="h-10" onClick={onNovoEncontrista} aria-expanded={formAberto}>
        <Plus className="mr-2 h-4 w-4" />
        {formAberto ? "Fechar cadastro" : "Novo encontrista"}
      </Button>
      </div>
    </div>
  );
}