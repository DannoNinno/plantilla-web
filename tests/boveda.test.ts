import {negocio} from '../src/infrastructure/componentes/boveda/ejemplos';
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

import {FormularioContacto} from '../src/infrastructure/componentes/boveda/formulario-contacto';

import {
  validarConsulta,
  limitesContacto,
} from '../src/infrastructure/componentes/boveda/formulario-contacto/validacion';

import tailwindConfig from '../tailwind.config';

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

test('las piezas incluidas no contactan numeros ni perfiles reales en el ejemplo', () => {
  const whatsapp = renderToStaticMarkup(createElement(Whatsapp, negocio.whatsapp));
  const redes = renderToStaticMarkup(createElement(RedesSociales, negocio.redes));
  const pie = renderToStaticMarkup(
    createElement(PiePagina, {nombre: negocio.nombre, ...negocio.pie}),
  );
  assert.ok(whatsapp.includes('href="#contacto"'));
  assert.ok(whatsapp.includes('fixed bottom-28'));
  assert.ok(whatsapp.includes('WhatsApp de ejemplo'));
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
  assert.equal(entrada.cuentaParaTope, false);
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

test('la biblioteca conserva piezas fragmentadas, Tailwind y contenido por props', () => {
  function fuentes(directorio: string): string[] {
    return readdirSync(directorio, {withFileTypes: true}).flatMap((entrada) => {
      const ruta = path.join(directorio, entrada.name);
      return entrada.isDirectory() ? fuentes(ruta) : [ruta];
    });
  }
  for (const carpeta of ['base', 'boveda', 'secciones']) {
    for (const ruta of fuentes(path.join('src', 'infrastructure', 'componentes', carpeta))) {
      assert.doesNotMatch(ruta, /\.(css|scss)$/);
      if (!/\.(ts|tsx)$/.test(ruta)) continue;
      const contenido = readFileSync(ruta, 'utf8');
      assert.ok(contenido.split(/\r?\n/).length <= 150, `${ruta}: supera 150 lineas`);
      assert.doesNotMatch(
        contenido,
        /\bany\b|style=\{|@apply|(?:bg|text|mt|p|rounded|shadow)-\[/,
        ruta,
      );
      if (!ruta.endsWith('.tsx') || carpeta === 'base') continue;
      assert.doesNotMatch(contenido, /data\/|Café Aurora/, ruta);
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
});
