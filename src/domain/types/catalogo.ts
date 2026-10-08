export interface CatalogoServicios {
  filosofia: {
    titulo: string;
    introduccion: string;
    objetivos: string[];
    conclusion: string;
  };
  alcance: {
    introduccion: string;
    condiciones: string[];
  };
  principios: string[];
  adicionales: {
    nombre: string;
    costo: string;
  }[];
}
