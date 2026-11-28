import {after, before, test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync, readdirSync} from 'node:fs';
import path from 'node:path';
import {getPlatformProxy, type PlatformProxy} from 'wrangler';
import {formulariosConfig} from '../src/config/formularios.config';
import {consultaConfig} from '../src/domain/configuracion/consulta';
import {crearEsquemaConsulta, enlaceWhatsapp, fechaBorrado} from '../src/domain/servicios/consulta';
import {avisoConsulta} from '../src/domain/servicios/avisoConsulta';
import type {ConsultaRecibida} from '../src/domain/types/consulta';
import {
  FormularioService,
  type EntregaConsulta,
  type LimiteConsultas,
} from '../src/modules/formularios/core/FormularioService';
import {crearToken, verificarToken} from '../src/modules/formularios/core/tokenConsulta';
import {CloudflareEmailNotificador} from '../src/modules/formularios/adaptadores/CloudflareEmailNotificador';
import {AlmacenAdmin} from '../src/modules/administracion/AlmacenAdmin';
import {avisoSolicitud} from '../src/modules/formularios/plantillas/avisoSolicitud';
import {
  crearSesion,
  verificarSesion,
  verificarPassword,
} from '../src/modules/administracion/sesion';

const sal = 'secreto-de-pruebas-largo-aislado-1234567890';
const consulta = {
  nombre: 'Persona de prueba',
  telefono: '+56 9 1234 5678',
  correo: '',
  canal: 'whatsapp',
  plan: '',
  mensaje: 'Quisiera conversar sobre mi proyecto.',
  consentimiento: true,
  versionAviso: consultaConfig.aviso.version,
};
const esquema = crearEsquemaConsulta(consultaConfig);
const permitido: LimiteConsultas = {limit: async () => ({success: true})};
function servicio(notificador: EntregaConsulta, limite = permitido) {
  return new FormularioService(notificador, limite, formulariosConfig, sal);
}
async function entrada() {
  return {...consulta, token: await crearToken(sal, Date.now() - 5000)};
}

test('acepta teléfono, correo o ambos y exige el dato correspondiente al canal', () => {
  for (const datos of [
    consulta,
    {...consulta, canal: 'llamada'},
    {...consulta, telefono: '', correo: 'persona@example.org', canal: 'correo'},
    {...consulta, correo: 'persona@example.org'},
  ])
    assert.equal(esquema.safeParse(datos).success, true);
  for (const cambio of [
    {telefono: ''},
    {canal: 'correo'},
    {canal: ''},
    {correo: 'invalido'},
    {telefono: 'no-es-un-numero'},
    {consentimiento: false},
    {versionAviso: 'anterior'},
    {plan: 'automatizacion'},
    {nombre: 'Cabecera\r\nBcc: otro@example.org'},
    {mensaje: Array(201).fill('palabra').join(' ')},
  ])
    assert.equal(
      esquema.safeParse({...consulta, ...cambio}).success,
      false,
      JSON.stringify(cambio),
    );
  assert.equal(
    esquema.safeParse({...consulta, mensaje: Array(200).fill('palabra').join(' ')}).success,
    true,
  );
});

test('los campos ausentes, de tipo incorrecto o demasiado largos tienen errores claros en español', () => {
  for (const cambio of [
    {nombre: undefined},
    {nombre: 123},
    {telefono: 123},
    {correo: 123},
    {plan: 123},
    {mensaje: undefined},
    {nombre: 'a'.repeat(101)},
    {telefono: '1'.repeat(31)},
    {correo: 'a'.repeat(255)},
    {mensaje: 'a'.repeat(10001)},
  ]) {
    const resultado = esquema.safeParse({...consulta, ...cambio});
    assert.equal(resultado.success, false);
    if (!resultado.success)
      for (const problema of resultado.error.issues)
        assert.doesNotMatch(problema.message, /Invalid|expected|Too big|undefined|string|number/);
  }
});

test('los tokens verifican firma, espera mínima y caducidad en límites exactos', async () => {
  const ahora = Date.now();
  const token = await crearToken(sal, ahora);
  const limites = formulariosConfig.antiSpam;
  assert.equal(await verificarToken(token, sal, limites, ahora + 2999), false);
  assert.equal(await verificarToken(token, sal, limites, ahora + 3000), true);
  assert.equal(await verificarToken(token, sal, limites, ahora + 7200000), true);
  assert.equal(await verificarToken(token, sal, limites, ahora + 7200001), false);
  assert.equal(await verificarToken(token + '0', sal, limites, ahora + 5000), false);
  assert.equal(await verificarToken(token, sal + 'otra', limites, ahora + 5000), false);
});

test('envía solo tras validar, con metadatos de consentimiento y sin repositorio de solicitudes', async () => {
  let enviada: ConsultaRecibida | undefined;
  const claves: string[] = [];
  const respuesta = await servicio(
    {
      enviarAviso: async (datos) => {
        enviada = datos;
      },
    },
    {
      limit: async ({key}) => {
        claves.push(key);
        return {success: true};
      },
    },
  ).procesar(await entrada(), '192.0.2.1');
  assert.deepEqual(respuesta, {ok: true});
  assert.ok(enviada);
  assert.equal(enviada.nombre, consulta.nombre);
  assert.equal(enviada.versionAviso, consultaConfig.aviso.version);
  assert.equal(enviada.borrarAntesDe, fechaBorrado(new Date(enviada.recibidoEn), 6));
  assert.match(claves[0], /^[a-f0-9]{64}$/);
  assert.ok(!JSON.stringify(enviada).includes('192.0.2.1'));
  for (const archivo of ['core/FormularioService.ts', 'crearFormularios.ts']) {
    const fuente = readFileSync(path.join('src', 'modules', 'formularios', archivo), 'utf8');
    assert.doesNotMatch(
      fuente,
      /D1Almacen|\.guardar\(|console\.\w+\([^)]*,\s*(error|datos|consulta)/,
    );
  }
});

test('no confirma éxito mientras el proveedor aún no completa el envío', async () => {
  let completar!: () => void;
  let iniciar!: () => void;
  const entrega = new Promise<void>((resolver) => {
    completar = resolver;
  });
  const iniciado = new Promise<void>((resolver) => {
    iniciar = resolver;
  });
  let terminado = false;
  const procesando = servicio({
    enviarAviso: async () => {
      iniciar();
      await entrega;
    },
  })
    .procesar(await entrada(), '192.0.2.4')
    .then((resultado) => {
      terminado = true;
      return resultado;
    });
  await iniciado;
  assert.equal(terminado, false);
  completar();
  assert.deepEqual(await procesando, {ok: true});
});

test('la trampa, los datos inválidos, el tiempo mínimo y el límite no envían correo', async () => {
  let envios = 0;
  const enviar: EntregaConsulta = {
    enviarAviso: async () => {
      envios++;
    },
  };
  assert.deepEqual(await servicio(enviar).procesar({sitioWeb: 'bot'}, '192.0.2.2'), {ok: true});
  assert.equal(
    (await servicio(enviar).procesar({...(await entrada()), consentimiento: false}, '192.0.2.2'))
      .ok,
    false,
  );
  assert.equal(
    (await servicio(enviar).procesar({...consulta, token: await crearToken(sal)}, '192.0.2.2')).ok,
    false,
  );
  assert.equal(
    (
      await servicio(enviar, {limit: async () => ({success: false})}).procesar(
        await entrada(),
        '192.0.2.2',
      )
    ).ok,
    false,
  );
  assert.equal(envios, 0);
});

test('un fallo del proveedor no da éxito ni registra datos personales o errores técnicos', async (t) => {
  const logs: unknown[][] = [];
  t.mock.method(console, 'error', (...valores: unknown[]) => logs.push(valores));
  let envios = 0;
  const resultado = await servicio({
    enviarAviso: async () => {
      envios++;
      throw new Error('persona@example.org cuerpo privado del proveedor');
    },
  }).procesar(await entrada(), '192.0.2.3');
  assert.equal(resultado.ok, false);
  assert.equal(envios, 1);
  assert.doesNotMatch(
    JSON.stringify({resultado, logs}),
    /persona@example\.org|cuerpo privado|1234 5678|Persona de prueba/,
  );
});

test('la fecha de borrado respeta meses de distinta duración y el aviso tiene trece puntos', () => {
  assert.equal(fechaBorrado(new Date('2026-08-31T12:00:00Z'), 6), '2027-02-28T12:00:00.000Z');
  assert.throws(() => fechaBorrado(new Date(), 0), /positivo/);
  const otro = {
    ...consultaConfig,
    negocio: 'Otro negocio',
    responsable: 'Otra persona',
    mesesConservacion: 3,
  };
  const aviso = avisoConsulta(otro);
  assert.equal(aviso.length, 13);
  assert.ok(JSON.stringify(aviso).includes('3 meses'));
  assert.ok(!JSON.stringify(aviso).includes('DannoTech'));
  assert.equal(enlaceWhatsapp(consultaConfig), undefined);
  const href = enlaceWhatsapp({
    ...otro,
    whatsapp: {activo: true, numero: '56912345678', mensaje: 'Hola, tengo una consulta.'},
  });
  assert.equal(new URL(href!).searchParams.get('text'), 'Hola, tengo una consulta.');
  assert.ok(!href!.includes(consulta.nombre));
});

test('el correo usa destino fijo, Reply-To opcional, asunto filtrable y aviso aceptado', async () => {
  const enviada: ConsultaRecibida = {
    ...esquema.parse({
      ...consulta,
      correo: 'persona@example.org',
      nombre: '<script>nombre</script>',
      plan: 'landing',
    }),
    recibidoEn: '2026-11-02T18:00:00Z',
    borrarAntesDe: '2027-05-02T18:00:00Z',
  };
  let mensaje: EmailMessage | EmailMessageBuilder | undefined;
  const binding: SendEmail = {
    send: async (datos) => {
      mensaje = datos;
      return {messageId: 'prueba'};
    },
  };
  await new CloudflareEmailNotificador(binding, formulariosConfig).enviarAviso(enviada);
  assert.ok(mensaje && 'subject' in mensaje);
  assert.equal(mensaje.to, formulariosConfig.destinoAvisos);
  assert.equal(mensaje.replyTo, enviada.correo);
  assert.ok(mensaje.subject.startsWith('[Consulta DannoTech] Presencia Digital'));
  const plantilla = avisoSolicitud(enviada, formulariosConfig);
  for (const texto of [
    'Consentimiento: Aceptado',
    'Versión del aviso',
    'America/Santiago',
    'Fecha límite de borrado',
  ])
    assert.ok(plantilla.text.includes(texto));
  assert.doesNotMatch(plantilla.html, /<script>|\/admin\/solicitudes/);
  assert.match(plantilla.html, /&lt;script&gt;/);
  await new CloudflareEmailNotificador(binding, formulariosConfig).enviarAviso({
    ...enviada,
    correo: '',
  });
  assert.ok(mensaje && 'subject' in mensaje);
  assert.equal('replyTo' in mensaje, false);
});

let plataforma: PlatformProxy<{DB: D1Database}>;
before(async () => {
  plataforma = await getPlatformProxy<{DB: D1Database}>({persist: false, envFiles: []});
  for (const archivo of readdirSync('drizzle')
    .filter((nombre) => nombre.endsWith('.sql'))
    .sort()) {
    for (const sentencia of readFileSync(path.join('drizzle', archivo), 'utf8').split(
      '--> statement-breakpoint',
    )) {
      if (sentencia.trim()) await plataforma.env.DB.prepare(sentencia.trim()).run();
    }
  }
});
after(async () => {
  await plataforma?.dispose();
});

test('el quinto fallo concurrente bloquea quince minutos sin escribir consultas', async () => {
  const almacen = new AlmacenAdmin(plataforma.env.DB);
  const ahora = Date.now();
  const resultados = await Promise.all(
    Array.from({length: 8}, () => almacen.registrarFallo('hash-concurrente', ahora)),
  );
  assert.equal(resultados.filter((bloqueado) => !bloqueado).length, 4);
  assert.equal(await almacen.estaBloqueado('hash-concurrente', ahora + 899999), true);
  assert.equal(await almacen.registrarExito('hash-concurrente', ahora + 899999), false);
  assert.equal(await almacen.estaBloqueado('hash-concurrente', ahora + 900000), false);
  assert.equal(await almacen.registrarFallo('hash-concurrente', ahora + 900000), false);
  const fila = await plataforma.env.DB.prepare('SELECT COUNT(*) AS total FROM solicitudes').first<{
    total: number;
  }>();
  assert.equal(fila?.total, 0);
});

test('un acceso correcto reinicia los fallos consecutivos y la configuración es reutilizable', async () => {
  const almacen = new AlmacenAdmin(plataforma.env.DB, {
    rutaPanel: '/gestion',
    maximosFallos: 2,
    bloqueoMinutos: 3,
    inactividadMinutos: 4,
  });
  const ahora = Date.now();
  assert.equal(await almacen.registrarFallo('hash-reinicio', ahora), false);
  assert.equal(await almacen.registrarExito('hash-reinicio', ahora), true);
  assert.equal(await almacen.registrarFallo('hash-reinicio', ahora), false);
  assert.equal(await almacen.registrarFallo('hash-reinicio', ahora), true);
  assert.equal(await almacen.registrarExito('hash-reinicio', ahora + 179999), false);
  assert.equal(await almacen.registrarExito('hash-reinicio', ahora + 180000), true);
});

test('las sesiones vencen exactamente tras treinta minutos inactivas y no pueden revivir', async () => {
  const almacen = new AlmacenAdmin(plataforma.env.DB);
  const ahora = Date.now();
  const id = crypto.randomUUID();
  await almacen.iniciarSesion(id, ahora);
  assert.equal(await almacen.sesionVigente(id, ahora + 1799999), true);
  assert.equal(await almacen.sesionVigente(id, ahora + 1800000), false);
  assert.equal(await almacen.renovarSesion(id, ahora + 1800000), false);
  const activa = crypto.randomUUID();
  await almacen.iniciarSesion(activa, ahora);
  assert.equal(await almacen.renovarSesion(activa, ahora + 1799999), true);
  assert.equal(await almacen.sesionVigente(activa, ahora + 1800000), true);
  await almacen.cerrarSesion(activa);
  assert.equal(await almacen.sesionVigente(activa, ahora + 1800000), false);
  assert.equal(await almacen.renovarSesion(activa, ahora + 1800000), false);
});

test('las sesiones del panel conservan firma y contraseña sin confiar la expiración al navegador', async () => {
  const id = crypto.randomUUID();
  const token = await crearSesion(sal, id);
  assert.equal(await verificarSesion(token, sal), id);
  assert.equal(await verificarSesion(token + 'x', sal), undefined);
  assert.equal(await verificarSesion(token, 'otro-secreto-de-prueba-de-32-caracteres'), undefined);
  assert.equal(
    await verificarPassword('password-de-prueba-largo', 'password-de-prueba-largo', sal),
    true,
  );
  assert.equal(await verificarPassword('otro', 'password-de-prueba-largo', sal), false);
});

test('sincronizar actividad no añade tiempo de inactividad ni retrocede ante peticiones desordenadas', async () => {
  const almacen = new AlmacenAdmin(plataforma.env.DB);
  const ahora = Date.now();
  const id = crypto.randomUUID();
  await almacen.iniciarSesion(id, ahora);
  assert.equal(await almacen.renovarSesion(id, ahora + 15000, 10000), true);
  assert.equal(await almacen.renovarSesion(id, ahora + 16000, 13000), true);
  assert.equal(await almacen.sesionVigente(id, ahora + 1804999), true);
  assert.equal(await almacen.sesionVigente(id, ahora + 1805000), false);
});
