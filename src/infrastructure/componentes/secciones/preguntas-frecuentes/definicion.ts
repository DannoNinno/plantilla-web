import {PreguntasFrecuentes, type PreguntasFrecuentesProps} from './index';
import {ejemploPreguntasFrecuentes} from './ejemplo';
import type {DefinicionRegistro} from '../../boveda/registrar';

export const definicionPreguntas: DefinicionRegistro<PreguntasFrecuentesProps> = {
  slug: 'preguntas-frecuentes',
  nombre: 'Preguntas frecuentes',
  descripcionCorta: 'Preguntas desplegables con controles HTML nativos, sin JavaScript.',
  planMinimo: 'presencia',
  cuentaParaTope: true,
  categoria: 'seccion',
  enDemo: true,
  componente: PreguntasFrecuentes,
  propsEjemplo: ejemploPreguntasFrecuentes,
  props: [
    {
      nombre: 'elementos',
      tipo: 'Pregunta[]',
      requerida: false,
      descripcion: 'Preguntas y respuestas; lista vacía por defecto.',
    },
  ],
};
