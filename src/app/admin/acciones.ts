'use server';

import {redirect} from 'next/navigation';
import {iniciarSesion, cerrarSesion, administradorConfigurado} from '@/plataforma/auth/sesion';
import {consumirLimite} from '@/plataforma/datos/sqlite';

export async function login(_estado: {error: string}, formulario: FormData) {
  const correo = formulario.get('correo');
  const password = formulario.get('password');
  if (
    typeof correo !== 'string' ||
    typeof password !== 'string' ||
    correo.length > 254 ||
    password.length > 256
  ) {
    return {error: 'Indica un correo y una clave válidos.'};
  }
  let correcto = false;
  try {
    if (!administradorConfigurado()) return {error: 'El administrador aún no está configurado.'};
    if (!consumirLimite('login', 10, 15 * 60 * 1000))
      return {error: 'Demasiados intentos. Espera 15 minutos.'};
    correcto = await iniciarSesion(correo.trim(), password);
  } catch (causa) {
    console.error('[admin] No fue posible iniciar sesión.', causa);
    return {error: 'No fue posible iniciar sesión. Revisa la configuración del servidor.'};
  }
  if (!correcto) return {error: 'Correo o clave incorrectos.'};
  redirect('/admin');
}

export async function logout() {
  await cerrarSesion();
  redirect('/admin/login');
}
