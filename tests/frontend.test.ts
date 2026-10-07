import {test} from 'node:test';
import assert from 'node:assert/strict';
import {existsSync, readdirSync, readFileSync} from 'node:fs';
import path from 'node:path';
import {createElement} from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {
  getComponentes,
  getNavegacion,
  getPaquete,
  getPaquetes,
  getPerfil,
  getSitio,
} from '../src/infrastructure/handlers/datos';
import {
  resolverSeleccion,
  seleccionInicial,
  validarRegistro,
} from '../src/domain/casos-de-uso/componentes/seleccion';
import {enlaceWhatsapp, mensajeSeleccion} from '../src/domain/servicios/contacto';
import type {DefinicionComponente} from '../src/domain/types/componentes';
import Contacto from '../src/infrastructure/componentes/Contacto/Contacto';
import tailwindConfig, {coloresMarca} from '../tailwind.config';

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

function fuentes(directorio: string): string[] {
  return readdirSync(directorio, {withFileTypes: true}).flatMap((entrada) => {
    const ruta = path.join(directorio, entrada.name);
    if (entrada.isDirectory()) return fuentes(ruta);
    return /\.(ts|tsx|mjs)$/.test(entrada.name) ? [ruta] : [];
  });
}

test('la estructura conserva las capas y todos los datos son JSON', () => {
  assert.deepEqual(readdirSync('src').sort(), ['app', 'data', 'domain', 'infrastructure']);
  assert.deepEqual(readdirSync('src/data').sort(), [
    'componentes.json',
    'navegacion.json',
    'paquetes.json',
    'perfil.json',
    'sitio.json',
  ]);
  assert.equal(existsSync('src/app/api'), false);
  assert.equal(existsSync('src/app/admin'), false);
  assert.equal(existsSync('src/infrastructure/repositorios'), false);
});

test('el codigo del frontend no contiene integraciones de backend', () => {
  for (const ruta of fuentes('src')) {
    assert.doesNotMatch(
      readFileSync(ruta, 'utf8'),
      /better-sqlite3|exceljs|server-only|next\/headers|node:crypto|['"]use server['"]|\bfetch\s*\(/,
      ruta,
    );
  }
  const manifiesto = JSON.parse(readFileSync('package.json', 'utf8'));
  for (const dependencia of ['better-sqlite3', 'exceljs', 'server-only']) {
    assert.equal(dependencia in manifiesto.dependencies, false);
  }
});

test('los handlers consumen los JSON sin duplicar los datos', () => {
  const casos = [
    ['sitio', getSitio()],
    ['perfil', getPerfil()],
    ['paquetes', getPaquetes()],
    ['componentes', getComponentes()],
    ['navegacion', getNavegacion()],
  ];
  for (const [nombre, datos] of casos) {
    const json = JSON.parse(readFileSync(path.join('src', 'data', `${nombre}.json`), 'utf8'));
    assert.deepEqual(datos, json);
  }
});

test('los datos conservan identidad, perfil y paquetes', () => {
  assert.equal(getSitio().nombre, 'dannotech');
  assert.equal(getPerfil().nombre, 'Daniel Salamanca Jorquera');
  assert.equal(getPerfil().capacidades.length, 6);
  assert.equal(getPerfil().experiencia.length, 2);
  assert.equal(getPerfil().proyectos.length, 2);
  assert.deepEqual(
    getPaquetes().map((paquete) => paquete.id),
    ['landing', 'portal'],
  );
  assert.equal(getPaquete('landing')?.nombre, 'Landing');
  assert.equal(getPaquete('inexistente'), undefined);
});

test('Tailwind es la unica fuente de la paleta y las animaciones', () => {
  assert.equal('colores' in getSitio(), false);
  assert.equal(coloresMarca.ink, '#04182F');
  assert.equal(coloresMarca.sky, '#22C3F5');
  assert.equal(coloresMarca.coral, '#FF6B4A');
  assert.equal(tailwindConfig.theme.extend.colors.brand.ink, coloresMarca.ink);
  assert.equal(tailwindConfig.theme.extend.animation.intro, 'entrada 650ms ease-out both');
  assert.equal(tailwindConfig.theme.extend.animation.pagina, 'entrada 300ms ease-out both');
  assert.deepEqual(tailwindConfig.theme.extend.fontFamily.sans, [
    'Poppins',
    'system-ui',
    'sans-serif',
  ]);
});

test('el hover de todas las capacidades comparte trazos y brillo acotados sin bucles', () => {
  const animaciones = tailwindConfig.theme.extend.animation;
  assert.equal(
    animaciones['perfil-icono'],
    'perfil-icono 900ms cubic-bezier(0.22, 1, 0.36, 1) both',
  );
  assert.equal(animaciones['capacidad-trazo'], 'capacidad-trazo 700ms ease-out both');
  assert.equal(animaciones['capacidad-brillo'], 'capacidad-brillo 850ms ease-out both');
  for (const nombre of ['perfil-icono', 'capacidad-trazo', 'capacidad-brillo'] as const) {
    assert.doesNotMatch(animaciones[nombre], /infinite/);
  }
  const perfil = readFileSync('src/app/perfil/page.tsx', 'utf8');
  assert.match(perfil, /fine-pointer:hover:bg-brand-sky\/\[0\.12\]/);
  assert.match(perfil, /motion-safe:fine-pointer:group-hover\/capacidad:animate-perfil-icono/);
  assert.match(perfil, /motion-safe:fine-pointer:group-hover\/capacidad:animate-capacidad-brillo/);
  assert.ok(
    perfil.includes('motion-safe:fine-pointer:group-hover/capacidad:[&>*]:animate-capacidad-trazo'),
  );
  assert.ok(
    perfil.includes('motion-safe:fine-pointer:group-hover/capacidad:[&>*]:[stroke-dasharray:80]'),
  );
  assert.doesNotMatch(perfil, /capacidad\.id === 'frontend'/);
  assert.equal(
    tailwindConfig.theme.extend.keyframes['capacidad-trazo'].from.strokeDashoffset,
    '80',
  );
});

test('las capacidades, formacion, idiomas y titulo comparten efectos simples y accesibles', () => {
  const animaciones = tailwindConfig.theme.extend.animation;
  assert.equal(animaciones['perfil-titulo'], 'perfil-titulo 650ms ease-out both');
  for (const nombre of ['perfil-icono', 'perfil-titulo'] as const) {
    assert.doesNotMatch(animaciones[nombre], /infinite/);
    assert.match(animaciones[nombre], /\bboth$/);
    assert.deepEqual(
      tailwindConfig.theme.extend.keyframes[nombre]['0%, 100%'],
      nombre === 'perfil-icono'
        ? {transform: 'translateY(0) rotate(0) scale(1)'}
        : {transform: 'translateX(0)'},
    );
  }
  const perfil = readFileSync('src/app/perfil/page.tsx', 'utf8');
  assert.equal(
    perfil.match(/motion-safe:fine-pointer:group-hover\/capacidad:animate-perfil-icono/g)?.length,
    1,
  );
  for (const grupo of ['formacion', 'idioma']) {
    assert.ok(
      perfil.includes(`motion-safe:fine-pointer:group-hover/${grupo}:animate-perfil-icono`),
    );
  }
  assert.equal(
    perfil.match(/motion-safe:fine-pointer:group-hover\/titulo:animate-perfil-titulo/g)?.length,
    2,
  );
});

test('el CSS global solo contiene las directivas de Tailwind y no hay clases CSS propias', () => {
  const css = readFileSync('src/app/globals.css', 'utf8').trim();
  assert.deepEqual(css.split(/\r?\n/), [
    '@tailwind base;',
    '@tailwind components;',
    '@tailwind utilities;',
  ]);
  const clasesAnteriores = new Set([
    'boton',
    'campo',
    'tarjeta',
    'etiqueta',
    'puerta',
    'puerta--catalogo',
    'puerta--perfil',
    'intro',
    'intro-line',
    'pagina',
    'perfil-portafolio',
    'perfil-hero',
    'perfil-stats',
    'entradas',
    'entradas-opciones',
    'puerta-icono',
    'puerta-descripcion',
    'puerta-enlace',
    'salto-contenido',
  ]);
  for (const ruta of fuentes('src')) {
    const fuente = readFileSync(ruta, 'utf8');
    assert.doesNotMatch(fuente, /\bstyle=\{|--dt-|--altura-cabecera/, ruta);
    for (const coincidencia of fuente.matchAll(/className="([^"]*)"/g)) {
      for (const clase of coincidencia[1].split(/\s+/)) {
        assert.equal(clasesAnteriores.has(clase), false, `${ruta}: ${clase}`);
      }
    }
  }
});

test('la navegacion no apunta a administracion ni a endpoints eliminados', () => {
  const navegacion = getNavegacion();
  assert.deepEqual(
    navegacion.principal.map((link) => link.href),
    ['/catalogo', '/perfil'],
  );
  assert.deepEqual(navegacion.pie, [{label: 'Contacto', href: '/perfil#contacto'}]);
  for (const link of [...navegacion.principal, ...navegacion.pie]) {
    assert.doesNotMatch(link.href, /^\/(admin|api)(\/|$)/);
  }
});

test('el registro vacio conserva el estado inicial del configurador', () => {
  validarRegistro(getComponentes());
  assert.deepEqual(seleccionInicial(getComponentes(), 'portal'), {ids: [], errores: []});
});

test('la seleccion local conserva bases y dependencias', () => {
  assert.deepEqual(seleccionInicial(definiciones, 'portal').ids, ['base']);
  assert.deepEqual(resolverSeleccion(definiciones, 'portal', ['extra']).ids, ['base', 'extra']);
  assert.equal(resolverSeleccion(definiciones, 'landing', ['extra']).errores.length, 1);
});

test('las definiciones ausentes, duplicadas y circulares se reportan', () => {
  const ausente = resolverSeleccion([definiciones[1]], 'portal', ['extra']);
  assert.deepEqual(ausente.ids, []);
  assert.equal(ausente.errores.length, 1);
  const ciclo = [{...definiciones[0], dependencias: ['extra']}, definiciones[1]];
  assert.match(resolverSeleccion(ciclo, 'portal', ['extra']).errores.join(' '), /circular/);
  assert.throws(() => validarRegistro([definiciones[0], definiciones[0]]), /duplicado/);
});

test('WhatsApp permanece ausente sin numero y codifica la seleccion local', () => {
  assert.equal(enlaceWhatsapp(getSitio().contacto.whatsapp, 'hola'), null);
  const mensaje = mensajeSeleccion('Portal', ['Componente de prueba']);
  assert.match(enlaceWhatsapp('56912345678', mensaje)!, /^https:\/\/wa.me\/56912345678\?text=/);
  assert.throws(() => enlaceWhatsapp('numero-invalido', mensaje));
});

test('el formulario conserva sus campos y estilo sin simular un envio', () => {
  const html = renderToStaticMarkup(
    createElement(Contacto, {resumen: 'Mi selección', mensajeEtiqueta: 'Mi proyecto'}),
  );
  assert.match(html, /<form[^>]*class="mt-6 max-w-2xl space-y-5"/);
  assert.match(html, /name="nombre"/);
  assert.match(html, /name="correo"/);
  assert.match(html, /name="mensaje"/);
  assert.match(html, /Mi selección/);
  assert.match(html, /Mi proyecto/);
  assert.match(html, /<button[^>]*disabled=""/);
  assert.match(html, /Enviar consulta/);
  assert.doesNotMatch(html, /Consulta recibida|guardados|action=/);
});
