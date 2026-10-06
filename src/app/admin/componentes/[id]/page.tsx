import {notFound} from 'next/navigation';
import Link from 'next/link';
import {exigirSesion} from '@/plataforma/auth/sesion';
import {getComponentesActivos} from '@/plataforma/componentes/servidor';

export const metadata = {title: 'Componente', robots: {index: false, follow: false}};
export const dynamic = 'force-dynamic';

export default async function ComponenteAdmin({params}: {params: Promise<{id: string}>}) {
  await exigirSesion();
  const id = (await params).id;
  const componente = getComponentesActivos().componentes.find((item) => item.definicion.id === id);
  if (!componente?.Admin) notFound();
  const Admin = componente.Admin;
  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <Link href="/admin" className="text-brand-sky-text">
        Volver al panel
      </Link>
      <h1 className="my-6 text-3xl font-bold">{componente.definicion.nombre}</h1>
      <Admin />
    </div>
  );
}
