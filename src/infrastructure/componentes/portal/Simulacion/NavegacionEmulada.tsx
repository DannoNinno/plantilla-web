'use client';

import {useId} from 'react';
import {Menu, X} from 'lucide-react';
import type {ConfigSimulacion, VistaEmulacion} from '@/infrastructure/handlers/simulacion';
import {seccionesNavegables} from '@/infrastructure/handlers/simulacion';
import type {useDrawerPanel} from '../../boveda/PanelAdministracion/useDrawerPanel';
import LogoSimulacion from './LogoSimulacion';
import EnlacesEmulados from './EnlacesEmulados';
import MenuMovilEmulado from './MenuMovilEmulado';

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
  return (
    <>
      <header
        data-testid="navegacion-emulada"
        className={`z-30 h-panel-header border-b ${posicion} ${lateral ? 'lg:hidden' : ''}
      ${transparente ? 'border-transparent bg-transparent text-brand-light' : tema}`}
      >
        <div className="flex h-full w-full items-center justify-between gap-3 px-4 sm:px-6">
          <LogoSimulacion oscuro />
          {!lateral && (
            <div className="hidden min-w-0 flex-1 lg:flex">
              <EnlacesEmulados config={config} activa={vista.activa} oscuro />
            </div>
          )}
          {tieneEnlaces && (
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
      {lateral && (
        <aside
          aria-label="Navegación lateral de la página"
          className={`hidden min-h-dvh w-72 flex-col gap-6 border-r p-5 lg:flex ${tema} ${p.fija ? 'fixed inset-y-0 left-0 z-30 overflow-y-auto' : 'relative self-start'}`}
        >
          <LogoSimulacion oscuro />
          <EnlacesEmulados config={config} activa={vista.activa} oscuro vertical />
        </aside>
      )}
      {tieneEnlaces && abierto && movil && (
        <MenuMovilEmulado
          config={config}
          activa={vista.activa}
          cerrar={() => setAbierto(false)}
          panelRef={panelRef}
          id={id}
        />
      )}
    </>
  );
}
