import {NextResponse} from 'next/server';
import {obtenerEntorno} from '@/modules/formularios/crearFormularios';
import {D1Almacen} from '@/modules/formularios/adaptadores/D1Almacen';
import {hashIp} from '@/modules/formularios/core/antiSpam';
import {
  crearSesion,
  DURACION_SESION,
  NOMBRE_COOKIE,
  verificarPassword,
} from '@/modules/formularios/admin/sesion';
import {ErrorPeticion, leerCuerpo, obtenerIp, validarOrigen} from '@/modules/formularios/http';

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
    const almacen = new D1Almacen(env.DB);
    if (!(await almacen.permitirAcceso(await hashIp(obtenerIp(request), env.IP_SALT)))) {
      return NextResponse.redirect(new URL('/admin/acceso/?error=limite', request.url), 303);
    }
    if (
      !(await verificarPassword(datos.get('password') ?? '', env.ADMIN_PASSWORD, env.ADMIN_SECRET))
    ) {
      return NextResponse.redirect(new URL('/admin/acceso/?error=credenciales', request.url), 303);
    }
    const respuesta = NextResponse.redirect(new URL('/admin/solicitudes/', request.url), 303);
    respuesta.headers.set('Cache-Control', 'no-store');
    respuesta.cookies.set(NOMBRE_COOKIE, await crearSesion(env.ADMIN_SECRET), {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development' || new URL(request.url).protocol === 'https:',
      sameSite: 'strict',
      path: '/',
      maxAge: DURACION_SESION,
    });
    return respuesta;
  } catch (error) {
    if (error instanceof ErrorPeticion)
      return new NextResponse(error.message, {status: error.estado});
    console.error('Error de inicio de sesión.', error);
    return new NextResponse('No se pudo iniciar sesión. Revisa la configuración del servidor.', {
      status: 503,
    });
  }
}
