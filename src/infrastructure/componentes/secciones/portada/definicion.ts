import {Portada, type PortadaProps} from './index';
import {ejemploPortada} from './ejemplo';
import {propsPortada} from './props';
import type {DefinicionRegistro} from '../../boveda/registrar';

export const definicionPortada: DefinicionRegistro<PortadaProps> = {
  slug: 'portada',
  nombre: 'Portada',
  descripcionCorta: 'Presentación del negocio con título, imagen y llamada a la acción.',
  planMinimo: 'presencia',
  cuentaParaTope: true,
  categoria: 'seccion',
  enDemo: true,
  componente: Portada,
  propsEjemplo: ejemploPortada,
  propsAisladas: {nivelTitulo: 'h2', accion: undefined},
  props: propsPortada,
};
