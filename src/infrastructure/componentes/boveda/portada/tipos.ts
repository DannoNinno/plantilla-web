export interface PortadaProps {
  titulo: string;
  id?: string;
  etiqueta?: string;
  descripcion?: string;
  nivelTitulo?: 'h1' | 'h2';
  accion?: {texto: string; href: string};
  imagen?: {src: string; alt: string; width: number; height: number};
}
