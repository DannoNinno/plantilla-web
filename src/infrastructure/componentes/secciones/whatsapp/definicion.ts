import {Whatsapp, type WhatsappProps} from './index';
import {ejemploWhatsapp} from './ejemplo';
import type {DefinicionRegistro} from '../../boveda/registrar';

export const definicionWhatsapp: DefinicionRegistro<WhatsappProps> = {
  slug: 'whatsapp',
  nombre: 'WhatsApp',
  descripcionCorta: 'Acceso flotante al contacto, con destino definido por props.',
  planMinimo: 'presencia',
  cuentaParaTope: false,
  categoria: 'seccion',
  enDemo: true,
  componente: Whatsapp,
  propsEjemplo: ejemploWhatsapp,
  props: [
    {nombre: 'texto', tipo: 'string', requerida: true, descripcion: 'Nombre accesible y tooltip.'},
    {
      nombre: 'href',
      tipo: 'string',
      requerida: true,
      descripcion: 'En la demo apunta al formulario local, no a un número real.',
    },
  ],
};
