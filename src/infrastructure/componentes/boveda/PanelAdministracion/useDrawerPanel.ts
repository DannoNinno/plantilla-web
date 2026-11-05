'use client';

import {useEffect, useRef, useState, useSyncExternalStore} from 'react';

function suscribir(cambio: () => void) {
  const consulta = window.matchMedia('(max-width: 1023px)');
  consulta.addEventListener('change', cambio);
  return () => consulta.removeEventListener('change', cambio);
}

export function useDrawerPanel(modalEnEscritorio = false) {
  const [abierto, setAbierto] = useState(false);
  const panelRef = useRef<HTMLElement>(null);
  const movil = useSyncExternalStore(
    suscribir,
    () => window.matchMedia('(max-width: 1023px)').matches,
    () => false,
  );
  const modal = movil || modalEnEscritorio;
  useEffect(() => {
    if (!abierto) return;
    const anterior = document.activeElement;
    const overflow = document.body.style.overflow;
    if (modal) {
      document.body.style.overflow = 'hidden';
      panelRef.current?.querySelector<HTMLElement>('button, a[href]')?.focus();
    }
    function teclado(evento: KeyboardEvent) {
      if (evento.key === 'Escape') {
        evento.preventDefault();
        setAbierto(false);
      }
      if (!modal || evento.key !== 'Tab') return;
      const elementos = Array.from(
        panelRef.current?.querySelectorAll<HTMLElement>(
          'button:not([disabled]), a[href], [tabindex="0"]',
        ) ?? [],
      );
      const primero = elementos[0];
      const ultimo = elementos.at(-1);
      if (evento.shiftKey && document.activeElement === primero) {
        evento.preventDefault();
        ultimo?.focus();
      } else if (!evento.shiftKey && document.activeElement === ultimo) {
        evento.preventDefault();
        primero?.focus();
      }
    }
    document.addEventListener('keydown', teclado);
    return () => {
      document.body.style.overflow = overflow;
      document.removeEventListener('keydown', teclado);
      if (anterior instanceof HTMLElement && anterior.isConnected) anterior.focus();
    };
  }, [abierto, modal]);
  return {abierto, setAbierto, movil, modal, panelRef};
}
