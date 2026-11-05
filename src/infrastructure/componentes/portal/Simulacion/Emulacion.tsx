'use client';

import {useEffect, useState} from 'react';
import {observarEmulacion, seguirEnlaceEjemplo} from '@/infrastructure/handlers/simulacion';
import type {ConfigSimulacion, VistaEmulacion} from '@/infrastructure/handlers/simulacion';
import NavegacionEmulada from './NavegacionEmulada';
import CajaSeccion from './CajaSeccion';
import FooterEmulado from './FooterEmulado';
import ExtrasEmulados from './ExtrasEmulados';
import DockEmulacion from './DockEmulacion';
import {useDrawerPanel} from '../../boveda/PanelAdministracion/useDrawerPanel';

export default function Emulacion({config}: {config: ConfigSimulacion}) {
  const menu = useDrawerPanel(config.pagina.navegacion === 'sidebar');
  const [aviso, setAviso] = useState('');
  const [vista, setVista] = useState<VistaEmulacion>({
    activa: config.secciones[0] ?? '',
    sobrePortada: config.pagina.esLanding,
  });
  useEffect(() => observarEmulacion(config, setVista), [config]);
  const p = config.pagina;
  const espacio =
    p.fija &&
    p.navegacion !== 'ninguna' &&
    !(p.navegacion === 'navbar' && p.esLanding && p.transparenteSobreLanding);
  return (
    <div className="relative min-h-dvh bg-brand-simulacion text-brand-ink">
      <NavegacionEmulada config={config} vista={vista} menu={menu} />
      <div
        inert={menu.abierto && menu.modal}
        className={`min-w-0 pb-28 ${espacio ? 'pt-panel-header' : ''}`}
      >
        <main
          id="contenido-emulado"
          className="w-full"
          onClickCapture={(evento) => {
            if (!(evento.target instanceof Element)) return;
            const enlace = evento.target.closest('a');
            if (!enlace) return;
            evento.preventDefault();
            setAviso(seguirEnlaceEjemplo(enlace.getAttribute('href') ?? '', config));
          }}
        >
          <h1 className="sr-only">Emulación de una página</h1>
          {aviso && (
            <p role="status" className="border-l-4 border-brand-coral bg-brand-light px-6 py-4">
              {aviso}
            </p>
          )}
          {config.secciones.map((key) => (
            <CajaSeccion key={key} keySeccion={key} landing={p.esLanding && key === 'portada'} />
          ))}
          {config.secciones.length === 0 && (
            <p className="min-h-96 p-8 text-center">La plantilla no tiene secciones.</p>
          )}
        </main>
        <FooterEmulado pagina={p} />
      </div>
      <div className="contents" inert={menu.abierto && menu.modal}>
        <ExtrasEmulados config={config} />
        <DockEmulacion config={config} />
      </div>
    </div>
  );
}
