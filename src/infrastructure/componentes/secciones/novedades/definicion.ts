import {Novedades, type NovedadesProps} from './index';
import {ejemploNovedades} from './ejemplo';
import type {DefinicionRegistro} from '../../boveda/registrar';
export const definicionNovedades: DefinicionRegistro<NovedadesProps> = {
  slug: 'novedades',
  nombre: 'Novedades',
  descripcionCorta: 'Noticias con ilustraciones y fechas de ejemplo.',
  planMinimo: 'captacion',
  cuentaParaTope: true,
  categoria: 'seccion',
  enDemo: true,
  componente: Novedades,
  propsEjemplo: ejemploNovedades,
  props: [
    {
      nombre: 'elementos',
      tipo: 'Novedad[]',
      requerida: false,
      descripcion: 'Noticias; lista vacía por defecto.',
    },
  ],
};
