import {Sedes, type SedesProps} from './index';
import {ejemploSedes} from './ejemplo';
import type {DefinicionRegistro} from '../../boveda/registrar';
export const definicionSedes: DefinicionRegistro<SedesProps> = {
  slug: 'sedes',
  nombre: 'Sedes',
  descripcionCorta: 'Locales con dirección, horarios e ilustraciones.',
  planMinimo: 'captacion',
  cuentaParaTope: true,
  categoria: 'seccion',
  enDemo: true,
  componente: Sedes,
  propsEjemplo: ejemploSedes,
  props: [
    {
      nombre: 'etiquetaDireccion',
      tipo: 'string',
      requerida: true,
      descripcion: 'Etiqueta de dirección.',
    },
    {
      nombre: 'etiquetaHorarios',
      tipo: 'string',
      requerida: true,
      descripcion: 'Etiqueta de horarios.',
    },
    {
      nombre: 'sedes',
      tipo: 'Sede[]',
      requerida: false,
      descripcion: 'Locales; lista vacía por defecto.',
    },
  ],
};
