import {test} from 'node:test';
import assert from 'node:assert/strict';
import {existsSync, readdirSync, readFileSync} from 'node:fs';
import path from 'node:path';
import {createElement} from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {
  getCatalogo,
  getComponentes,
  getNavegacion,
  getPaquete,
  getPaquetes,
  getPaquetesHabilitados,
  getPerfil,
  getSitio,
} from '../src/infrastructure/handlers/datos';
import {seleccionarComponentes} from '../src/domain/casos-de-uso/componentes/seleccion';
import {
  contarPalabras,
  enlaceCorreo,
  enlaceCotizacion,
  prepararCorreoContacto,
  validarMensaje,
} from '../src/domain/servicios/contacto';
import {CONTACT_EMAIL, MAX_MESSAGE_WORDS, QUOTES_EMAIL} from '../src/domain/configuracion/contacto';
import {nombresIconos} from '../src/domain/types/componentes';
import {iconos} from '../src/infrastructure/componentes/Vitrina/iconos';
import GrillaComponentes from '../src/infrastructure/componentes/Vitrina/GrillaComponentes';
import TarjetaComponente from '../src/infrastructure/componentes/Vitrina/TarjetaComponente';
import PaginaCatalogo from '../src/infrastructure/componentes/Catalogo/PaginaCatalogo';
import PaginaPaquete from '../src/infrastructure/componentes/DetallePaquete/PaginaPaquete';
import TarjetaPlan from '../src/infrastructure/componentes/Catalogo/TarjetaPlan';
import CarruselPlanes from '../src/infrastructure/componentes/Catalogo/CarruselPlanes';
import CondicionesCatalogo from '../src/infrastructure/componentes/Catalogo/CondicionesCatalogo';
import Contacto from '../src/infrastructure/componentes/Contacto/Contacto';
import DetallePaquete from '../src/infrastructure/componentes/DetallePaquete/DetallePaquete';
import Entrada from '../src/infrastructure/componentes/Entrada/Entrada';
import Footer from '../src/infrastructure/componentes/Footer/Footer';
import {clasesBoton} from '../src/infrastructure/componentes/Boton/estilos';
import {esEnlaceActivo} from '../src/infrastructure/componentes/Header/navegacion';
import {precioDesdeCLP} from '../src/domain/servicios/precio';
import tailwindConfig, {coloresMarca} from '../tailwind.config';

function fuentes(directorio: string): string[] {
  return readdirSync(directorio, {withFileTypes: true}).flatMap((entrada) => {
    const ruta = path.join(directorio, entrada.name);
    if (entrada.isDirectory()) return fuentes(ruta);
    return /\.(ts|tsx|mjs|json)$/.test(entrada.name) ? [ruta] : [];
  });
}

test('la estructura conserva las capas y todos los datos son JSON', () => {
  assert.deepEqual(readdirSync('src').sort(), ['app', 'data', 'domain', 'infrastructure']);
  assert.deepEqual(readdirSync('src/data').sort(), [
    'catalogo.json',
    'componentes.json',
    'ejemplos-boveda.json',
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
    ['catalogo', getCatalogo()],
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
    ['landing', 'portal', 'automatizacion', 'comercio-electronico'],
  );
  assert.equal(getPaquete('landing')?.nombre, 'Presencia Digital');
  assert.equal(getPaquete('portal')?.nombre, 'Captación de Clientes');
  assert.equal(getPaquete('inexistente'), undefined);
  assert.equal(getPaquete('sistema-web-a-medida'), undefined);
});

test('los cuatro planes conservan precios y todo el detalle de tarifas.md', () => {
  const bloques = readFileSync('tarifas.md', 'utf8')
    .split(/^# /m)
    .filter((bloque) => /^Plan \d - /.test(bloque));
  assert.equal(bloques.length, 4);
  const paquetes = getPaquetes();
  assert.equal(new Set(paquetes.map((paquete) => paquete.id)).size, 4);
  for (const [index, bloque] of bloques.entries()) {
    const paquete = paquetes[index];
    const nombre = bloque.split(/\r?\n/)[0].replace(/^Plan \d - /, '');
    assert.equal(paquete.nombre, nombre);
    const precio = bloque.match(/^## Desde \$([\d.]+) CLP/m);
    assert.ok(precio, nombre);
    assert.equal(paquete.precioDesde, Number(precio[1].replaceAll('.', '')));
    assert.ok(paquete.resumen.length > 0 && paquete.resumen.length <= 100, nombre);
    const secciones = bloque.split(/^### /m).slice(1);
    assert.equal(paquete.secciones.length, secciones.length, nombre);
    for (const [indice, fuente] of secciones.entries()) {
      const [titulo, ...lineas] = fuente.split(/\r?\n/);
      const seccion = paquete.secciones[indice];
      assert.equal(seccion.titulo, titulo, nombre);
      const elementos = lineas
        .filter((linea) => linea.startsWith('* '))
        .map((linea) => linea.slice(2));
      const descripcion = lineas
        .filter((linea) => linea.trim() && !linea.startsWith('* ') && linea !== '---')
        .join(' ');
      assert.deepEqual(seccion.elementos ?? [], elementos, `${nombre}: ${titulo}`);
      assert.equal(seccion.descripcion ?? '', descripcion, `${nombre}: ${titulo}`);
    }
  }
});

test('los precios desde se muestran en pesos chilenos sin decimales', () => {
  assert.deepEqual(
    getPaquetes().map((paquete) => precioDesdeCLP(paquete.precioDesde)),
    ['Desde $150.000 CLP', 'Desde $350.000 CLP', 'Desde $500.000 CLP', 'Desde $700.000 CLP'],
  );
});

test('los casos y contextos preservan la privacidad y el perfil separa audiencias', () => {
  const perfil = getPerfil();
  for (const caso of perfil.proyectos) {
    assert.doesNotMatch(JSON.stringify(caso), /Santo Tomás|TREBOL-IT|PAES|fallas|proveedores/i);
  }
  for (const capacidad of perfil.capacidades) {
    assert.doesNotMatch(capacidad.contexto, /Santo Tomás|TREBOL-IT|PAES/i);
  }
  assert.equal(perfil.proyectos[0].nombre, 'Rediseño de plataforma de evaluaciones en línea');
  assert.equal(
    perfil.proyectos[0].problema,
    'El sistema necesitaba una base más estable y mantenible.',
  );
  assert.doesNotMatch(JSON.stringify(perfil.experiencia), /PAES|fallas|proveedores/i);
  const pagina = readFileSync('src/app/(portal)/perfil/page.tsx', 'utf8');
  assert.ok(pagina.indexOf('<FotoPerfil />') < pagina.indexOf('id="detalle-tecnico-titulo"'));
  assert.ok(
    pagina.indexOf('aria-labelledby="ficha-titulo"') < pagina.indexOf('id="detalle-tecnico"'),
  );
  assert.match(pagina, /www\.linkedin\.com\/in\/danielsalamancajorquera/);
  assert.match(pagina, /¿Un proyecto o una idea para tu negocio\?/);
  assert.doesNotMatch(pagina, /o una oportunidad profesional/);
  assert.equal(getSitio().demosHabilitadas, false);
});

test('los primeros dos planes incluyen hasta cinco dias habiles y las reuniones en ese periodo', () => {
  for (const id of ['landing', 'portal']) {
    assert.deepEqual(
      getPaquete(id)?.secciones.find((seccion) => seccion.titulo === 'Plazo de entrega')?.elementos,
      ['Hasta 5 días hábiles.', 'Las reuniones incluidas se realizan dentro de ese período.'],
    );
  }
  for (const id of ['automatizacion', 'comercio-electronico']) {
    assert.equal(
      getPaquetes()
        .find((paquete) => paquete.id === id)
        ?.secciones.some((seccion) => seccion.titulo === 'Plazo de entrega'),
      false,
    );
  }
});

test('cada vista de detalle muestra todas las secciones de su plan', () => {
  for (const paquete of getPaquetes()) {
    const html = renderToStaticMarkup(createElement(DetallePaquete, {paquete}));
    for (const seccion of paquete.secciones) {
      assert.ok(html.includes(`class="text-xl font-bold">${seccion.titulo}</h2>`));
      if (seccion.descripcion) assert.ok(html.includes(seccion.descripcion));
      for (const elemento of seccion.elementos ?? []) {
        assert.ok(html.includes(`<li>${elemento}</li>`), `${paquete.nombre}: ${elemento}`);
      }
    }
  }
});

test('el catalogo conserva filosofia, alcance, principios y costos adicionales de tarifas.md', () => {
  const fuente = readFileSync('tarifas.md', 'utf8');
  const catalogo = getCatalogo();
  for (const texto of [
    catalogo.filosofia.titulo,
    catalogo.filosofia.introduccion,
    ...catalogo.filosofia.objetivos,
    catalogo.filosofia.conclusion,
    catalogo.alcance.introduccion,
    ...catalogo.alcance.condiciones,
    ...catalogo.principios,
    ...catalogo.adicionales.flatMap((adicional) => [adicional.nombre, adicional.costo]),
  ]) {
    assert.ok(fuente.includes(texto), texto);
  }
  assert.equal(catalogo.filosofia.objetivos.length, 6);
  assert.equal(catalogo.alcance.condiciones.length, 3);
  assert.equal(catalogo.principios.length, 7);
  assert.deepEqual(catalogo.adicionales, [
    {nombre: 'Reuniones Adicionales', costo: '$25.000 CLP por hora.'},
    {nombre: 'Capacitación Adicional', costo: '$25.000 CLP por hora.'},
    {nombre: 'Desarrollo Fuera de Alcance', costo: 'Desde $35.000 CLP por hora.'},
    {nombre: 'Soporte Evolutivo', costo: 'Cotización según necesidad.'},
  ]);
});

test('la oferta presenta a dannotech como marca personal en primera persona', () => {
  const sitio = getSitio();
  const catalogo = getCatalogo();
  const html = renderToStaticMarkup(createElement(Entrada));
  assert.ok(html.includes(`Soy ${sitio.persona}, y ${sitio.nombre} es mi marca personal.`));
  assert.ok(html.includes('Tu negocio, mi experiencia.'));
  assert.doesNotMatch(html, /Este espacio todavía no está disponible\.|grayscale/);
  assert.doesNotMatch(html, /(?:\s|")cursor-not-allowed(?:\s|")/);
  assert.ok(html.includes('Sitios desde $150.000 CLP'));
  assert.ok(html.includes('href="#que-hago"'));
  assert.match(html, /href="\/catalogo"/);
  for (const titulo of ['Qué hago y para quién', 'Por qué conmigo', 'Cómo trabajo']) {
    assert.ok(html.includes(titulo));
  }
  assert.ok(html.indexOf('Catálogo</h3>') < html.indexOf('Perfil</h3>'));
  assert.doesNotMatch(html, /Próximamente/);
  assert.match(getPerfil().presentacion, /^Soy Daniel/);
  assert.match(sitio.descripcion, /^Te ayudo a /);
  assert.match(catalogo.filosofia.titulo, /^No solo desarrollo /);
  assert.equal(catalogo.filosofia.introduccion, 'Te ayudo a:');
  for (const paquete of getPaquetes()) {
    assert.match(paquete.resumen, /^(Te ayudo|Desarrollo|Creo) /);
    assert.match(paquete.descripcion, /^(Diseño y desarrollo|Desarrollo) /);
  }
  const textos = [
    html,
    JSON.stringify(catalogo),
    JSON.stringify(getPaquetes()),
    sitio.descripcion,
    getPerfil().presentacion,
    readFileSync('src/app/(portal)/catalogo/page.tsx', 'utf8'),
    readFileSync('tarifas.md', 'utf8'),
  ];
  for (const texto of textos) {
    assert.doesNotMatch(texto, /\b(vendemos|ayudamos|nuestros|cotizamos|definimos)\b/i);
  }
});

test('los botones comparten hover, foco accesible y respeto al movimiento reducido', () => {
  for (const variante of ['coral', 'sky', 'ink', 'borde', 'bordeOscuro'] as const) {
    const clases = clasesBoton(variante, 'mt-6');
    assert.ok(clases.includes('fine-pointer:hover:'));
    assert.ok(clases.includes('focus-visible:'));
    assert.ok(clases.includes('motion-safe:fine-pointer:hover:-translate-y-0.5'));
    assert.ok(clases.includes('motion-reduce:transform-none'));
    assert.ok(clases.includes('motion-reduce:transition-none'));
    assert.ok(clases.includes('disabled:transform-none'));
    assert.ok(clases.includes('disabled:shadow-none'));
    assert.ok(clases.includes('disabled:fine-pointer:hover:transform-none'));
    assert.ok(clases.includes('disabled:fine-pointer:hover:shadow-none'));
    assert.ok(clases.endsWith('mt-6'));
  }
});

test('Tailwind es la unica fuente de la paleta y las animaciones', () => {
  assert.equal('colores' in getSitio(), false);
  assert.equal(coloresMarca.ink, '#04182F');
  assert.equal(coloresMarca.sky, '#22C3F5');
  assert.equal(coloresMarca.coral, '#FF6B4A');
  assert.equal(tailwindConfig.theme.extend.colors.brand.ink, coloresMarca.ink);
  assert.equal(tailwindConfig.theme.extend.animation.intro, 'entrada 450ms ease-out both');
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
  const perfil = readFileSync('src/app/(portal)/perfil/page.tsx', 'utf8');
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
  const perfil = readFileSync('src/app/(portal)/perfil/page.tsx', 'utf8');
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

test('el CSS global limita las clases propias a la entrada progresiva por scroll', () => {
  const css = readFileSync('src/app/globals.css', 'utf8').trim();
  for (const directiva of ['@tailwind base;', '@tailwind components;', '@tailwind utilities;']) {
    assert.ok(css.includes(directiva));
  }
  assert.match(css, /prefers-reduced-motion: no-preference/);
  assert.match(css, /transition-property: opacity, transform, filter/);
  assert.match(css, /transition-duration: 600ms/);
  assert.match(css, /transition-timing-function: ease-out/);
  assert.match(css, /translateY\(24px\)/);
  assert.match(css, /blur\(8px\)/);
  for (const retraso of [100, 200, 120, 240, 360]) {
    assert.ok(css.includes(`transition-delay: ${retraso}ms`));
  }
  assert.doesNotMatch(css, /scroll-snap|transition-property: all/);
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

test('la home revela sus cuatro bloques con una sola transicion ligera por contenido', () => {
  const html = renderToStaticMarkup(createElement(Entrada));
  assert.equal(html.match(/min-h-\[70vh\]/g)?.length, 4);
  assert.equal(html.match(/data-entrada="true"/g)?.length, 4);
  assert.equal(html.match(/entrada-ligera/g)?.length, 4);
  assert.doesNotMatch(
    html,
    /data-entrada-elemento|data-entrada-paso|entrada-preparada|entrada-visible|scroll-snap|backdrop-blur/,
  );
  assert.equal(html.match(/motion-safe:animate-intro/g)?.length, 1);
  assert.doesNotMatch(html, /(?:^|\s)animate-intro/);
  const css = readFileSync('src/app/globals.css', 'utf8');
  assert.match(
    css,
    /\.entrada-ligera\.entrada-visible\s*>\s*div\s*\{[^}]*transition: opacity 250ms ease-out/,
  );
  assert.match(
    css,
    /\.entrada-ligera\.entrada-preparada:not\(\.entrada-visible\)\s*>\s*div\s*\{[^}]*opacity: 0/,
  );
  assert.match(css, /\.entrada-ligera\.entrada-visible\s*\{[^}]*transition: none/);
  for (const pagina of [
    'src/app/(portal)/perfil/page.tsx',
    'src/infrastructure/componentes/Catalogo/PresentacionCatalogo.tsx',
    'src/infrastructure/componentes/DetallePaquete/PresentacionPaquete.tsx',
  ]) {
    assert.ok(readFileSync(pagina, 'utf8').includes('EntradaScroll'));
  }
});

test('la portada ofrece exploracion inicial y encabezados numerados sin botones siguientes', () => {
  const html = renderToStaticMarkup(createElement(Entrada));
  assert.doesNotMatch(html, /Siguiente|aria-current="step"|>Anterior|Volver al inicio|Paso \d de/);
  for (const id of ['presentacion', 'que-hago', 'por-que-conmigo', 'como-trabajo', 'entradas']) {
    assert.equal(html.match(new RegExp(`id="${id}"`, 'g'))?.length, 1);
  }
  assert.ok(html.includes('href="#que-hago"'));
  assert.ok(html.includes('Explorar el sitio'));
  for (const titulo of [
    '01 / Para tu negocio',
    '02 / Trato directo',
    '03 / Paso a paso',
    '04 / Tu próximo paso',
  ]) {
    assert.ok(html.includes(titulo));
  }
  for (const fondo of ['bg-servicios', 'bg-confianza', 'bg-proceso', 'bg-entradas']) {
    assert.ok(html.includes(fondo));
  }
  assert.doesNotMatch(html, /scroll-snap|overflow-hidden/);
});

test('todos los fondos de la portada tienen degradados propios definidos en Tailwind', () => {
  const fondos = tailwindConfig.theme.extend.backgroundImage;
  const html = renderToStaticMarkup(createElement(Entrada));
  for (const nombre of ['intro', 'servicios', 'confianza', 'proceso', 'entradas'] as const) {
    assert.match(fondos[nombre], /linear-gradient/);
    assert.match(fondos[nombre], /radial-gradient/);
    assert.ok(html.includes(`bg-${nombre}`));
  }
  assert.notEqual(fondos.confianza, fondos['perfil-hero']);
});

test('la navegacion no apunta a administracion ni a endpoints eliminados', () => {
  const navegacion = getNavegacion();
  assert.deepEqual(
    navegacion.principal.map((link) => link.href),
    ['/catalogo', '/perfil'],
  );
  assert.deepEqual(navegacion.pie, [{label: 'Contacto', href: '/contacto'}]);
  assert.equal(getSitio().catalogoHabilitado, true);
  for (const link of [...navegacion.principal, ...navegacion.pie]) {
    assert.doesNotMatch(link.href, /^\/(admin|api)(\/|$)/);
  }
});

test('el navbar marca la seccion actual y sus rutas hijas sin confundir prefijos', () => {
  for (const ruta of ['/catalogo', '/catalogo/', '/catalogo/landing/', '/catalogo/portal']) {
    assert.equal(esEnlaceActivo(ruta, '/catalogo'), true, ruta);
  }
  assert.equal(esEnlaceActivo('/perfil/', '/perfil/'), true);
  assert.equal(esEnlaceActivo('/contacto/', '/contacto'), true);
  assert.equal(esEnlaceActivo('/catalogo-extra', '/catalogo'), false);
  assert.equal(esEnlaceActivo('/perfil', '/catalogo'), false);
  assert.equal(esEnlaceActivo('/', '/catalogo'), false);
  assert.equal(esEnlaceActivo('/', '/'), true);
  assert.equal(esEnlaceActivo('/contacto', '/'), false);
});

test('la vitrina hereda los componentes y destaca el panel sin mutar los datos', () => {
  const componentes = getComponentes();
  const original = JSON.stringify(componentes);
  assert.equal(componentes.length, 19);
  assert.deepEqual(Object.keys(iconos), [...nombresIconos]);
  assert.deepEqual(
    componentes.map((item) => item.icono),
    [...nombresIconos],
  );
  const landing = seleccionarComponentes(componentes, 'landing', getPaquetes());
  assert.equal(landing.incluidos.length, 11);
  assert.equal(landing.noIncluidos.length, 8);
  assert.ok(
    landing.incluidos.every((item) => item.incluido && item.componente.planMinimo === 'landing'),
  );
  assert.ok(
    landing.noIncluidos.every((item) => !item.incluido && item.componente.planMinimo === 'portal'),
  );
  const portal = seleccionarComponentes(componentes, 'portal', getPaquetes());
  assert.equal(portal.incluidos.length, 19);
  assert.deepEqual(portal.noIncluidos, []);
  assert.equal(portal.incluidos[0].componente.id, 'panel-administracion');
  assert.equal(JSON.stringify(componentes), original);
  assert.deepEqual(seleccionarComponentes([], 'landing', getPaquetes()), {
    incluidos: [],
    noIncluidos: [],
  });
});

test('la vitrina rechaza planes no habilitados y excluye sus componentes', () => {
  const paquetes = getPaquetes().map((paquete) => ({
    ...paquete,
    habilitado: paquete.id === 'landing',
  }));
  const seleccion = seleccionarComponentes(getComponentes(), 'landing', paquetes);
  assert.equal(seleccion.incluidos.length, 11);
  assert.deepEqual(seleccion.noIncluidos, []);
  for (const id of ['portal', 'automatizacion', 'comercio-electronico', 'inexistente']) {
    assert.throws(
      () => seleccionarComponentes(getComponentes(), id, paquetes),
      /no esta habilitado/,
    );
  }
  const soloPortal = paquetes.map((paquete) => ({...paquete, habilitado: paquete.id === 'portal'}));
  assert.equal(seleccionarComponentes(getComponentes(), 'portal', soloPortal).incluidos.length, 8);
});

test('las tarjetas de vitrina son descriptivas y accesibles, no demos interactivas', () => {
  const textos = getCatalogo().vitrina.etiquetas;
  for (const componente of getComponentes()) {
    const html = renderToStaticMarkup(
      createElement(TarjetaComponente, {
        componente,
        textos,
        nombrePlanMinimo: getPaquete(componente.planMinimo)?.nombre,
      }),
    );
    const id = html.match(/aria-labelledby="([^"]+)"/)?.[1];
    assert.ok(id);
    assert.ok(html.includes(`<h3 id="${id}"`));
    assert.ok(html.includes(componente.nombre));
    assert.ok(html.includes(componente.descripcion));
    assert.doesNotMatch(html, /<a\b|<button\b|<input\b|tabindex=|TODO\(Daniel\)/);
    if (componente.destacado) {
      assert.match(html, /md:col-span-2/);
      assert.match(html, /lg:col-span-3/);
      for (const detalle of componente.detalles ?? []) assert.ok(html.includes(detalle));
    }
  }
  const html = renderToStaticMarkup(
    createElement(GrillaComponentes, {
      componentes: seleccionarComponentes(getComponentes(), 'landing', getPaquetes()).incluidos,
      textos,
    }),
  );
  assert.equal(html.match(/<article\b/g)?.length, 11);
});

test('solo los primeros dos planes tienen rutas y tarjetas navegables', () => {
  assert.deepEqual(
    getPaquetesHabilitados().map((paquete) => paquete.id),
    ['landing', 'portal'],
  );
  for (const [index, paquete] of getPaquetes().entries()) {
    const html = renderToStaticMarkup(
      createElement(TarjetaPlan, {
        paquete,
        numero: index + 1,
        textos: getCatalogo().textos,
        comparacion: getCatalogo().comparacion,
      }),
    );
    assert.ok(html.includes(paquete.nombre));
    if (paquete.habilitado) {
      assert.ok(html.includes(precioDesdeCLP(paquete.precioDesde)));
      assert.ok(html.includes(`href="/catalogo/${paquete.id}"`));
      assert.ok(html.includes(`href="/contacto?paquete=${paquete.id}"`));
      assert.ok(paquete.comparacion);
      const datos = paquete.comparacion;
      assert.ok(html.includes(datos.plazoEntrega));
      assert.ok(html.includes(datos.capacitacion));
      assert.ok(html.includes(String(datos.seccionesMaximas)));
      for (const reunion of datos.reunionesIncluidas) assert.ok(html.includes(reunion));
      assert.equal(html.match(/<dt\b/g)?.length, 5);
    } else {
      assert.equal(getPaquete(paquete.id), undefined);
      assert.match(html, /aria-disabled="true"/);
      assert.match(html, /Próximamente/);
      assert.doesNotMatch(html, /<a\b|CLP/);
    }
  }
  const ruta = readFileSync('src/app/(portal)/catalogo/[paquete]/page.tsx', 'utf8');
  assert.match(ruta, /getPaquetesHabilitados\(\)\.map/);
  assert.equal(ruta.match(/if \(!paquete\) notFound\(\)/g)?.length, 2);
});

test('el catalogo integra tarjetas y comparacion en un solo carrusel sin tabla ni scroll', () => {
  const catalogo = getCatalogo();
  const html = renderToStaticMarkup(
    createElement(PaginaCatalogo, {catalogo, paquetes: getPaquetes(), sitio: getSitio()}),
  );
  const orden = [
    'catalogo-titulo',
    'planes-titulo',
    '>Ver todos los componentes</a>',
    'filosofia-titulo',
    'alcance-titulo',
    'adicionales-titulo',
  ];
  for (let index = 1; index < orden.length; index++) {
    assert.ok(html.indexOf(orden[index - 1]) < html.indexOf(orden[index]), orden[index]);
  }
  assert.equal(html.match(/<h1\b/g)?.length, 1);
  assert.match(html, /Mis compromisos contigo/);
  assert.doesNotMatch(html, /<table\b|overflow-x-auto|comparacion-titulo/);
  assert.equal(html.match(/aria-roledescription="carrusel"/g)?.length, 1);
  assert.equal(html.match(/aria-roledescription="diapositiva"/g)?.length, 4);
  assert.equal(html.match(/hidden=""/g)?.length, 3);
  assert.equal(html.match(/data-entrada="true"/g)?.length, 4);
  assert.doesNotMatch(html, /href="\/demo\//);
  for (const paquete of getPaquetes().filter((item) => !item.habilitado)) {
    assert.ok(!html.includes(`href="/catalogo/${paquete.id}"`));
  }
});

test('el carrusel presenta una sola diapositiva y controles accesibles sin avance automatico', () => {
  const textos = getCatalogo().comparacion;
  const planes = getPaquetes().map((paquete) => ({
    id: paquete.id,
    nombre: paquete.nombre,
    contenido: createElement('p', null, paquete.nombre),
  }));
  const html = renderToStaticMarkup(createElement(CarruselPlanes, {planes, textos}));
  assert.equal(html.match(/<button\b/g)?.length, 6);
  assert.equal(html.match(/disabled=""/g)?.length, 1);
  assert.equal(html.match(/aria-current="true"/g)?.length, 1);
  assert.match(html, /aria-live="polite" aria-atomic="true"/);
  assert.match(html, /Plan 1 de 4/);
  assert.equal(html.match(/hidden=""/g)?.length, 3);
  for (const [indice, plan] of planes.entries()) {
    assert.ok(
      html.includes(
        textos.irAlPlan.replace('{numero}', String(indice + 1)).replace('{nombre}', plan.nombre),
      ),
    );
  }
  const unico = renderToStaticMarkup(
    createElement(CarruselPlanes, {planes: planes.slice(0, 1), textos}),
  );
  assert.match(unico, /Plan 1 de 1/);
  assert.equal(unico.match(/disabled=""/g)?.length, 2);
  assert.doesNotMatch(unico, /hidden=""/);
  assert.throws(
    () => renderToStaticMarkup(createElement(CarruselPlanes, {planes: [], textos})),
    /al menos un plan/,
  );
});

test('las tarjetas habilitadas requieren los datos completos de comparacion', () => {
  const paquete = {...getPaquetes()[0], comparacion: undefined};
  assert.throws(
    () =>
      renderToStaticMarkup(
        createElement(TarjetaPlan, {
          paquete,
          numero: 1,
          textos: getCatalogo().textos,
          comparacion: getCatalogo().comparacion,
        }),
      ),
    /no tiene una comparacion habilitada/,
  );
});

test('filosofia, alcance y compromisos comparten una sola seccion sin perder contenido', () => {
  const catalogo = getCatalogo();
  const html = renderToStaticMarkup(createElement(CondicionesCatalogo, {catalogo}));
  assert.equal(html.match(/<section\b/g)?.length, 1);
  assert.equal(html.match(/data-entrada="true"/g)?.length, 1);
  assert.equal(html.match(/<h2\b/g)?.length, 1);
  assert.equal(html.match(/<h3\b/g)?.length, 2);
  assert.match(html, /id="alcance" tabindex="-1"/);
  for (const texto of [
    catalogo.filosofia.titulo,
    catalogo.filosofia.introduccion,
    catalogo.filosofia.conclusion,
    ...catalogo.filosofia.objetivos,
    catalogo.textos.alcance,
    catalogo.alcance.introduccion,
    ...catalogo.alcance.condiciones,
    catalogo.textos.principios,
    ...catalogo.principios,
  ])
    assert.ok(html.includes(texto), texto);
});

test('el detalle mantiene el formulario final preseleccionado y agrega vitrina y plazo', () => {
  const catalogo = getCatalogo();
  for (const paquete of getPaquetesHabilitados()) {
    const html = renderToStaticMarkup(
      createElement(PaginaPaquete, {
        paquete,
        paquetes: getPaquetes(),
        componentes: getComponentes(),
        catalogo,
      }),
    );
    assert.equal(html.match(/<h1\b/g)?.length, 1);
    assert.match(html, /id="consulta"/);
    assert.match(html, /<form\b/);
    assert.ok(html.includes(`<option value="${paquete.id}" selected="">`));
    assert.ok(html.includes(catalogo.vitrina.tituloDetalle));
    assert.ok(html.includes(paquete.comparacion!.plazoEntrega));
    assert.ok(html.indexOf('componentes-titulo') < html.indexOf('id="consulta"'));
    assert.ok(html.indexOf('Gestión de alcance y mis compromisos') < html.indexOf('<form'));
    assert.doesNotMatch(html, /href="\/contacto|href="\/demo\//);
  }
});

test('se retiran las rutas y herramientas de la demo pero se conserva la biblioteca', () => {
  for (const ruta of [
    'src/app/(demo)/layout.tsx',
    'src/app/(portal)/componentes/[slug]/page.tsx',
    'src/demo/planes.ts',
    'src/data/demo/negocio.json',
    'src/infrastructure/componentes/Configurador/Configurador.tsx',
    'src/infrastructure/componentes/Catalogo/ExploracionCatalogo.tsx',
  ])
    assert.equal(existsSync(ruta), false, ruta);
  for (const ruta of fuentes('src')) {
    assert.doesNotMatch(
      readFileSync(ruta, 'utf8'),
      /from ['"][^'"]*(?:\/demo\/|\/Configurador\/)|href=["']\/demo\//,
      ruta,
    );
  }
  assert.equal(existsSync('public/ejemplos-boveda/cafe-aurora/manifest.json'), true);
  assert.equal('exploracion' in getCatalogo(), false);
});

test('los correos oficiales solo se definen en la configuracion y no se expone Gmail', () => {
  const configuracion = path.join('src', 'domain', 'configuracion', 'contacto.ts');
  for (const ruta of fuentes('src')) {
    const contenido = readFileSync(ruta, 'utf8');
    assert.doesNotMatch(contenido, /@gmail\.com/i, ruta);
    if (ruta !== configuracion) assert.doesNotMatch(contenido, /@dannotech\.cl/i, ruta);
  }
  const html = renderToStaticMarkup(createElement(Footer));
  assert.ok(html.includes(`href="${enlaceCorreo(CONTACT_EMAIL)}"`));
  assert.ok(html.includes(CONTACT_EMAIL));
  assert.ok(html.includes(`>${CONTACT_EMAIL}</a>`));
  assert.match(html, /href="\/contacto\/?"/);
});

test('los mailto de cotizacion tienen asunto codificado y nombre del plan', () => {
  const general = new URL(enlaceCotizacion());
  assert.equal(general.protocol, 'mailto:');
  assert.equal(general.pathname, QUOTES_EMAIL);
  assert.equal(general.searchParams.get('subject'), 'Solicitud de cotización');
  assert.ok(enlaceCotizacion().includes('Solicitud%20de%20cotizaci%C3%B3n'));
  for (const paquete of getPaquetes()) {
    const url = new URL(enlaceCotizacion(paquete.nombre));
    assert.equal(url.pathname, QUOTES_EMAIL);
    assert.equal(url.searchParams.get('subject'), `Solicitud de cotización: ${paquete.nombre}`);
  }
});

test('el limite real del mensaje es de 200 palabras, incluyendo espacios y saltos de linea', () => {
  assert.equal(MAX_MESSAGE_WORDS, 200);
  assert.equal(contarPalabras(' \n\t '), 0);
  assert.equal(contarPalabras('  hola\tmundo\n¿cómo\u00a0estás?  '), 4);
  assert.equal(validarMensaje(Array(200).fill('palabra').join('\n')), null);
  assert.equal(
    validarMensaje(Array(201).fill('palabra').join(' ')),
    'Tu mensaje no puede superar las 200 palabras.',
  );
  assert.equal(validarMensaje('          '), 'Escribe un mensaje.');
  assert.equal(validarMensaje('hola'), 'Escribe un mensaje de al menos 10 caracteres.');
});

const datosContacto = {
  nombre: 'Daniel & prueba',
  correo: CONTACT_EMAIL,
  paqueteId: 'consulta',
  mensaje: 'Me interesa conversar sobre mi negocio, con ideas & preguntas.',
};

test('el formulario prepara consultas y cotizaciones con todos los datos sin enviarlos', () => {
  for (const opcion of [{id: 'consulta', nombre: 'Consulta'}, ...getPaquetesHabilitados()]) {
    const resultado = prepararCorreoContacto(
      {...datosContacto, paqueteId: opcion.id},
      getPaquetes(),
    );
    assert.ok(resultado.ok);
    const url = new URL(resultado.href);
    assert.equal(url.protocol, 'mailto:');
    assert.equal(url.pathname, opcion.id === 'consulta' ? CONTACT_EMAIL : QUOTES_EMAIL);
    assert.equal(
      url.searchParams.get('subject'),
      opcion.id === 'consulta' ? 'Consulta general' : `Solicitud de cotización: ${opcion.nombre}`,
    );
    const cuerpo = url.searchParams.get('body')!;
    assert.ok(cuerpo.includes(datosContacto.nombre));
    assert.ok(cuerpo.includes(datosContacto.correo));
    assert.ok(cuerpo.includes(datosContacto.mensaje));
    assert.ok(cuerpo.includes(`Motivo: ${opcion.nombre}`));
  }
  const limite = prepararCorreoContacto(
    {...datosContacto, mensaje: Array(200).fill('palabra').join(' ')},
    getPaquetes(),
  );
  assert.ok(limite.ok);
});

test('el formulario rechaza datos invalidos explicitamente sin generar un mailto', () => {
  for (const cambio of [
    {nombre: ''},
    {nombre: 'a'.repeat(101)},
    {correo: ''},
    {correo: 'correo-invalido'},
    {correo: `${'a'.repeat(254)}@${CONTACT_EMAIL.split('@')[1]}`},
    {mensaje: ' '},
    {mensaje: Array(201).fill('palabra').join(' ')},
    {paqueteId: 'sistema-web-a-medida'},
    {paqueteId: 'automatizacion'},
    {paqueteId: 'comercio-electronico'},
  ]) {
    const resultado = prepararCorreoContacto({...datosContacto, ...cambio}, getPaquetes());
    assert.equal(resultado.ok, false);
    if (!resultado.ok) assert.ok(resultado.error.length > 0);
    assert.equal('href' in resultado, false);
  }
});

test('el formulario muestra Consulta y los planes habilitados sin simular un envio exitoso', () => {
  const html = renderToStaticMarkup(
    createElement(Contacto, {
      paquetes: getPaquetes(),
      mensajeEtiqueta: 'Mi proyecto',
    }),
  );
  assert.match(html, /<form[^>]*class="mt-6 max-w-2xl space-y-5"/);
  assert.match(html, /name="nombre"/);
  assert.match(html, /name="correo"/);
  assert.match(html, /name="mensaje"/);
  assert.match(html, /Mi proyecto/);
  assert.match(html, /<select[^>]*name="paquete"/);
  assert.match(html, /<option value="consulta" selected="">Consulta<\/option>/);
  for (const paquete of getPaquetesHabilitados()) {
    assert.ok(html.includes(`<option value="${paquete.id}">${paquete.nombre}</option>`));
  }
  assert.doesNotMatch(html, /value="automatizacion"|value="comercio-electronico"/);
  assert.match(html, /200.*palabras/);
  assert.match(html, /Preparar consulta/);
  assert.equal((html.match(/<button\b/g) ?? []).length, 1);
  assert.doesNotMatch(html, /<a\b|mailto:/);
  assert.ok(html.includes('Este formulario no envía ni guarda solicitudes'));
  assert.doesNotMatch(html, /maxlength="3000"/);
  assert.doesNotMatch(html, /Consulta recibida|guardados|action=/);
  const cotizacion = renderToStaticMarkup(
    createElement(Contacto, {paquetes: getPaquetes(), paqueteInicial: 'landing'}),
  );
  assert.ok(cotizacion.includes('<option value="landing" selected="">Presencia Digital</option>'));
  assert.ok(cotizacion.includes('Preparar cotización'));
  assert.doesNotMatch(cotizacion, /mailto:|wa\.me|Ver los canales de contacto/);
});
