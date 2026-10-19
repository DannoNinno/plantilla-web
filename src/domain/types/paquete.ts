export interface ComparacionPlan {
  seccionesMaximas: number;
  panelAdministracion: boolean;
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
  comparacion?: ComparacionPlan;
  secciones: {
    titulo: string;
    descripcion?: string;
    elementos?: string[];
  }[];
}
