import Image from 'next/image';

export interface ImagenContenidoDatos {
  src: string;
  alt: string;
  width: number;
  height: number;
}

export interface ImagenContenidoProps {
  imagen: ImagenContenidoDatos;
  sizes?: string;
}

export default function ImagenContenido({
  imagen,
  sizes = '(max-width: 767px) 100vw, 50vw',
}: ImagenContenidoProps) {
  return <Image {...imagen} alt={imagen.alt} sizes={sizes} className="h-auto w-full rounded-2xl" />;
}
