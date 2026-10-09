import type {ImagenContenidoDatos} from '../../base/ImagenContenido/ImagenContenido';
export interface PersonaEquipo {
  id: string;
  nombre: string;
  rol?: string;
  imagen?: ImagenContenidoDatos;
}
export interface EquipoProps {
  id?: string;
  titulo?: string;
  descripcion?: string;
  personas?: readonly PersonaEquipo[];
}
