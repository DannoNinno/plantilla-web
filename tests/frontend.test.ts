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
import {
  contarPalabras,
  enlaceCorreo,
  enlaceCotizacion,
  prepararCorreoContacto,
  validarMensaje,
} from '../src/domain/servicios/contacto';
import {CONTACT_EMAIL, MAX_MESSAGE_WORDS, QUOTES_EMAIL} from '../src/domain/configuracion/contacto';
import Contacto from '../src/infrastructure/componentes/Contacto/Contacto';
import DetallePaquete from '../src/infrastructure/componentes/DetallePaquete/DetallePaquete';
import TarjetaPlan from '../src/infrastructure/componentes/Catalogo/TarjetaPlan';
import ComparacionPlanes from '../src/infrastructure/componentes/Catalogo/ComparacionPlanes';
import BeneficiosPyme from '../src/infrastructure/componentes/Perfil/BeneficiosPyme';
import TarjetaComponente from '../src/infrastructure/componentes/Vitrina/TarjetaComponente';
import GrillaComponentes from '../src/infrastructure/componentes/Vitrina/GrillaComponentes';
import {iconos} from '../src/infrastructure/componentes/Vitrina/iconos';
import {nombresIconos} from '../src/domain/types/componentes';
import {seleccionarComponentes} from '../src/domain/casos-de-uso/componentes/seleccion';
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
    return /\.(ts|tsx|mjs)$/.test(entrada.name) ? [ruta] : [];
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

test('solo los dos planes habilitados se pueden consultar por id', () => {
  assert.deepEqual(
    getPaquetesHabilitados().map((paquete) => paquete.id),
    ['landing', 'portal'],
  );
  assert.deepEqual(
    getPaquetes().map((paquete) => paquete.habilitado),
    [true, true, false, false],
  );
  assert.equal(getPaquete('automatizacion'), undefined);
  assert.equal(getPaquete('comercio-electronico'), undefined);
});

test('las tarjetas bloqueadas no muestran precio, enlaces ni controles interactivos', () => {
  const tarjetas = getPaquetes().map((paquete, index) => {
    const html = renderToStaticMarkup(
      createElement(TarjetaPlan, {
        paquete,
        numero: index + 1,
        textos: getCatalogo().tarjetasPlan,
      }),
    );
    assert.ok(html.includes(paquete.nombre));
    if (paquete.habilitado) {
      assert.ok(html.includes(`href="/catalogo/${paquete.id}"`));
      assert.ok(html.includes(precioDesdeCLP(paquete.precioDesde)));
      assert.doesNotMatch(html, /aria-disabled|Próximamente/);
    } else {
      assert.match(html, /<article aria-disabled="true"/);
      assert.match(html, /opacity-50/);
      assert.match(html, /lucide-lock-keyhole/);
      assert.ok(html.includes(getCatalogo().tarjetasPlan.proximamente));
      assert.doesNotMatch(html, /<a\b|<button\b|tabindex=|Desde|\$|CLP/);
    }
    return html;
  });
  assert.equal((tarjetas.join('').match(/<a\b/g) ?? []).length, 2);
  assert.equal((tarjetas.join('').match(/aria-disabled="true"/g) ?? []).length, 2);
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
  for (const paquete of getPaquetesHabilitados()) {
    const html = renderToStaticMarkup(createElement(DetallePaquete, {paquete}));
    for (const seccion of paquete.secciones) {
      assert.ok(html.includes(`<h2 class="text-xl font-bold">${seccion.titulo}</h2>`));
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
  assert.ok(html.includes(sitio.descripcionCatalogo));
  assert.doesNotMatch(html, /cuatro planes/);
  assert.match(getPerfil().presentacion, /^dannotech es mi marca personal\./);
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
    readFileSync('src/app/catalogo/page.tsx', 'utf8'),
    readFileSync('tarifas.md', 'utf8'),
  ];
  for (const texto of textos) {
    assert.doesNotMatch(texto, /\b(vendemos|ayudamos|nuestros|cotizamos|definimos)\b/i);
  }
});

test('el home dirige a planes y contacto y explica para quien trabajo', () => {
  const {inicio} = getSitio();
  const html = renderToStaticMarkup(createElement(Entrada));
  const titulo = html.match(/<h1\b[^>]*>(.*?)<\/h1>/s)?.[1].replace(/<[^>]+>/g, '');
  assert.equal(titulo, `${inicio.tituloHero} ${inicio.subtituloHero}`);
  assert.match(html, /href="\/catalogo"[^>]*>Ver planes /);
  assert.doesNotMatch(html, /Explorar el sitio/);
  assert.ok(html.includes(inicio.queHagoTitulo));
  assert.ok(html.includes(inicio.paraQuien));
  assert.match(
    inicio.paraQuien,
    /emprendedores, profesionales independientes y negocios que aún no tienen sitio web/,
  );
  assert.match(inicio.revisionParaQuien, /TODO\(Daniel\)/);
  assert.ok(html.includes(inicio.cotizar));
  assert.ok(html.indexOf(inicio.cotizar) > html.indexOf('Conocer a Daniel'));
  assert.match(html, /href="\/contacto"[^>]*>¿Ya sabes lo que necesitas\? Cotiza aquí<\/a>/);
  assert.doesNotMatch(html, /TODO\(Daniel\)/);
});

test('los datos de comparacion coinciden con el alcance de los planes activos', () => {
  for (const paquete of getPaquetesHabilitados()) {
    const datos = paquete.comparacion;
    assert.ok(datos);
    assert.equal(datos.seccionesMaximas, paquete.id === 'landing' ? 5 : 10);
    assert.ok(
      paquete.secciones
        .find((item) => item.titulo === 'Incluye')
        ?.elementos?.includes(`Hasta ${datos.seccionesMaximas} vistas o secciones.`),
    );
    assert.equal(datos.panelAdministracion, paquete.id === 'portal');
    assert.ok(
      paquete.secciones
        .find((item) => item.titulo === (datos.panelAdministracion ? 'Incluye' : 'No incluye'))
        ?.elementos?.includes('Panel de administración.'),
    );
    assert.equal(
      datos.plazoEntrega,
      paquete.secciones.find((item) => item.titulo === 'Plazo de entrega')?.elementos?.[0],
    );
    assert.deepEqual(
      datos.reunionesIncluidas,
      paquete.secciones.find((item) => item.titulo === 'Reuniones incluidas')?.elementos,
    );
    assert.equal(
      datos.capacitacion,
      paquete.secciones.find((item) => item.titulo === 'Capacitación')?.elementos?.[0],
    );
    assert.ok(paquete.secciones.some((item) => item.titulo === 'No incluye'));
    assert.ok(
      !paquete.secciones.some((item) =>
        ['Reuniones Incluidas', 'No Incluye'].includes(item.titulo),
      ),
    );
  }
});

test('la comparacion presenta los cinco criterios sin planes desactivados ni datos inventados', () => {
  const textos = getCatalogo().comparacion;
  const paquetes = getPaquetesHabilitados();
  const html = renderToStaticMarkup(createElement(ComparacionPlanes, {paquetes, textos}));
  assert.equal((html.match(/<article\b/g) ?? []).length, 2);
  assert.equal((html.match(/<dt\b/g) ?? []).length, 10);
  assert.match(html, /md:grid-cols-2/);
  for (const paquete of paquetes) {
    assert.ok(html.includes(paquete.nombre));
    const datos = paquete.comparacion;
    assert.ok(datos);
    assert.ok(
      html.includes(textos.cantidadSecciones.replace('{cantidad}', String(datos.seccionesMaximas))),
    );
    assert.ok(html.includes(datos.plazoEntrega));
    assert.ok(html.includes(datos.capacitacion));
    for (const reunion of datos.reunionesIncluidas) assert.ok(html.includes(reunion));
  }
  assert.ok(html.includes(textos.panelIncluido));
  assert.ok(html.includes(textos.panelNoIncluido));
  assert.doesNotMatch(html, /Automatización de Procesos|Comercio Electrónico/);
  const landing = getPaquete('landing');
  assert.ok(landing);
  assert.throws(
    () =>
      renderToStaticMarkup(
        createElement(ComparacionPlanes, {
          paquetes: [{...landing, comparacion: undefined}],
          textos,
        }),
      ),
    /no tiene una comparacion habilitada/,
  );
  assert.throws(
    () =>
      renderToStaticMarkup(
        createElement(ComparacionPlanes, {
          paquetes: getPaquetes(),
          textos,
        }),
      ),
    /no tiene una comparacion habilitada/,
  );
  assert.equal(
    getCatalogo().planes.precios,
    'Precios referenciales. Defino contigo el alcance y te cotizo antes de comenzar.',
  );
});

test('el perfil presenta tres beneficios para pymes y conserva las propuestas en datos', () => {
  const perfil = getPerfil();
  assert.equal(perfil.beneficiosPyme.puntos.length, 3);
  const html = renderToStaticMarkup(
    createElement(BeneficiosPyme, {contenido: perfil.beneficiosPyme}),
  );
  assert.equal((html.match(/<li\b/g) ?? []).length, 3);
  assert.ok(html.includes(perfil.beneficiosPyme.titulo));
  for (const punto of perfil.beneficiosPyme.puntos) {
    assert.ok(html.includes(punto.texto));
    assert.match(punto.revision, /TODO\(Daniel\)/);
  }
  assert.match(perfil.revisionPrincipio, /TODO\(Daniel\)/);
  const datos = perfil.capacidades.find((capacidad) => capacidad.id === 'datos');
  assert.ok(datos);
  assert.match(datos.revisionContexto ?? '', /TODO\(Daniel\)/);
  assert.doesNotMatch(
    JSON.stringify(perfil),
    /declarados en mi currículum|Siempre hay espacio para especializarme y crecer/,
  );
  assert.doesNotMatch(html, /TODO\(Daniel\)/);
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
  assert.deepEqual(navegacion.pie, [{label: 'Contacto', href: '/contacto'}]);
  for (const link of [...navegacion.principal, ...navegacion.pie]) {
    assert.doesNotMatch(link.href, /^\/(admin|api)(\/|$)/);
  }
});

test('el catalogo no conserva la redireccion temporal que ocultaba sus rutas', () => {
  const configuracion = readFileSync('src/infrastructure/configuracion/next.mjs', 'utf8');
  assert.doesNotMatch(configuracion, /catalogoHabilitado|source:\s*['"]\/catalogo/);
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

test('el sitio no expone la demo ni conserva el configurador interactivo', () => {
  for (const ruta of fuentes('src')) {
    const contenido = readFileSync(ruta, 'utf8');
    assert.doesNotMatch(contenido, /demo|configurador|enDemo/i, ruta);
    assert.doesNotMatch(contenido, /['"`]\/componentes\//, ruta);
  }
  for (const ruta of [
    'src/app/(demo)',
    'src/app/(portal)/componentes/[slug]',
    'src/infrastructure/componentes/demo',
    'src/infrastructure/componentes/Configurador/Configurador.tsx',
    'src/infrastructure/componentes/Catalogo/ExploracionCatalogo.tsx',
    'src/demo',
    'src/data/demo',
  ]) {
    assert.equal(existsSync(ruta), false, ruta);
  }
  const catalogo = JSON.parse(readFileSync('src/data/catalogo.json', 'utf8'));
  assert.equal('fase' in catalogo, false);
  assert.doesNotMatch(JSON.stringify(catalogo), /demo|exploraci[oó]n/i);
});

test('la vitrina conserva los 19 componentes, sus iconos y las descripciones pendientes', () => {
  const componentes = getComponentes();
  assert.deepEqual(
    componentes.map((componente) => componente.id),
    [
      'portada',
      'servicios',
      'quienes-somos',
      'galeria',
      'testimonios',
      'preguntas-frecuentes',
      'ubicacion-horarios',
      'redes-sociales',
      'whatsapp',
      'formulario-contacto',
      'pie-pagina',
      'panel-administracion',
      'novedades',
      'catalogo-sin-compra',
      'promocion-destacada',
      'sedes',
      'equipo',
      'cotizacion-pasos',
      'vista-google',
    ],
  );
  assert.deepEqual(Object.keys(iconos), [...nombresIconos]);
  assert.deepEqual(
    componentes.map((componente) => componente.icono),
    [...nombresIconos],
  );
  assert.equal(componentes.filter((componente) => componente.planMinimo === 'landing').length, 11);
  assert.equal(componentes.filter((componente) => componente.planMinimo === 'portal').length, 8);
  assert.deepEqual(
    componentes.filter((componente) => componente.destacado).map((componente) => componente.id),
    ['panel-administracion'],
  );
  for (const componente of componentes) {
    assert.ok(componente.descripcion.length > 0 && componente.descripcion.length <= 65);
    assert.match(componente.revisionDescripcion, /TODO\(Daniel\)/);
  }
});

test('la seleccion de vitrina hereda landing en portal y destaca el panel primero', () => {
  const componentes = getComponentes();
  const original = JSON.stringify(componentes);
  const landing = seleccionarComponentes(componentes, 'landing', getPaquetes());
  assert.equal(landing.incluidos.length, 11);
  assert.equal(landing.noIncluidos.length, 8);
  assert.ok(
    landing.incluidos.every((item) => item.incluido && item.componente.planMinimo === 'landing'),
  );
  assert.ok(
    landing.noIncluidos.every((item) => !item.incluido && item.componente.planMinimo === 'portal'),
  );
  assert.ok(
    landing.incluidos.every((item) => item.nombrePlanMinimo === getPaquete('landing')?.nombre),
  );
  const portal = seleccionarComponentes(componentes, 'portal', getPaquetes());
  assert.equal(portal.incluidos.length, 19);
  assert.equal(portal.noIncluidos.length, 0);
  assert.equal(portal.incluidos[0].componente.id, 'panel-administracion');
  assert.ok(portal.incluidos.every((item) => item.incluido));
  assert.deepEqual(
    portal.incluidos.slice(1).map((item) => item.componente.id),
    componentes.filter((item) => !item.destacado).map((item) => item.id),
  );
  assert.equal(JSON.stringify(componentes), original);
  assert.deepEqual(seleccionarComponentes([], 'landing', getPaquetes()), {
    incluidos: [],
    noIncluidos: [],
  });
});

test('la vitrina excluye componentes cuyo plan minimo esta desactivado', () => {
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
  const soloPortal = getPaquetes().map((paquete) => ({
    ...paquete,
    habilitado: paquete.id === 'portal',
  }));
  const portal = seleccionarComponentes(getComponentes(), 'portal', soloPortal);
  assert.equal(portal.incluidos.length, 8);
  assert.ok(portal.incluidos.every((item) => item.componente.planMinimo === 'portal'));
});

test('las tarjetas de vitrina son articulos accesibles sin interactividad', () => {
  const textos = getCatalogo().vitrina.etiquetas;
  for (const componente of getComponentes()) {
    const html = renderToStaticMarkup(
      createElement(TarjetaComponente, {
        componente,
        textos,
        nombrePlanMinimo: getPaquete(componente.planMinimo)?.nombre,
      }),
    );
    assert.match(html, /<article aria-labelledby="([^"]+)"/);
    const id = html.match(/aria-labelledby="([^"]+)"/)?.[1];
    assert.ok(html.includes(`<h3 id="${id}"`));
    assert.ok(html.includes(componente.nombre));
    assert.ok(html.includes(componente.descripcion));
    assert.match(html, /Incluido en/);
    assert.doesNotMatch(html, /<a\b|<button\b|<input\b|tabindex=|TODO\(Daniel\)/);
    if (componente.destacado) {
      assert.match(html, /md:col-span-2/);
      assert.ok(html.includes(textos.componenteClave));
    }
  }
  const panel = getComponentes().find((item) => item.id === 'panel-administracion');
  assert.ok(panel);
  const bloqueado = renderToStaticMarkup(
    createElement(TarjetaComponente, {
      componente: panel,
      incluido: false,
      nombrePlanMinimo: 'Captación de Clientes',
      textos,
    }),
  );
  assert.match(bloqueado, /opacity-60/);
  assert.ok(bloqueado.includes('Disponible desde Captación de Clientes'));
  const sinPlan = renderToStaticMarkup(
    createElement(TarjetaComponente, {componente: panel, textos}),
  );
  assert.ok(sinPlan.includes(textos.incluidoSinPlan));
  const sinPlanBloqueado = renderToStaticMarkup(
    createElement(TarjetaComponente, {
      componente: panel,
      textos,
      incluido: false,
    }),
  );
  assert.ok(sinPlanBloqueado.includes(textos.disponibleSinPlan));
});

test('la grilla dibuja la lista recibida en orden sin filtrar variantes no incluidas', () => {
  const {noIncluidos} = seleccionarComponentes(getComponentes(), 'landing', getPaquetes());
  const componentes = noIncluidos.slice(0, 2).reverse();
  const html = renderToStaticMarkup(
    createElement(GrillaComponentes, {
      componentes,
      textos: getCatalogo().vitrina.etiquetas,
    }),
  );
  assert.match(html, /grid-cols-1.*md:grid-cols-2.*lg:grid-cols-3/);
  assert.equal((html.match(/<article\b/g) ?? []).length, 2);
  assert.ok(
    html.indexOf(componentes[0].componente.nombre) < html.indexOf(componentes[1].componente.nombre),
  );
  assert.equal((html.match(/opacity-60/g) ?? []).length, 2);
});

test('los correos oficiales solo se definen en la configuracion y no se expone Gmail', () => {
  const configuracion = path.join('src', 'domain', 'configuracion', 'contacto.ts');
  for (const ruta of [
    ...fuentes('src'),
    ...readdirSync('src/data').map((nombre) => path.join('src', 'data', nombre)),
  ]) {
    const contenido = readFileSync(ruta, 'utf8');
    assert.doesNotMatch(contenido, /@gmail\.com/i, ruta);
    if (ruta !== configuracion) assert.doesNotMatch(contenido, /@dannotech\.cl/i, ruta);
  }
  const html = renderToStaticMarkup(createElement(Footer));
  assert.ok(html.includes(`href="${enlaceCorreo(CONTACT_EMAIL)}"`));
  assert.ok(html.includes('Escríbeme por correo'));
  assert.ok(!html.includes(`>${CONTACT_EMAIL}</a>`));
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
    assert.doesNotMatch(cuerpo, /configurador|selecci[oó]n/i);
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

test('el formulario muestra Consulta y solo los planes habilitados sin simular un envio exitoso', () => {
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
  assert.equal((html.match(/<option\b/g) ?? []).length, 3);
  assert.doesNotMatch(html, /automatizacion|comercio-electronico/);
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

test('un plan inicial desactivado se trata igual que uno inexistente en el contacto', () => {
  for (const paqueteInicial of ['automatizacion', 'comercio-electronico', 'inexistente']) {
    const html = renderToStaticMarkup(
      createElement(Contacto, {paquetes: getPaquetes(), paqueteInicial}),
    );
    assert.match(html, /<option value="consulta" selected="">Consulta<\/option>/);
    assert.match(html, /Preparar consulta/);
    assert.doesNotMatch(html, /automatizacion|comercio-electronico|Preparar cotización/);
    assert.deepEqual(
      prepararCorreoContacto({...datosContacto, paqueteId: paqueteInicial}, getPaquetes()),
      {ok: false, error: 'Elige Consulta o uno de los planes disponibles.'},
    );
  }
});
