export interface Testimonio {
  id: string;
  texto: string;
  autor?: string;
  detalle?: string;
}

export interface TestimoniosProps {
  id?: string;
  titulo?: string;
  descripcion?: string;
  elementos?: readonly Testimonio[];
}
