import {X} from 'lucide-react';
import type {RefObject} from 'react';
import type {ConfigSimulacion} from '@/infrastructure/handlers/simulacion';
import EnlacesEmulados from './EnlacesEmulados';

export default function MenuMovilEmulado({
  config,
  activa,
  cerrar,
  panelRef,
  id,
}: {
  config: ConfigSimulacion;
  activa: string;
  cerrar: () => void;
  panelRef: RefObject<HTMLElement | null>;
  id: string;
}) {
  const drawer = config.pagina.menuMovil === 'drawer';
  return (
    <>
      <button
        type="button"
        aria-label="Cerrar menú de la página"
        tabIndex={-1}
        onClick={cerrar}
        className="fixed inset-x-0 bottom-0 top-panel-header z-40 bg-brand-ink/70 lg:hidden"
      />
      <aside
        ref={panelRef}
        id={id}
        role="dialog"
        aria-modal="true"
        aria-label="Menú de la página"
        className={`fixed top-panel-header z-50 max-h-[calc(100dvh-theme(spacing.panel-header))] overflow-y-auto overscroll-contain border p-4 shadow-xl lg:hidden ${
          drawer ? 'bottom-0 left-0 w-[min(18rem,calc(100vw-2rem))]' : 'inset-x-0'
        } border-brand-sky/40 bg-brand-ink text-brand-light`}
      >
        <button
          type="button"
          aria-label="Cerrar menú de la página"
          onClick={cerrar}
          className="mb-3 ml-auto grid h-11 w-11 place-items-center border border-current focus-visible:outline-brand-coral"
        >
          <X size={20} aria-hidden="true" />
        </button>
        <EnlacesEmulados config={config} activa={activa} oscuro cerrar={cerrar} vertical />
      </aside>
    </>
  );
}
