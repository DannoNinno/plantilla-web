'use client';

import {useId, useState} from 'react';
import type {KeyboardEvent, ReactNode} from 'react';
import {ArrowLeft, ArrowRight} from 'lucide-react';
import type {CatalogoServicios} from '../../../domain/types/catalogo';
import {clasesBoton} from '../Boton/estilos';

interface CarruselPlanesProps {
  planes: {id: string; nombre: string; contenido: ReactNode}[];
  textos: CatalogoServicios['comparacion'];
}

export default function CarruselPlanes({planes, textos}: CarruselPlanesProps) {
  const id = useId();
  const [actual, setActual] = useState(0);
  if (planes.length === 0) throw new Error('El carrusel necesita al menos un plan.');

  const posicion = textos.posicion
    .replace('{actual}', String(actual + 1))
    .replace('{total}', String(planes.length));

  function navegar(event: KeyboardEvent<HTMLDivElement>) {
    if (event.target !== event.currentTarget) return;
    switch (event.key) {
      case 'ArrowLeft':
        setActual((indice) => Math.max(0, indice - 1));
        break;
      case 'ArrowRight':
        setActual((indice) => Math.min(planes.length - 1, indice + 1));
        break;
      case 'Home':
        setActual(0);
        break;
      case 'End':
        setActual(planes.length - 1);
        break;
      default:
        return;
    }
    event.preventDefault();
  }

  return (
    <div
      role="region"
      aria-roledescription={textos.carrusel}
      aria-label={textos.titulo}
      aria-describedby={`${id}-ayuda`}
      tabIndex={0}
      onKeyDown={navegar}
      className="mt-6 min-w-0 rounded-2xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-sky-text"
    >
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <p id={`${id}-ayuda`} className="max-w-xl text-sm text-brand-ink/70">
          {textos.ayudaCarrusel}
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            aria-controls={id}
            aria-label={textos.anterior}
            disabled={actual === 0}
            onClick={() => setActual(actual - 1)}
            className={clasesBoton('borde', 'px-3')}
          >
            <ArrowLeft size={20} aria-hidden="true" />
          </button>
          <button
            type="button"
            aria-controls={id}
            aria-label={textos.siguiente}
            disabled={actual === planes.length - 1}
            onClick={() => setActual(actual + 1)}
            className={clasesBoton('borde', 'px-3')}
          >
            <ArrowRight size={20} aria-hidden="true" />
          </button>
        </div>
      </div>
      <div id={id} className="min-w-0">
        {planes.map((plan, indice) => (
          <div
            key={plan.id}
            id={`${id}-${plan.id}`}
            role="group"
            aria-roledescription={textos.diapositiva}
            aria-label={plan.nombre}
            hidden={indice !== actual}
            className="min-w-0"
          >
            {plan.contenido}
          </div>
        ))}
      </div>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <p aria-live="polite" aria-atomic="true" className="text-sm text-brand-ink/70">
          {posicion}
        </p>
        <div className="flex flex-wrap gap-2">
          {planes.map((plan, indice) => (
            <button
              key={plan.id}
              type="button"
              aria-label={textos.irAlPlan
                .replace('{numero}', String(indice + 1))
                .replace('{nombre}', plan.nombre)}
              aria-controls={`${id}-${plan.id}`}
              aria-current={indice === actual ? 'true' : undefined}
              onClick={() => setActual(indice)}
              className={clasesBoton(indice === actual ? 'ink' : 'borde', 'min-w-12 px-3')}
            >
              {String(indice + 1).padStart(2, '0')}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
