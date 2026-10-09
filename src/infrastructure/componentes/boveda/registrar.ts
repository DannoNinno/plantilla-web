import {createElement} from 'react';
import type {ComponentType} from 'react';

export type PlanBoveda = 'presencia' | 'captacion';

export interface DocumentacionProp {
  nombre: string;
  tipo: string;
  requerida: boolean;
  descripcion: string;
}

export interface DefinicionRegistro<Props extends object> {
  slug: string;
  nombre: string;
  descripcionCorta: string;
  planMinimo: PlanBoveda;
  cuentaParaTope: boolean;
  categoria: 'seccion' | 'componente';
  enDemo: boolean;
  componente: ComponentType<Props>;
  propsEjemplo: Props;
  propsAisladas?: Partial<Props>;
  props: DocumentacionProp[];
}

export function registrar<Props extends object>(entrada: DefinicionRegistro<Props>) {
  return {
    ...entrada,
    renderizar: (aislado = false) =>
      createElement(
        entrada.componente,
        aislado ? {...entrada.propsEjemplo, ...entrada.propsAisladas} : entrada.propsEjemplo,
      ),
  };
}
