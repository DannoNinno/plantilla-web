import {Testimonios, type TestimoniosProps} from './index';
import {ejemploTestimonios} from './ejemplo';
import type {DefinicionRegistro} from '../../boveda/registrar';

export const definicionTestimonios: DefinicionRegistro<TestimoniosProps> = {
  slug: 'testimonios',
  nombre: 'Testimonios',
  descripcionCorta: 'Opiniones con cita, autor y contexto opcionales.',
  planMinimo: 'presencia',
  cuentaParaTope: true,
  categoria: 'seccion',
  enDemo: true,
  componente: Testimonios,
  propsEjemplo: ejemploTestimonios,
  props: [
    {
      nombre: 'elementos',
      tipo: 'Testimonio[]',
      requerida: false,
      descripcion: 'Citas; lista vacía por defecto. Los ejemplos de la demo son ficticios.',
    },
  ],
};
