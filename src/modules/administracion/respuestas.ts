import {NextResponse} from 'next/server';
import {
  adminConfig,
  INACTIVIDAD_SEGUNDOS,
  rutasAdmin,
} from '../../domain/configuracion/administracion';
import {ErrorPeticion} from '../formularios/http';
import {NOMBRE_COOKIE} from './sesion';

export function cookieAdmin(respuesta: NextResponse, token: string, eliminar = false) {
  respuesta.headers.set('Cache-Control', 'private, no-store');
  respuesta.headers.set('X-Robots-Tag', 'noindex, nofollow');
  respuesta.cookies.set(NOMBRE_COOKIE, token, {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    path: adminConfig.rutaPanel,
    maxAge: eliminar ? 0 : INACTIVIDAD_SEGUNDOS,
  });
  return respuesta;
}

export function errorAdmin(error: unknown, request: Request) {
  if (error instanceof ErrorPeticion) {
    if (error.estado === 401)
      return cookieAdmin(
        NextResponse.redirect(new URL(rutasAdmin.acceso, request.url), 303),
        '',
        true,
      );
    return new NextResponse(error.message, {
      status: error.estado,
      headers: {'Cache-Control': 'private, no-store', 'X-Robots-Tag': 'noindex, nofollow'},
    });
  }
  console.error('administración fallida: configuración o infraestructura');
  return new NextResponse('No se pudo completar la operación. Inténtalo nuevamente.', {
    status: 503,
    headers: {'Cache-Control': 'private, no-store', 'X-Robots-Tag': 'noindex, nofollow'},
  });
}
