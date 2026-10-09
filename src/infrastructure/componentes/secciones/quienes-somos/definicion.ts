import {QuienesSomos, type QuienesSomosProps} from './index';
import {ejemploQuienesSomos} from './ejemplo';
import type {DefinicionRegistro} from '../../boveda/registrar';

export const definicionQuienesSomos: DefinicionRegistro<QuienesSomosProps> = {
  slug: 'quienes-somos',
  nombre: 'Quiénes somos',
  descripcionCorta: 'Historia del negocio con párrafos e imagen opcional.',
  planMinimo: 'presencia',
  cuentaParaTope: true,
  categoria: 'seccion',
  enDemo: true,
  componente: QuienesSomos,
  propsEjemplo: ejemploQuienesSomos,
  props: [
    {
      nombre: 'parrafos',
      tipo: 'string[]',
      requerida: false,
      descripcion: 'Párrafos; lista vacía por defecto.',
    },
    {
      nombre: 'imagen',
      tipo: '{src, alt, width, height}',
      requerida: false,
      descripcion: 'Ilustración o foto proporcionada por el proyecto destino.',
    },
  ],
};
