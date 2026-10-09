'use client';
import {Fragment, useEffect, useRef} from 'react';
import {negocio} from '../../../../demo/negocio';
import {registro} from '../../boveda/registro';
import PaginaPlan from '../PaginaPlan/PaginaPlan';
import type {PaginaPlanProps} from '../PaginaPlan/PaginaPlan';
import type {HerramientasDemoProps} from '../HerramientasDemo/HerramientasDemo';
import useAdministracion from './useAdministracion';
import ControlVista from './ControlVista';
import PanelAdministracion from './PanelAdministracion';
export interface CaptacionDemoProps {
  pagina: Omit<PaginaPlanProps, 'children' | 'herramientas'>;
  herramientas: HerramientasDemoProps;
}
export default function CaptacionDemo({pagina, herramientas}: CaptacionDemoProps) {
  const estado = useAdministracion();
  const tituloRef = useRef<HTMLHeadingElement>(null);
  const textos = negocio.interfaz.administracion;
  useEffect(() => {
    if (estado.administrador) tituloRef.current?.focus();
  }, [estado.administrador]);
  const slugs = [
    ...estado.seleccion,
    ...registro.filter((item) => item.enDemo && !item.cuentaParaTope).map((item) => item.slug),
  ];
  return (
    <PaginaPlan
      {...pagina}
      herramientas={{
        ...herramientas,
        control: (
          <ControlVista
            administrador={estado.administrador}
            texto={estado.administrador ? textos.desactivar : textos.activar}
            textoCorto={estado.administrador ? textos.textoVisita : textos.textoAdmin}
            alternar={estado.alternarVista}
          />
        ),
      }}
    >
      <noscript>
        <p className="px-5 py-8 text-center">{textos.noJavascript}</p>
      </noscript>
      {estado.administrador && (
        <PanelAdministracion
          estado={estado}
          textos={textos}
          limite={negocio.interfaz.planes.captacion.limite}
          tituloRef={tituloRef}
        />
      )}
      {slugs.map((slug) => {
        const instancia = estado.instancias.find((item) => item.slug === slug);
        const entrada = registro.find((item) => item.slug === slug);
        if (!instancia || !entrada) throw new Error('Sección de demostración no disponible.');
        return (
          <Fragment key={`${estado.version}:${slug}`}>
            {instancia.renderizar((consulta) => estado.recibir(entrada.nombre, consulta))}
          </Fragment>
        );
      })}
    </PaginaPlan>
  );
}
