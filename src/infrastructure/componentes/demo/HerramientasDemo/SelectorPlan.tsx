import type {PlanDemo} from '../../../../demo/planes';
import type {PlanBoveda} from '../../boveda/registro';
import {PanelsTopLeft, Target} from 'lucide-react';
import type {LucideIcon} from 'lucide-react';
import AccionHerramienta from './AccionHerramienta';

const iconosPlan: Record<PlanBoveda, LucideIcon> = {
  presencia: PanelsTopLeft,
  captacion: Target,
};

export interface SelectorPlanProps {
  planes: PlanDemo[];
  actual?: PlanBoveda;
  etiqueta: string;
}

export default function SelectorPlan({planes, actual, etiqueta}: SelectorPlanProps) {
  return (
    <div
      role="group"
      aria-label={etiqueta}
      className="flex min-w-0 gap-1 border-l border-brand-ink/15 pl-2"
    >
      {planes.map((plan) => (
        <AccionHerramienta
          key={plan.id}
          href={plan.href}
          texto={plan.nombre}
          textoCorto={plan.textoCorto}
          icono={iconosPlan[plan.id]}
          familia="plan"
          actual={actual === plan.id}
        />
      ))}
    </div>
  );
}
