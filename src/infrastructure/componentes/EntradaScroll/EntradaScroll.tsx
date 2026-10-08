'use client';

import {useEffect, useRef} from 'react';
import type {ComponentPropsWithoutRef} from 'react';

export default function EntradaScroll(props: ComponentPropsWithoutRef<'section'>) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const bloque = ref.current;
    const movimientoReducido = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (!bloque || movimientoReducido.matches || !('IntersectionObserver' in window)) return;

    // Si el bloque supera cinco pantallas, se revela al llenar la ventana.
    const umbral = () => Math.min(0.2, window.innerHeight / bloque.offsetHeight);
    let observer: IntersectionObserver;
    const mostrar = () => {
      bloque.classList.add('entrada-visible');
      observer.disconnect();
    };
    const observar = () => {
      observer?.disconnect();
      observer = new IntersectionObserver(
        (entradas) => {
          if (
            entradas.some(
              (entrada) => entrada.isIntersecting && entrada.intersectionRatio >= umbral(),
            )
          ) {
            mostrar();
          }
        },
        {threshold: umbral()},
      );
      if (!bloque.classList.contains('entrada-visible')) observer.observe(bloque);
    };

    observar();
    bloque.classList.add('entrada-preparada');
    bloque.addEventListener('focusin', mostrar);
    movimientoReducido.addEventListener('change', mostrar);
    window.addEventListener('resize', observar);

    return () => {
      observer.disconnect();
      bloque.removeEventListener('focusin', mostrar);
      movimientoReducido.removeEventListener('change', mostrar);
      window.removeEventListener('resize', observar);
      bloque.classList.remove('entrada-preparada', 'entrada-visible');
    };
  }, []);

  return <section {...props} ref={ref} data-entrada />;
}
