import {NextResponse, type NextRequest} from 'next/server';
import {exigirAdminApi} from '@/modules/administracion/proteccion';
import {validarOrigen} from '@/modules/formularios/http';
import {cookieAdmin, errorAdmin} from '@/modules/administracion/respuestas';
import {rutasAdmin} from '@/domain/configuracion/administracion';

export async function POST(request: NextRequest) {
  try {
    validarOrigen(request);
    const {almacen, id} = await exigirAdminApi(request);
    await almacen.cerrarSesion(id);
    return cookieAdmin(
      NextResponse.redirect(new URL(rutasAdmin.acceso, request.url), 303),
      '',
      true,
    );
  } catch (error) {
    return errorAdmin(error, request);
  }
}
