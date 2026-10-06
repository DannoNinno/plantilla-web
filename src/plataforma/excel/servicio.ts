import 'server-only';
import ExcelJS from 'exceljs';
import {randomUUID} from 'node:crypto';
import {mkdir, writeFile} from 'node:fs/promises';
import path from 'node:path';
import {getDb, getDirectorioDatos} from '../datos/sqlite';
import type {Celda, ContratoExcel, ErrorExcel, FilaExcel} from './tipos';

const MAX_FILAS = 5000;
export class ArchivoExcelInvalido extends Error {}

function celda(valor: ExcelJS.CellValue): Celda | undefined {
  if (valor === null || valor === undefined) return null;
  if (
    typeof valor === 'string' ||
    typeof valor === 'number' ||
    typeof valor === 'boolean' ||
    valor instanceof Date
  )
    return valor;
  return undefined;
}

export async function leerExcel(buffer: Buffer, contrato: ContratoExcel) {
  const libro = new ExcelJS.Workbook();
  try {
    await libro.xlsx.load(new Uint8Array(buffer).buffer);
  } catch (causa) {
    throw new ArchivoExcelInvalido('El archivo no contiene un libro Excel válido.', {cause: causa});
  }
  const errores: ErrorExcel[] = [];
  const filas: Record<string, FilaExcel[]> = {};
  for (const pagina of libro.worksheets) {
    if (!contrato.hojas.some((hoja) => hoja.nombre === pagina.name)) {
      errores.push({
        hoja: pagina.name,
        fila: 1,
        columna: '',
        mensaje: 'Esta hoja no está definida para el componente.',
      });
    }
  }
  for (const hoja of contrato.hojas) {
    const pagina = libro.getWorksheet(hoja.nombre);
    filas[hoja.nombre] = [];
    if (!pagina) {
      errores.push({hoja: hoja.nombre, fila: 1, columna: '', mensaje: 'Falta esta hoja.'});
      continue;
    }
    if (pagina.rowCount > MAX_FILAS + 1 || pagina.columnCount > 100) {
      errores.push({
        hoja: hoja.nombre,
        fila: 1,
        columna: '',
        mensaje: `La hoja excede ${MAX_FILAS} filas o 100 columnas.`,
      });
      continue;
    }
    const encabezados: string[] = [];
    pagina.getRow(1).eachCell({includeEmpty: true}, (entrada, indice) => {
      encabezados[indice - 1] = typeof entrada.value === 'string' ? entrada.value.trim() : '';
    });
    if (
      encabezados.length !== hoja.columnas.length ||
      encabezados.some((columna, indice) => columna !== hoja.columnas[indice])
    ) {
      errores.push({
        hoja: hoja.nombre,
        fila: 1,
        columna: '',
        mensaje: `Columnas esperadas en orden: ${hoja.columnas.join(', ')}.`,
      });
      continue;
    }
    for (let numero = 2; numero <= pagina.rowCount; numero++) {
      const fila = pagina.getRow(numero);
      if (!fila.hasValues) continue;
      const valores: FilaExcel = {};
      hoja.columnas.forEach((columna, indice) => {
        const valor = celda(fila.getCell(indice + 1).value);
        if (valor === undefined)
          errores.push({
            hoja: hoja.nombre,
            fila: numero,
            columna,
            mensaje: 'No se permiten fórmulas ni valores complejos.',
          });
        else valores[columna] = valor;
      });
      for (const error of hoja.validar(valores))
        errores.push({hoja: hoja.nombre, fila: numero, ...error});
      filas[hoja.nombre].push(valores);
    }
  }
  return {filas, errores};
}

export async function importarExcel(componente: string, buffer: Buffer, contrato: ContratoExcel) {
  const fecha = new Date().toISOString();
  const nombre = `${fecha.replace(/[:.]/g, '-')}-${randomUUID()}.xlsx`;
  const directorio = path.join(getDirectorioDatos(), 'importaciones');
  await mkdir(directorio, {recursive: true});
  await writeFile(path.join(directorio, nombre), buffer, {flag: 'wx'});
  const db = getDb();
  const id = db
    .prepare('INSERT INTO importaciones (componente, archivo, fecha, estado) VALUES (?, ?, ?, ?)')
    .run(componente, nombre, fecha, 'recibido').lastInsertRowid;
  try {
    const resultado = await leerExcel(buffer, contrato);
    if (resultado.errores.length) {
      db.prepare('UPDATE importaciones SET estado = ? WHERE id = ?').run('invalido', id);
      return {importado: false, errores: resultado.errores};
    }
    db.transaction(() => {
      contrato.importar(db, resultado.filas);
      db.prepare('UPDATE importaciones SET estado = ? WHERE id = ?').run('importado', id);
    })();
    return {importado: true, errores: []};
  } catch (causa) {
    db.prepare('UPDATE importaciones SET estado = ? WHERE id = ?').run('error', id);
    throw causa;
  }
}

export async function exportarExcel(contrato: ContratoExcel) {
  const libro = new ExcelJS.Workbook();
  const filas = contrato.exportar(getDb());
  for (const hoja of contrato.hojas) {
    const pagina = libro.addWorksheet(hoja.nombre);
    pagina.addRow(hoja.columnas);
    if (!filas[hoja.nombre])
      throw new Error(`El componente no entregó datos para exportar la hoja ${hoja.nombre}.`);
    for (const fila of filas[hoja.nombre])
      pagina.addRow(hoja.columnas.map((columna) => fila[columna] ?? null));
    pagina.getRow(1).font = {bold: true};
  }
  return libro.xlsx.writeBuffer();
}
