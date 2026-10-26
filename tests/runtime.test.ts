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
});
