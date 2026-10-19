import type {ImagenContenidoDatos} from '../../base/ImagenContenido/ImagenContenido';
export interface ProductoCatalogo {
  id: string;
  nombre: string;
  descripcion?: string;
  precio?: number;
  imagen?: ImagenContenidoDatos;
}
export interface CatalogoSinCompraProps {
  id?: string;
  titulo?: string;
  descripcion?: string;
  productos?: readonly ProductoCatalogo[];
  textoConsulta: string;
  hrefConsulta: string;
}
