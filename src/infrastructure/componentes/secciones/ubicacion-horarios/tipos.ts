export interface UbicacionHorariosProps {
  id?: string;
  titulo?: string;
  descripcion?: string;
  nombre?: string;
  direccion?: string;
  horarios?: string;
  etiquetaDireccion: string;
  etiquetaHorarios: string;
  imagen?: {src: string; alt: string; width: number; height: number};
}
