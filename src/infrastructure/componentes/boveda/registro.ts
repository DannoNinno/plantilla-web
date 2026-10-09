import {createElement} from 'react';
import type {ComponentType} from 'react';
import {Portada, type PortadaProps} from './portada';
import {ejemploPortada} from './portada/ejemplo';
import {propsPortada} from './portada/props';
import {FormularioContacto, type FormularioContactoProps} from './formulario-contacto';
import {ejemploFormularioContacto} from './formulario-contacto/ejemplo';
import {propsFormularioContacto} from './formulario-contacto/props';

export type PlanBoveda = 'presencia' | 'captacion';

export interface DocumentacionProp {
  nombre: string;
  tipo: string;
  requerida: boolean;
  descripcion: string;
}

interface DefinicionRegistro<Props extends object> {
  slug: string;
  nombre: string;
  descripcionCorta: string;
  planMinimo: PlanBoveda;
  cuentaParaTope: boolean;
  componente: ComponentType<Props>;
  propsEjemplo: Props;
  propsAisladas?: Partial<Props>;
  props: DocumentacionProp[];
}

function registrar<Props extends object>(entrada: DefinicionRegistro<Props>) {
  return {
    ...entrada,
    renderizar: (aislado = false) =>
      createElement(
        entrada.componente,
        aislado ? {...entrada.propsEjemplo, ...entrada.propsAisladas} : entrada.propsEjemplo,
      ),
  };
}

export const registro = [
  registrar<PortadaProps>({
    slug: 'portada',
    nombre: 'Portada',
    descripcionCorta: 'Presentación del negocio con título, imagen y llamada a la acción.',
    planMinimo: 'presencia',
    cuentaParaTope: true,
    componente: Portada,
    propsEjemplo: ejemploPortada,
    propsAisladas: {nivelTitulo: 'h2', accion: undefined},
    props: propsPortada,
  }),
  registrar<FormularioContactoProps>({
    slug: 'formulario-contacto',
    nombre: 'Formulario de contacto',
    descripcionCorta:
      'Consulta accesible con validación y resultado local, sin enviar información.',
    planMinimo: 'presencia',
    cuentaParaTope: true,
    componente: FormularioContacto,
    propsEjemplo: ejemploFormularioContacto,
    props: propsFormularioContacto,
  }),
];

export type EntradaBoveda = (typeof registro)[number];

export function getComponente(slug: string) {
  return registro.find((entrada) => entrada.slug === slug);
}
