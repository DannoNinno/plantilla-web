import {negocio} from '../../../../demo/negocio';
import type {FormularioCotizacionProps} from './tipos';
export const ejemploCotizacion = {
  id: negocio.cotizacionPasos.id,
  titulo: negocio.cotizacionPasos.titulo,
  descripcion: negocio.cotizacionPasos.descripcion,
  campos: {
    ...negocio.contacto.campos,
    mensaje: negocio.cotizacionPasos.mensaje,
    servicio: {
      ...negocio.cotizacionPasos.servicio,
      opciones: negocio.servicios.elementos.map((item) => ({id: item.id, texto: item.titulo})),
    },
  },
  textos: {...negocio.contacto.textos, ...negocio.cotizacionPasos.textos},
} satisfies FormularioCotizacionProps;
