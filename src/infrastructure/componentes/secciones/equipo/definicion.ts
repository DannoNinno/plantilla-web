import {Equipo, type EquipoProps} from './index';
import {ejemploEquipo} from './ejemplo';
import type {DefinicionRegistro} from '../../boveda/registrar';
export const definicionEquipo: DefinicionRegistro<EquipoProps> = {
  slug: 'equipo',
  nombre: 'Equipo',
  descripcionCorta: 'Personas, funciones y retratos ficticios.',
  planMinimo: 'captacion',
  cuentaParaTope: true,
  categoria: 'seccion',
  enDemo: true,
  componente: Equipo,
  propsEjemplo: ejemploEquipo,
  props: [
    {
      nombre: 'personas',
      tipo: 'PersonaEquipo[]',
      requerida: false,
      descripcion: 'Equipo; lista vacía por defecto.',
    },
  ],
};
