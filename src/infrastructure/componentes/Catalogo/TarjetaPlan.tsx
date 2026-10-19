import Link from 'next/link';
import {ArrowUpRight, LockKeyhole} from 'lucide-react';
import type {Paquete} from '@/domain/types/paquete';
import type {CatalogoServicios} from '@/domain/types/catalogo';
import {precioDesdeCLP} from '../../../domain/servicios/precio';
import {clasesBoton} from '../Boton/estilos';

export interface TarjetaPlanProps {
  paquete: Paquete;
  numero: number;
  textos: CatalogoServicios['textos'];
}

export default function TarjetaPlan({paquete, numero, textos}: TarjetaPlanProps) {
  return (
    <article
      aria-disabled={!paquete.habilitado || undefined}
      className={`flex min-w-0 flex-col rounded-2xl border border-brand-ink/10 bg-white p-6 sm:p-8${paquete.habilitado ? '' : ' opacity-50'}`}
    >
      <span className="text-xs font-semibold uppercase tracking-widest text-brand-sky-text">
        {textos.plan} {numero}
      </span>
      <h3 className="mt-5 break-words text-2xl font-bold">{paquete.nombre}</h3>
      {paquete.habilitado ? (
        <p className="mt-3 text-xl font-semibold text-brand-sky-text">
          {precioDesdeCLP(paquete.precioDesde)}
        </p>
      ) : (
        <p className="mt-3 flex items-center gap-2 text-xl font-semibold text-brand-ink/65">
          <LockKeyhole size={18} aria-hidden="true" />
          {textos.proximamente}
        </p>
      )}
      <p className="mt-4 flex-1 leading-relaxed text-brand-ink/70">{paquete.resumen}</p>
      {paquete.habilitado && (
        <Link href={`/catalogo/${paquete.id}`} className={clasesBoton('ink', 'mt-6')}>
          {textos.detalle} {paquete.nombre} <ArrowUpRight size={18} aria-hidden="true" />
        </Link>
      )}
    </article>
  );
}
