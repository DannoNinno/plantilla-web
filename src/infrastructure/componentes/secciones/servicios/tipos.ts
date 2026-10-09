export interface Servicio {
  id: string;
  titulo: string;
  descripcion?: string;
}

export interface ServiciosProps {
  id?: string;
  titulo?: string;
  descripcion?: string;
  elementos?: readonly Servicio[];
}
