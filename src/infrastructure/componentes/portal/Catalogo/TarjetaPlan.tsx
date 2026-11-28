import Link from 'next/link';
import {ArrowUpRight, Check, LockKeyhole} from 'lucide-react';
import type {Paquete} from '@/domain/types/paquete';
import type {CatalogoServicios} from '@/domain/types/catalogo';
import PrecioPlan from './PrecioPlan';
import {clasesBoton} from '../../boveda/Base/Boton/estilos';

export interface TarjetaPlanProps {
  paquete: Paquete;
  textos: CatalogoServicios['textos'];
}

export default function TarjetaPlan({paquete, textos}: TarjetaPlanProps) {
  if (paquete.habilitado && !paquete.puntos?.length) {
    throw new Error(`El plan habilitado no tiene puntos clave: ${paquete.id}`);
  }

  return (
    <article
      aria-disabled={!paquete.habilitado || undefined}
      className={`flex h-full min-w-0 flex-col rounded-2xl ${
        paquete.habilitado
          ? 'bg-white shadow-[0_16px_40px_-16px_rgba(4,24,47,0.4)]'
          : 'bg-brand-plan-disabled text-brand-ink/70 shadow-none'
      } p-5 sm:p-6`}
    >
      <h3 className="break-words text-2xl font-bold">{paquete.nombre}</h3>
      <p className="mt-2 leading-relaxed text-brand-ink/70">{paquete.resumen}</p>
      {!paquete.habilitado && (
        <p className="mt-4 flex w-fit items-center gap-2 rounded-lg bg-brand-ink/10 px-3 py-2 text-sm font-semibold text-brand-ink/75">
          <LockKeyhole size={18} aria-hidden="true" />
          {textos.proximamente}
        </p>
      )}
      {paquete.habilitado && (
        <>
          <PrecioPlan paquete={paquete} textos={textos} className="mt-4" />
          <ul className="mt-5 space-y-2 border-t border-brand-ink/10 pt-5 text-sm leading-relaxed">
            {paquete.puntos?.map((punto) => (
              <li key={punto} className="flex gap-2">
                <Check
                  size={18}
                  className="mt-0.5 shrink-0 text-brand-sky-text"
                  aria-hidden="true"
                />
                {punto}
              </li>
            ))}
          </ul>
          <div className="mt-auto flex flex-col items-center gap-2 pt-6">
            <Link
              href={`/contacto?paquete=${paquete.id}`}
              aria-label={`${textos.cotizarPlan}: ${paquete.nombre}`}
              className={clasesBoton('coral', 'w-full')}
            >
              {textos.cotizarPlan} <ArrowUpRight size={18} aria-hidden="true" />
            </Link>
            <Link
              href={`/catalogo/${paquete.id}`}
              aria-label={`${textos.detalle} ${paquete.nombre}`}
              className="inline-flex min-h-12 items-center rounded text-sm font-semibold text-brand-sky-text underline underline-offset-4"
            >
              {textos.verDetalles}
            </Link>
          </div>
        </>
      )}
    </article>
  );
}
