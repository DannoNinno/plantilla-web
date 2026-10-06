import Link from 'next/link';
import {exigirSesion} from '@/plataforma/auth/sesion';
import {getConsultas} from '@/plataforma/datos/consultas';
import {getComponentesActivos, getRegistro} from '@/plataforma/componentes/servidor';
import {getPaquete} from '@/plataforma/datos/paquetes';
import {logout} from './acciones';

export const metadata = {title: 'Panel', robots: {index: false, follow: false}};
export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  const sesion = await exigirSesion();
  const {componentes, errores} = getComponentesActivos();
  const consultas = getConsultas();
  const disponibles = getRegistro();
  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Administración</h1>
          <p className="mt-2 text-sm text-brand-ink/65">{sesion.correo}</p>
        </div>
        <form action={logout}>
          <button className="boton border border-brand-ink/20">Cerrar sesión</button>
        </form>
      </div>
      {errores.length > 0 && (
        <div role="alert" className="mt-6 text-brand-coral-dark">
          {errores.map((error) => (
            <p key={error}>{error}</p>
          ))}
        </div>
      )}
      <section className="tarjeta mt-8">
        <h2 className="text-xl font-bold">Componentes del sitio</h2>
        {componentes.filter((item) => item.Admin).length > 0 ? (
          <nav className="mt-4 flex flex-wrap gap-3">
            {componentes
              .filter((item) => item.Admin)
              .map((item) => (
                <Link
                  key={item.definicion.id}
                  className="boton bg-brand-ink text-white"
                  href={`/admin/componentes/${item.definicion.id}`}
                >
                  {item.definicion.nombre}
                </Link>
              ))}
          </nav>
        ) : (
          <p className="mt-4 text-sm text-brand-ink/65">
            No hay componentes activos con pantalla de administración. El registro está preparado
            para tus definiciones.
          </p>
        )}
      </section>
      <section className="mt-10">
        <h2 className="text-2xl font-bold">Consultas recibidas</h2>
        <p className="mt-2 text-sm text-brand-ink/65">
          Últimas 100 consultas. Se guardan localmente; no se envía correo automático.
        </p>
        {consultas.length === 0 ? (
          <p className="tarjeta mt-5">Todavía no hay consultas.</p>
        ) : (
          <div className="mt-5 space-y-4">
            {consultas.map((consulta) => (
              <article key={consulta.id} className="tarjeta">
                <div className="flex flex-wrap justify-between gap-3">
                  <h3 className="font-bold">{consulta.nombre}</h3>
                  <time dateTime={consulta.fecha} className="text-xs text-brand-ink/60">
                    {new Date(consulta.fecha).toLocaleString('es-CL', {
                      timeZone: 'America/Santiago',
                    })}
                  </time>
                </div>
                <a
                  href={`mailto:${consulta.correo}`}
                  className="mt-2 inline-block text-sm text-brand-sky-text"
                >
                  {consulta.correo}
                </a>
                <p className="mt-4 whitespace-pre-wrap text-sm">{consulta.mensaje}</p>
                {consulta.seleccion && (
                  <p className="mt-4 break-words rounded-xl bg-brand-light p-3 text-xs">
                    Paquete:{' '}
                    {getPaquete(consulta.seleccion.paquete)?.nombre ??
                      `Paquete retirado (${consulta.seleccion.paquete})`}
                    . Componentes:{' '}
                    {consulta.seleccion.componentes.length
                      ? consulta.seleccion.componentes
                          .map(
                            (id) =>
                              disponibles.find((item) => item.definicion.id === id)?.definicion
                                .nombre ?? `Componente retirado (${id})`,
                          )
                          .join(', ')
                      : 'Sin componentes adicionales'}
                    .
                  </p>
                )}
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
