'use client';

import {useCallback, useEffect, useId, useRef, useState} from 'react';
import type {ReactNode} from 'react';
import {ArrowLeft, ArrowRight} from 'lucide-react';
import type {CatalogoServicios} from '../../../domain/types/catalogo';
import {clasesBoton} from '../Boton/estilos';

interface CarruselComparacionProps {
  textos: CatalogoServicios['comparacion'];
  children: ReactNode;
}

export default function CarruselComparacion({textos, children}: CarruselComparacionProps) {
  const id = useId();
  const ref = useRef<HTMLDivElement>(null);
  const [limites, setLimites] = useState({anterior: false, siguiente: false});
  const actualizar = useCallback(() => {
    const elemento = ref.current;
    if (!elemento) return;
    setLimites({
      anterior: elemento.scrollLeft > 1,
      siguiente: elemento.scrollLeft + elemento.clientWidth < elemento.scrollWidth - 1,
    });
  }, []);

  useEffect(() => {
    actualizar();
    const elemento = ref.current;
    if (!elemento) return;
    const observer = new ResizeObserver(actualizar);
    observer.observe(elemento);
    if (elemento.firstElementChild) observer.observe(elemento.firstElementChild);
    return () => observer.disconnect();
  }, [actualizar]);

  function desplazar(direccion: number) {
    const elemento = ref.current;
    const columna = elemento?.querySelector('thead th:nth-child(2)');
    if (!elemento || !columna) return;
    elemento.scrollBy({left: direccion * columna.getBoundingClientRect().width, behavior: 'auto'});
  }

  return (
    <div className="mt-8 min-w-0">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
        <p id={`${id}-ayuda`} className="text-sm text-brand-ink/70">
          {textos.ayudaCarrusel}
        </p>
        <div className="flex gap-3">
          <button
            type="button"
            aria-controls={id}
            aria-label={textos.anterior}
            disabled={!limites.anterior}
            onClick={() => desplazar(-1)}
            className={clasesBoton('borde')}
          >
            <ArrowLeft size={20} aria-hidden="true" />
          </button>
          <button
            type="button"
            aria-controls={id}
            aria-label={textos.siguiente}
            disabled={!limites.siguiente}
            onClick={() => desplazar(1)}
            className={clasesBoton('borde')}
          >
            <ArrowRight size={20} aria-hidden="true" />
          </button>
        </div>
      </div>
      <div
        id={id}
        ref={ref}
        role="region"
        aria-label={textos.titulo}
        aria-describedby={`${id}-ayuda`}
        tabIndex={0}
        onScroll={actualizar}
        className="overflow-x-auto rounded-2xl border border-brand-ink/10 motion-safe:scroll-smooth focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-sky-text"
      >
        {children}
      </div>
    </div>
  );
}
