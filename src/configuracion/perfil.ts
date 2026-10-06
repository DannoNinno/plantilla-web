export interface Proyecto {
  id: string;
  nombre: string;
  problema: string;
  solucion: string;
  resultado: string;
  enlace?: string;
}

export const perfil: {
  presentacion: string;
  experiencia: string[];
  competencias: string[];
  proyectos: Proyecto[];
} = {
  presentacion: '',
  experiencia: [],
  competencias: [],
  proyectos: [],
};
