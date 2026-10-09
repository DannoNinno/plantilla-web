import type {PlanDemo} from '../../../../demo/planes';
import type {PlanBoveda} from '../../boveda/registro';
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
}

export default function HerramientasDemo({
  etiqueta,
  selector,
  portal,
  cotizacion,
  planes,
  actual,
}: HerramientasDemoProps) {
  return (
    <div className="z-40 flex shrink-0 justify-center bg-seccion-fondo px-3 py-2">
      <nav
        aria-label={etiqueta}
        className="inline-flex max-w-full items-center gap-2 rounded-2xl border border-brand-ink/10 bg-white p-2 shadow-lg"
      >
        <div className="flex min-w-0 gap-1">
          <AccionHerramienta {...cotizacion} icono={FileText} familia="marca" />
          <AccionHerramienta {...portal} icono={House} familia="marca" />
        </div>
        <SelectorPlan planes={planes} actual={actual} etiqueta={selector} />
      </nav>
    </div>
  );
}
