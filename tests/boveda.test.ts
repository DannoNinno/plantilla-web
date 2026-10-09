import {test} from 'node:test';
import assert from 'node:assert/strict';
import {existsSync, readdirSync, readFileSync} from 'node:fs';
import path from 'node:path';
import ts from 'typescript';
import {createElement} from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {Portada} from '../src/infrastructure/componentes/boveda/portada';
import {registro, getComponente} from '../src/infrastructure/componentes/boveda/registro';
import {negocio} from '../src/demo/negocio';
import {
  esPlanDemo,
  getPlanesDemo,
  getSeccionesPlan,
  seleccionarSecciones,
} from '../src/demo/planes';
import {FormularioContacto} from '../src/infrastructure/componentes/boveda/formulario-contacto';
import {
  validarConsulta,
  limitesContacto,
} from '../src/infrastructure/componentes/boveda/formulario-contacto/validacion';
import IndiceBoveda from '../src/infrastructure/componentes/demo/IndiceBoveda/IndiceBoveda';
import FichaComponente from '../src/infrastructure/componentes/demo/FichaComponente/FichaComponente';
import PaginaPlan from '../src/infrastructure/componentes/demo/PaginaPlan/PaginaPlan';
import HerramientasDemo from '../src/infrastructure/componentes/demo/HerramientasDemo/HerramientasDemo';
import tailwindConfig from '../tailwind.config';

test('la demo tiene una unica fuente JSON sin duplicar el negocio', () => {
  assert.deepEqual(negocio, JSON.parse(readFileSync('src/data/demo/negocio.json', 'utf8')));
  assert.equal(negocio.nombre, 'Café Aurora');
  assert.ok(negocio.sedes.length > 1);
  assert.ok(negocio.productos.length > 0);
  assert.ok(negocio.novedades.length > 0);
});

test('Portada funciona con props minimas, texto largo e imagen opcional', () => {
  const html = renderToStaticMarkup(createElement(Portada, {titulo: 'Título '.repeat(100)}));
  assert.equal(html.match(/<h1\b/g)?.length, 1);
  assert.doesNotMatch(html, /<img|<a\b|Café Aurora/);
  assert.ok(html.includes('break-words'));
  const ejemplo = renderToStaticMarkup(createElement(Portada, negocio.portada));
  assert.ok(ejemplo.includes('width="1600"'));
  assert.ok(ejemplo.includes('height="900"'));
  assert.ok(ejemplo.includes('href="#contacto"'));
});

test('las demos respetan 5 y 10 secciones y no cuentan las piezas siempre incluidas', () => {
  const entradas = Array.from({length: 12}, (_, indice) => ({
    slug: `seccion-${indice}`,
    planMinimo: 'presencia' as const,
    cuentaParaTope: true,
  }));
  const pie = {slug: 'pie', planMinimo: 'presencia' as const, cuentaParaTope: false};
  for (const [plan, limite] of [
    ['presencia', 5],
    ['captacion', 10],
  ] as const) {
    const seleccion = seleccionarSecciones([...entradas, pie], plan, limite);
    assert.equal(seleccion.filter((entrada) => entrada.cuentaParaTope).length, limite);
    assert.equal(seleccion.at(-1)?.slug, 'pie');
    assert.deepEqual(
      getSeccionesPlan(plan).map((entrada) => entrada.slug),
      ['portada', 'formulario-contacto'],
    );
  }
  assert.deepEqual(seleccionarSecciones([], 'presencia', 5), []);
  assert.deepEqual(seleccionarSecciones([{...pie, planMinimo: 'captacion'}], 'presencia', 5), []);
  assert.equal(esPlanDemo('desconocido'), false);
  assert.equal(esPlanDemo('captacion'), true);
});

test('el formulario valida vacios, correo, espacios y limites exactos', () => {
  const consulta = {
    nombre: 'Cliente ficticio',
    correo: 'cliente@ejemplo.invalid',
    mensaje: 'Hola, quiero conocer sus cafés.',
  };
  assert.deepEqual(validarConsulta(consulta, negocio.contacto), {});
  assert.equal(
    Object.keys(
      validarConsulta({nombre: ' ', correo: 'incorrecto', mensaje: '   '}, negocio.contacto),
    ).length,
    3,
  );
  for (const campo of ['nombre', 'correo', 'mensaje'] as const) {
    const invalida = {...consulta, [campo]: 'a'.repeat(limitesContacto[campo] + 1)};
    assert.equal(
      validarConsulta(invalida, negocio.contacto)[campo],
      negocio.contacto.textos.limite,
    );
  }
  assert.deepEqual(
    validarConsulta(
      {...consulta, nombre: 'a'.repeat(100), mensaje: 'a'.repeat(2000)},
      negocio.contacto,
    ),
    {},
  );
});

test('el formulario es aislable, etiqueta todos los campos y no envia sin JavaScript', () => {
  const html = renderToStaticMarkup(
    createElement(FormularioContacto, {
      campos: negocio.contacto.campos,
      textos: negocio.contacto.textos,
    }),
  );
  assert.doesNotMatch(html, /<h1\b|<h2\b|mailto:|action=/);
  assert.equal(html.match(/<label\b/g)?.length, 3);
  assert.ok(html.includes('<noscript>'));
  assert.match(html, /<button[^>]*type="submit"[^>]*disabled=""/);
  const doble = renderToStaticMarkup(
    createElement(
      'div',
      null,
      createElement(FormularioContacto, negocio.contacto),
      createElement(FormularioContacto, {...negocio.contacto, id: 'otro-contacto'}),
    ),
  );
  const ids = [...doble.matchAll(/\bid="([^"]+)"/g)].map((coincidencia) => coincidencia[1]);
  assert.equal(new Set(ids).size, ids.length);
});

test('el indice y las fichas se generan desde el registro con un solo h1', () => {
  const interfaz = negocio.interfaz;
  const indice = renderToStaticMarkup(
    createElement(IndiceBoveda, {
      entradas: registro,
      planes: getPlanesDemo(),
      textos: interfaz.boveda,
    }),
  );
  for (const entrada of registro) {
    assert.ok(indice.includes(`href="/componentes/${entrada.slug}"`));
    const ficha = renderToStaticMarkup(
      createElement(
        FichaComponente,
        {
          entrada,
          plan: interfaz.planes[entrada.planMinimo].nombre,
          textos: interfaz.boveda,
          aviso: interfaz.aviso,
          descripcionAviso: interfaz.detalleAviso,
        },
        entrada.renderizar(true),
      ),
    );
    assert.equal(ficha.match(/<h1\b/g)?.length, 1);
    assert.ok(ficha.includes('<table'));
    assert.ok(ficha.includes('Sitio de demostración'));
  }
  const vacio = renderToStaticMarkup(
    createElement(IndiceBoveda, {entradas: [], planes: getPlanesDemo(), textos: interfaz.boveda}),
  );
  assert.ok(vacio.includes(interfaz.boveda.vacio));
});

test('la pagina ensamblada contiene aviso, botonera y solo un h1', () => {
  const interfaz = negocio.interfaz;
  for (const plan of getPlanesDemo()) {
    const html = renderToStaticMarkup(
      createElement(
        PaginaPlan,
        {
          aviso: interfaz.aviso,
          descripcionAviso: interfaz.detalleAviso,
          fase: interfaz.fase,
          herramientas: {
            etiqueta: interfaz.herramientas,
            selector: interfaz.selector,
            portal: interfaz.portal,
            cotizacion: {...interfaz.cotizacion, href: plan.cotizacionHref},
            planes: getPlanesDemo(),
            actual: plan.id,
          },
        },
        getSeccionesPlan(plan.id).map((entrada) =>
          createElement('div', {key: entrada.slug}, entrada.renderizar()),
        ),
      ),
    );
    assert.equal(html.match(/<h1\b/g)?.length, 1);
    assert.ok(html.includes(`href="${plan.cotizacionHref.replace('&', '&amp;')}"`));
    assert.ok(html.includes('aria-current="page"'));
    assert.ok(html.includes('h-dvh'));
    assert.ok(html.includes('overflow-y-auto'));
    assert.ok(html.includes('shrink-0'));
  }
});

test('la botonera flotante distingue marca y planes con iconos sin repetir el aviso', () => {
  const interfaz = negocio.interfaz;
  const html = renderToStaticMarkup(
    createElement(HerramientasDemo, {
      etiqueta: interfaz.herramientas,
      selector: interfaz.selector,
      portal: interfaz.portal,
      cotizacion: interfaz.cotizacion,
      planes: getPlanesDemo(),
      actual: 'presencia',
    }),
  );
  assert.equal(html.match(/<svg\b/g)?.length, 4);
  assert.equal(html.match(/data-familia="marca"/g)?.length, 2);
  assert.equal(html.match(/data-familia="plan"/g)?.length, 2);
  assert.equal(html.match(/aria-current="page"/g)?.length, 1);
  assert.doesNotMatch(html, /Sitio de demostración|bg-brand-ink|(?:\s|")w-full(?:\s|")/);
  assert.ok(html.includes('aria-label="Volver a la cotización"'));
  assert.ok(html.includes('aria-label="Captación de Clientes"'));
  assert.ok(html.includes('>Cotizar</span>'));
  assert.ok(html.includes('shadow-lg'));
});

test('las nuevas piezas cumplen fragmentacion, Tailwind y paginas sin marcado propio', () => {
  function fuentes(directorio: string): string[] {
    return readdirSync(directorio, {withFileTypes: true}).flatMap((entrada) => {
      const ruta = path.join(directorio, entrada.name);
      return entrada.isDirectory() ? fuentes(ruta) : [ruta];
    });
  }
  const piezas = ['base', 'boveda', 'demo'].flatMap((carpeta) =>
    fuentes(path.join('src', 'infrastructure', 'componentes', carpeta)),
  );
  for (const ruta of piezas) {
    assert.doesNotMatch(ruta, /\.(css|scss)$/);
    if (!/\.(ts|tsx)$/.test(ruta)) continue;
    const contenido = readFileSync(ruta, 'utf8');
    assert.ok(contenido.split(/\r?\n/).length <= 150, `${ruta}: supera 150 lineas`);
    assert.doesNotMatch(
      contenido,
      /\bany\b|style=\{|@apply|(?:bg|text|mt|p|rounded|shadow)-\[/,
      ruta,
    );
    if (ruta.endsWith('.tsx') && ruta.includes(`${path.sep}boveda${path.sep}`)) {
      assert.doesNotMatch(contenido, /demo\/negocio|data\/|Café Aurora/, ruta);
      const fuente = ts.createSourceFile(
        ruta,
        contenido,
        ts.ScriptTarget.Latest,
        true,
        ts.ScriptKind.TSX,
      );
      function visitar(nodo: ts.Node) {
        if (ts.isJsxText(nodo)) assert.equal(nodo.text.trim(), '', `${ruta}: texto en duro`);
        ts.forEachChild(nodo, visitar);
      }
      visitar(fuente);
    }
  }
  for (const ruta of [
    'src/app/(portal)/componentes/page.tsx',
    'src/app/(portal)/componentes/[slug]/page.tsx',
    'src/app/(demo)/demo/[plan]/page.tsx',
    'src/app/(portal)/contacto/page.tsx',
  ]) {
    const fuente = ts.createSourceFile(
      ruta,
      readFileSync(ruta, 'utf8'),
      ts.ScriptTarget.Latest,
      true,
      ts.ScriptKind.TSX,
    );
    function visitar(nodo: ts.Node) {
      if (ts.isJsxOpeningElement(nodo) || ts.isJsxSelfClosingElement(nodo)) {
        assert.match(nodo.tagName.getText(fuente), /^[A-Z]/, `${ruta}: marcado de pagina`);
      }
      ts.forEachChild(nodo, visitar);
    }
    visitar(fuente);
  }
});

test('las imagenes del ejemplo existen y los colores de texto cumplen contraste AA', () => {
  for (const imagen of [negocio.portada.imagen, negocio.portada.logo]) {
    assert.ok(existsSync(path.join('public', ...imagen.src.split('/').filter(Boolean))));
    assert.ok(imagen.width > 0 && imagen.height > 0 && imagen.alt.length > 0);
  }
  function luminancia(hex: string) {
    const canales = [1, 3, 5].map((inicio) => {
      const canal = parseInt(hex.slice(inicio, inicio + 2), 16) / 255;
      return canal <= 0.04045 ? canal / 12.92 : ((canal + 0.055) / 1.055) ** 2.4;
    });
    return canales[0] * 0.2126 + canales[1] * 0.7152 + canales[2] * 0.0722;
  }
  const colores = tailwindConfig.theme.extend.colors.seccion;
  for (const [texto, fondo] of [
    [colores.tinta, colores.fondo],
    ['#FFFFFF', colores.acento],
  ]) {
    const valores = [luminancia(texto), luminancia(fondo)].sort((a, b) => b - a);
    assert.ok((valores[0] + 0.05) / (valores[1] + 0.05) >= 4.5);
  }
});

test('el registro conserva componentes, ejemplos tipados y metadatos unicos', () => {
  assert.equal(new Set(registro.map((entrada) => entrada.slug)).size, registro.length);
  assert.equal(getComponente('no-existe'), undefined);
  const portada = getComponente('portada');
  assert.ok(portada);
  assert.ok(portada.cuentaParaTope);
  assert.equal(portada.planMinimo, 'presencia');
  const aislado = renderToStaticMarkup(portada.renderizar(true));
  assert.doesNotMatch(aislado, /<h1\b|href="#contacto"/);
  assert.equal(aislado.match(/<h2\b/g)?.length, 1);
});
