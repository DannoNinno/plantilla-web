import handler from './.open-next/worker.js';
import {redirigirHTTPS, esLocal} from './src/infrastructure/seguridad/https';

export * from './.open-next/worker.js';

export default {
  async fetch(request, env, ctx) {
    const redireccion = redirigirHTTPS(request);
    if (redireccion) return redireccion;
    const respuesta = await handler.fetch(request, env, ctx);
    if (esLocal(new URL(request.url))) return respuesta;
    const protegida = new Response(respuesta.body, respuesta);
    protegida.headers.set('Strict-Transport-Security', 'max-age=31536000');
    return protegida;
  },
} satisfies ExportedHandler<CloudflareEnv>;
