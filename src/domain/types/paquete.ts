export interface ComparacionPlan {
  paginasMaximas: number;
  seccionesPorPagina: number;
  panelAdministracion: boolean;
  correoDominio: boolean;
  plazoEntrega: string;
  reunionesIncluidas: string[];
  capacitacion: string;
}

export interface Paquete {
  id: string;
  habilitado: boolean;
  nombre: string;
  resumen: string;
  descripcion: string;
  precioDesde: number;
  precioPagoInicial?: number;
  comparacion?: ComparacionPlan;
  secciones: {
    titulo: string;
    descripcion?: string;
    elementos?: string[];
  }[];
}
