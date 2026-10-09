import type {ImagenContenidoDatos} from '../../base/ImagenContenido/ImagenContenido';
export interface PromocionDestacadaProps {
  id?: string;
  titulo?: string;
  descripcion?: string;
  etiqueta?: string;
  imagen?: ImagenContenidoDatos;
  accion?: {texto: string; href: string};
}
