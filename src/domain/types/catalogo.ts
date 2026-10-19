import type {TextosTarjetaComponente} from './componentes';

export interface CatalogoServicios {
  textos: {
    etiqueta: string;
    titulo: string;
    identidad: string;
    presentacion: string;
    planes: string;
    precios: string;
    plan: string;
    detalle: string;
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
    secciones: string;
    cantidadSecciones: string;
    panelAdministracion: string;
    panelIncluido: string;
    panelNoIncluido: string;
    plazoEntrega: string;
    reuniones: string;
    capacitacion: string;
    caracteristica: string;
    proximamente: string;
    noDisponible: string;
    verPlan: string;
    anterior: string;
    siguiente: string;
    ayudaCarrusel: string;
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
