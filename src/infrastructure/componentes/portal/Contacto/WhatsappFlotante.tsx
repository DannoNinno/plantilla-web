'use client';

import {useEffect, useRef, useState} from 'react';
import {usePathname} from 'next/navigation';
import Whatsapp from '../../boveda/Secciones/Whatsapp/Whatsapp';
import type {WhatsappProps} from '../../boveda/Secciones/Whatsapp/tipos';

const CONTROLES =
  'main a, main button, main input, main select, main textarea, main summary, footer a';

/** Oculta el botón mientras quedaría encima de un enlace, botón o campo. */
export default function WhatsappFlotante({texto, href}: Pick<WhatsappProps, 'texto' | 'href'>) {
  const contenedor = useRef<HTMLDivElement>(null);
  const [tapa, setTapa] = useState(false);
  const ruta = usePathname();

  useEffect(() => {
    let cuadro = 0;
    function revisar() {
      cuadro = 0;
      const boton = contenedor.current?.querySelector('a')?.getBoundingClientRect();
      if (!boton) return;
      setTapa(
        Array.from(document.querySelectorAll(CONTROLES)).some((control) => {
          if (control.closest('[inert]')) return false;
          const area = control.getBoundingClientRect();
          return (
            area.width > 0 &&
            area.left < boton.right &&
            area.right > boton.left &&
            area.top < boton.bottom &&
            area.bottom > boton.top
          );
        }),
      );
    }
    function programar() {
      if (!cuadro) cuadro = requestAnimationFrame(revisar);
    }
    const eventos = ['scroll', 'resize', 'transitionend', 'animationend', 'toggle'];
    for (const evento of eventos) window.addEventListener(evento, programar, true);
    const observador = new ResizeObserver(programar);
    observador.observe(document.body);
    programar();
    return () => {
      cancelAnimationFrame(cuadro);
      observador.disconnect();
      for (const evento of eventos) window.removeEventListener(evento, programar, true);
    };
  }, [ruta]);

  return (
    <div ref={contenedor} className={tapa ? 'invisible' : undefined}>
      <Whatsapp texto={texto} href={href} posicion="esquina" />
    </div>
  );
}
