import Link from 'next/link';
import {ArrowUpRight, LockKeyhole} from 'lucide-react';
import type {Paquete} from '../../../domain/types/paquete';
import type {CatalogoServicios} from '../../../domain/types/catalogo';
import {precioDesdeCLP} from '../../../domain/servicios/precio';
import {clasesBoton} from '../Boton/estilos';

interface TarjetaPlanProps {
  paquete: Paquete;
  numero: number;
  textos: CatalogoServicios['tarjetasPlan'];
}

export default function TarjetaPlan({paquete, numero, textos}: TarjetaPlanProps) {
  return (
    <article
      aria-disabled={!paquete.habilitado || undefined}
      className={`flex flex-col rounded-2xl border border-brand-ink/10 bg-white p-6 sm:p-8 ${
        paquete.habilitado ? '' : 'opacity-50'
      }`}
    >
      <span className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-sky-text">
        {textos.etiqueta} {numero}
      </span>
      <h3 className="mt-5 text-2xl font-bold">{paquete.nombre}</h3>
      {paquete.habilitado && (
        <p className="mt-3 text-xl font-semibold text-brand-sky-text">
          {precioDesdeCLP(paquete.precioDesde)}
        </p>
      )}
      <p className="mt-4 flex-1 leading-relaxed text-brand-ink/70">{paquete.resumen}</p>
      {paquete.habilitado ? (
        <Link href={`/catalogo/${paquete.id}`} className={clasesBoton('ink', 'mt-6')}>
          {textos.verDetalle} {paquete.nombre} <ArrowUpRight size={18} aria-hidden="true" />
        </Link>
      ) : (
        <span className="mt-6 inline-flex items-center gap-2 font-semibold">
          <LockKeyhole size={18} aria-hidden="true" />
          {textos.proximamente}
        </span>
      )}
    </article>
  );
}
