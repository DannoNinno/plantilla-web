import type {ImagenContenidoDatos} from '../../base/ImagenContenido/ImagenContenido';
export interface Sede {
  id: string;
  nombre: string;
  direccion?: string;
  horarios?: string;
  imagen?: ImagenContenidoDatos;
}
export interface SedesProps {
  id?: string;
  titulo?: string;
  descripcion?: string;
  sedes?: readonly Sede[];
  etiquetaDireccion: string;
  etiquetaHorarios: string;
}
