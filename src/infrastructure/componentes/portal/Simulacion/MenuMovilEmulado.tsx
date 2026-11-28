import {X} from 'lucide-react';
import type {RefObject} from 'react';
import type {ConfigSimulacion} from '@/infrastructure/handlers/simulacion';
import EnlacesEmulados from './EnlacesEmulados';
import {animacionDrawer} from '../../boveda/PanelAdministracion/animacionDrawer';

export default function MenuMovilEmulado({
  abierto,
  config,
  activa,
  cerrar,
  panelRef,
  movil,
  id,
}: {
  abierto: boolean;
  config: ConfigSimulacion;
  activa: string;
  cerrar: () => void;
  panelRef?: RefObject<HTMLElement | null>;
  movil: boolean;
  id: string;
}) {
  const lateral = config.pagina.navegacion === 'sidebar';
  const drawer = lateral || config.pagina.menuMovil === 'drawer';
  if (!drawer && !abierto) return null;
  return (
    <>
      {movil && abierto && (
        <button
          type="button"
          aria-label="Cerrar menú de la página"
          tabIndex={-1}
          onClick={cerrar}
          className="fixed inset-x-0 bottom-0 top-panel-header z-40 bg-brand-ink/70 lg:hidden"
        />
      )}
      <aside
        ref={panelRef}
        id={id}
        role={lateral ? undefined : 'dialog'}
        aria-modal={(!lateral && abierto) || undefined}
        aria-hidden={!abierto}
        inert={!abierto}
        aria-label="Menú de la página"
        className={`fixed top-panel-header z-50 max-h-[calc(100dvh-theme(spacing.panel-header))] overflow-y-auto overscroll-contain border p-4 shadow-xl ${lateral ? '' : 'lg:hidden'} ${
          drawer
            ? `bottom-0 left-0 w-[min(18rem,calc(100vw-2rem))] ${animacionDrawer(abierto)}`
            : 'inset-x-0'
        } border-brand-sky/40 bg-brand-ink text-brand-light`}
      >
        {!lateral && (
          <button
            type="button"
            aria-label="Cerrar menú de la página"
            onClick={cerrar}
            className="mb-3 ml-auto grid h-11 w-11 place-items-center border border-current focus-visible:outline-brand-coral"
          >
            <X size={20} aria-hidden="true" />
          </button>
        )}
        <EnlacesEmulados
          config={config}
          activa={activa}
          oscuro
          cerrar={movil ? cerrar : undefined}
          vertical
        />
      </aside>
    </>
  );
}
