import {PromocionDestacada, type PromocionDestacadaProps} from './index';
import {ejemploPromocion} from './ejemplo';
import type {DefinicionRegistro} from '../../boveda/registrar';
export const definicionPromocion: DefinicionRegistro<PromocionDestacadaProps> = {
  slug: 'promocion-destacada',
  nombre: 'Promoción destacada',
  descripcionCorta: 'Campaña con ilustración y una acción configurable.',
  planMinimo: 'captacion',
  cuentaParaTope: true,
  categoria: 'seccion',
  enDemo: true,
  componente: PromocionDestacada,
  propsEjemplo: ejemploPromocion,
  props: [
    {
      nombre: 'accion',
      tipo: '{texto: string; href: string}',
      requerida: false,
      descripcion: 'Acción opcional.',
    },
    {
      nombre: 'imagen',
      tipo: 'ImagenContenidoDatos',
      requerida: false,
      descripcion: 'Imagen con dimensiones y texto alternativo.',
    },
  ],
};
