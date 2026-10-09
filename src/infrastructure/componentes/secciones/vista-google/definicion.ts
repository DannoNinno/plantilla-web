import {VistaGoogle, type VistaGoogleProps} from './index';
import {ejemploGoogle} from './ejemplo';
import type {DefinicionRegistro} from '../../boveda/registrar';
export const definicionGoogle: DefinicionRegistro<VistaGoogleProps> = {
  slug: 'vista-google',
  nombre: 'Vista previa en Google',
  descripcionCorta: 'Maqueta de resultado de búsqueda, sin conexión a Google.',
  planMinimo: 'captacion',
  cuentaParaTope: false,
  categoria: 'seccion',
  enDemo: false,
  componente: VistaGoogle,
  propsEjemplo: ejemploGoogle,
  props: [
    {
      nombre: 'etiqueta',
      tipo: 'string',
      requerida: true,
      descripcion: 'Nombre accesible de la vista.',
    },
    {
      nombre: 'titulo',
      tipo: 'string',
      requerida: true,
      descripcion: 'Título del resultado simulado.',
    },
    {
      nombre: 'descripcion',
      tipo: 'string',
      requerida: true,
      descripcion: 'Descripción del resultado.',
    },
    {nombre: 'url', tipo: 'string', requerida: true, descripcion: 'URL mostrada solo como texto.'},
    {nombre: 'nota', tipo: 'string', requerida: true, descripcion: 'Aviso de simulación.'},
  ],
};
