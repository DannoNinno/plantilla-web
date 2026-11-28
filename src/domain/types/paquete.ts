export interface Paquete {
  id: string;
  habilitado: boolean;
  nombre: string;
  resumen: string;
  descripcion: string;
  precioDesde: number;
  precioPagoInicial?: number;
  puntos?: string[];
  secciones: {
    titulo: string;
    descripcion?: string;
    elementos?: string[];
  }[];
}
