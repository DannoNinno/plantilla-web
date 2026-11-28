'use client';

import {useId} from 'react';
import type {ReactNode} from 'react';
import NavbarPanel from './NavbarPanel';
import DrawerPanel from './DrawerPanel';
import {useDrawerPanel} from './useDrawerPanel';
import SaltoContenido from '../Base/SaltoContenido/SaltoContenido';

export interface LayoutPanelProps {
  children?: ReactNode;
  nombre: string;
  subtitulo: string;
  marca: ReactNode;
  inicio: string;
  acciones: ReactNode;
  menu: ReactNode;
}

export default function LayoutPanel(props: LayoutPanelProps) {
  const {abierto, setAbierto, movil, panelRef} = useDrawerPanel();
  const id = useId();
  return (
    <div className="min-h-dvh bg-brand-ink bg-intro text-brand-light">
      <SaltoContenido etiqueta="Ir al contenido" />
      <NavbarPanel
        {...props}
        abierto={abierto}
        alternar={() => setAbierto(!abierto)}
        idPanel={id}
      />
      <div
        className={`grid grid-cols-[0_minmax(0,1fr)] pt-panel-header transition-[grid-template-columns] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none ${abierto ? 'lg:grid-cols-[18rem_minmax(0,1fr)]' : ''}`}
      >
        <div className="min-w-0 lg:sticky lg:top-panel-header lg:self-start lg:overflow-clip">
          <DrawerPanel
            {...props}
            abierto={abierto}
            movil={movil}
            panelRef={panelRef}
            idPanel={id}
            cerrar={() => setAbierto(false)}
          />
        </div>
        <main
          id="contenido"
          inert={movil && abierto}
          className="mx-auto min-h-[calc(100dvh-theme(spacing.panel-header))] w-full min-w-0 max-w-7xl px-4 py-6 sm:px-6 lg:px-8"
        >
          {props.children}
        </main>
      </div>
    </div>
  );
}
