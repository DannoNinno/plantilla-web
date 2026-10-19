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
  comparacion: CatalogoServicios['comparacion'];
}

export default function TarjetaPlan({paquete, numero, textos, comparacion}: TarjetaPlanProps) {
  const datos = paquete.comparacion;
  if (paquete.habilitado && !datos) {
    throw new Error(`El plan no tiene una comparacion habilitada: ${paquete.id}`);
  }

  return (
    <article
      aria-disabled={!paquete.habilitado || undefined}
      className={`grid h-full min-w-0 content-start gap-8 rounded-2xl border border-brand-ink/10 bg-white p-6 sm:p-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-12${paquete.habilitado ? '' : ' opacity-60'}`}
    >
      <div className="min-w-0">
        <span className="text-xs font-semibold uppercase tracking-widest text-brand-sky-text">
          {textos.plan} {numero}
        </span>
        <h3 className="mt-4 break-words text-3xl font-bold sm:text-4xl">{paquete.nombre}</h3>
        {paquete.habilitado ? (
          <p className="mt-4 text-2xl font-semibold text-brand-sky-text">
            {precioDesdeCLP(paquete.precioDesde)}
          </p>
        ) : (
          <p className="mt-4 flex items-center gap-2 text-xl font-semibold text-brand-ink/65">
            <LockKeyhole size={18} aria-hidden="true" />
            {textos.proximamente}
          </p>
        )}
        <p className="mt-4 leading-relaxed text-brand-ink/70">{paquete.resumen}</p>
        {paquete.habilitado && (
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Link
              href={`/contacto?paquete=${paquete.id}`}
              aria-label={`${textos.cotizarPlan}: ${paquete.nombre}`}
              className={clasesBoton('coral')}
            >
              {textos.cotizarPlan} <ArrowUpRight size={18} aria-hidden="true" />
            </Link>
            <Link
              href={`/catalogo/${paquete.id}`}
              aria-label={`${textos.detalle} ${paquete.nombre}`}
              className={clasesBoton('borde')}
            >
              {textos.verDetalles}
            </Link>
          </div>
        )}
      </div>
      {paquete.habilitado && datos && (
        <dl className="grid content-start gap-5 border-t border-brand-ink/10 pt-6 text-sm sm:grid-cols-2 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
          <div>
            <dt className="font-semibold">{comparacion.secciones}</dt>
            <dd className="mt-2 leading-relaxed text-brand-ink/70">
              {comparacion.cantidadSecciones.replace('{cantidad}', String(datos.seccionesMaximas))}
            </dd>
          </div>
          <div>
            <dt className="font-semibold">{comparacion.panelAdministracion}</dt>
            <dd className="mt-2 leading-relaxed text-brand-ink/70">
              {datos.panelAdministracion ? comparacion.panelIncluido : comparacion.panelNoIncluido}
            </dd>
          </div>
          <div>
            <dt className="font-semibold">{comparacion.plazoEntrega}</dt>
            <dd className="mt-2 leading-relaxed text-brand-ink/70">{datos.plazoEntrega}</dd>
          </div>
          <div>
            <dt className="font-semibold">{comparacion.capacitacion}</dt>
            <dd className="mt-2 leading-relaxed text-brand-ink/70">{datos.capacitacion}</dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="font-semibold">{comparacion.reuniones}</dt>
            <dd className="mt-2 text-brand-ink/70">
              <ul className="grid list-disc gap-x-6 gap-y-2 pl-4 leading-relaxed sm:grid-cols-2">
                {datos.reunionesIncluidas.map((reunion) => (
                  <li key={reunion}>{reunion}</li>
                ))}
              </ul>
            </dd>
          </div>
        </dl>
      )}
    </article>
  );
}
