import {test} from 'node:test';
import assert from 'node:assert/strict';

const configurada = process.env.TEST_BASE_URL;
if (!configurada)
  throw new Error('Configura TEST_BASE_URL con la URL del Worker local o de ensayo.');
const base = new URL(configurada).origin;
const id = '00000000-0000-4000-8000-000000000001';

test('el panel y el detalle rechazan sesiones ausentes o manipuladas', async () => {
  for (const ruta of ['/admin/solicitudes/', `/admin/solicitudes/${id}/`]) {
    for (const cookie of ['', 'sesion_formularios=manipulada']) {
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
    `/api/admin/formularios/${id}/reenviar/`,
    `/api/admin/formularios/${id}/leida/`,
    '/api/admin/salir/',
  ]) {
    for (const cookie of ['', 'sesion_formularios=manipulada']) {
      const respuesta = await fetch(new URL(ruta, base), {
        method: 'POST',
        redirect: 'manual',
        headers: {Origin: base, Cookie: cookie},
      });
      assert.equal(respuesta.status, 401, ruta);
      assert.match(respuesta.headers.get('cache-control') ?? '', /no-store/);
    }
    const origenAjeno = await fetch(new URL(ruta, base), {
      method: 'POST',
      headers: {Origin: 'https://origen-no-permitido.example'},
    });
    assert.equal(origenAjeno.status, 403, ruta);
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

test('privacidad y contacto son públicos, sin pedir correo al visitante', async () => {
  const politica = await fetch(new URL('/privacidad/', base));
  assert.equal(politica.status, 200);
  const texto = await politica.text();
  assert.match(texto, /Daniel Salamanca Jorquera/);
  assert.match(texto, /doce meses/);
  assert.match(texto, /mailto:contacto@dannotech\.cl/);
  const contacto = await fetch(new URL('/contacto/', base));
  assert.equal(contacto.status, 200);
  const html = await contacto.text();
  assert.match(html, /name="consentimiento"/);
  assert.match(html, /href="\/privacidad\/?"/);
  assert.doesNotMatch(html, /name="(?:correo|email)"|type="email"/);
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
