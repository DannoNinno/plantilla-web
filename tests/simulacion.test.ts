import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import path from 'node:path';
import {compressToEncodedURIComponent} from 'lz-string';
import {isValidElement} from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import tailwindConfig from '../tailwind.config';
import {registro} from '../src/infrastructure/componentes/boveda/registro';
import {getComponentes} from '../src/infrastructure/handlers/datos';
import {adminConfig} from '../src/domain/configuracion/administracion';
import {
  agregarSeccion,
  cambiarOpcion,
  cambiarPlan,
  contarSecciones,
  copiarJSON,
  decodeConfig,
  encodeConfig,
  formatoJSON,
  getSeccionSimulacion,
  irASeccion,
  MAX_SECCIONES,
  moverSeccion,
  opcionesSeleccion,
  opcionesSwitch,
  paginaSimulacionSchema,
  quitarSeccion,
  renderizarSeccionSimulacion,
  rutaEmulacion,
  rutaSimulacion,
  seccionesSimulacion,
  seccionesNavegables,
  seguirEnlaceEjemplo,
  simulacionSchema,
  urlSimulacion,
  validarSimulacion,
  valoresPorDefecto,
  volverArriba,
} from '../src/infrastructure/handlers/simulacion';
import type {
  ConfigSimulacion,
  ResultadoSimulacion,
} from '../src/infrastructure/handlers/simulacion';

function valor<T>(resultado: ResultadoSimulacion<T>): T {
  assert.equal(resultado.ok, true, resultado.ok ? undefined : resultado.error.mensaje);
  return resultado.valor;
}
function invalido(resultado: ResultadoSimulacion<unknown>, mensaje?: RegExp) {
  assert.equal(resultado.ok, false);
  assert.ok(resultado.error.codigo);
  assert.ok(resultado.error.mensaje);
  if (mensaje) assert.match(resultado.error.mensaje, mensaje);
}
const inicial = () => structuredClone(valoresPorDefecto);
const comprimir = (json: unknown) => compressToEncodedURIComponent(JSON.stringify(json));
const fuente = (...partes: string[]) => readFileSync(path.join('src', ...partes), 'utf8');

test('Portada permanece en la página, pero nunca en los enlaces de navegación', () => {
  for (const esLanding of [true, false]) {
    const config = valor(
      validarSimulacion({
        ...inicial(),
        pagina: {...inicial().pagina, esLanding},
        secciones: esLanding
          ? ['portada', 'galeria', 'servicios']
          : ['galeria', 'portada', 'servicios'],
      }),
    );
    const original = [...config.secciones];
    assert.deepEqual(seccionesNavegables(config.secciones), ['galeria', 'servicios']);
    assert.deepEqual(config.secciones, original);
    assert.ok(config.secciones.includes('portada'));
  }
  assert.deepEqual(seccionesNavegables(['portada']), []);
  assert.deepEqual(seccionesNavegables([]), []);
  assert.deepEqual(seccionesNavegables(['servicios', 'futura-seccion']), [
    'servicios',
    'futura-seccion',
  ]);
  const enlaces = fuente(
    'infrastructure',
    'componentes',
    'portal',
    'Simulacion',
    'EnlacesEmulados.tsx',
  );
  assert.match(enlaces, /seccionesNavegables\(keys\)/);
});

test('el inventario adapta las 15 piezas del registro completo sin duplicar metadatos', () => {
  const excluidas = new Set(['whatsapp', 'pie-pagina', 'vista-google']);
  const elegibles = registro.filter(({slug}) => !excluidas.has(slug));
  assert.equal(seccionesSimulacion.length, 15);
  assert.deepEqual(
    seccionesSimulacion.map(({key}) => key),
    elegibles.map(({slug}) => slug),
  );
  for (const pieza of seccionesSimulacion) {
    const origen = registro.find(({slug}) => slug === pieza.key);
    assert.ok(origen);
    assert.equal(pieza.nombre, pieza.key === 'portada' ? 'PORTADA' : origen.nombre);
    assert.equal(pieza.planMinimo, origen.planMinimo);
    assert.equal(pieza.cuentaParaTope, origen.cuentaParaTope);
    assert.equal(pieza.icono, getComponentes().find(({id}) => id === pieza.key)?.icono);
  }
  assert.ok(getSeccionSimulacion('formulario-contacto'));
  assert.ok(getSeccionSimulacion('cotizacion-pasos'));
  assert.ok(getSeccionSimulacion('redes-sociales'));
  assert.equal(getSeccionSimulacion('panel-administracion'), undefined);
});

test('los valores iniciales y controles cubren todas las opciones de página', () => {
  assert.deepEqual(valoresPorDefecto, {
    v: 1,
    plan: 'presencia-digital',
    pagina: {
      esLanding: true,
      navegacion: 'navbar',
      fija: true,
      transparenteSobreLanding: false,
      logo: 'izquierda',
      menuMovil: 'hamburguesa',
      footer: 'simple',
      tema: 'oscuro',
      ancho: 'completo',
      scrollSuave: true,
      seccionActiva: true,
      whatsapp: 'ninguno',
      volverArriba: false,
    },
    secciones: ['portada'],
  });
  assert.deepEqual(simulacionSchema.parse({}), valoresPorDefecto);
  const controles = [...opcionesSeleccion, ...opcionesSwitch].map(({key}) => key);
  assert.equal(new Set(controles).size, controles.length);
  assert.deepEqual(
    [...controles, 'menuMovil', 'logo', 'tema', 'ancho'].sort(),
    Object.keys(paginaSimulacionSchema.shape).sort(),
  );
  const opciones = fuente(
    'infrastructure',
    'componentes',
    'portal',
    'Simulacion',
    'OpcionesPagina.tsx',
  );
  assert.match(opciones, /Menú móvil tipo drawer/);
  assert.doesNotMatch(
    opciones,
    /Posición del logo|Tema de navegación y pie|Ancho de las secciones/,
  );
});

test('los enlaces anteriores conservan secciones y normalizan las opciones que ahora son fijas', () => {
  const antigua = {
    ...inicial(),
    pagina: {...inicial().pagina, tema: 'claro', ancho: 'contenido', logo: 'centro'},
  };
  const actual = valor(decodeConfig(comprimir(antigua)));
  assert.deepEqual(actual, inicial());
  assert.equal(actual.pagina.tema, 'oscuro');
  assert.equal(actual.pagina.logo, 'izquierda');
  assert.equal(actual.pagina.ancho, 'completo');
});

test('la muestra renderiza los 15 componentes originales con sus props ficticias sin mutar la bóveda', () => {
  for (const {key} of seccionesSimulacion) {
    const original = registro.find(({slug}) => slug === key);
    assert.ok(original);
    const props = structuredClone(original.propsEjemplo);
    const ejemplo = renderizarSeccionSimulacion(key);
    assert.ok(isValidElement(ejemplo));
    assert.equal(ejemplo.type, original.componente);
    const html = renderToStaticMarkup(ejemplo);
    assert.ok(html.length > 100, key);
    assert.doesNotMatch(html, /caf[eé]|aurora|cafe-aurora/i, key);
    assert.doesNotMatch(JSON.stringify(ejemplo.props), /caf[eé]|aurora|cafe-aurora/i, key);
    assert.deepEqual(original.propsEjemplo, props);
  }
  assert.match(
    renderToStaticMarkup(renderizarSeccionSimulacion('portada')),
    /Título principal de tu sitio/,
  );
  assert.match(
    renderToStaticMarkup(renderizarSeccionSimulacion('servicios')),
    /Servicio de ejemplo 1/,
  );
  assert.match(
    renderToStaticMarkup(renderizarSeccionSimulacion('galeria')),
    /\/simulacion\/imagen-ejemplo\.svg/,
  );
  const galeria = renderizarSeccionSimulacion('galeria');
  assert.ok(isValidElement<{imagenes: {id: string}[]}>(galeria));
  assert.ok(galeria.props.imagenes.every(({id}) => typeof id === 'string'));
  assert.equal(
    new Set(galeria.props.imagenes.map(({id}) => id)).size,
    galeria.props.imagenes.length,
  );
  for (const key of ['desconocida', 'whatsapp', 'pie-pagina', 'vista-google']) {
    assert.equal(renderizarSeccionSimulacion(key), undefined);
  }
});

test('PORTADA se bloquea por vista landing, independientemente del plan', () => {
  for (const plan of ['presencia-digital', 'captacion-clientes']) {
    let config = valor(cambiarPlan(inicial(), plan));
    invalido(quitarSeccion(config, 'portada'), /landing/i);
    invalido(moverSeccion(config, 'portada', 2), /bloqueada/i);
    invalido(validarSimulacion({...config, secciones: ['servicios', 'portada']}), /primera/i);
    config = valor(cambiarOpcion(config, 'esLanding', false));
    config = valor(quitarSeccion(config, 'portada'));
    assert.deepEqual(config.secciones, []);
    config = valor(agregarSeccion(config, 'servicios'));
    config = valor(agregarSeccion(config, 'portada'));
    assert.deepEqual(config.secciones, ['servicios', 'portada']);
    config = valor(cambiarOpcion(config, 'esLanding', true));
    assert.deepEqual(config.secciones, ['portada', 'servicios']);
  }
});

test('agregar, mover y quitar preservan el original y nunca duplican secciones', () => {
  const original = inicial();
  let config = valor(agregarSeccion(original, 'servicios'));
  config = valor(agregarSeccion(config, 'galeria', 0));
  assert.deepEqual(config.secciones, ['portada', 'galeria', 'servicios']);
  config = valor(moverSeccion(config, 'servicios', 0));
  assert.deepEqual(config.secciones, ['portada', 'servicios', 'galeria']);
  config = valor(moverSeccion(config, 'servicios', 999));
  assert.deepEqual(config.secciones, ['portada', 'galeria', 'servicios']);
  config = valor(quitarSeccion(config, 'galeria'));
  assert.deepEqual(config.secciones, ['portada', 'servicios']);
  assert.deepEqual(original, valoresPorDefecto);
  invalido(agregarSeccion(config, 'servicios'), /ya está/i);
  invalido(validarSimulacion({...config, secciones: ['portada', 'portada']}), /repetidas/i);
  invalido(moverSeccion(config, 'ausente', 1), /no está/i);
  invalido(quitarSeccion(config, 'ausente'), /no está/i);
});

test('el máximo es seis computables, PORTADA cuenta y redes sociales no', () => {
  assert.equal(MAX_SECCIONES, 6);
  const seis = ['portada', 'servicios', 'galeria', 'testimonios', 'preguntas-frecuentes', 'equipo'];
  const config = valor(
    validarSimulacion({...inicial(), plan: 'captacion-clientes', secciones: seis}),
  );
  assert.equal(contarSecciones(config.secciones), 6);
  const conRedes = valor(agregarSeccion(config, 'redes-sociales'));
  assert.equal(conRedes.secciones.length, 7);
  assert.equal(contarSecciones(conRedes.secciones), 6);
  invalido(agregarSeccion(conRedes, 'quienes-somos'), /seis/i);
  assert.equal(contarSecciones(['key-desconocida']), 1);
  const sinPortada = valor(
    validarSimulacion({
      ...config,
      pagina: {...config.pagina, esLanding: false},
      secciones: [
        'servicios',
        'galeria',
        'testimonios',
        'preguntas-frecuentes',
        'equipo',
        'quienes-somos',
      ],
    }),
  );
  invalido(cambiarOpcion(sinPortada, 'esLanding', true), /seis/i);
  assert.equal(sinPortada.secciones.includes('portada'), false);
});

test('los planes, exclusiones y errores de opciones no borran selecciones', () => {
  const base = inicial();
  for (const pieza of seccionesSimulacion) {
    const resultado = agregarSeccion(base, pieza.key);
    if (pieza.key === 'portada' || pieza.planMinimo === 'captacion') invalido(resultado);
    else valor(resultado);
  }
  const config = valor(agregarSeccion(valor(cambiarPlan(base, 'captacion-clientes')), 'equipo'));
  invalido(cambiarPlan(config, 'presencia-digital'), /Captación/i);
  assert.deepEqual(config.secciones, ['portada', 'equipo']);
  for (const key of ['whatsapp', 'pie-pagina', 'vista-google'])
    invalido(agregarSeccion(config, key));
  invalido(cambiarOpcion(config, 'navegacion', 'errónea'), /Configuración inválida/i);
  invalido(cambiarOpcion(config, 'fija', 'true'));
  invalido(cambiarPlan(config, 'inexistente'));
});

test('el codec restaura exactamente opciones, orden y keys futuras', () => {
  const config: ConfigSimulacion = {
    v: 1,
    plan: 'captacion-clientes',
    pagina: {
      esLanding: false,
      navegacion: 'sidebar',
      fija: false,
      transparenteSobreLanding: true,
      logo: 'izquierda',
      menuMovil: 'drawer',
      footer: 'completo',
      tema: 'oscuro',
      ancho: 'completo',
      scrollSuave: false,
      seccionActiva: false,
      whatsapp: 'abajo-izquierda',
      volverArriba: true,
    },
    secciones: ['equipo', 'portada', 'futura-seccion', 'cotizacion-pasos', 'redes-sociales'],
  };
  assert.deepEqual(valor(decodeConfig(encodeConfig(config))), config);
  assert.deepEqual(valor(decodeConfig(encodeConfig(inicial()))), inicial());
  const {componentes, ...configExportada} = JSON.parse(formatoJSON(config));
  assert.deepEqual(configExportada, config);
  assert.deepEqual(
    componentes.map(({key}: {key: string}) => key),
    config.secciones,
  );
  assert.match(formatoJSON(config), /\n {2}"v": 1/);
  assert.match(formatoJSON(config), /\n {4}"esLanding": false/);
});

test('el JSON guía describe cada componente seleccionado sin modificar la configuración ni el codec', () => {
  for (const seccion of seccionesSimulacion) {
    const config = simulacionSchema.parse({
      plan: 'captacion-clientes',
      pagina: {esLanding: false},
      secciones: [seccion.key],
    });
    const original = structuredClone(config);
    const exportado = JSON.parse(formatoJSON(config));
    const ficha = getComponentes().find(({id}) => id === seccion.key);
    assert.ok(ficha);
    assert.deepEqual(exportado.componentes, [
      {key: seccion.key, nombre: seccion.nombre, descripcion: ficha.descripcion},
    ]);
    assert.ok(exportado.componentes[0].descripcion.trim());
    assert.deepEqual(config, original);
    assert.deepEqual(valor(decodeConfig(encodeConfig(config))), original);
  }
  const futuro = simulacionSchema.parse({
    pagina: {esLanding: false},
    secciones: ['futura-seccion'],
  });
  assert.deepEqual(JSON.parse(formatoJSON(futuro)).componentes, [
    {
      key: 'futura-seccion',
      nombre: 'Sección no encontrada',
      descripcion:
        'Componente desconocido en esta bóveda. Requiere revisión antes de implementarlo.',
    },
  ]);
  const vacio = simulacionSchema.parse({pagina: {esLanding: false}, secciones: []});
  assert.deepEqual(JSON.parse(formatoJSON(vacio)).componentes, []);
});

test('el decoder devuelve errores tipados, nunca excepciones ni valores por defecto silenciosos', () => {
  for (const entrada of [undefined, null, [], {}, 22, '', '???', 'abc', 'a', 'AAAA', ['abc']]) {
    assert.doesNotThrow(() => invalido(decodeConfig(entrada)));
  }
  for (const json of [
    null,
    [],
    {v: 2},
    {pagina: {tema: 'rosa'}},
    {extra: true},
    {...inicial(), secciones: ['<script>']},
    {...inicial(), secciones: ['portada', 'portada']},
  ]) {
    invalido(decodeConfig(comprimir(json)));
  }
  invalido(decodeConfig(compressToEncodedURIComponent('{json roto')), /JSON/i);
  invalido(decodeConfig('A'.repeat(4097)), /larga/i);
  invalido(decodeConfig(comprimir({relleno: 'A'.repeat(20000)})), /larga/i);
});

test('ambas rutas usan el prefijo configurado y el retorno preserva c exactamente', () => {
  const config = valor(agregarSeccion(inicial(), 'servicios'));
  const armador = new URL(urlSimulacion(config), 'https://prueba.example');
  const emulador = new URL(urlSimulacion(config, true), 'https://prueba.example');
  assert.equal(rutaSimulacion, `${adminConfig.rutaPanel}/simulacion/`);
  assert.equal(rutaEmulacion, `${rutaSimulacion}emular/`);
  assert.equal(armador.pathname, rutaSimulacion);
  assert.equal(emulador.pathname, rutaEmulacion);
  assert.equal(armador.search, emulador.search);
  assert.deepEqual(valor(decodeConfig(emulador.searchParams.get('c'))), config);
});

test('copiar entrega JSON completo y los permisos rechazados producen un error explícito', async () => {
  const descriptor = Object.getOwnPropertyDescriptor(navigator, 'clipboard');
  let escrito = '';
  Object.defineProperty(navigator, 'clipboard', {
    configurable: true,
    value: {
      writeText: async (texto: string) => {
        escrito = texto;
      },
    },
  });
  try {
    assert.equal(valor(await copiarJSON(inicial())), 'Copiado');
    assert.equal(escrito, formatoJSON(inicial()));
    const {componentes, ...configExportada} = JSON.parse(escrito);
    assert.deepEqual(configExportada, inicial());
    assert.equal(componentes[0].key, 'portada');
    assert.equal(componentes[0].descripcion, getSeccionSimulacion('portada')?.descripcion);
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: {
        writeText: async () => {
          throw new Error('Permiso rechazado');
        },
      },
    });
    invalido(await copiarJSON(inicial()), /permisos del portapapeles/i);
  } finally {
    if (descriptor) Object.defineProperty(navigator, 'clipboard', descriptor);
    else Reflect.deleteProperty(navigator, 'clipboard');
  }
});

test('los anclajes compensan solo la navegación fija y respetan scroll suave y movimiento reducido', () => {
  const anteriorWindow = Object.getOwnPropertyDescriptor(globalThis, 'window');
  const anteriorDocument = Object.getOwnPropertyDescriptor(globalThis, 'document');
  const desplazamientos: ScrollToOptions[] = [];
  let reducido = false;
  const ventana = {
    innerWidth: 1440,
    scrollY: 100,
    scrollTo: (opciones: ScrollToOptions) => desplazamientos.push(opciones),
    matchMedia: () => ({matches: reducido}),
  };
  Object.defineProperty(globalThis, 'window', {configurable: true, value: ventana});
  Object.defineProperty(globalThis, 'document', {
    configurable: true,
    value: {
      getElementById: (id: string) =>
        id === 'seccion-portada'
          ? {getBoundingClientRect: () => ({top: 200})}
          : id === 'portada'
            ? {closest: () => ({getAttribute: () => 'portada'})}
            : null,
    },
  });
  try {
    let config = inicial();
    irASeccion('portada', config);
    assert.deepEqual(desplazamientos.at(-1), {top: 220, behavior: 'smooth'});
    config = valor(cambiarOpcion(config, 'scrollSuave', false));
    irASeccion('portada', config);
    assert.deepEqual(desplazamientos.at(-1), {top: 220, behavior: 'instant'});
    config = valor(cambiarOpcion(config, 'scrollSuave', true));
    reducido = true;
    irASeccion('portada', config);
    assert.equal(desplazamientos.at(-1)?.behavior, 'instant');
    config = valor(cambiarOpcion(config, 'navegacion', 'sidebar'));
    irASeccion('portada', config);
    assert.equal(desplazamientos.at(-1)?.top, 300);
    ventana.innerWidth = 390;
    irASeccion('portada', config);
    assert.equal(desplazamientos.at(-1)?.top, 220);
    config = valor(cambiarOpcion(config, 'fija', false));
    irASeccion('portada', config);
    assert.equal(desplazamientos.at(-1)?.top, 300);
    volverArriba(config);
    assert.deepEqual(desplazamientos.at(-1), {top: 0, behavior: 'instant'});
    assert.throws(() => irASeccion('ausente', config), /No existe el anclaje/);
    assert.equal(seguirEnlaceEjemplo('#portada', config), '');
    assert.match(seguirEnlaceEjemplo('#ausente', config), /Enlace de ejemplo/);
    assert.match(
      seguirEnlaceEjemplo('https://ejemplo.invalid', config),
      /No se abren sitios externos/,
    );
  } finally {
    if (anteriorWindow) Object.defineProperty(globalThis, 'window', anteriorWindow);
    else Reflect.deleteProperty(globalThis, 'window');
    if (anteriorDocument) Object.defineProperty(globalThis, 'document', anteriorDocument);
    else Reflect.deleteProperty(globalThis, 'document');
  }
});

test('la emulación adapta componentes reales sin cambiar el layout protegido ni las dos acciones del dock', () => {
  const grupo = fuente('app', 'admin', '(emulacion)', 'layout.tsx');
  assert.match(grupo, /await exigirAdmin\(\)/);
  assert.match(grupo, /EstadoSesion/);
  assert.doesNotMatch(grupo, /PanelAdmin|LayoutPanel/);
  const ui = fuente('infrastructure', 'componentes', 'portal', 'Simulacion', 'Emulacion.tsx');
  assert.match(ui, /<CajaSeccion/);
  assert.doesNotMatch(ui, /\.componente|\.Componente|<Portada|<Formulario/);
  const caja = fuente('infrastructure', 'componentes', 'portal', 'Simulacion', 'CajaSeccion.tsx');
  assert.match(caja, /Sección no encontrada/);
  assert.match(caja, /min-h-dvh/);
  assert.match(caja, /renderizarSeccionSimulacion/);
  assert.match(caja, /pointer-events-none/);
  assert.match(caja, /data-testid="marca-agua"/);
  assert.match(caja, /opacity-20 blur-sm/);
  assert.match(caja, /\[&>section>div\]:z-20/);
  const imagen = readFileSync(path.join('public', 'simulacion', 'imagen-ejemplo.svg'), 'utf8');
  assert.doesNotMatch(imagen, /filter|feGaussianBlur|opacity/);
  assert.match(imagen, /fill="#D4EDF8"/);
  assert.match(imagen, /stroke="#85BFD6"/);
  assert.match(caja, /!max-w-none/);
  assert.match(ui, /className="w-full"/);
  const dock = fuente('infrastructure', 'componentes', 'portal', 'Simulacion', 'DockEmulacion.tsx');
  assert.equal((dock.match(/<button\b/g) ?? []).length, 1);
  assert.equal((dock.match(/<Link\b/g) ?? []).length, 1);
  assert.match(dock, /<Link href=\{urlSimulacion\(config\)\} replace/);
  const acciones = fuente(
    'infrastructure',
    'componentes',
    'portal',
    'Simulacion',
    'AccionesSimulacion.tsx',
  );
  assert.match(acciones, /<Link[\s\S]*?href=\{urlSimulacion\(config, true\)\}\s+replace/);
  assert.doesNotMatch(acciones, /target=|pestaña nueva|Solo se emulan cajas/);
});

test('la carga es de ruta y la entrada no transforma el contenedor de los elementos fijos', () => {
  for (const grupo of ['(panel)', '(emulacion)']) {
    assert.match(fuente('app', 'admin', grupo, 'loading.tsx'), /CargandoVista/);
    assert.match(
      fuente('app', 'admin', grupo, 'template.tsx'),
      /motion-safe:animate-simulacion-entrada/,
    );
  }
  assert.deepEqual(tailwindConfig.theme.extend.keyframes['simulacion-entrada'], {
    from: {opacity: '0'},
    to: {opacity: '1'},
  });
  const carga = fuente(
    'infrastructure',
    'componentes',
    'portal',
    'Administracion',
    'CargandoVista.tsx',
  );
  assert.match(carga, /role="status"/);
  assert.match(carga, /motion-reduce:animate-none/);
  assert.doesNotMatch(carga, /setTimeout/);
});
