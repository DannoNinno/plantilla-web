export const NOMBRE_COOKIE = 'sesion_admin';

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

export async function crearSesion(secreto: string, id = crypto.randomUUID()): Promise<string> {
  const firma = await crypto.subtle.sign(
    'HMAC',
    await claveHmac(secreto),
    new TextEncoder().encode(id),
  );
  return `${id}.${codificar(new Uint8Array(firma))}`;
}

export async function verificarSesion(
  token: string | undefined,
  secreto: string,
): Promise<string | undefined> {
  const clave = await claveHmac(secreto);
  if (!token || token.length > 100) return undefined;
  const partes = token.split('.');
  if (partes.length !== 2) return undefined;
  const [id, firma] = partes;
  if (!/^[a-f0-9-]{36}$/u.test(id) || !/^[\w-]{43}$/u.test(firma)) return undefined;
  const bytes = Uint8Array.from(atob(firma.replace(/-/gu, '+').replace(/_/gu, '/') + '='), (c) =>
    c.charCodeAt(0),
  );
  const valida = await crypto.subtle.verify('HMAC', clave, bytes, new TextEncoder().encode(id));
  return valida ? id : undefined;
}

export async function verificarPassword(ingresada: string, esperada: string, secreto: string) {
  if (esperada.length < 16) throw new Error('ADMIN_PASSWORD debe tener al menos 16 caracteres.');
  const clave = await claveHmac(secreto);
  const firma = await crypto.subtle.sign('HMAC', clave, new TextEncoder().encode(esperada));
  return crypto.subtle.verify('HMAC', clave, firma, new TextEncoder().encode(ingresada));
}
