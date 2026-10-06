import {redirect} from 'next/navigation';
import {administradorConfigurado, getSesion} from '@/plataforma/auth/sesion';
import Login from '@/components/Portal/Login';

export const metadata = {title: 'Administración', robots: {index: false, follow: false}};
export const dynamic = 'force-dynamic';

export default async function LoginPage() {
  if (await getSesion()) redirect('/admin');
  return (
    <div className="mx-auto max-w-lg px-6 py-14">
      <p className="etiqueta">Solo para el administrador</p>
      <h1 className="mt-3 text-3xl font-bold">Tu panel</h1>
      <Login configurado={administradorConfigurado()} />
    </div>
  );
}
