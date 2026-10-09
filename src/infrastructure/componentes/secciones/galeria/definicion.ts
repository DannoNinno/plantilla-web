import {Galeria, type GaleriaProps} from './index';
import {ejemploGaleria} from './ejemplo';
import type {DefinicionRegistro} from '../../boveda/registrar';

export const definicionGaleria: DefinicionRegistro<GaleriaProps> = {
  slug: 'galeria',
  nombre: 'Galería',
  descripcionCorta: 'Grilla adaptable de imágenes con alternativas y leyendas opcionales.',
  planMinimo: 'presencia',
  cuentaParaTope: true,
  categoria: 'seccion',
  enDemo: true,
  componente: Galeria,
  propsEjemplo: ejemploGaleria,
  props: [
    {
      nombre: 'imagenes',
      tipo: 'ImagenGaleria[]',
      requerida: false,
      descripcion: 'Imágenes con id, dimensiones y alt; lista vacía por defecto.',
    },
  ],
};
