export interface Proyecto {
  id: string;
  nombre: string;
  contexto: string;
  tecnologias: string[];
  problema: string;
  solucion: string;
  resultado: string;
  enlace?: string;
}

export interface Capacidad {
  id: string;
  nombre: string;
  enfoque: string;
  tecnologias: string[];
  contexto: string;
}

export interface Experiencia {
  empresa: string;
  cargo: string;
  periodo: string;
  actual: boolean;
  descripcion: string;
  aportes: string[];
}

export interface Perfil {
  nombre: string;
  cabecera: {
    nombre: string;
    apellido: string;
    iniciales: string;
    formacion: string;
    idioma: string;
  };
  cargo: string;
  especialidad: string;
  presentacion: string;
  principio: string;
  experiencia: Experiencia[];
  capacidades: Capacidad[];
  competencias: string[];
  formacion: {titulo: string; institucion: string; periodo: string};
  idiomas: {nombre: string; nivel: string; certificacion: string}[];
  proyectos: Proyecto[];
}
