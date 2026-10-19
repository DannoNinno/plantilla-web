import {useId} from 'react';
import type {ComponenteVitrina, TextosTarjetaComponente} from '../../../domain/types/componentes';
import {iconos} from './iconos';

interface TarjetaComponenteProps {
  componente: ComponenteVitrina;
  incluido?: boolean;
  nombrePlanMinimo?: string;
  textos: TextosTarjetaComponente;
}

export default function TarjetaComponente({
  componente,
  incluido = true,
  nombrePlanMinimo,
  textos,
}: TarjetaComponenteProps) {
  const tituloId = useId();
  const Icono = iconos[componente.icono];
  const etiqueta = nombrePlanMinimo
    ? (incluido ? textos.incluidoEn : textos.disponibleDesde).replace('{plan}', nombrePlanMinimo)
    : incluido
      ? textos.incluidoSinPlan
      : textos.disponibleSinPlan;

  return (
    <article
      aria-labelledby={tituloId}
      className={`min-w-0 rounded-2xl border p-6 ${
        componente.destacado
          ? 'border-brand-sky-text/40 bg-brand-sky/10 md:col-span-2'
          : 'border-brand-ink/10 bg-white'
      } ${incluido ? '' : 'opacity-60'}`}
    >
      <span className="inline-flex rounded-xl bg-brand-sky/15 p-3 text-brand-sky-text">
        <Icono size={24} aria-hidden="true" />
      </span>
      {componente.destacado && (
        <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-brand-sky-text">
          {textos.componenteClave}
        </p>
      )}
      <h3 id={tituloId} className="mt-4 text-xl font-bold">
        {componente.nombre}
      </h3>
      <p className="mt-3 leading-relaxed text-brand-ink/70">{componente.descripcion}</p>
      <p className="mt-4 text-sm font-semibold text-brand-sky-text">{etiqueta}</p>
    </article>
  );
}
