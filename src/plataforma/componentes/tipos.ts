import type {ComponentType} from 'react';
import type {ContratoExcel} from '@/plataforma/excel/tipos';

export interface DefinicionComponente {
  id: string;
  nombre: string;
  descripcionCorta: string;
  paquetes: Record<string, 'base' | 'opcional'>;
  dependencias: string[];
}

export type DatoPublico =
  null | string | number | boolean | DatoPublico[] | {[clave: string]: DatoPublico};

export interface PropsPublico {
  modo: 'sitio' | 'demo';
  datos: DatoPublico;
}

export interface DatosComponente {
  getPublico: () => Promise<DatoPublico> | DatoPublico;
  excel?: ContratoExcel;
}

export interface ComponenteRegistrado {
  definicion: DefinicionComponente;
  Publico: ComponentType<PropsPublico>;
  Admin?: ComponentType;
  demo: DatoPublico;
  datos?: () => Promise<DatosComponente>;
}
