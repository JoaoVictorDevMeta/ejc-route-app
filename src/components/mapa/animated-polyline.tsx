"use client";

import { useEffect, useRef } from "react";
import { Polyline } from "react-leaflet";
import type { LatLngExpression, Polyline as LeafletPolyline } from "leaflet";

type Props = {
  positions: LatLngExpression[];
  color: string;
  weight?: number;
  /** Atraso em ms antes de começar a animação (para efeito escalonado). */
  delay?: number;
  /** Duração da animação em ms. */
  duration?: number;
  animate?: boolean;
};

function animarPath(
  line: LeafletPolyline | null,
  delay: number,
  duration: number,
  ativo: boolean
) {
  if (!line) return;
  const path = line.getElement() as SVGPathElement | null;
  if (!path) return;

  // Reset
  path.style.transition = "none";
  path.style.strokeDasharray = "";
  path.style.strokeDashoffset = "";

  if (!ativo) return;

  const length = path.getTotalLength();
  if (!length) return;

  path.style.strokeDasharray = `${length}`;
  path.style.strokeDashoffset = `${length}`;

  // Force reflow para o reset pegar antes da animação
  void path.getBoundingClientRect();

  window.setTimeout(() => {
    path.style.transition = `stroke-dashoffset ${duration}ms cubic-bezier(0.22, 1, 0.36, 1)`;
    path.style.strokeDashoffset = "0";
  }, delay);
}

export function AnimatedPolyline({
  positions,
  color,
  weight = 5,
  delay = 0,
  duration = 1400,
  animate = true,
}: Props) {
  const glowRef = useRef<LeafletPolyline | null>(null);
  const mainRef = useRef<LeafletPolyline | null>(null);

  useEffect(() => {
    const habilitar = animate && positions.length > 1;
    animarPath(glowRef.current, delay, duration, habilitar);
    animarPath(mainRef.current, delay, duration, habilitar);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [positions, animate, delay, duration]);

  return (
    <>
      {/* Halo suave por baixo */}
      <Polyline
        ref={glowRef}
        positions={positions}
        pathOptions={{
          color,
          weight: weight + 10,
          opacity: 0.18,
          lineCap: "round",
          lineJoin: "round",
        }}
      />
      {/* Linha principal */}
      <Polyline
        ref={mainRef}
        positions={positions}
        pathOptions={{
          color,
          weight,
          opacity: 0.95,
          lineCap: "round",
          lineJoin: "round",
        }}
      />
    </>
  );
}