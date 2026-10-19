import type {TextosTarjetaComponente} from './componentes';

export interface CatalogoServicios {
  presentacion: {
    etiqueta: string;
    titulo: string;
    introduccion: string;
    revision: string;
  };
  planes: {
    titulo: string;
    precios: string;
    avisoSinPagos: string;
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
  detalle: {
    revision: string;
    volver: string;
    contactoCargando: string;
    planNoDisponible: string;
    inicio: {etiqueta: string; descripcion: string; cotizar: string};
    final: {etiqueta: string; descripcion: string; cotizar: string};
  };
  tituloAdicionales: string;
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
  tarjetasPlan: {
    etiqueta: string;
    verDetalle: string;
    proximamente: string;
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
