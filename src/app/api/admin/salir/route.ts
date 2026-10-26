import {NextResponse, type NextRequest} from 'next/server';
import {NOMBRE_COOKIE} from '@/modules/formularios/admin/sesion';
import {exigirAdminApi} from '@/modules/formularios/admin/proteccion';
import {ErrorPeticion, validarOrigen} from '@/modules/formularios/http';

export async function POST(request: NextRequest) {
  try {
    validarOrigen(request);
    await exigirAdminApi(request);
    const respuesta = NextResponse.redirect(new URL('/admin/acceso/', request.url), 303);
    respuesta.cookies.set(NOMBRE_COOKIE, '', {
      httpOnly: true,
      sameSite: 'strict',
      path: '/',
      maxAge: 0,
    });
    return respuesta;
  } catch (error) {
    if (error instanceof ErrorPeticion)
      return new NextResponse(error.message, {status: error.estado});
    console.error('Error al cerrar sesión.', error);
    return new NextResponse('No se pudo cerrar sesión.', {status: 503});
  }
}
