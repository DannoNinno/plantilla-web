export interface Paquete {
  id: string;
  nombre: string;
  resumen: string;
  descripcion: string;
  precioDesde: number;
  secciones: {
    titulo: string;
    descripcion?: string;
    elementos?: string[];
  }[];
}
