'use client';

import {useId} from 'react';
import {Menu, X} from 'lucide-react';
import type {ConfigSimulacion, VistaEmulacion} from '@/infrastructure/handlers/simulacion';
import {seccionesNavegables} from '@/infrastructure/handlers/simulacion';
import type {useDrawerPanel} from '../../boveda/PanelAdministracion/useDrawerPanel';
import LogoSimulacion from './LogoSimulacion';
import EnlacesEmulados from './EnlacesEmulados';
import MenuMovilEmulado from './MenuMovilEmulado';
import BotonDrawer from '../../boveda/PanelAdministracion/BotonDrawer';

export default function NavegacionEmulada({
  config,
  vista,
  menu,
}: {
  config: ConfigSimulacion;
  vista: VistaEmulacion;
  menu: ReturnType<typeof useDrawerPanel>;
}) {
  const {abierto, setAbierto, movil, panelRef} = menu;
  const id = useId();
  const p = config.pagina;
  if (p.navegacion === 'ninguna') return null;
  const lateral = p.navegacion === 'sidebar';
  const tieneEnlaces = seccionesNavegables(config.secciones).length > 0;
  const superpuesta = !lateral && p.esLanding && p.transparenteSobreLanding;
  const transparente = superpuesta && vista.sobrePortada;
  const tema = 'border-brand-sky/40 bg-brand-ink text-brand-light';
  const posicion = p.fija
    ? 'fixed inset-x-0 top-0'
    : superpuesta
      ? 'absolute inset-x-0 top-0'
      : 'relative';
  const dialogoLateral = lateral && movil && abierto;
  return (
    <section
      ref={lateral ? panelRef : undefined}
      role={dialogoLateral ? 'dialog' : undefined}
      aria-modal={dialogoLateral || undefined}
      aria-label="Navegación de la página"
    >
      <header
        data-testid="navegacion-emulada"
        className={`z-30 h-panel-header border-b ${posicion}
      ${transparente ? 'border-transparent bg-transparent text-brand-light' : tema}`}
      >
        <div className="flex h-full w-full items-center justify-between gap-3 px-4 sm:px-6">
          <div className="flex items-center gap-2">
            {lateral && tieneEnlaces && (
              <BotonDrawer abierto={abierto} alternar={() => setAbierto(!abierto)} idPanel={id} />
            )}
            <LogoSimulacion oscuro />
          </div>
          {!lateral && (
            <div className="hidden min-w-0 flex-1 lg:flex">
              <EnlacesEmulados config={config} activa={vista.activa} oscuro />
            </div>
          )}
          {!lateral && tieneEnlaces && (
            <button
              type="button"
              aria-label={abierto ? 'Cerrar menú de la página' : 'Abrir menú de la página'}
              aria-expanded={abierto}
              aria-controls={id}
              onClick={() => setAbierto(!abierto)}
              className="grid h-11 w-11 place-items-center border border-current focus-visible:outline-brand-coral lg:hidden"
            >
              {abierto ? <X size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}
            </button>
          )}
        </div>
      </header>
      {tieneEnlaces && (lateral || movil) && (
        <MenuMovilEmulado
          abierto={abierto}
          config={config}
          activa={vista.activa}
          cerrar={() => setAbierto(false)}
          movil={movil}
          panelRef={lateral ? undefined : panelRef}
          id={id}
        />
      )}
    </section>
  );
}
