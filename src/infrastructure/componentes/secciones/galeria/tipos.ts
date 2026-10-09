export interface ImagenGaleria {
  id: string;
  src: string;
  alt: string;
  width: number;
  height: number;
  leyenda?: string;
}

export interface GaleriaProps {
  id?: string;
  titulo?: string;
  descripcion?: string;
  imagenes?: readonly ImagenGaleria[];
}
