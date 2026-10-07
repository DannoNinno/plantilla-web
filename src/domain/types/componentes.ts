export interface DefinicionComponente {
  id: string;
  nombre: string;
  descripcionCorta: string;
  paquetes: Record<string, 'base' | 'opcional'>;
  dependencias: string[];
}

export interface ResultadoSeleccion {
  ids: string[];
  errores: string[];
}
