import type {TextosTarjetaComponente} from './componentes';

export interface CatalogoServicios {
  textos: {
    etiqueta: string;
    titulo: string;
    identidad: string;
    presentacion: string;
    planes: string;
    precios: string;
    impuestoIncluido: string;
    pagoDosCuotas: string;
    pagoInicial: string;
    descuentoPagoInicial: string;
    plan: string;
    detalle: string;
    verDetalles: string;
    cotizarPlan: string;
    cotizacion: string;
    alcance: string;
    principios: string;
    adicionales: string;
    detalleAdicionales: string;
    volver: string;
    verAlcance: string;
    verAdicionales: string;
    verBase: string;
    consulta: string;
    proximamente: string;
  };
  comparacion: {
    titulo: string;
    paginas: string;
    unaPagina: string;
    cantidadPaginas: string;
    secciones: string;
    cantidadSecciones: string;
    panelAdministracion: string;
    panelIncluido: string;
    panelNoIncluido: string;
    correoDominio: string;
    propiedad: string;
    activosCliente: string;
    ajustes: string;
    ajustesIncluidos: string;
    plazoEntrega: string;
    reuniones: string;
    capacitacion: string;
    anterior: string;
    siguiente: string;
    ayudaCarrusel: string;
    carrusel: string;
    diapositiva: string;
    irAlPlan: string;
    posicion: string;
  };
  vitrina: {
    titulo: string;
    descripcion: string;
    tituloDetalle: string;
    introduccionDetalle: string;
    revisionDetalle: string;
    sumaPlan: string;
    verTodos: string;
    etiquetas: TextosTarjetaComponente;
  };
  filosofia: {
    titulo: string;
    introduccion: string;
    objetivos: string[];
    conclusion: string;
  };
  alcance: {
    introduccion: string;
    condiciones: string[];
  };
  principios: string[];
  adicionales: {
    nombre: string;
    costo: string;
  }[];
}
