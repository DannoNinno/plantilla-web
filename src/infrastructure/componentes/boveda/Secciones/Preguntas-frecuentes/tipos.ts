export interface Pregunta {
  id: string;
  pregunta: string;
  respuesta: string;
}

export interface PreguntasFrecuentesProps {
  id?: string;
  titulo?: string;
  descripcion?: string;
  elementos?: readonly Pregunta[];
}
