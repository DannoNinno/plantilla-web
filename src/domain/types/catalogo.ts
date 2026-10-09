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
  };
  exploracion: {
    titulo: string;
    descripcion: string;
    sitio: string;
    detalleSitio: string;
    verPlanes: string;
    componentes: string;
    detalleComponentes: string;
    verComponentes: string;
    componentesHref: string;
    verDemo: string;
    detallePlan: string;
    fase: string;
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
