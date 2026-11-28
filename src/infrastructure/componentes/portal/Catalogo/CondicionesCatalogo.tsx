import {ChevronDown} from 'lucide-react';
import type {CatalogoServicios} from '@/domain/types/catalogo';
import AlcanceCatalogo from './AlcanceCatalogo';

export interface CondicionesCatalogoProps {
  catalogo: CatalogoServicios;
}

export default function CondicionesCatalogo({catalogo}: CondicionesCatalogoProps) {
  return (
    <details
      id="condiciones"
      className="group mt-10 scroll-mt-28 rounded-2xl border border-brand-ink/15 bg-white px-6 sm:px-8"
    >
      <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-4 rounded py-4 text-lg font-bold [&::-webkit-details-marker]:hidden">
        {catalogo.textos.alcance}
        <ChevronDown size={20} className="shrink-0 group-open:rotate-180" aria-hidden="true" />
      </summary>
      <AlcanceCatalogo condiciones={catalogo.alcance.condiciones} />
    </details>
  );
}
