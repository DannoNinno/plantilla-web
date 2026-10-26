import {test} from 'node:test';
import assert from 'node:assert/strict';
import {existsSync, readdirSync, readFileSync} from 'node:fs';
import path from 'node:path';
import ts from 'typescript';
import {redirigirHTTPS} from '../src/infrastructure/seguridad/https';

test('HTTPS conserva host, ruta y parámetros; solo permite HTTP en loopback', () => {
  for (const host of ['dannotech.cl', 'www.dannotech.cl', 'dannotech-ensayo.example.workers.dev']) {
    const peticion = new Request(`http://${host}/admin/acceso/?origen=prueba`);
    const respuesta = redirigirHTTPS(peticion);
    assert.ok(respuesta);
    assert.equal(respuesta?.status, 301);
    assert.equal(respuesta.headers.get('location'), `https://${host}/admin/acceso/?origen=prueba`);
    assert.equal(redirigirHTTPS(new Request(`https://${host}/`)), undefined);
    assert.equal(
      redirigirHTTPS(new Request(`http://${host}/api/formularios/`, {method: 'POST'}))?.status,
      308,
    );
  }
  for (const host of ['localhost', '127.0.0.1', '[::1]']) {
    assert.equal(redirigirHTTPS(new Request(`http://${host}:3108/`)), undefined);
  }
  assert.equal(redirigirHTTPS(new Request('http://localhost.example/'))?.status, 301);
});

function archivos(directorio: string): string[] {
  return readdirSync(directorio, {withFileTypes: true}).flatMap((entrada) => {
    const ruta = path.join(directorio, entrada.name);
    return entrada.isDirectory() ? archivos(ruta) : [ruta];
  });
}

function analizar(ruta: string) {
  return ts.createSourceFile(
    ruta,
    readFileSync(ruta, 'utf8'),
    ts.ScriptTarget.Latest,
    true,
    ruta.endsWith('.tsx') ? ts.ScriptKind.TSX : ts.ScriptKind.TS,
  );
}

function funcionExportada(fuente: ts.SourceFile, nombre: string) {
  const funcion = fuente.statements.find(
    (nodo): nodo is ts.FunctionDeclaration =>
      ts.isFunctionDeclaration(nodo) &&
      nodo.modifiers?.some((modificador) => modificador.kind === ts.SyntaxKind.ExportKeyword) ===
        true &&
      (nombre === 'default'
        ? nodo.modifiers.some((modificador) => modificador.kind === ts.SyntaxKind.DefaultKeyword)
        : nodo.name?.text === nombre),
  );
  assert.ok(funcion?.body, `Falta la función exportada ${nombre} en ${fuente.fileName}`);
  return funcion.body;
}

function esGuarda(sentencia: ts.Statement, nombre: string): boolean {
  if (!ts.isExpressionStatement(sentencia) || !ts.isAwaitExpression(sentencia.expression))
    return false;
  const llamada = sentencia.expression.expression;
  return (
    ts.isCallExpression(llamada) &&
    ts.isIdentifier(llamada.expression) &&
    llamada.expression.text === nombre
  );
}

test('cada página privada autentica antes de leer parámetros, datos o renderizar', () => {
  const paginas = archivos(path.join('src', 'app', 'admin'))
    .filter((ruta) => path.basename(ruta) === 'page.tsx')
    .filter((ruta) => path.basename(path.dirname(ruta)) !== 'acceso');
  assert.ok(paginas.length >= 2);
  for (const ruta of paginas) {
    const fuente = analizar(ruta);
    const cuerpo = funcionExportada(fuente, 'default');
    assert.ok(esGuarda(cuerpo.statements[0], 'exigirAdmin'), `${ruta} debe autenticar primero`);
    assert.match(
      fuente.text,
      /import\s*\{\s*exigirAdmin\s*\}\s*from\s*['"]@\/modules\/formularios\/admin\/proteccion['"]/,
    );
  }
});

test('cada endpoint administrativo privado comprueba origen y sesión antes de operar', () => {
  const rutas = archivos(path.join('src', 'app', 'api', 'admin'))
    .filter((ruta) => path.basename(ruta) === 'route.ts')
    .filter((ruta) => path.basename(path.dirname(ruta)) !== 'acceso');
  assert.ok(rutas.length >= 3);
  for (const ruta of rutas) {
    const fuente = analizar(ruta);
    const cuerpo = funcionExportada(fuente, 'POST');
    const intento = cuerpo.statements[0];
    assert.ok(ts.isTryStatement(intento), `${ruta} debe manejar errores explícitamente`);
    const [origen, sesion] = intento.tryBlock.statements;
    assert.ok(ts.isExpressionStatement(origen) && ts.isCallExpression(origen.expression));
    assert.equal(origen.expression.expression.getText(fuente), 'validarOrigen');
    assert.ok(esGuarda(sesion, 'exigirAdminApi'), `${ruta} debe autenticar antes de operar`);
    assert.match(
      fuente.text,
      /import\s*\{\s*exigirAdminApi\s*\}\s*from\s*['"]@\/modules\/formularios\/admin\/proteccion['"]/,
    );
  }
});

test('la protección no depende de middleware ni proxy experimental', () => {
  assert.equal(existsSync(path.join('src', 'proxy.ts')), false);
  assert.equal(existsSync(path.join('src', 'middleware.ts')), false);
  const proteccion = analizar(path.join('src', 'modules', 'formularios', 'admin', 'proteccion.ts'));
  for (const nombre of ['exigirAdmin', 'exigirAdminApi']) {
    const cuerpo = funcionExportada(proteccion, nombre).getText(proteccion);
    assert.match(cuerpo, /await verificarSesion\(/);
  }
  const config = readFileSync(
    path.join('src', 'infrastructure', 'configuracion', 'next.mjs'),
    'utf8',
  );
  assert.match(config, /\/admin\/:path\*/);
  assert.match(config, /\/api\/admin\/:path\*/);
  assert.match(config, /private, no-store/);
  assert.match(config, /noindex, nofollow/);
});
