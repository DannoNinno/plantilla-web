import type {PlanDemo} from '../../../../demo/planes';
import type {PlanBoveda} from '../../boveda/registro';
import type {ReactNode} from 'react';
import {FileText, House} from 'lucide-react';
import AccionHerramienta from './AccionHerramienta';
import SelectorPlan from './SelectorPlan';

export interface HerramientasDemoProps {
  etiqueta: string;
  selector: string;
  portal: {texto: string; textoCorto?: string; href: string};
  cotizacion: {texto: string; textoCorto?: string; href: string};
  planes: PlanDemo[];
  actual: PlanBoveda;
  control?: ReactNode;
}

export default function HerramientasDemo({
  etiqueta,
  selector,
  portal,
  cotizacion,
  planes,
  actual,
  control,
}: HerramientasDemoProps) {
  return (
    <div className="flex justify-center px-3 py-2">
      <nav
        aria-label={etiqueta}
        className="pointer-events-auto inline-flex max-w-full items-center gap-2 rounded-2xl border border-brand-light/15 bg-brand-ink p-2 shadow-lg"
      >
        <div className="flex min-w-0 gap-1">
          <AccionHerramienta
            {...cotizacion}
            icono={FileText}
            familia="marca"
            compacta={Boolean(control)}
          />
          <AccionHerramienta
            {...portal}
            icono={House}
            familia="marca"
            compacta={Boolean(control)}
          />
        </div>
        <SelectorPlan
          planes={planes}
          actual={actual}
          etiqueta={selector}
          compacta={Boolean(control)}
        />
        {control}
      </nav>
    </div>
  );
}
