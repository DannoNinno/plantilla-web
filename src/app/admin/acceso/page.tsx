import {clasesBoton} from '@/infrastructure/componentes/Boton/estilos';

export default async function AccesoPage({
  searchParams,
}: {
  searchParams: Promise<{error?: string}>;
}) {
  const {error} = await searchParams;
  return (
    <section className="mx-auto max-w-md space-y-6">
      <h1 className="text-3xl font-bold">Acceso a solicitudes</h1>
      {error && (
        <p role="alert">
          {error === 'limite'
            ? 'Demasiados intentos. Espera diez minutos.'
            : 'La contraseña no es correcta.'}
        </p>
      )}
      <form action="/api/admin/acceso/" method="post" className="space-y-5">
        <label className="block">
          Contraseña
          <input
            type="password"
            name="password"
            required
            maxLength={256}
            autoComplete="current-password"
            className="mt-2 w-full rounded-xl border border-brand-ink/20 px-4 py-3"
          />
        </label>
        <button className={clasesBoton('coral')}>Entrar</button>
      </form>
    </section>
  );
}
