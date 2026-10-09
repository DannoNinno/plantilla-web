'use client';

import {useRef} from 'react';
import type {FocusEvent} from 'react';

export default function useEnfoqueDemo() {
  const superior = useRef<HTMLDivElement>(null);
  const inferior = useRef<HTMLDivElement>(null);

  function enfocar(evento: FocusEvent<HTMLDivElement>) {
    const campo = evento.target;
    const contenido = evento.currentTarget;
    requestAnimationFrame(() => {
      if (document.activeElement !== campo) return;
      const limites = contenido.getBoundingClientRect();
      const arriba = superior.current?.getBoundingClientRect().bottom ?? limites.top;
      const abajo = inferior.current?.getBoundingClientRect().top ?? limites.bottom;
      const posicion = campo.getBoundingClientRect();
      if (posicion.top >= arriba && posicion.bottom <= abajo) return;
      contenido.scrollBy({
        top: (posicion.top + posicion.bottom - arriba - abajo) / 2,
        behavior: 'instant',
      });
    });
  }

  return {superior, inferior, enfocar};
}
