import type Database from 'better-sqlite3';

export type Celda = string | number | boolean | Date | null;
export type FilaExcel = Record<string, Celda>;

export interface ErrorExcel {
  hoja: string;
  fila: number;
  columna: string;
  mensaje: string;
}

export interface HojaExcel {
  nombre: string;
  columnas: string[];
  validar: (fila: FilaExcel) => {columna: string; mensaje: string}[];
}

export interface ContratoExcel {
  hojas: HojaExcel[];
  importar: (db: Database.Database, filas: Record<string, FilaExcel[]>) => void;
  exportar: (db: Database.Database) => Record<string, FilaExcel[]>;
}
