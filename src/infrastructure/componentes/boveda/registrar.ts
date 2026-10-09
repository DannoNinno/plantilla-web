import {createElement} from 'react';
import type {ComponentType} from 'react';
import type {ConsultaContacto} from '../base/consulta/tipos';
import {obtenerCampos} from './edicion/campos';
import type {CampoEditable} from './edicion/campos';
import {actualizarContenido} from './edicion/actualizar';
import type {ValorEditable} from './edicion/actualizar';

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
  conectarConsulta?: (props: Props, onConsulta: (consulta: ConsultaContacto) => void) => Props;
}

export interface InstanciaEditable {
  slug: string;
  campos: CampoEditable[];
  actualizar: (ruta: readonly string[], valor: ValorEditable) => InstanciaEditable;
  renderizar: (onConsulta?: (consulta: ConsultaContacto) => void) => React.ReactNode;
}
function crearInstancia<Props extends object>(
  entrada: DefinicionRegistro<Props>,
  valores: Props,
): InstanciaEditable {
  return {
    slug: entrada.slug,
    campos: obtenerCampos(valores),
    actualizar: (ruta, valor) => crearInstancia(entrada, actualizarContenido(valores, ruta, valor)),
    renderizar: (onConsulta) =>
      createElement(
        entrada.componente,
        onConsulta && entrada.conectarConsulta
          ? entrada.conectarConsulta(valores, onConsulta)
          : valores,
      ),
  };
}
export function registrar<Props extends object>(entrada: DefinicionRegistro<Props>) {
  return {
    ...entrada,
    crearInstancia: () => crearInstancia(entrada, structuredClone(entrada.propsEjemplo)),
    renderizar: (aislado = false) =>
      createElement(
        entrada.componente,
        aislado ? {...entrada.propsEjemplo, ...entrada.propsAisladas} : entrada.propsEjemplo,
      ),
  };
}
