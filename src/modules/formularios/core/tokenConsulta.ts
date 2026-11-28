async function clave(secreto: string) {
  if (secreto.length < 32) throw new Error('Configura IP_SALT con al menos 32 caracteres.');
  return crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secreto),
    {name: 'HMAC', hash: 'SHA-256'},
    false,
    ['sign', 'verify'],
  );
}

export async function crearToken(secreto: string, ahora = Date.now()) {
  const contenido = `${ahora}.${crypto.randomUUID()}`;
  const firma = await crypto.subtle.sign(
    'HMAC',
    await clave(secreto),
    new TextEncoder().encode(contenido),
  );
  return `${contenido}.${Array.from(new Uint8Array(firma), (valor) => valor.toString(16).padStart(2, '0')).join('')}`;
}

export async function verificarToken(
  token: unknown,
  secreto: string,
  limites: {minimoSegundos: number; maximoSegundos: number},
  ahora = Date.now(),
) {
  if (typeof token !== 'string' || !/^\d{13}\.[a-f0-9-]{36}\.[a-f0-9]{64}$/u.test(token))
    return false;
  const [fecha, nonce, firma] = token.split('.');
  const transcurrido = ahora - Number(fecha);
  if (transcurrido < limites.minimoSegundos * 1000 || transcurrido > limites.maximoSegundos * 1000)
    return false;
  const bytes = Uint8Array.from(firma.match(/.{2}/gu) ?? [], (valor) => parseInt(valor, 16));
  return crypto.subtle.verify(
    'HMAC',
    await clave(secreto),
    bytes,
    new TextEncoder().encode(`${fecha}.${nonce}`),
  );
}
