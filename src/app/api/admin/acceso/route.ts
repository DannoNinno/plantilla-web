import {NextResponse} from 'next/server';
import {obtenerEntorno} from '@/modules/entornoCloudflare';
import {AlmacenAdmin} from '@/modules/administracion/AlmacenAdmin';
import {hashIp} from '@/modules/formularios/core/antiSpam';
import {crearSesion, verificarPassword} from '@/modules/administracion/sesion';
import {ErrorPeticion, leerCuerpo, obtenerIp, validarOrigen} from '@/modules/formularios/http';
import {rutasAdmin} from '@/domain/configuracion/administracion';
import {cookieAdmin, errorAdmin} from '@/modules/administracion/respuestas';

export async function POST(request: Request) {
  try {
    validarOrigen(request);
    if (!request.headers.get('content-type')?.startsWith('application/x-www-form-urlencoded')) {
      throw new ErrorPeticion('Formato de acceso inválido.', 415);
    }
    const datos = new URLSearchParams(await leerCuerpo(request, 2048));
    const env = await obtenerEntorno();
    if (!env.ADMIN_SECRET || !env.ADMIN_PASSWORD || !env.IP_SALT) {
      throw new Error('Faltan secretos de autenticación.');
    }
    const almacen = new AlmacenAdmin(env.DB);
    const ipHash = await hashIp(obtenerIp(request), env.IP_SALT);
    const rechazar = (error: string) =>
      NextResponse.redirect(new URL(`${rutasAdmin.acceso}?error=${error}`, request.url), 303);
    if (await almacen.estaBloqueado(ipHash)) return rechazar('limite');
    if (
      !(await verificarPassword(datos.get('password') ?? '', env.ADMIN_PASSWORD, env.ADMIN_SECRET))
    ) {
      return rechazar((await almacen.registrarFallo(ipHash)) ? 'limite' : 'credenciales');
    }
    if (!(await almacen.registrarExito(ipHash))) return rechazar('limite');
    const id = crypto.randomUUID();
    const token = await crearSesion(env.ADMIN_SECRET, id);
    await almacen.iniciarSesion(id);
    return cookieAdmin(NextResponse.redirect(new URL(rutasAdmin.inicio, request.url), 303), token);
  } catch (error) {
    return errorAdmin(error, request);
  }
}
