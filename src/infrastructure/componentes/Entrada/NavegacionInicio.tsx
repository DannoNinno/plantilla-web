'use client';

import {useEffect, useRef} from 'react';
import type {MouseEvent, ReactNode} from 'react';
import {ArrowDown} from 'lucide-react';
import {clasesBoton} from '../Boton/estilos';

const siguientes = [
  {id: 'por-que-conmigo', titulo: 'Por qué conmigo'},
  {id: 'como-trabajo', titulo: 'Cómo trabajo'},
  {id: 'entradas', titulo: 'Catálogo / Perfil'},
];

let cancelarActual: (() => void) | undefined;

export function EnlaceSeccion({
  destino,
  children,
  className,
  etiqueta,
}: {
  destino: string;
  children: ReactNode;
  className: string;
  etiqueta?: string;
}) {
  const cancelar = useRef<(() => void) | undefined>(undefined);

  useEffect(() => () => cancelar.current?.(), []);

  function navegar(evento: MouseEvent<HTMLAnchorElement>) {
    if (
      evento.button !== 0 ||
      evento.metaKey ||
      evento.ctrlKey ||
      evento.shiftKey ||
      evento.altKey ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    )
      return;

    const bloque = document.getElementById(destino);
    if (!bloque) throw new Error(`No existe la sección de destino: ${destino}`);
    evento.preventDefault();
    cancelarActual?.();

    let posicion = 0;
    let elemento: HTMLElement | null = bloque;
    while (elemento) {
      posicion += elemento.offsetTop;
      elemento = elemento.offsetParent instanceof HTMLElement ? elemento.offsetParent : null;
    }
    const margen = parseFloat(getComputedStyle(bloque).scrollMarginTop) || 0;
    const destinoScroll = Math.max(
      0,
      Math.min(posicion - margen, document.documentElement.scrollHeight - window.innerHeight),
    );
    let frame = 0;
    let estable = 0;
    let terminado = false;
    const inicio = performance.now();

    const interrumpir = () => terminar(false);
    const teclado = (eventoTeclado: KeyboardEvent) => {
      if (
        ['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', ' ', 'Escape'].includes(
          eventoTeclado.key,
        )
      ) {
        interrumpir();
      }
    };
    function terminar(enfocar: boolean) {
      if (terminado) return;
      terminado = true;
      cancelAnimationFrame(frame);
      if (!enfocar) window.scrollTo({top: window.scrollY, behavior: 'instant'});
      window.removeEventListener('wheel', interrumpir);
      window.removeEventListener('touchstart', interrumpir);
      window.removeEventListener('pointerdown', interrumpir);
      window.removeEventListener('resize', interrumpir);
      window.removeEventListener('keydown', teclado);
      if (cancelarActual === interrumpir) cancelarActual = undefined;
      cancelar.current = undefined;
      bloque?.dispatchEvent(new Event('entrada-navegacion-fin'));
      if (enfocar) bloque?.focus({preventScroll: true});
    }
    function comprobar() {
      if (!bloque?.isConnected) {
        interrumpir();
        return;
      }
      estable = Math.abs(window.scrollY - destinoScroll) <= 1 ? estable + 1 : 0;
      if (estable >= 3) {
        terminar(true);
      } else if (performance.now() - inicio > 3000) {
        console.warn(`Se interrumpió el desplazamiento a la sección ${destino}.`);
        interrumpir();
      } else {
        frame = requestAnimationFrame(comprobar);
      }
    }

    cancelar.current = interrumpir;
    cancelarActual = interrumpir;
    window.addEventListener('wheel', interrumpir, {passive: true});
    window.addEventListener('touchstart', interrumpir, {passive: true});
    window.addEventListener('pointerdown', interrumpir, {passive: true});
    window.addEventListener('resize', interrumpir);
    window.addEventListener('keydown', teclado);
    bloque.dispatchEvent(new Event('entrada-navegacion-inicio'));
    if (window.location.hash !== `#${destino}`) {
      window.history.pushState(null, '', `#${destino}`);
    }
    window.scrollTo({top: destinoScroll, behavior: 'smooth'});
    frame = requestAnimationFrame(comprobar);
  }

  return (
    <a href={`#${destino}`} aria-label={etiqueta} className={className} onClick={navegar}>
      {children}
    </a>
  );
}

export default function NavegacionInicio({paso}: {paso: 0 | 1 | 2}) {
  const oscuro = paso === 1;
  const siguiente = siguientes[paso];

  return (
    <nav
      aria-label="Continuar por la portada"
      className="mx-auto mt-8 flex w-full max-w-6xl justify-end"
    >
      <EnlaceSeccion
        destino={siguiente.id}
        etiqueta={`Siguiente: ${siguiente.titulo}`}
        className={clasesBoton(oscuro ? 'bordeOscuro' : 'borde')}
      >
        Siguiente <ArrowDown size={18} aria-hidden="true" />
      </EnlaceSeccion>
    </nav>
  );
}
