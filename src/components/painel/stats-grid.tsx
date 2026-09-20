import { Users, CheckCircle2, Clock, Car } from "lucide-react";
import { StatCard } from "./stat-card";

// TODO: substituir por dados reais via props ou fetch
export function StatsGrid() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatCard titulo="Encontristas" valor="—" descricao="no encontro atual" icone={Users} />
      <StatCard titulo="Confirmados" valor="—" descricao="prontos para busca" icone={CheckCircle2} />
      <StatCard titulo="Na fila" valor="—" descricao="aguardando vaga" icone={Clock} />
      <StatCard titulo="Carros" valor="—" descricao="estimados" icone={Car} />
    </div>
  );
}