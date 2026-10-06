import {test, after} from 'node:test';
import assert from 'node:assert/strict';
import {mkdtempSync, rmSync, readdirSync} from 'node:fs';
import {tmpdir} from 'node:os';
import path from 'node:path';
import ExcelJS from 'exceljs';
import {
  resolverSeleccion,
  seleccionInicial,
  validarRegistro,
  resolverConfiguracionSitio,
} from '../src/plataforma/componentes/seleccion';
import type {DefinicionComponente} from '../src/plataforma/componentes/tipos';
import {validarConsulta} from '../src/plataforma/contacto/validacion';
import {enlaceWhatsapp, mensajeSeleccion} from '../src/plataforma/contacto/mensaje';
import {crearHash, verificarPassword} from '../src/plataforma/auth/password';
import {getDb, consumirLimite} from '../src/plataforma/datos/sqlite';
import {getConsultas, guardarConsulta} from '../src/plataforma/datos/consultas';
import {CuerpoDemasiadoGrande, leerCuerpo} from '../src/plataforma/http/cuerpo';
import {leerExcel, importarExcel, exportarExcel} from '../src/plataforma/excel/servicio';
import type {ContratoExcel} from '../src/plataforma/excel/tipos';

const directorio = mkdtempSync(path.join(tmpdir(), 'dannotech-test-'));
const dataAnterior = process.env.DATA_DIR;
process.env.DATA_DIR = directorio;
after(() => {
  getDb().close();
  if (dataAnterior === undefined) delete process.env.DATA_DIR;
  else process.env.DATA_DIR = dataAnterior;
  rmSync(directorio, {recursive: true, force: true});
});

const definiciones: DefinicionComponente[] = [
  {id: 'base', nombre: 'Base', descripcionCorta: '', paquetes: {portal: 'base'}, dependencias: []},
  {
    id: 'extra',
    nombre: 'Extra',
    descripcionCorta: '',
    paquetes: {portal: 'opcional'},
    dependencias: ['base'],
  },
];

test('registro vacio y seleccion vacia funcionan', () => {
  validarRegistro([]);
  assert.deepEqual(seleccionInicial([], 'portal'), {ids: [], errores: []});
});

test('la base y las dependencias se resuelven sin importar componentes entre si', () => {
  assert.deepEqual(seleccionInicial(definiciones, 'portal').ids, ['base']);
  assert.deepEqual(resolverSeleccion(definiciones, 'portal', ['extra']).ids, ['base', 'extra']);
  assert.equal(resolverSeleccion(definiciones, 'landing', ['extra']).errores.length, 1);
});

test('retirar una entrada conserva el resto y reporta la dependencia ausente', () => {
  const resultado = resolverSeleccion([definiciones[1]], 'portal', ['extra']);
  assert.deepEqual(resultado.ids, []);
  assert.equal(resultado.errores.length, 1);
});

test('detecta ciclos e identificadores duplicados', () => {
  const ciclo = [{...definiciones[0], dependencias: ['extra']}, definiciones[1]];
  assert.match(resolverSeleccion(ciclo, 'portal', ['extra']).errores.join(' '), /circular/);
  assert.throws(() => validarRegistro([definiciones[0], definiciones[0]]), /duplicado/);
});

test('desactivar una dependencia del sitio no la vuelve a activar', () => {
  const seleccion = resolverConfiguracionSitio(definiciones, 'portal', {base: false, extra: true});
  assert.deepEqual(seleccion.ids, []);
  assert.equal(seleccion.errores.length, 1);
  assert.deepEqual(
    resolverConfiguracionSitio(definiciones, 'portal', {base: true, extra: true}).ids,
    ['base', 'extra'],
  );
});

test('una base con dependencia ausente sigue reportando el error', () => {
  const baseInvalida = [{...definiciones[0], dependencias: ['retirado']}];
  assert.equal(seleccionInicial(baseInvalida, 'portal').errores.length, 1);
});

test('contacto valida campos y no acepta selecciones arbitrarias', () => {
  assert.ok(
    validarConsulta({nombre: 'Daniel', correo: 'demo@example.test', mensaje: 'Consulta de prueba'})
      .consulta,
  );
  assert.ok(validarConsulta({nombre: '', correo: 'invalido', mensaje: 'corto'}).error);
  assert.ok(
    validarConsulta({
      nombre: 'Daniel',
      correo: 'demo@example.test',
      mensaje: 'Consulta de prueba',
      seleccion: {paquete: 'portal', componentes: [42]},
    }).error,
  );
});

test('WhatsApp permanece ausente sin numero y codifica el resumen', () => {
  assert.equal(enlaceWhatsapp('', 'hola'), null);
  const mensaje = mensajeSeleccion('Portal', ['Componente de prueba']);
  assert.match(enlaceWhatsapp('56912345678', mensaje)!, /https:\/\/wa.me\/56912345678\?text=/);
  assert.throws(() => enlaceWhatsapp('numero-invalido', mensaje));
});

test('las claves se verifican con hash y no texto plano', () => {
  const hash = crearHash('clave-temporal-de-prueba');
  assert.equal(verificarPassword('clave-temporal-de-prueba', hash), true);
  assert.equal(verificarPassword('otra-clave', hash), false);
});

test('SQLite usa WAL y registra migracion; limita solicitudes', () => {
  assert.equal(getDb().pragma('journal_mode', {simple: true}), 'wal');
  assert.equal(getDb().prepare('SELECT COUNT(*) FROM migraciones').pluck().get(), 1);
  assert.equal(consumirLimite('prueba', 1, 10000), true);
  assert.equal(consumirLimite('prueba', 1, 10000), false);
});

test('la consulta conserva la seleccion como datos tipados para el panel', () => {
  guardarConsulta({
    nombre: 'Prueba local',
    correo: 'panel@example.test',
    mensaje: 'Consulta temporal para validar el panel.',
    seleccion: {paquete: 'portal', componentes: []},
  });
  assert.deepEqual(getConsultas()[0].seleccion, {paquete: 'portal', componentes: []});
});

test('el cuerpo HTTP no puede superar el limite configurado', async () => {
  const valido = new Request('http://localhost', {method: 'POST', body: 'hola'});
  assert.equal(new TextDecoder().decode(await leerCuerpo(valido, 4)), 'hola');
  const grande = new Request('http://localhost', {method: 'POST', body: 'demasiado'});
  await assert.rejects(leerCuerpo(grande, 4), CuerpoDemasiadoGrande);
});

const contrato: ContratoExcel = {
  hojas: [
    {
      nombre: 'contenido',
      columnas: ['id', 'titulo'],
      validar: (fila) =>
        typeof fila.titulo !== 'string' || !fila.titulo.trim()
          ? [{columna: 'titulo', mensaje: 'El titulo es obligatorio.'}]
          : [],
    },
  ],
  importar: (db, filas) => {
    db.exec(
      'CREATE TABLE IF NOT EXISTS prueba_excel (id INTEGER PRIMARY KEY, titulo TEXT NOT NULL)',
    );
    for (const fila of filas.contenido) {
      db.prepare('INSERT INTO prueba_excel (id, titulo) VALUES (?, ?)').run(fila.id, fila.titulo);
    }
  },
  exportar: (db) => ({
    contenido: db.prepare('SELECT id, titulo FROM prueba_excel ORDER BY id').all() as {
      id: number;
      titulo: string;
    }[],
  }),
};

async function archivo(filas: (string | number | null)[][]) {
  const libro = new ExcelJS.Workbook();
  const hoja = libro.addWorksheet('contenido');
  hoja.addRow(['id', 'titulo']);
  filas.forEach((fila) => hoja.addRow(fila));
  return Buffer.from(await libro.xlsx.writeBuffer());
}

test('Excel informa fila y columna; no modifica contenido si una fila falla', async () => {
  const invalido = await archivo([
    [1, 'Correcto'],
    [2, null],
  ]);
  const resultado = await importarExcel('prueba', invalido, contrato);
  assert.equal(resultado.importado, false);
  assert.deepEqual(resultado.errores[0], {
    hoja: 'contenido',
    fila: 3,
    columna: 'titulo',
    mensaje: 'El titulo es obligatorio.',
  });
  assert.equal(
    getDb().prepare("SELECT name FROM sqlite_master WHERE name = 'prueba_excel'").get(),
    undefined,
  );
});

test('Excel importa, exporta y revierte toda la transaccion ante un error', async () => {
  assert.equal(
    (await importarExcel('prueba', await archivo([[1, 'Primero']]), contrato)).importado,
    true,
  );
  const exportado = Buffer.from(await exportarExcel(contrato));
  assert.equal((await leerExcel(exportado, contrato)).filas.contenido[0].titulo, 'Primero');
  await assert.rejects(
    importarExcel(
      'prueba',
      await archivo([
        [2, 'Segundo'],
        [1, 'Duplicado'],
      ]),
      contrato,
    ),
  );
  assert.equal(getDb().prepare('SELECT COUNT(*) FROM prueba_excel').pluck().get(), 1);
  assert.equal(readdirSync(path.join(directorio, 'importaciones')).length, 3);
});

test('Excel rechaza formulas y hojas faltantes', async () => {
  const libro = new ExcelJS.Workbook();
  const hoja = libro.addWorksheet('contenido');
  hoja.addRow(['id', 'titulo']);
  hoja.addRow([2, {formula: '1+1', result: 2}]);
  const resultado = await leerExcel(Buffer.from(await libro.xlsx.writeBuffer()), contrato);
  assert.match(resultado.errores[0].mensaje, /fórmulas/);
  const vacio = new ExcelJS.Workbook();
  const faltante = await leerExcel(Buffer.from(await vacio.xlsx.writeBuffer()), contrato);
  assert.equal(faltante.errores[0].fila, 1);
});
