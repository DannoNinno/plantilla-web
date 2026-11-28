export function esTrampa(datos: unknown): boolean {
  return (
    typeof datos === 'object' &&
    datos !== null &&
    'sitioWeb' in datos &&
    typeof datos.sitioWeb === 'string' &&
    datos.sitioWeb.trim().length > 0
  );
}

export async function hashIp(ip: string, sal: string): Promise<string> {
  if (sal.length < 32) throw new Error('IP_SALT debe tener al menos 32 caracteres.');
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(`${sal}:${ip}`));
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, '0')).join('');
}
