import {UbicacionHorarios, type UbicacionHorariosProps} from './index';
import {ejemploUbicacionHorarios} from './ejemplo';
import type {DefinicionRegistro} from '../../boveda/registrar';

export const definicionUbicacion: DefinicionRegistro<UbicacionHorariosProps> = {
  slug: 'ubicacion-horarios',
  nombre: 'Ubicación y horarios',
  descripcionCorta: 'Dirección, horario e imagen opcional, sin cargar mapas externos.',
  planMinimo: 'presencia',
  cuentaParaTope: true,
  categoria: 'seccion',
  enDemo: true,
  componente: UbicacionHorarios,
  propsEjemplo: ejemploUbicacionHorarios,
  props: [
    {
      nombre: 'etiquetaDireccion',
      tipo: 'string',
      requerida: true,
      descripcion: 'Etiqueta de la dirección.',
    },
    {
      nombre: 'etiquetaHorarios',
      tipo: 'string',
      requerida: true,
      descripcion: 'Etiqueta del horario.',
    },
    {
      nombre: 'direccion',
      tipo: 'string',
      requerida: false,
      descripcion: 'Dirección recibida por props.',
    },
  ],
};
