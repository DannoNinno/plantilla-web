import {test} from 'node:test';
import assert from 'node:assert/strict';
import {PRIVACY_VERSION} from '../src/domain/configuracion/contacto';

const configurada = process.env.TEST_BASE_URL;
if (!configurada)
  throw new Error('Configura TEST_BASE_URL con la URL del Worker local o de ensayo.');
const base = new URL(configurada).origin;
const id = '00000000-0000-4000-8000-000000000001';
const passwordAdmin = process.env.TEST_ADMIN_PASSWORD;
const ipPrueba = () =>
  `2001:db8:${Array.from(crypto.getRandomValues(new Uint16Array(6)), (n) => n.toString(16)).join(':')}`;

test(
  'el flujo real autentica, renueva y revoca con cookies protegidas',
  {skip: !passwordAdmin},
  async () => {
    assert.ok(
      ['localhost', '127.0.0.1', '[::1]'].includes(new URL(base).hostname),
      'Usa credenciales de prueba solo en loopback.',
    );
    assert.ok(passwordAdmin);
    const ip = ipPrueba();
    const entrar = (password: string) =>
      fetch(new URL('/admin/api/acceso/', base), {
        method: 'POST',
        redirect: 'manual',
        headers: {
          Origin: base,
          'Content-Type': 'application/x-www-form-urlencoded',
          'CF-Connecting-IP': ip,
        },
        body: new URLSearchParams({password}),
      });
    for (let intento = 0; intento < 4; intento++) {
      const rechazo = await entrar('incorrecta-para-prueba');
      assert.equal(
        new URL(rechazo.headers.get('location')!, base).searchParams.get('error'),
        'credenciales',
      );
    }
    const acceso = await entrar(passwordAdmin);
    assert.equal(acceso.status, 303);
    assert.equal(new URL(acceso.headers.get('location')!, base).pathname, '/admin/');
    const cabecera = acceso.headers.get('set-cookie');
    assert.ok(cabecera, 'El acceso debe emitir una cookie.');
    for (const flag of ['HttpOnly', 'Secure', 'SameSite=strict', 'Path=/admin', 'Max-Age=1800'])
      assert.ok(cabecera.toLowerCase().includes(flag.toLowerCase()), `Falta ${flag}`);
    const cookie = cabecera.split(';')[0];
    for (const ruta of ['/admin/', '/admin/simulacion/', '/admin/simulacion/emular/?c=invalido']) {
      const inicio = await fetch(new URL(ruta, base), {headers: {Cookie: cookie}});
      assert.equal(inicio.status, 200, ruta);
      assert.match(inicio.headers.get('cache-control') ?? '', /no-store/);
      assert.match(inicio.headers.get('x-robots-tag') ?? '', /noindex/);
      assert.ok(
        (await inicio.text()).includes(ruta.includes('emular') ? 'configuración' : 'Cerrar sesión'),
      );
    }
    const renovar = (body: string) =>
      fetch(new URL('/admin/api/sesion/', base), {
        method: 'POST',
        redirect: 'manual',
        headers: {Origin: base, Cookie: cookie, 'Content-Type': 'application/json'},
        body,
      });
    assert.equal((await renovar('{')).status, 400);
    assert.equal((await renovar(JSON.stringify({inactividadMs: -1}))).status, 400);
    const renovada = await renovar(JSON.stringify({inactividadMs: 0}));
    assert.equal(renovada.status, 200);
    assert.deepEqual(await renovada.json(), {ok: true});
    const salida = await fetch(new URL('/admin/api/salir/', base), {
      method: 'POST',
      redirect: 'manual',
      headers: {Origin: base, Cookie: cookie},
    });
    assert.equal(salida.status, 303);
    assert.ok(salida.headers.get('set-cookie')?.includes('Max-Age=0'));
    const revocada = await fetch(new URL('/admin/', base), {
      redirect: 'manual',
      headers: {Cookie: cookie},
    });
    assert.equal(revocada.status, 307);
    assert.equal((await renovar(JSON.stringify({inactividadMs: 0}))).status, 303);
  },
);

test(
  'el quinto fallo real bloquea incluso una contraseña correcta',
  {skip: !passwordAdmin},
  async () => {
    assert.ok(
      ['localhost', '127.0.0.1', '[::1]'].includes(new URL(base).hostname),
      'Usa credenciales de prueba solo en loopback.',
    );
    assert.ok(passwordAdmin);
    const ip = ipPrueba();
    for (let intento = 1; intento <= 6; intento++) {
      const respuesta: Response = await fetch(new URL('/admin/api/acceso/', base), {
        method: 'POST',
        redirect: 'manual',
        headers: {
          Origin: base,
          'Content-Type': 'application/x-www-form-urlencoded',
          'CF-Connecting-IP': ip,
        },
        body: new URLSearchParams({
          password: intento === 6 ? passwordAdmin : 'incorrecta-para-prueba',
        }),
      });
      assert.equal(respuesta.status, 303);
      assert.equal(
        new URL(respuesta.headers.get('location')!, base).searchParams.get('error'),
        intento < 5 ? 'credenciales' : 'limite',
      );
      assert.equal(respuesta.headers.get('set-cookie'), null);
    }
  },
);

test('el panel rechaza sesiones ausentes o manipuladas', async () => {
  for (const ruta of ['/admin/', '/admin/simulacion/', '/admin/simulacion/emular/?c=invalido']) {
    for (const cookie of ['', 'sesion_admin=manipulada']) {
      const respuesta = await fetch(new URL(ruta, base), {
        redirect: 'manual',
        headers: cookie ? {Cookie: cookie} : {},
      });
      assert.equal(respuesta.status, 307, ruta);
      assert.equal(new URL(respuesta.headers.get('location')!, base).pathname, '/admin/acceso/');
      assert.match(respuesta.headers.get('cache-control') ?? '', /no-store/);
      assert.match(respuesta.headers.get('x-robots-tag') ?? '', /noindex/);
    }
  }
});

test('los endpoints administrativos autentican sin depender del proxy', async () => {
  for (const ruta of [
    '/admin/api/salir/',
    '/admin/api/sesion/',
    '/api/admin/salir/',
    '/api/admin/sesion/',
  ]) {
    for (const cookie of ['', 'sesion_admin=manipulada']) {
      const respuesta = await fetch(new URL(ruta, base), {
        method: 'POST',
        redirect: 'manual',
        headers: {Origin: base, Cookie: cookie},
      });
      assert.equal(respuesta.status, 303, ruta);
      assert.equal(new URL(respuesta.headers.get('location')!, base).pathname, '/admin/acceso/');
      assert.match(respuesta.headers.get('cache-control') ?? '', /no-store/);
    }
    const origenAjeno = await fetch(new URL(ruta, base), {
      method: 'POST',
      headers: {Origin: 'https://origen-no-permitido.example'},
    });
    assert.equal(origenAjeno.status, 403, ruta);
  }
});

test('la bandeja y los endpoints de solicitudes se retiraron sin borrar datos históricos', async () => {
  for (const ruta of [
    '/admin/solicitudes/',
    `/admin/solicitudes/${id}/`,
    `/api/admin/formularios/${id}/reenviar/`,
    `/api/admin/formularios/${id}/leida/`,
  ]) {
    const respuesta = await fetch(new URL(ruta, base));
    assert.equal(respuesta.status, 404, ruta);
  }
});

test('el acceso y el formulario rechazan orígenes ajenos', async () => {
  for (const ruta of ['/api/admin/acceso/', '/api/formularios/']) {
    const respuesta = await fetch(new URL(ruta, base), {
      method: 'POST',
      headers: {Origin: 'https://origen-no-permitido.example'},
    });
    assert.equal(respuesta.status, 403, ruta);
  }
});

test('el endpoint público valida tipo, formato, tamaño y honeypot sin enviar avisos', async () => {
  const enviar = (body: string, contentType = 'application/json') =>
    fetch(new URL('/api/formularios/', base), {
      method: 'POST',
      headers: {Origin: base, 'Content-Type': contentType},
      body,
    });
  assert.equal((await enviar('texto', 'text/plain')).status, 415);
  assert.equal((await enviar('{')).status, 400);
  const invalido = await enviar(JSON.stringify({tipo: 'invalido'}));
  assert.equal(invalido.status, 400);
  assert.equal((await enviar('a'.repeat(16385))).status, 413);
  const trampa = await enviar(JSON.stringify({tipo: 'consulta', sitioWeb: 'bot-de-prueba'}));
  assert.equal(trampa.status, 200);
  assert.deepEqual(await trampa.json(), {ok: true});
  const sinConsentimiento = await enviar(
    JSON.stringify({tipo: 'consulta', nombre: 'Prueba sin guardar', mensaje: 'Mensaje de prueba.'}),
  );
  assert.equal(sinConsentimiento.status, 400);
  assert.match(await sinConsentimiento.text(), /consentimiento/);
});

test('prepara tokens sin caché y rechaza envíos sin token o con aviso desactualizado', async () => {
  const preparacion = await fetch(new URL('/api/formularios/', base));
  assert.equal(preparacion.status, 200);
  assert.match(preparacion.headers.get('cache-control') ?? '', /no-store/);
  const datos = (await preparacion.json()) as {token: string};
  assert.match(datos.token, /^\d+\.[\da-f-]+\.[\da-f]+$/);
  const cuerpo = {
    nombre: 'Prueba sin envío',
    correo: 'prueba@example.org',
    canal: 'correo',
    mensaje: 'Esta consulta no debe enviarse.',
    consentimiento: true,
    versionAviso: 'desactualizada',
    token: datos.token,
  };
  const respuesta = await fetch(new URL('/api/formularios/', base), {
    method: 'POST',
    headers: {Origin: base, 'Content-Type': 'application/json'},
    body: JSON.stringify(cuerpo),
  });
  assert.equal(respuesta.status, 400);
  assert.match(respuesta.headers.get('cache-control') ?? '', /no-store/);
  assert.match(await respuesta.text(), /versionAviso/);
  const sinToken = await fetch(new URL('/api/formularios/', base), {
    method: 'POST',
    headers: {Origin: base, 'Content-Type': 'application/json'},
    body: JSON.stringify({...cuerpo, versionAviso: PRIVACY_VERSION, token: ''}),
  });
  assert.equal(sinToken.status, 422);
  assert.equal(((await sinToken.json()) as {ok: boolean}).ok, false);
});

test('privacidad y contacto son públicos y permiten responder al visitante', async () => {
  const politica = await fetch(new URL('/privacidad/', base));
  assert.equal(politica.status, 200);
  const texto = await politica.text();
  assert.match(texto, /Daniel Salamanca Jorquera/);
  assert.match(texto, /máximo de 6 meses/);
  assert.match(texto, /mailto:contacto@dannotech\.cl/);
  const contacto = await fetch(new URL('/contacto/', base));
  assert.equal(contacto.status, 200);
  const html = await contacto.text();
  assert.match(html, /name="consentimiento"/);
  assert.match(html, /href="\/privacidad\/?"/);
  assert.match(html, /name="correo"/);
  assert.match(html, /name="telefono"/);
  assert.match(html, /name="canal"/);
  assert.doesNotMatch(html, /name="(?:rut|direccion|fechaNacimiento)"/);
});

test('el Worker remoto fuerza HTTPS en páginas y POST sin modificar su destino', async () => {
  if (new URL(base).protocol !== 'https:') return;
  for (const ruta of ['/?prueba=https', '/admin/acceso/?prueba=https', '/api/formularios/']) {
    const url = new URL(ruta, base);
    const segura = url.href;
    url.protocol = 'http:';
    const method = ruta.startsWith('/api/') ? 'POST' : 'GET';
    const respuesta = await fetch(url, {method, redirect: 'manual'});
    assert.equal(respuesta.status, method === 'POST' ? 308 : 301, ruta);
    assert.equal(respuesta.headers.get('location'), segura);
  }
  const respuesta = await fetch(new URL('/admin/acceso/', base));
  assert.match(respuesta.headers.get('strict-transport-security') ?? '', /max-age=31536000/);
});
