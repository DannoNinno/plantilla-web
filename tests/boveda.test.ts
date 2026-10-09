import {test} from 'node:test';
import assert from 'node:assert/strict';
import {existsSync, readdirSync, readFileSync} from 'node:fs';
import path from 'node:path';
import ts from 'typescript';
import {createElement} from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {Portada} from '../src/infrastructure/componentes/secciones/portada';
import {
  registro,
  registroBoveda,
  getComponente,
} from '../src/infrastructure/componentes/boveda/registro';
import {negocio} from '../src/demo/negocio';
import {
  esPlanDemo,
  getPlanesDemo,
  getDemoPaquete,
  getSeccionesPlan,
  seleccionarSecciones,
  seleccionarComposicion,
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
import {getCatalogo, getPaquetes, getSitio} from '../src/infrastructure/handlers/datos';
import PaginaCatalogo from '../src/infrastructure/componentes/Catalogo/PaginaCatalogo';
import PaginaPaquete from '../src/infrastructure/componentes/DetallePaquete/PaginaPaquete';
import TituloSeccion from '../src/infrastructure/componentes/base/TituloSeccion/TituloSeccion';
import {Servicios} from '../src/infrastructure/componentes/secciones/servicios';
import {QuienesSomos} from '../src/infrastructure/componentes/secciones/quienes-somos';
import {Galeria} from '../src/infrastructure/componentes/secciones/galeria';
import {Testimonios} from '../src/infrastructure/componentes/secciones/testimonios';
import {PreguntasFrecuentes} from '../src/infrastructure/componentes/secciones/preguntas-frecuentes';
import {UbicacionHorarios} from '../src/infrastructure/componentes/secciones/ubicacion-horarios';
import {Whatsapp} from '../src/infrastructure/componentes/secciones/whatsapp';
import {RedesSociales} from '../src/infrastructure/componentes/secciones/redes-sociales';
import {PiePagina} from '../src/infrastructure/componentes/secciones/pie-pagina';
import {Novedades} from '../src/infrastructure/componentes/secciones/novedades';
import {CatalogoSinCompra} from '../src/infrastructure/componentes/secciones/catalogo-sin-compra';
import {Sedes} from '../src/infrastructure/componentes/secciones/sedes';
import {Equipo} from '../src/infrastructure/componentes/secciones/equipo';
import {PromocionDestacada} from '../src/infrastructure/componentes/secciones/promocion-destacada';
import {VistaGoogle} from '../src/infrastructure/componentes/secciones/vista-google';
import {FormularioCotizacion} from '../src/infrastructure/componentes/boveda/cotizacion-pasos';
import {ejemploCotizacion} from '../src/infrastructure/componentes/boveda/cotizacion-pasos/ejemplo';
import {
  validarSolicitud,
  erroresPaso,
  pasoPrimerError,
} from '../src/infrastructure/componentes/boveda/cotizacion-pasos/validacion';
import {obtenerCampos} from '../src/infrastructure/componentes/boveda/edicion/campos';
import {actualizarContenido} from '../src/infrastructure/componentes/boveda/edicion/actualizar';
import {cambiarSeleccion, marcarMensaje, eliminarMensaje} from '../src/demo/administracion';

test('la demo tiene una unica fuente JSON sin duplicar el negocio', () => {
  assert.deepEqual(negocio, JSON.parse(readFileSync('src/data/demo/negocio.json', 'utf8')));
  assert.equal(negocio.nombre, 'Café Aurora');
  assert.ok(negocio.sedes.length > 1);
  assert.ok(negocio.productos.length > 0);
  assert.ok(negocio.novedades.length > 0);
});

test('los titulos compartidos usan la misma tipografia sans del portal', () => {
  for (const nivel of ['h1', 'h2'] as const) {
    const html = renderToStaticMarkup(createElement(TituloSeccion, {titulo: 'Título', nivel}));
    assert.ok(html.includes(`<${nivel} class="font-sans`));
    assert.doesNotMatch(html, /font-editorial|font-serif/);
  }
  assert.deepEqual(tailwindConfig.theme.extend.fontFamily.sans, [
    'Poppins',
    'system-ui',
    'sans-serif',
  ]);
});

test('el catalogo distingue componentes aislados y demos del plan sin inventar demos', () => {
  const catalogo = getCatalogo();
  const paquetes = getPaquetes();
  const sitio = getSitio();
  const html = renderToStaticMarkup(createElement(PaginaCatalogo, {catalogo, paquetes, sitio}));
  assert.equal(sitio.catalogoHabilitado, true);
  assert.equal(html.match(/<h1\b/g)?.length, 1);
  assert.ok(html.includes('href="/componentes"'));
  assert.ok(html.includes('href="#planes"'));
  assert.ok(html.includes(catalogo.exploracion.fase));
  for (const paquete of paquetes) {
    const demo = getDemoPaquete(paquete.id);
    const detalle = renderToStaticMarkup(
      createElement(PaginaPaquete, {
        paquete,
        paquetes,
        componentes: [],
        nombreSitio: sitio.nombre,
        catalogo,
        demo,
      }),
    );
    assert.equal(detalle.match(/<h1\b/g)?.length, 1);
    assert.ok(detalle.includes(paquete.nombre));
    assert.ok(detalle.includes('id="consulta"'));
    if (paquete.id === 'landing' || paquete.id === 'portal') {
      assert.ok(demo);
      assert.equal(demo.href, paquete.id === 'landing' ? '/demo/presencia' : '/demo/captacion');
      assert.ok(detalle.includes(`href="${demo.href}"`));
      assert.ok(detalle.includes('href="/componentes"'));
      assert.ok(detalle.includes(catalogo.exploracion.fase));
    } else {
      assert.equal(demo, undefined);
      assert.doesNotMatch(detalle, /href="\/demo\//);
    }
  }
  assert.equal(getDemoPaquete('inexistente'), undefined);
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
      getSeccionesPlan(plan)
        .filter((entrada) => entrada.cuentaParaTope)
        .map((entrada) => entrada.slug),
      negocio.interfaz.planes[plan].secciones,
    );
    assert.equal(
      getSeccionesPlan(plan).filter((entrada) => entrada.cuentaParaTope).length,
      plan === 'presencia' ? 5 : 10,
    );
    assert.deepEqual(
      getSeccionesPlan(plan)
        .filter((entrada) => !entrada.cuentaParaTope)
        .map((entrada) => entrada.slug),
      ['whatsapp', 'redes-sociales', 'pie-pagina'],
    );
  }
  assert.deepEqual(seleccionarSecciones([], 'presencia', 5), []);
  assert.deepEqual(seleccionarSecciones([{...pie, planMinimo: 'captacion'}], 'presencia', 5), []);
  assert.equal(esPlanDemo('desconocido'), false);
  assert.equal(esPlanDemo('captacion'), true);
});

test('la composicion elegida respeta orden y rechaza errores de configuracion', () => {
  const entradas = [
    {slug: 'primera', planMinimo: 'presencia' as const, cuentaParaTope: true},
    {slug: 'segunda', planMinimo: 'presencia' as const, cuentaParaTope: true},
    {slug: 'avanzada', planMinimo: 'captacion' as const, cuentaParaTope: true},
    {slug: 'pie', planMinimo: 'presencia' as const, cuentaParaTope: false},
  ];
  assert.deepEqual(
    seleccionarComposicion(entradas, ['segunda', 'primera'], 'presencia', 5).map(
      (entrada) => entrada.slug,
    ),
    ['segunda', 'primera', 'pie'],
  );
  assert.throws(
    () => seleccionarComposicion(entradas, ['primera', 'primera'], 'presencia', 5),
    /duplicadas/,
  );
  assert.throws(
    () => seleccionarComposicion(entradas, ['ausente'], 'presencia', 5),
    /no disponible/,
  );
  assert.throws(
    () => seleccionarComposicion(entradas, ['avanzada'], 'presencia', 5),
    /no disponible/,
  );
  assert.throws(() => seleccionarComposicion(entradas, ['pie'], 'presencia', 5), /no disponible/);
  assert.throws(
    () => seleccionarComposicion(entradas, ['primera', 'segunda'], 'presencia', 1),
    /supera/,
  );
});

test('las seis secciones nuevas funcionan con props minimas y listas vacias', () => {
  const vacios = [
    createElement(Servicios, {}),
    createElement(QuienesSomos, {}),
    createElement(Galeria, {}),
    createElement(Testimonios, {}),
    createElement(PreguntasFrecuentes, {}),
    createElement(UbicacionHorarios, {etiquetaDireccion: 'Dirección', etiquetaHorarios: 'Horario'}),
  ];
  for (const componente of vacios) {
    const html = renderToStaticMarkup(componente);
    assert.doesNotMatch(html, /<h1\b|<img\b|Café Aurora|undefined|<iframe/);
    assert.ok(html.includes('<section'));
  }
  assert.doesNotMatch(renderToStaticMarkup(createElement(QuienesSomos, {})), /data-imagen="true"/);
});

test('las listas separan sus tarjetas y conservan textos largos sin contenido inventado', () => {
  const largo = 'Texto de ejemplo '.repeat(80);
  const servicios = renderToStaticMarkup(
    createElement(Servicios, {
      titulo: largo,
      elementos: [{id: 'uno', titulo: largo, descripcion: largo}],
    }),
  );
  const testimonios = renderToStaticMarkup(
    createElement(Testimonios, {elementos: [{id: 'uno', texto: largo}]}),
  );
  assert.ok(servicios.includes(largo));
  assert.ok(servicios.includes('break-words'));
  assert.ok(testimonios.includes('<blockquote'));
  assert.doesNotMatch(testimonios, /<figcaption|Visitante ficticio/);
  const nosotros = renderToStaticMarkup(createElement(QuienesSomos, {parrafos: [largo]}));
  assert.ok(nosotros.includes(largo));
  assert.doesNotMatch(nosotros, /<img/);
});

test('las preguntas frecuentes usan controles nativos cerrados y contenido por props', () => {
  const html = renderToStaticMarkup(createElement(PreguntasFrecuentes, negocio.preguntas));
  assert.equal(html.match(/<details\b/g)?.length, negocio.preguntas.elementos.length);
  assert.equal(html.match(/<summary\b/g)?.length, negocio.preguntas.elementos.length);
  assert.doesNotMatch(html, /<details[^>]*\bopen\b|<button|aria-expanded|<script/);
  assert.ok(html.includes(negocio.preguntas.elementos[0].respuesta));
});

test('la galeria y ubicacion usan recursos propios dimensionados sin mapas externos', () => {
  for (const imagen of [
    ...negocio.galeria.imagenes,
    negocio.nosotros.imagen,
    negocio.sedes[0].imagen,
  ]) {
    assert.ok(
      existsSync(path.join('public', ...imagen.src.split('/').filter(Boolean))),
      imagen.src,
    );
    assert.ok(imagen.width > 0 && imagen.height > 0 && imagen.alt.length > 0);
  }
  const galeria = renderToStaticMarkup(createElement(Galeria, negocio.galeria));
  assert.equal(galeria.match(/<img\b/g)?.length, 6);
  assert.equal(galeria.match(/<figcaption\b/g)?.length, 6);
  assert.doesNotMatch(galeria, /<iframe|autoplay/);
  const ubicacion = registro.find((entrada) => entrada.slug === 'ubicacion-horarios');
  assert.ok(ubicacion);
  const html = renderToStaticMarkup(ubicacion.renderizar());
  assert.ok(html.includes(negocio.sedes[0].direccion));
  assert.ok(html.includes(negocio.sedes[0].horarios));
  assert.ok(html.includes('<address'));
  assert.doesNotMatch(html, /<iframe|google\.com|maps\./);
});

test('las piezas incluidas no contactan numeros ni perfiles reales en la demo', () => {
  const whatsapp = renderToStaticMarkup(createElement(Whatsapp, negocio.whatsapp));
  const redes = renderToStaticMarkup(createElement(RedesSociales, negocio.redes));
  const pie = renderToStaticMarkup(
    createElement(PiePagina, {nombre: negocio.nombre, ...negocio.pie}),
  );
  assert.ok(whatsapp.includes('href="#contacto"'));
  assert.ok(whatsapp.includes('fixed bottom-28'));
  assert.ok(whatsapp.includes('WhatsApp de demostración'));
  assert.equal(redes.match(/href="#contacto"/g)?.length, negocio.redes.enlaces.length);
  assert.doesNotMatch(`${whatsapp}${redes}`, /href="https?:|wa\.me|tel:|mailto:/);
  assert.ok(pie.includes('<footer'));
  assert.ok(pie.includes('href="#portada"'));
  const vacias = renderToStaticMarkup(createElement(RedesSociales, {etiqueta: 'Redes'}));
  assert.doesNotMatch(vacias, /<li\b|href=/);
  const minimo = renderToStaticMarkup(
    createElement(PiePagina, {nombre: 'Negocio', copyright: 'Ejemplo'}),
  );
  assert.doesNotMatch(minimo, /<a\b|Café Aurora/);
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
  assert.ok(html.includes('data-introduccion="false"'));
  assert.doesNotMatch(html, /<div class="min-w-0 space-y-6"><\/div>/);
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
      entradas: registroBoveda,
      textos: interfaz.boveda,
    }),
  );
  assert.equal(indice.match(/<h1\b/g)?.length, 1);
  assert.equal(indice.match(/<form\b/g)?.length, registroBoveda.length);
  assert.doesNotMatch(
    indice,
    /href="\/componentes\/portada"|href="\/demo\/|Cuenta para el límite|<table/,
  );
  for (const entrada of registroBoveda) {
    assert.ok(indice.includes(`href="/componentes/${entrada.slug}"`));
    const ficha = renderToStaticMarkup(
      createElement(
        FichaComponente,
        {
          entrada,
          plan: interfaz.planes[entrada.planMinimo].nombre,
          textos: interfaz.boveda,
        },
        entrada.renderizar(true),
      ),
    );
    assert.equal(ficha.match(/<h1\b/g)?.length, 1);
    assert.ok(ficha.includes('<table'));
    assert.ok(ficha.includes('<form'));
    assert.ok(ficha.indexOf('<form') < ficha.indexOf('<table'));
    assert.match(ficha, /<details class="[^"]*">/);
    assert.doesNotMatch(ficha, /<details[^>]*\bopen\b/);
    assert.ok(ficha.includes(interfaz.boveda.informacionTecnica));
    assert.doesNotMatch(ficha, /href="\/demo\/|Sitio de demostración/);
  }
  const vacio = renderToStaticMarkup(
    createElement(IndiceBoveda, {entradas: [], textos: interfaz.boveda}),
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
    assert.ok(html.includes('fixed inset-0'));
    assert.ok(html.includes('data-flotante="true"'));
    assert.equal(html.match(/Sitio de demostración/g)?.length, 1);
    assert.ok(html.includes('overflow-y-auto'));
    assert.ok(html.includes('pointer-events-none fixed inset-x-0 top-0'));
    assert.ok(html.includes('pointer-events-none fixed inset-x-0 bottom-0'));
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
  assert.doesNotMatch(html, /Sitio de demostración|(?:\s|")w-full(?:\s|")/);
  assert.ok(html.includes('bg-brand-ink'));
  assert.ok(html.includes('text-brand-light'));
  assert.ok(html.includes('text-brand-coral'));
  assert.ok(html.includes('text-brand-sky'));
  assert.ok(html.includes('aria-label="Volver a la cotización"'));
  assert.ok(html.includes('aria-label="Captación de Clientes"'));
  assert.ok(html.includes('>Cotizar</span>'));
  assert.ok(html.includes('shadow-lg'));
  assert.doesNotMatch(html, /bg-seccion-fondo/);
  for (const clase of [
    'motion-safe:fine-pointer:hover:scale-105',
    'motion-safe:focus-visible:scale-105',
    'active:scale-100',
    'motion-reduce:transform-none',
    'motion-reduce:transition-none',
    'duration-150',
  ]) {
    assert.equal(html.split(clase).length - 1, 4, clase);
  }
});

test('las nuevas piezas cumplen fragmentacion, Tailwind y paginas sin marcado propio', () => {
  function fuentes(directorio: string): string[] {
    return readdirSync(directorio, {withFileTypes: true}).flatMap((entrada) => {
      const ruta = path.join(directorio, entrada.name);
      return entrada.isDirectory() ? fuentes(ruta) : [ruta];
    });
  }
  const piezas = ['base', 'boveda', 'secciones', 'demo', 'Catalogo', 'DetallePaquete'].flatMap(
    (carpeta) => fuentes(path.join('src', 'infrastructure', 'componentes', carpeta)),
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
    assert.doesNotMatch(contenido, /font-editorial|font-serif/, ruta);
    if (ruta.endsWith('.tsx') && /[\\/](boveda|secciones)[\\/]/.test(ruta)) {
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
    'src/app/(portal)/catalogo/page.tsx',
    'src/app/(portal)/catalogo/[paquete]/page.tsx',
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
    [
      tailwindConfig.theme.extend.colors.brand.ink,
      tailwindConfig.theme.extend.colors.canal.whatsapp,
    ],
  ]) {
    const valores = [luminancia(texto), luminancia(fondo)].sort((a, b) => b - a);
    assert.ok((valores[0] + 0.05) / (valores[1] + 0.05) >= 4.5);
  }
});

test('el registro conserva componentes, ejemplos tipados y metadatos unicos', () => {
  assert.equal(new Set(registro.map((entrada) => entrada.slug)).size, registro.length);
  assert.equal(getComponente('no-existe'), undefined);
  assert.equal(getComponente('portada'), undefined);
  assert.deepEqual(
    registroBoveda.map((entrada) => entrada.slug),
    ['formulario-contacto', 'cotizacion-pasos'],
  );
  assert.ok(registroBoveda.every((entrada) => entrada.categoria === 'componente'));
  const portada = registro.find((entrada) => entrada.slug === 'portada');
  assert.ok(portada);
  assert.ok(portada.cuentaParaTope);
  assert.equal(portada.planMinimo, 'presencia');
  assert.equal(portada.categoria, 'seccion');
  assert.equal(portada.enDemo, true);
  const aislado = renderToStaticMarkup(portada.renderizar(true));
  assert.doesNotMatch(aislado, /<h1\b|href="#contacto"/);
  assert.equal(aislado.match(/<h2\b/g)?.length, 1);
  const formulario = getComponente('formulario-contacto');
  assert.ok(formulario);
  assert.doesNotMatch(renderToStaticMarkup(formulario.renderizar(true)), /<h1\b|<h2\b/);
});

test('Captacion publica piezas agnosticas, listas vacias y una vista Google sin conexiones', () => {
  for (const pieza of [
    createElement(Novedades, {}),
    createElement(Sedes, {etiquetaDireccion: 'Dirección', etiquetaHorarios: 'Horarios'}),
    createElement(Equipo, {}),
    createElement(PromocionDestacada, {}),
    createElement(CatalogoSinCompra, {textoConsulta: 'Consultar', hrefConsulta: '#consulta'}),
  ]) {
    const html = renderToStaticMarkup(pieza);
    assert.ok(html.includes('<section'));
    assert.doesNotMatch(html, /undefined|<h1\b|<img\b/);
  }
  const google = renderToStaticMarkup(
    createElement(VistaGoogle, {
      ...negocio.google,
      titulo: negocio.nombre,
      descripcion: negocio.descripcion,
    }),
  );
  assert.ok(google.includes(negocio.google.url));
  assert.doesNotMatch(google, /<a\b|<iframe|google\.com|<h1\b/);
  const entrada = registro.find((item) => item.slug === 'vista-google');
  assert.ok(entrada);
  assert.equal(entrada.enDemo, false);
  assert.equal(entrada.cuentaParaTope, false);
  assert.ok(!getSeccionesPlan('captacion').some((item) => item.slug === 'equipo'));
});

test('los recursos de Captacion existen con dimensiones y texto alternativo', () => {
  const imagenes = registro
    .flatMap((item) => item.crearInstancia().campos)
    .filter((campo) => campo.tipo === 'imagen');
  assert.ok(imagenes.length >= 15);
  for (const {valor: imagen} of imagenes) {
    assert.ok(
      existsSync(path.join('public', ...imagen.src.split('/').filter(Boolean))),
      imagen.src,
    );
    assert.ok(imagen.width > 0 && imagen.height > 0 && imagen.alt.trim());
  }
});

test('la cotizacion reutiliza limites exactos y valida cada paso y toda la solicitud', () => {
  const valida = {
    servicio: ejemploCotizacion.campos.servicio.opciones[0].id,
    nombre: 'Cliente ficticio',
    correo: 'cliente@ejemplo.invalid',
    mensaje: 'a'.repeat(10),
  };
  assert.deepEqual(validarSolicitud(valida, ejemploCotizacion), {});
  const errores = validarSolicitud(
    {servicio: 'ausente', nombre: '', correo: 'incorrecto', mensaje: 'corto'},
    ejemploCotizacion,
  );
  assert.deepEqual(Object.keys(erroresPaso(errores, 1)), ['servicio']);
  assert.deepEqual(Object.keys(erroresPaso(errores, 2)), ['mensaje']);
  assert.deepEqual(Object.keys(erroresPaso(errores, 3)), ['nombre', 'correo']);
  assert.equal(pasoPrimerError(errores), 1);
  assert.equal(pasoPrimerError({mensaje: 'error', correo: 'error'}), 2);
  assert.equal(pasoPrimerError({correo: 'error'}), 3);
  assert.deepEqual(
    validarSolicitud(
      {...valida, mensaje: 'a'.repeat(2000), nombre: 'a'.repeat(100)},
      ejemploCotizacion,
    ),
    {},
  );
  assert.equal(
    validarSolicitud({...valida, mensaje: 'a'.repeat(2001)}, ejemploCotizacion).mensaje,
    negocio.contacto.textos.limite,
  );
  assert.equal(
    validarSolicitud({...valida, mensaje: 'a'.repeat(9)}, ejemploCotizacion).mensaje,
    ejemploCotizacion.campos.mensaje.error,
  );
  const html = renderToStaticMarkup(createElement(FormularioCotizacion, ejemploCotizacion));
  assert.match(html, /<select[^>]*name="servicio"/);
  assert.match(html, /<button[^>]*type="submit"[^>]*disabled=""/);
  assert.ok(html.includes('<noscript>'));
  assert.doesNotMatch(html, /action=|mailto:|<h1\b/);
});

test('la edicion es inmutable y bloquea anclas, identidades y rutas incompatibles', () => {
  const props = {
    id: 'seccion',
    href: '#contacto',
    titulo: 'Inicial',
    elementos: [{id: 'producto', nombre: 'Producto', precio: 1200}],
    imagen: negocio.portada.imagen,
  };
  const campos = obtenerCampos(props);
  assert.ok(
    !campos.some((campo) =>
      ['id', 'href', 'src', 'width', 'height'].includes(campo.ruta.at(-1) ?? ''),
    ),
  );
  const titulo = actualizarContenido(props, ['titulo'], 'Nuevo título');
  assert.equal(titulo.titulo, 'Nuevo título');
  assert.equal(props.titulo, 'Inicial');
  const producto = actualizarContenido(props, ['elementos', '0', 'precio'], 0);
  assert.equal(producto.elementos[0].precio, 0);
  assert.equal(props.elementos[0].precio, 1200);
  for (const numero of [-1, 1.5, NaN, Infinity, Number.MAX_SAFE_INTEGER + 1]) {
    assert.throws(
      () => actualizarContenido(props, ['elementos', '0', 'precio'], numero),
      /incompatible/,
    );
  }
  for (const ruta of [
    ['id'],
    ['href'],
    ['imagen', 'src'],
    ['__proto__'],
    ['elementos', '99', 'nombre'],
  ]) {
    assert.throws(() => actualizarContenido(props, ruta, 'otro'), /no editable/);
  }
  assert.throws(() => actualizarContenido(props, ['titulo'], 10), /incompatible/);
  const imagen = actualizarContenido(props, ['imagen'], negocio.sedes[0].imagen);
  assert.deepEqual(imagen.imagen, negocio.sedes[0].imagen);
  assert.deepEqual(props.imagen, negocio.portada.imagen);
});

test('las instancias enlazan props tipadas y reflejan cambios sin alterar el registro', () => {
  const portada = registro.find((item) => item.slug === 'portada');
  assert.ok(portada);
  const inicial = portada.crearInstancia();
  const cambiada = inicial.actualizar(['titulo'], 'Título editado de prueba');
  assert.ok(renderToStaticMarkup(cambiada.renderizar()).includes('Título editado de prueba'));
  assert.doesNotMatch(renderToStaticMarkup(inicial.renderizar()), /Título editado de prueba/);
  assert.doesNotMatch(renderToStaticMarkup(portada.renderizar()), /Título editado de prueba/);
});

test('el selector intercambia secciones sin superar diez ni eliminar las piezas fijas', () => {
  const inicial = negocio.interfaz.planes.captacion.secciones;
  const disponibles = registro
    .filter((item) => item.enDemo && item.cuentaParaTope)
    .map((item) => item.slug);
  const fijas = ['portada', 'formulario-contacto'];
  assert.throws(() => cambiarSeleccion(inicial, 'equipo', disponibles, 10, fijas), /Límite/);
  assert.throws(() => cambiarSeleccion(inicial, 'portada', disponibles, 10, fijas), /fija/);
  assert.throws(
    () => cambiarSeleccion(inicial, 'desconocida', disponibles, 10, fijas),
    /no disponible/,
  );
  const sinNovedades = cambiarSeleccion(inicial, 'novedades', disponibles, 10, fijas);
  const conEquipo = cambiarSeleccion(sinNovedades, 'equipo', disponibles, 10, fijas);
  assert.equal(conEquipo.length, 10);
  assert.ok(conEquipo.includes('equipo'));
  assert.ok(!conEquipo.includes('novedades'));
  assert.equal(inicial.length, 10);
  assert.equal(negocio.catalogo.hrefConsulta, '#contacto');
  assert.equal(negocio.promocion.accion.href, '#contacto');
});

test('la bandeja marca mensajes sin mutar ni aceptar identidades desconocidas', () => {
  const mensajes = [
    {
      id: 1,
      nombre: 'Ficticio',
      correo: 'ficticio@ejemplo.invalid',
      mensaje: 'Consulta de ejemplo',
      origen: 'Contacto',
      leido: false,
    },
  ];
  assert.equal(marcarMensaje(mensajes, 1)[0].leido, true);
  assert.equal(mensajes[0].leido, false);
  assert.throws(() => marcarMensaje(mensajes, 99), /no disponible/);
  assert.deepEqual(eliminarMensaje(mensajes, 1), []);
  assert.equal(mensajes.length, 1);
  assert.throws(() => eliminarMensaje(mensajes, 99), /no disponible/);
});

test('la simulacion no incorpora persistencia, autenticacion ni peticiones', () => {
  const rutas = [
    'src/infrastructure/componentes/demo/AdministracionDemo/useAdministracion.ts',
    'src/infrastructure/componentes/boveda/cotizacion-pasos/useCotizacion.ts',
    'src/demo/administracion.ts',
  ];
  for (const ruta of rutas) {
    assert.doesNotMatch(
      readFileSync(ruta, 'utf8'),
      /localStorage|sessionStorage|fetch\(|XMLHttpRequest|axios|document\.cookie|use server/,
    );
  }
});
