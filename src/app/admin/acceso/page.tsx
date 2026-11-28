import {clasesBoton} from '@/infrastructure/componentes/boveda/Base/Boton/estilos';
import {adminConfig, rutasAdmin} from '@/domain/configuracion/administracion';
import Link from 'next/link';
import Image from 'next/image';

export default async function AccesoPage({
  searchParams,
}: {
  searchParams: Promise<{error?: string}>;
}) {
  const {error} = await searchParams;
  return (
    <main
      id="contenido"
      className="grid min-h-dvh place-items-center bg-brand-ink bg-intro px-6 py-12 text-brand-light"
    >
      <section className="w-full max-w-md space-y-6 border border-brand-sky/40 border-t-4 border-t-brand-sky bg-brand-ink p-8 shadow-xl">
        <Image
          src="/dannotech-kit/svg/dannotech-isotipo-fondo-oscuro.svg"
          alt="DannoTech"
          width={102}
          height={88}
          className="h-auto w-16"
        />
        <p className="text-sm font-bold uppercase tracking-widest text-brand-sky">Área privada</p>
        <h1 className="text-3xl font-bold">Acceso a administración</h1>
        {error && (
          <p role="alert" className="text-brand-coral">
            {error === 'limite'
              ? `Demasiados intentos. Espera ${adminConfig.bloqueoMinutos} minutos.`
              : 'Usuario o contraseña incorrectos'}
          </p>
        )}
        <form action={rutasAdmin.entrar} method="post" className="space-y-5">
          <label className="block">
            Contraseña
            <input
              type="password"
              name="password"
              required
              maxLength={256}
              autoComplete="current-password"
              className="mt-2 w-full border border-brand-sky/60 bg-brand-ink px-4 py-3 text-brand-light focus-visible:outline-brand-sky"
            />
          </label>
          <button className={clasesBoton('coral', '!rounded-none')}>Entrar</button>
        </form>
        <Link href="/" className="inline-block text-sm underline">
          Volver al sitio
        </Link>
      </section>
    </main>
  );
}
