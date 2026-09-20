import { Users, CheckCircle2, Clock, Car } from "lucide-react";
import { StatCard } from "./stat-card";

type StatsGridProps = {
  encontristas: number;
  confirmados: number;
  fila: number;
  carros: number;
};

export function StatsGrid({ encontristas, confirmados, fila, carros }: StatsGridProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatCard titulo="Encontristas" valor={encontristas} descricao="no encontro atual" icone={Users} />
      <StatCard titulo="Confirmados" valor={confirmados} descricao="prontos para busca" icone={CheckCircle2} />
      <StatCard titulo="Na fila" valor={fila} descricao="aguardando vaga" icone={Clock} />
      <StatCard titulo="Pais de carro" valor={carros} descricao="com origem cadastrada" icone={Car} />
    </div>
  );
}