import {test} from 'node:test';
import assert from 'node:assert/strict';
import {existsSync, readdirSync, readFileSync} from 'node:fs';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import ts from 'typescript';
import {redirigirHTTPS} from '../src/infrastructure/seguridad/https';

test('producción selecciona explícitamente el entorno raíz y ensayo conserva su selector', () => {
  const entorno = readFileSync('.env.production', 'utf8');
  assert.match(entorno, /^CLOUDFLARE_ENV=""\r?$/m);
  const manifiesto = JSON.parse(readFileSync('package.json', 'utf8')) as {
    scripts: Record<string, string>;
  };
  assert.match(manifiesto.scripts['deploy:staging'], /build --env staging/);
  assert.match(manifiesto.scripts['deploy:staging'], /deploy --env staging/);
});

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
  const expresion = ts.isExpressionStatement(sentencia)
    ? sentencia.expression
    : ts.isVariableStatement(sentencia) && sentencia.declarationList.declarations.length === 1
      ? sentencia.declarationList.declarations[0].initializer
      : undefined;
  if (!expresion || !ts.isAwaitExpression(expresion)) return false;
  const llamada = expresion.expression;
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
  assert.ok(paginas.length >= 1);
  for (const ruta of paginas) {
    const fuente = analizar(ruta);
    const cuerpo = funcionExportada(fuente, 'default');
    assert.ok(esGuarda(cuerpo.statements[0], 'exigirAdmin'), `${ruta} debe autenticar primero`);
    assert.match(
      fuente.text,
      /import\s*\{\s*exigirAdmin\s*\}\s*from\s*['"]@\/modules\/administracion\/proteccion['"]/,
    );
  }
});

test('cada endpoint administrativo privado comprueba origen y sesión antes de operar', () => {
  const rutas = archivos(path.join('src', 'app', 'api', 'admin'))
    .filter((ruta) => path.basename(ruta) === 'route.ts')
    .filter((ruta) => path.basename(path.dirname(ruta)) !== 'acceso');
  assert.ok(rutas.length >= 1);
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
      /import\s*\{\s*exigirAdminApi\s*\}\s*from\s*['"]@\/modules\/administracion\/proteccion['"]/,
    );
  }
});

test('la protección no depende de middleware ni proxy experimental', () => {
  assert.equal(existsSync(path.join('src', 'proxy.ts')), false);
  assert.equal(existsSync(path.join('src', 'middleware.ts')), false);
  const proteccion = analizar(path.join('src', 'modules', 'administracion', 'proteccion.ts'));
  for (const nombre of ['exigirAdmin', 'exigirAdminApi']) {
    const cuerpo = funcionExportada(proteccion, nombre).getText(proteccion);
    assert.match(cuerpo, /await verificarSesion\(/);
    assert.match(cuerpo, /await .*sesionVigente\(/);
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

test('la ruta configurable resuelve páginas y API sin redirigir en bucle', () => {
  execFileSync(
    process.execPath,
    [
      '--input-type=module',
      '-e',
      `
    import assert from 'node:assert/strict';
    import config from './src/infrastructure/configuracion/next.mjs';
    import admin from './src/data/administracion.json' with {type: 'json'};
    import pruebas from 'next/experimental/testing/server.js';
    for (const ruta of ['/admin', '/gestion', '/admin/privado']) {
      admin.rutaPanel = ruta;
      const reglas = await config.rewrites();
      assert.equal(reglas.beforeFiles[0].source, ruta + '/api/:path*');
      const api = await pruebas.unstable_getResponseFromNextConfig({
        url: 'https://prueba.example' + ruta + '/api/sesion/',
        nextConfig: config,
      });
      assert.equal(new URL(pruebas.getRewrittenUrl(api)).pathname, '/api/admin/sesion');
      if (ruta !== '/admin') {
        const pagina = await pruebas.unstable_getResponseFromNextConfig({
          url: 'https://prueba.example' + ruta + '/',
          nextConfig: config,
        });
        assert.equal(new URL(pruebas.getRewrittenUrl(pagina)).pathname, '/admin');
      }
      const cabeceras = await config.headers();
      assert.equal(cabeceras[0].source, ruta + '/:path*');
      assert.ok(cabeceras[0].headers.some(h => h.key === 'X-Robots-Tag' && h.value.includes('noindex')));
    }
  `,
    ],
    {stdio: 'pipe'},
  );
});

test('el layout privado también exige sesión y robots no revela la ruta del panel', () => {
  const fuente = analizar(path.join('src', 'app', 'admin', '(panel)', 'layout.tsx'));
  assert.ok(esGuarda(funcionExportada(fuente, 'default').statements[0], 'exigirAdmin'));
  const layout = readFileSync(path.join('src', 'app', 'admin', 'layout.tsx'), 'utf8');
  assert.match(layout, /robots:\s*\{index: false, follow: false\}/);
  for (const archivo of archivos('src/app')
    .concat(archivos('public'))
    .filter((ruta) => /robots\.(txt|ts|js)$/.test(ruta))) {
    assert.doesNotMatch(readFileSync(archivo, 'utf8'), /admin/i);
  }
});
