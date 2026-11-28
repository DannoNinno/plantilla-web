import type {TextosTarjetaComponente} from './componentes';

export interface CatalogoServicios {
  textos: {
    etiqueta: string;
    titulo: string;
    identidad: string;
    presentacion: string;
    planes: string;
    impuestoIncluido: string;
    pagoDosCuotas: string;
    pagoInicial: string;
    descuentoPagoInicial: string;
    detalle: string;
    verDetalles: string;
    cotizarPlan: string;
    cotizacion: string;
    alcance: string;
    adicionales: string;
    detalleAdicionales: string;
    volver: string;
    verAlcance: string;
    verAdicionales: string;
    verBase: string;
    consulta: string;
    proximamente: string;
    alcanceInicial: string;
  };
  comparacion: {
    titulo: string;
    anterior: string;
    siguiente: string;
    ayudaCarrusel: string;
    carrusel: string;
    diapositiva: string;
    irAlPlan: string;
    posicion: string;
  };
  vitrina: {
    tituloDetalle: string;
    introduccionDetalle: string;
    etiquetas: TextosTarjetaComponente;
  };
  alcance: {
    condiciones: string[];
  };
  adicionales: {
    nombre: string;
    costo: string;
  }[];
}
