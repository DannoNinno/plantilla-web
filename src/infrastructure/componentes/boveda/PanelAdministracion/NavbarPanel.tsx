import {Menu, X} from 'lucide-react';
import type {ReactNode} from 'react';

export default function NavbarPanel({
  abierto,
  alternar,
  idPanel,
  nombre,
  subtitulo,
  marca,
  inicio,
  acciones,
}: {
  abierto: boolean;
  alternar: () => void;
  idPanel: string;
  nombre: string;
  subtitulo: string;
  marca: ReactNode;
  inicio: string;
  acciones: ReactNode;
}) {
  return (
    <header className="fixed inset-x-0 top-0 z-50 h-panel-header bg-brand-ink text-brand-light shadow-lg">
      <div className="flex h-full items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-2">
          <button
            type="button"
            onClick={alternar}
            aria-expanded={abierto}
            aria-controls={idPanel}
            aria-label={abierto ? 'Cerrar navegación' : 'Abrir navegación'}
            className="grid h-10 w-10 shrink-0 place-items-center border border-brand-sky/60 text-brand-sky hover:bg-brand-sky/15 focus-visible:outline-brand-sky"
          >
            {abierto ? <X size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}
          </button>
          <a
            href={inicio}
            aria-label={`${nombre}: ${subtitulo}`}
            className="flex min-w-0 items-center gap-3 focus-visible:outline-brand-sky"
          >
            <span className="shrink-0">{marca}</span>
            <span className="hidden truncate text-sm font-semibold tracking-wide sm:block">
              {subtitulo}
            </span>
          </a>
        </div>
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-brand-sky to-brand-coral"
        />
        {acciones}
      </div>
    </header>
  );
}
