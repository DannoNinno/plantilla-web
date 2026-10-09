import {FormularioCotizacion, type FormularioCotizacionProps} from './index';
import {ejemploCotizacion} from './ejemplo';
import type {DefinicionRegistro} from '../registrar';
export const definicionCotizacion: DefinicionRegistro<FormularioCotizacionProps> = {
  slug: 'cotizacion-pasos',
  nombre: 'Cotización por pasos',
  descripcionCorta: 'Solicitud en tres pasos con validación y resultado local.',
  planMinimo: 'captacion',
  cuentaParaTope: true,
  categoria: 'componente',
  enDemo: true,
  componente: FormularioCotizacion,
  propsEjemplo: ejemploCotizacion,
  propsAisladas: {titulo: undefined, descripcion: undefined},
  conectarConsulta: (props, onConsulta) => ({...props, onConsulta}),
  props: [
    {
      nombre: 'campos',
      tipo: 'FormularioCotizacionProps["campos"]',
      requerida: true,
      descripcion: 'Etiquetas, errores y opciones de servicio.',
    },
    {
      nombre: 'textos',
      tipo: 'FormularioCotizacionProps["textos"]',
      requerida: true,
      descripcion: 'Avisos, pasos, botones y resultado.',
    },
    {
      nombre: 'onConsulta',
      tipo: '(consulta: ConsultaContacto) => void',
      requerida: false,
      descripcion: 'Notificación síncrona local; no envía datos.',
    },
  ],
};
