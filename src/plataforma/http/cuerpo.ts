export class CuerpoDemasiadoGrande extends Error {}

export async function leerCuerpo(request: Request, limite: number) {
  const reader = request.body?.getReader();
  if (!reader) return new Uint8Array();
  const bloques: Uint8Array[] = [];
  let total = 0;
  try {
    while (true) {
      const {value, done} = await reader.read();
      if (done) break;
      total += value.byteLength;
      if (total > limite) {
        await reader.cancel();
        throw new CuerpoDemasiadoGrande('El envío supera el tamaño permitido.');
      }
      bloques.push(value);
    }
  } finally {
    reader.releaseLock();
  }
  const cuerpo = new Uint8Array(total);
  let posicion = 0;
  for (const bloque of bloques) {
    cuerpo.set(bloque, posicion);
    posicion += bloque.byteLength;
  }
  return cuerpo;
}

export function origenPermitido(request: Request) {
  const origen = request.headers.get('origin');
  const esperado = process.env.SITE_URL
    ? new URL(process.env.SITE_URL).origin
    : new URL(request.url).origin;
  return origen === esperado;
}
