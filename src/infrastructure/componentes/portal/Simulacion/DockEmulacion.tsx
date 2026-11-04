'use client';

import {useEffect, useState} from 'react';
import Link from 'next/link';
import {ArrowLeft, Copy} from 'lucide-react';
import {copiarJSON, urlSimulacion} from '@/infrastructure/handlers/simulacion';
import type {ConfigSimulacion} from '@/infrastructure/handlers/simulacion';

export default function DockEmulacion({config}: {config: ConfigSimulacion}) {
  const [estado, setEstado] = useState('');
  useEffect(() => {
    if (estado !== 'Copiado') return;
    const timer = window.setTimeout(() => setEstado(''), 2500);
    return () => window.clearTimeout(timer);
  }, [estado]);
  const clase =
    'flex min-h-12 min-w-0 items-center justify-center gap-2 px-3 text-xs font-bold focus-visible:outline-brand-coral sm:text-sm';
  return (
    <div className="fixed bottom-3 left-1/2 z-50 w-max max-w-[calc(100vw-1.5rem)] -translate-x-1/2 border border-brand-sky bg-brand-ink p-2 text-brand-light shadow-xl">
      {estado && (
        <p role={estado === 'Copiado' ? 'status' : 'alert'} className="max-w-sm px-2 pb-2 text-sm">
          {estado}
        </p>
      )}
      <nav aria-label="Acciones de emulación" className="flex items-center gap-1">
        <button
          type="button"
          className={`${clase} bg-brand-sky text-brand-ink`}
          onClick={async () => {
            const resultado = await copiarJSON(config);
            setEstado(resultado.ok ? resultado.valor : resultado.error.mensaje);
          }}
        >
          <Copy size={17} className="shrink-0" aria-hidden="true" />
          Copiar JSON
        </button>
        <Link href={urlSimulacion(config)} replace className={clase}>
          <ArrowLeft size={17} className="shrink-0" aria-hidden="true" />
          Volver a simulación
        </Link>
      </nav>
    </div>
  );
}
