import {Servicios, type ServiciosProps} from './index';
import {ejemploServicios} from './ejemplo';
import type {DefinicionRegistro} from '../../boveda/registrar';

export const definicionServicios: DefinicionRegistro<ServiciosProps> = {
  slug: 'servicios',
  nombre: 'Servicios',
  descripcionCorta: 'Lista de servicios con tarjetas y contenido recibido por props.',
  planMinimo: 'presencia',
  cuentaParaTope: true,
  categoria: 'seccion',
  enDemo: true,
  componente: Servicios,
  propsEjemplo: ejemploServicios,
  props: [
    {nombre: 'titulo', tipo: 'string', requerida: false, descripcion: 'Título de la sección.'},
    {
      nombre: 'elementos',
      tipo: 'Servicio[]',
      requerida: false,
      descripcion: 'Servicios; lista vacía por defecto.',
    },
  ],
};
