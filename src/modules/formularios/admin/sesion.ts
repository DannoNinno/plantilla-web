export const NOMBRE_COOKIE = 'sesion_formularios';
export const DURACION_SESION = 8 * 60 * 60;

async function claveHmac(secreto: string) {
  if (secreto.length < 32) throw new Error('ADMIN_SECRET debe tener al menos 32 caracteres.');
  return crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secreto),
    {name: 'HMAC', hash: 'SHA-256'},
    false,
    ['sign', 'verify'],
  );
}

function codificar(bytes: Uint8Array): string {
  return btoa(String.fromCharCode(...bytes))
    .replace(/\+/gu, '-')
    .replace(/\//gu, '_')
    .replace(/=+$/gu, '');
}

export async function crearSesion(secreto: string, ahora = Date.now()): Promise<string> {
  const contenido = `${Math.floor(ahora / 1000) + DURACION_SESION}.${crypto.randomUUID()}`;
  const firma = await crypto.subtle.sign(
    'HMAC',
    await claveHmac(secreto),
    new TextEncoder().encode(contenido),
  );
  return `${contenido}.${codificar(new Uint8Array(firma))}`;
}

export async function verificarSesion(
  token: string | undefined,
  secreto: string,
  ahora = Date.now(),
): Promise<boolean> {
  const clave = await claveHmac(secreto);
  if (!token || token.length > 200) return false;
  const partes = token.split('.');
  if (partes.length !== 3) return false;
  const [expira, nonce, firma] = partes;
  if (!/^\d{10}$/u.test(expira) || !/^[a-f0-9-]{36}$/u.test(nonce) || !/^[\w-]{43}$/u.test(firma))
    return false;
  const segundos = Math.floor(ahora / 1000);
  if (Number(expira) <= segundos || Number(expira) > segundos + DURACION_SESION) return false;
  const bytes = Uint8Array.from(atob(firma.replace(/-/gu, '+').replace(/_/gu, '/') + '='), (c) =>
    c.charCodeAt(0),
  );
  return crypto.subtle.verify('HMAC', clave, bytes, new TextEncoder().encode(`${expira}.${nonce}`));
}

export async function verificarPassword(ingresada: string, esperada: string, secreto: string) {
  if (esperada.length < 16) throw new Error('ADMIN_PASSWORD debe tener al menos 16 caracteres.');
  const clave = await claveHmac(secreto);
  const firma = await crypto.subtle.sign('HMAC', clave, new TextEncoder().encode(esperada));
  return crypto.subtle.verify('HMAC', clave, firma, new TextEncoder().encode(ingresada));
}
