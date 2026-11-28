import type {ImagenContenidoDatos} from '../../Base/ImagenContenido/ImagenContenido';
export interface Novedad {
  id: string;
  titulo: string;
  descripcion?: string;
  fecha?: string;
  imagen?: ImagenContenidoDatos;
}
export interface NovedadesProps {
  id?: string;
  titulo?: string;
  descripcion?: string;
  elementos?: readonly Novedad[];
}
