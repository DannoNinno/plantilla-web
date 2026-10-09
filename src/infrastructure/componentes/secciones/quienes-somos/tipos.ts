export interface QuienesSomosProps {
  id?: string;
  titulo?: string;
  descripcion?: string;
  parrafos?: readonly string[];
  imagen?: {src: string; alt: string; width: number; height: number};
}
