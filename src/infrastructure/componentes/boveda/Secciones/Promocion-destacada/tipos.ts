import type {ImagenContenidoDatos} from '../../Base/ImagenContenido/ImagenContenido';
export interface PromocionDestacadaProps {
  id?: string;
  titulo?: string;
  descripcion?: string;
  etiqueta?: string;
  imagen?: ImagenContenidoDatos;
  accion?: {texto: string; href: string};
}
