import 'server-only';
import {cookies} from 'next/headers';
import {redirect} from 'next/navigation';
import type {NextRequest} from 'next/server';
import {obtenerEntorno} from '../entornoCloudflare';
import {NOMBRE_COOKIE, verificarSesion} from './sesion';
import {ErrorPeticion} from '../formularios/http';
import {AlmacenAdmin} from './AlmacenAdmin';
import {rutasAdmin} from '../../domain/configuracion/administracion';

export async function exigirAdmin() {
  const cookie = (await cookies()).get(NOMBRE_COOKIE)?.value;
  if (!cookie) redirect(rutasAdmin.acceso);
  const env = await obtenerEntorno();
  if (!env.ADMIN_SECRET) throw new Error('Falta ADMIN_SECRET.');
  const id = await verificarSesion(cookie, env.ADMIN_SECRET);
  if (!id || !(await new AlmacenAdmin(env.DB).sesionVigente(id))) redirect(rutasAdmin.acceso);
}

export async function exigirAdminApi(request: NextRequest) {
  const token = request.cookies.get(NOMBRE_COOKIE)?.value;
  if (!token) throw new ErrorPeticion('Necesitas iniciar sesión.', 401);
  const env = await obtenerEntorno();
  if (!env.ADMIN_SECRET) throw new Error('Falta ADMIN_SECRET.');
  const id = await verificarSesion(token, env.ADMIN_SECRET);
  const almacen = new AlmacenAdmin(env.DB);
  if (!id || !(await almacen.sesionVigente(id))) {
    throw new ErrorPeticion('Necesitas iniciar sesión.', 401);
  }
  return {almacen, id, token};
}
