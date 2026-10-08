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
    let navegando = false;
    const mostrar = () => {
      navegando = false;
      bloque.classList.add('entrada-visible');
      observer.disconnect();
    };
    const prepararNavegacion = () => {
      navegando = true;
      observer.disconnect();
      bloque.classList.remove('entrada-visible');
    };
    const observar = () => {
      if (bloque.classList.contains('entrada-visible')) return;
      observer?.disconnect();
      const threshold = umbral();
      observer = new IntersectionObserver(
        (entradas) => {
          if (
            !navegando &&
            entradas.some(
              (entrada) => entrada.isIntersecting && entrada.intersectionRatio >= threshold,
            )
          ) {
            mostrar();
          }
        },
        {threshold},
      );
      observer.observe(bloque);
    };

    observar();
    bloque.classList.add('entrada-preparada');
    bloque.addEventListener('focusin', mostrar);
    bloque.addEventListener('entrada-navegacion-inicio', prepararNavegacion);
    bloque.addEventListener('entrada-navegacion-fin', mostrar);
    movimientoReducido.addEventListener('change', mostrar);
    window.addEventListener('resize', observar);

    return () => {
      observer.disconnect();
      bloque.removeEventListener('focusin', mostrar);
      bloque.removeEventListener('entrada-navegacion-inicio', prepararNavegacion);
      bloque.removeEventListener('entrada-navegacion-fin', mostrar);
      movimientoReducido.removeEventListener('change', mostrar);
      window.removeEventListener('resize', observar);
      bloque.classList.remove('entrada-preparada', 'entrada-visible');
    };
  }, []);

  return <section {...props} ref={ref} tabIndex={props.tabIndex ?? -1} data-entrada />;
}
