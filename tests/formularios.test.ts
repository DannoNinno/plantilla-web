import {after, before, test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync, readdirSync} from 'node:fs';
import {getPlatformProxy, type PlatformProxy} from 'wrangler';
import {formulariosConfig} from '../src/config/formularios.config';
import {PRIVACY_VERSION} from '../src/domain/configuracion/contacto';
import {FormularioService} from '../src/modules/formularios/core/FormularioService';
import {D1Almacen} from '../src/modules/formularios/adaptadores/D1Almacen';
import {CloudflareEmailNotificador} from '../src/modules/formularios/adaptadores/CloudflareEmailNotificador';
import {avisoSolicitud} from '../src/modules/formularios/plantillas/avisoSolicitud';
import {
  crearSesion,
  DURACION_SESION,
  verificarPassword,
  verificarSesion,
} from '../src/modules/formularios/admin/sesion';
import {hashIp} from '../src/modules/formularios/core/antiSpam';
import type {Almacen, Notificador, Solicitud} from '../src/modules/formularios/core/tipos';

const sal = 'sal-de-pruebas-larga-y-aislada-1234567890';
const consulta = {
  tipo: 'consulta',
  nombre: '  Persona <prueba>  ',
  mensaje: 'Quisiera conversar sobre mi proyecto.',
  consentimiento: true,
};
let plataforma: PlatformProxy<{DB: D1Database}>;
let almacen: D1Almacen;
let secuencia = 0;
const idAnterior = '00000000-0000-4000-8000-000000000001';
const correoAnterior = 'registro-anterior@example.org';
function ip() {
  return `192.0.2.${++secuencia}`;
}
function servicio(notificador: Notificador, repositorio: Almacen = almacen) {
  return new FormularioService(repositorio, notificador, formulariosConfig, sal);
}
const noEnviar: Notificador = {
  enviarAviso: async () => {
    assert.fail('No debe enviar.');
  },
};

before(async () => {
  plataforma = await getPlatformProxy<{DB: D1Database}>({persist: false, envFiles: []});
  for (const archivo of readdirSync('drizzle')
    .filter((nombre) => nombre.endsWith('.sql'))
    .sort()) {
    for (const sentencia of readFileSync(`drizzle/${archivo}`, 'utf8').split(
      '--> statement-breakpoint',
    )) {
      if (sentencia.trim()) await plataforma.env.DB.prepare(sentencia.trim()).run();
    }
    if (archivo === '0000_pink_hercules.sql') {
      await plataforma.env.DB.prepare(
        `INSERT INTO solicitudes
          (id, tipo, nombre, email, datos, ip_hash, creado_en, estado_aviso, intentos_aviso, leida, avisado_en)
         VALUES (?, 'consulta', 'Registro anterior', ?, ?, 'hash-anterior', ?, 'enviado', 3, 1, ?)`,
      )
        .bind(
          idAnterior,
          correoAnterior,
          JSON.stringify({mensaje: 'Mensaje anterior a la migración.'}),
          '2020-01-01T00:00:00.000Z',
          '2020-01-01T00:01:00.000Z',
        )
        .run();
    }
  }
  almacen = new D1Almacen(plataforma.env.DB);
});
after(async () => {
  await plataforma?.dispose();
});

test('la migración conserva los datos y estados de las solicitudes anteriores', async () => {
  const anterior = await almacen.obtener(idAnterior);
  assert.ok(anterior);
  assert.equal(anterior.email, correoAnterior);
  assert.equal(anterior.datos.mensaje, 'Mensaje anterior a la migración.');
  assert.equal(anterior.ipHash, 'hash-anterior');
  assert.equal(anterior.estadoAviso, 'enviado');
  assert.equal(anterior.intentosAviso, 3);
  assert.equal(anterior.leida, true);
  assert.equal(anterior.avisadoEn, '2020-01-01T00:01:00.000Z');
});

test('guarda antes de enviar; conserva todos los datos y marca enviado', async () => {
  let recibida: Solicitud | undefined;
  const resultado = await servicio({
    enviarAviso: async (s) => {
      assert.ok(await almacen.obtener(s.id));
      recibida = s;
    },
  }).procesar(consulta, ip());
  assert.deepEqual(resultado, {ok: true});
  assert.ok(recibida);
  const guardada = await almacen.obtener(recibida.id);
  assert.equal(guardada?.estadoAviso, 'enviado');
  assert.equal(guardada?.nombre, 'Persona <prueba>');
  assert.equal(guardada?.email, null);
  assert.equal(guardada?.datos.mensaje, consulta.mensaje);
  assert.equal(guardada?.datos.consentimiento, PRIVACY_VERSION);
  assert.equal(guardada?.intentosAviso, 1);
  assert.ok(guardada?.avisadoEn);
  assert.equal(guardada?.reservaHasta, null);
});

test('consulta y cotización descartan el email incluso si se añade al payload', async () => {
  for (const tipo of ['consulta', 'cotizacion']) {
    let recibida: Solicitud | undefined;
    const resultado = await servicio({
      enviarAviso: async (s) => {
        recibida = s;
      },
    }).procesar(
      {
        ...consulta,
        tipo,
        servicio: 'landing',
        detalle: consulta.mensaje,
        email: 'no-guardar@example.org',
        correo: 'no-guardar@example.org',
        replyTo: 'no-guardar@example.org',
      },
      ip(),
    );
    assert.deepEqual(resultado, {ok: true});
    assert.ok(recibida);
    const guardada = await almacen.obtener(recibida.id);
    assert.ok(guardada);
    assert.equal(guardada.email, null);
    assert.doesNotMatch(
      JSON.stringify(guardada.datos),
      /no-guardar@example\.org|email|correo|replyTo/,
    );
    const plantilla = avisoSolicitud(guardada, formulariosConfig);
    assert.doesNotMatch(plantilla.text, /no-guardar@example\.org|Email:/);
    assert.doesNotMatch(plantilla.html, /no-guardar@example\.org/);
  }
});

test('fallo de aviso no altera el éxito; registra error y permite reenvío manual', async () => {
  const direccionIp = ip();
  let recibida: Solicitud | undefined;
  const resultado = await servicio({
    enviarAviso: async (s) => {
      recibida = s;
      throw new Error('Fallo de binding simulado');
    },
  }).procesar(consulta, direccionIp);
  assert.deepEqual(resultado, {ok: true});
  assert.ok(recibida);
  let guardada = await almacen.obtener(recibida.id);
  assert.equal(guardada?.estadoAviso, 'fallido');
  assert.equal(guardada?.intentosAviso, 2);
  assert.equal(guardada?.ultimoError, 'Fallo de binding simulado');
  assert.deepEqual(await servicio({enviarAviso: async () => {}}).reenviarAviso(recibida.id), {
    ok: true,
  });
  guardada = await almacen.obtener(recibida.id);
  assert.equal(guardada?.estadoAviso, 'enviado');
  assert.equal(guardada?.intentosAviso, 3);
  assert.equal(guardada?.ultimoError, null);
});

test('honeypot y tipo inválido no guardan ni envían', async () => {
  const antes = await almacen.contar();
  const s = servicio(noEnviar);
  assert.deepEqual(await s.procesar({...consulta, sitioWeb: 'spam'}, ip()), {ok: true});
  assert.equal((await s.procesar({...consulta, tipo: 'desconocido'}, ip())).ok, false);
  assert.equal(await almacen.contar(), antes);
});

test('ambos tipos requieren consentimiento explícito y no aceptan una versión del cliente', async () => {
  const antes = await almacen.contar();
  for (const tipo of ['consulta', 'cotizacion']) {
    for (const consentimiento of [undefined, false, 'true', PRIVACY_VERSION]) {
      const resultado = await servicio(noEnviar).procesar(
        {...consulta, tipo, servicio: 'landing', detalle: consulta.mensaje, consentimiento},
        ip(),
      );
      assert.equal(resultado.ok, false);
      if (!resultado.ok) assert.ok(resultado.errores?.consentimiento);
    }
  }
  assert.equal(await almacen.contar(), antes);
});

test('un binding ausente en producción falla explícitamente sin perder la solicitud', async () => {
  const resultado = await servicio(
    new CloudflareEmailNotificador(undefined, formulariosConfig),
  ).procesar({...consulta, nombre: 'Binding ausente'}, ip());
  assert.deepEqual(resultado, {ok: true});
  const [fila] = await almacen.listar({estado: 'fallido'});
  assert.equal(fila.nombre, 'Binding ausente');
  assert.match(fila.ultimoError ?? '', /AVISO_EMAIL/);
  assert.equal(fila.intentosAviso, 2);
});

test('si falla la confirmación en D1 después de enviar, no vuelve a enviar inmediatamente', async () => {
  let envios = 0;
  let id = '';
  const repositorio = new Proxy(almacen, {
    get(target, propiedad) {
      if (propiedad === 'actualizarAviso') {
        return async () => {
          throw new Error('Confirmación D1 no disponible');
        };
      }
      return Reflect.get(target, propiedad);
    },
  });
  const resultado = await servicio(
    {
      enviarAviso: async (s) => {
        envios++;
        id = s.id;
      },
    },
    repositorio,
  ).procesar(consulta, ip());
  assert.deepEqual(resultado, {ok: true});
  assert.equal(envios, 1);
  const fila = await almacen.obtener(id);
  assert.equal(fila?.estadoAviso, 'pendiente');
  assert.ok(fila?.reservaHasta);
});

test('valida campos, límite de palabras y servicios habilitados', async () => {
  const antes = await almacen.contar();
  for (const entrada of [
    {...consulta, nombre: 'a'.repeat(101)},
    {...consulta, nombre: 'cabecera\r\ninyectada'},
    {...consulta, mensaje: Array(201).fill('palabra').join(' ')},
    {...consulta, tipo: 'cotizacion', servicio: 'automatizacion', detalle: consulta.mensaje},
    {...consulta, tipo: 'cotizacion', servicio: 'inexistente', detalle: consulta.mensaje},
  ]) {
    const resultado = await servicio(noEnviar).procesar(entrada, ip());
    assert.equal(resultado.ok, false);
    if (!resultado.ok) assert.ok(resultado.errores && Object.keys(resultado.errores).length);
  }
  assert.equal(await almacen.contar(), antes);
});

test('el límite por IP permite solo cinco inserciones simultáneas', async () => {
  const direccionIp = ip();
  const resultados = await Promise.all(
    Array.from({length: 9}, () =>
      servicio({enviarAviso: async () => {}}).procesar(consulta, direccionIp),
    ),
  );
  assert.equal(resultados.filter((r) => r.ok).length, 5);
  assert.equal(await almacen.contarRecientesPorIp(await hashIp(direccionIp, sal), 10), 5);
});

test('dos reenvíos simultáneos tienen un solo propietario; los enviados no se repiten', async () => {
  const s = await almacen.guardar(
    {
      tipo: 'consulta',
      nombre: 'Prueba',
      datos: {mensaje: consulta.mensaje},
      ipHash: await hashIp(ip(), sal),
    },
    {desde: new Date(0).toISOString(), maximo: 5},
  );
  assert.ok(s);
  let envios = 0;
  const notificador: Notificador = {
    enviarAviso: async () => {
      envios++;
    },
  };
  const resultados = await Promise.all([
    servicio(notificador).reenviarAviso(s.id),
    servicio(notificador).reenviarAviso(s.id),
  ]);
  assert.equal(envios, 1);
  assert.equal(resultados.filter((r) => r.ok).length, 1);
  assert.deepEqual(await servicio(notificador).reenviarAviso(s.id), {
    ok: false,
    motivo: 'no_disponible',
  });
});

test('una reserva vencida se recupera y su propietario viejo no puede finalizarla', async () => {
  const s = await almacen.guardar(
    {
      tipo: 'consulta',
      nombre: 'Prueba',
      datos: {},
      ipHash: await hashIp(ip(), sal),
    },
    {desde: new Date(0).toISOString(), maximo: 5},
  );
  assert.ok(s);
  assert.equal(await almacen.reservarAviso(s.id, 'viejo', new Date(0).toISOString()), true);
  assert.equal(
    await almacen.reservarAviso(s.id, 'nuevo', new Date(Date.now() + 60000).toISOString()),
    true,
  );
  await assert.rejects(almacen.actualizarAviso(s.id, 'viejo', {estado: 'enviado'}), /reserva/);
  await almacen.actualizarAviso(s.id, 'nuevo', {estado: 'fallido', error: 'Recuperada'});
});

test('un error de guardado no envía y no muestra éxito', async () => {
  const repositorio = new Proxy(almacen, {
    get(target, propiedad) {
      if (propiedad === 'guardar')
        return async () => {
          throw new Error('D1 no disponible');
        };
      return Reflect.get(target, propiedad);
    },
  });
  const resultado = await servicio(noEnviar, repositorio).procesar(consulta, ip());
  assert.equal(resultado.ok, false);
  if (!resultado.ok) assert.match(resultado.mensaje, /guardar/);
});

test('cotización conserva el plan validado, genera asunto y nunca usa al visitante como destino', async () => {
  let recibida: Solicitud | undefined;
  assert.deepEqual(
    await servicio({
      enviarAviso: async (s) => {
        recibida = s;
      },
    }).procesar(
      {
        ...consulta,
        tipo: 'cotizacion',
        servicio: 'landing',
        detalle: consulta.mensaje,
        telefono: '+56 9 1234 5678',
        destino: 'destino-no-permitido@example.org',
      },
      ip(),
    ),
    {ok: true},
  );
  assert.ok(recibida);
  assert.equal(recibida.datos.servicio, 'Presencia Digital');
  let enviado: EmailMessageBuilder | undefined;
  const binding: SendEmail = {
    send: async (mensaje) => {
      if (!('subject' in mensaje)) throw new Error('Se esperaba el constructor estructurado.');
      enviado = mensaje;
      return {messageId: 'simulado'};
    },
  };
  await new CloudflareEmailNotificador(binding, formulariosConfig).enviarAviso(recibida);
  assert.ok(enviado);
  assert.equal(enviado.to, formulariosConfig.destinoAvisos);
  assert.equal('replyTo' in enviado, false);
  assert.equal(recibida.email, null);
  assert.match(enviado.subject, /^\[Cotización\] Presencia Digital/);
  assert.ok(enviado.text?.includes(consulta.mensaje));
  assert.ok(enviado.html?.includes('&lt;prueba&gt;'));
  assert.ok(enviado.text?.includes('America/Santiago'));
  assert.ok(enviado.text?.includes(`/admin/solicitudes/${recibida.id}/`));
  const plantilla = avisoSolicitud(
    {...recibida, datos: {detalle: '<script>"&\''}},
    formulariosConfig,
  );
  assert.doesNotMatch(plantilla.html, /<script>/);
  assert.match(plantilla.html, /&lt;script&gt;&quot;&amp;&#39;/);
});

test('listado, filtros, conteo y lectura no cambian el aviso', async () => {
  const filas = await almacen.listar({tipo: 'cotizacion', estado: 'enviado'});
  assert.ok(filas.length);
  const s = filas[0];
  await almacen.marcarLeida(s.id);
  assert.equal((await almacen.obtener(s.id))?.leida, true);
  assert.equal((await almacen.obtener(s.id))?.estadoAviso, 'enviado');
  assert.ok((await almacen.contar({tipo: 'cotizacion'})) >= 1);
  assert.equal((await almacen.listar({pagina: 100})).length, 0);
});

test('autenticación verifica firma, expiración, manipulación y contraseña', async () => {
  const secreto = 'secreto-de-pruebas-aislado-y-largo-1234567890';
  const ahora = Date.now();
  const token = await crearSesion(secreto, ahora);
  assert.equal(await verificarSesion(token, secreto, ahora), true);
  assert.equal(await verificarSesion(undefined, secreto, ahora), false);
  assert.equal(await verificarSesion(token + 'x', secreto, ahora), false);
  assert.equal(await verificarSesion(token, secreto, ahora + DURACION_SESION * 1000), false);
  assert.equal(await verificarSesion(token, sal, ahora), false);
  assert.equal(
    await verificarPassword('password-largo-pruebas', 'password-largo-pruebas', secreto),
    true,
  );
  assert.equal(await verificarPassword('incorrecto', 'password-largo-pruebas', secreto), false);
  await assert.rejects(crearSesion('corto'), /32/);
});

test('el acceso administrativo tiene límite atómico en D1', async () => {
  const hash = await hashIp(ip(), sal);
  const intentos = await Promise.all(Array.from({length: 8}, () => almacen.permitirAcceso(hash)));
  assert.equal(intentos.filter(Boolean).length, 5);
});
