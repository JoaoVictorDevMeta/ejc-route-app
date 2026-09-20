"use client";

import { useEffect, useState } from "react";
import { Check, LoaderCircle } from "lucide-react";
import { cn } from "cn";

type ProcessLoadingProps = {
  steps: string[];
  active?: boolean;
};

export function ProcessLoading({ steps, active = true }: ProcessLoadingProps) {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    if (!active) return;
    const timer = window.setInterval(() => {
      setCurrentStep((step) => Math.min(step + 1, steps.length - 1));
    }, 1500);
    return () => window.clearInterval(timer);
  }, [active, steps.length]);

  if (!active) return null;

  const progress = steps.length > 1 ? (currentStep / (steps.length - 1)) * 100 : 100;

  return (
    <div className="animate-in fade-in slide-in-from-top-2 rounded-xl border border-primary/15 bg-primary/5 p-4 duration-300">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-sm font-semibold text-primary">
          <LoaderCircle className="h-4 w-4 animate-spin" />
          {steps[currentStep]}
        </div>
        <span className="text-xs text-muted-foreground">Etapa {currentStep + 1} de {steps.length}</span>
      </div>
      <div className="mb-3 h-1.5 overflow-hidden rounded-full bg-primary/10">
        <div className="h-full rounded-full bg-primary transition-[width] duration-700" style={{ width: `${progress}%` }} />
      </div>
      <div className="grid gap-2 sm:grid-cols-3">
        {steps.map((step, index) => (
          <div key={step} className={cn("flex items-center gap-1.5 text-xs transition-colors", index <= currentStep ? "text-primary" : "text-muted-foreground/60")}>
            {index < currentStep ? <Check className="h-3.5 w-3.5" /> : <span className={cn("flex h-4 w-4 items-center justify-center rounded-full border text-[10px]", index === currentStep && "border-primary bg-primary text-primary-foreground")}>{index + 1}</span>}
            <span>{step}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
