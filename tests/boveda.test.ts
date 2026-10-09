import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createElement} from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {Portada} from '../src/infrastructure/componentes/boveda/portada';
import {registro, getComponente} from '../src/infrastructure/componentes/boveda/registro';
import {negocio} from '../src/demo/negocio';

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
  assert.ok(ejemplo.includes('width="960"'));
  assert.ok(ejemplo.includes('height="720"'));
  assert.ok(ejemplo.includes('href="#contacto"'));
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
