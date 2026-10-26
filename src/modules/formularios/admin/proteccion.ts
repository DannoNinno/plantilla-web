import 'server-only';
import {cookies} from 'next/headers';
import {redirect} from 'next/navigation';
import type {NextRequest} from 'next/server';
import {obtenerEntorno} from '../crearFormularios';
import {NOMBRE_COOKIE, verificarSesion} from './sesion';
import {ErrorPeticion} from '../http';

export async function exigirAdmin() {
  const env = await obtenerEntorno();
  if (!env.ADMIN_SECRET) throw new Error('Falta ADMIN_SECRET.');
  const cookie = (await cookies()).get(NOMBRE_COOKIE)?.value;
  if (!(await verificarSesion(cookie, env.ADMIN_SECRET))) redirect('/admin/acceso/');
}

export async function exigirAdminApi(request: NextRequest) {
  const env = await obtenerEntorno();
  if (!env.ADMIN_SECRET) throw new Error('Falta ADMIN_SECRET.');
  if (!(await verificarSesion(request.cookies.get(NOMBRE_COOKIE)?.value, env.ADMIN_SECRET))) {
    throw new ErrorPeticion('Necesitas iniciar sesión.', 401);
  }
  return env;
}
