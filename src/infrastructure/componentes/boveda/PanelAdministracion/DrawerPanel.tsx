import {ShieldCheck, X} from 'lucide-react';
import type {ReactNode, RefObject} from 'react';

export default function DrawerPanel({
  abierto,
  movil,
  cerrar,
  panelRef,
  idPanel,
  subtitulo,
  nombre,
  menu,
}: {
  abierto: boolean;
  movil: boolean;
  cerrar: () => void;
  panelRef: RefObject<HTMLElement | null>;
  idPanel: string;
  subtitulo: string;
  nombre: string;
  menu: ReactNode;
}) {
  return (
    <>
      {abierto && (
        <button
          type="button"
          tabIndex={-1}
          aria-label="Cerrar navegación"
          onClick={cerrar}
          className="fixed inset-x-0 bottom-0 top-panel-header z-30 bg-brand-ink/80 backdrop-blur-sm lg:hidden"
        />
      )}
      <aside
        id={idPanel}
        ref={panelRef}
        role={movil ? 'dialog' : undefined}
        aria-label="Navegación de administración"
        aria-modal={movil && abierto ? true : undefined}
        aria-hidden={!abierto}
        inert={!abierto}
        className={`fixed bottom-0 left-0 top-panel-header z-40 flex w-[min(18rem,calc(100vw-2rem))] flex-col border-r border-brand-sky/40 bg-brand-ink text-brand-light shadow-xl transition-[transform,visibility] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none lg:relative lg:inset-auto lg:h-[calc(100dvh-theme(spacing.panel-header))] lg:w-72 ${
          abierto ? 'visible translate-x-0' : 'invisible -translate-x-full'
        }`}
      >
        <div className="flex shrink-0 items-center justify-between gap-2 border-b border-brand-sky/30 p-5">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 shrink-0 place-items-center bg-brand-sky/15 text-brand-sky">
              <ShieldCheck size={22} aria-hidden="true" />
            </span>
            <div>
              <p className="text-lg font-bold">{subtitulo}</p>
              <p className="mt-2 text-xs font-semibold text-brand-sky">Área privada</p>
            </div>
          </div>
          <button
            type="button"
            onClick={cerrar}
            aria-label="Cerrar navegación"
            className="grid h-10 w-10 shrink-0 place-items-center text-brand-sky hover:bg-brand-sky/15 focus-visible:outline-brand-sky lg:hidden"
          >
            <X size={20} aria-hidden="true" />
          </button>
        </div>
        <nav
          aria-label="Secciones de administración"
          className="min-h-0 flex-1 space-y-1 overflow-y-auto overscroll-contain p-3"
          onClick={(evento) => {
            if (movil && evento.target instanceof Element && evento.target.closest('a[href]'))
              cerrar();
          }}
        >
          {menu}
        </nav>
        <p className="shrink-0 border-t border-brand-sky/30 p-4 text-center text-xs text-brand-light">
          {nombre}
        </p>
      </aside>
    </>
  );
}
