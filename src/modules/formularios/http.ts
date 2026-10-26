import 'server-only';

export class ErrorPeticion extends Error {
  constructor(
    message: string,
    readonly estado: number,
  ) {
    super(message);
  }
}

export function validarOrigen(request: Request) {
  if (request.headers.get('origin') !== new URL(request.url).origin) {
    throw new ErrorPeticion('Origen de solicitud no permitido.', 403);
  }
}

export function obtenerIp(request: Request): string {
  const ip = request.headers.get('cf-connecting-ip');
  if (ip) return ip;
  if (process.env.NODE_ENV === 'development') return '127.0.0.1';
  throw new Error('No se recibió la IP de Cloudflare.');
}

export async function leerCuerpo(request: Request, maximo = 16384): Promise<string> {
  if (!request.body) throw new ErrorPeticion('Faltan los datos de la solicitud.', 400);
  const lector = request.body.getReader();
  const partes: Uint8Array[] = [];
  let largo = 0;
  try {
    while (true) {
      const {done, value} = await lector.read();
      if (done) break;
      largo += value.byteLength;
      if (largo > maximo) {
        await lector.cancel();
        throw new ErrorPeticion('La solicitud es demasiado larga.', 413);
      }
      partes.push(value);
    }
  } finally {
    lector.releaseLock();
  }
  const bytes = new Uint8Array(largo);
  let posicion = 0;
  for (const parte of partes) {
    bytes.set(parte, posicion);
    posicion += parte.byteLength;
  }
  return new TextDecoder().decode(bytes);
}
