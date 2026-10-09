import {createElement} from 'react';
import type {ComponentType} from 'react';
import {Portada, type PortadaProps} from './portada';
import {ejemploPortada} from './portada/ejemplo';

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
    props: [
      {
        nombre: 'titulo',
        tipo: 'string',
        requerida: true,
        descripcion: 'Título de la presentación.',
      },
      {nombre: 'id', tipo: 'string', requerida: false, descripcion: 'Ancla de la sección.'},
      {
        nombre: 'etiqueta',
        tipo: 'string',
        requerida: false,
        descripcion: 'Texto previo al título.',
      },
      {nombre: 'descripcion', tipo: 'string', requerida: false, descripcion: 'Texto de apoyo.'},
      {
        nombre: 'nivelTitulo',
        tipo: "'h1' | 'h2'",
        requerida: false,
        descripcion: 'h1 por defecto; h2 en una ficha aislada.',
      },
      {
        nombre: 'accion',
        tipo: '{texto, href}',
        requerida: false,
        descripcion: 'Enlace opcional. Omitido en la ficha para no apuntar a otra sección.',
      },
      {
        nombre: 'imagen',
        tipo: '{src, alt, width, height}',
        requerida: false,
        descripcion: 'Imagen opcional con dimensiones y alternativa textual.',
      },
    ],
  }),
];

export function getComponente(slug: string) {
  return registro.find((entrada) => entrada.slug === slug);
}
