import {perfil} from '@/configuracion/perfil';
import {sitio} from '@/configuracion/sitio';
import Contacto from '@/components/Portal/Contacto';
import {enlaceWhatsapp} from '@/plataforma/contacto/mensaje';

export const metadata = {title: 'Perfil'};

export default function PerfilPage() {
  const whatsapp = enlaceWhatsapp(
    sitio.contacto.whatsapp,
    'Hola, me gustaría conversar sobre un sitio para mi negocio.',
  );
  return (
    <div className="mx-auto max-w-6xl px-6 py-12 sm:py-20">
      <p className="etiqueta">Detrás de {sitio.nombre}</p>
      <h1 className="mt-4 text-4xl font-bold sm:text-5xl">{sitio.persona}</h1>
      <p className="mt-6 max-w-2xl text-lg leading-relaxed text-brand-ink/70">
        {perfil.presentacion ||
          'Construyo sitios web empaquetados para pymes chilenas. Los entrego funcionando para que cada negocio pueda administrarlos por su cuenta.'}
      </p>
      <div className="mt-12 grid gap-6 md:grid-cols-2">
        <section className="tarjeta">
          <h2 className="text-2xl font-bold">Experiencia</h2>
          {perfil.experiencia.length ? (
            <ul className="mt-5 space-y-3">
              {perfil.experiencia.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          ) : (
            <p className="mt-4 text-sm text-brand-ink/65">
              Mi experiencia estará disponible pronto.
            </p>
          )}
        </section>
        <section className="tarjeta">
          <h2 className="text-2xl font-bold">Competencias</h2>
          {perfil.competencias.length ? (
            <ul className="mt-5 flex flex-wrap gap-2">
              {perfil.competencias.map((item) => (
                <li key={item} className="rounded-full bg-brand-light px-4 py-2 text-sm">
                  {item}
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-4 text-sm text-brand-ink/65">
              Esta sección se completará con mis competencias.
            </p>
          )}
        </section>
      </div>
      <section className="mt-14">
        <h2 className="text-3xl font-bold">Proyectos</h2>
        {perfil.proyectos.length ? (
          <div className="mt-6 grid gap-6 md:grid-cols-2">
            {perfil.proyectos.map((proyecto) => (
              <article key={proyecto.id} className="tarjeta">
                <h3 className="text-xl font-bold">{proyecto.nombre}</h3>
                <dl className="mt-5 space-y-4">
                  <div>
                    <dt className="font-semibold">El problema</dt>
                    <dd className="mt-1 text-brand-ink/70">{proyecto.problema}</dd>
                  </div>
                  <div>
                    <dt className="font-semibold">La solución</dt>
                    <dd className="mt-1 text-brand-ink/70">{proyecto.solucion}</dd>
                  </div>
                  <div>
                    <dt className="font-semibold">El resultado</dt>
                    <dd className="mt-1 text-brand-ink/70">{proyecto.resultado}</dd>
                  </div>
                </dl>
                {proyecto.enlace && (
                  <a
                    href={proyecto.enlace}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="boton mt-5 border border-brand-ink/20"
                  >
                    Ver proyecto
                  </a>
                )}
              </article>
            ))}
          </div>
        ) : (
          <p className="mt-4 text-brand-ink/65">
            Pronto compartiré proyectos con su problema, solución y resultado.
          </p>
        )}
      </section>
      <section id="contacto" className="mt-16 scroll-mt-28 border-t border-brand-ink/10 pt-10">
        <p className="etiqueta">Hablemos</p>
        <h2 className="mt-3 text-3xl font-bold">¿Qué necesita tu negocio?</h2>
        <p className="mt-4 text-brand-ink/70">
          Cuéntame tu idea. Podemos encontrar un buen punto de partida.
        </p>
        {whatsapp && (
          <a
            href={whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="boton mt-5 border border-brand-ink/20"
          >
            Conversar por WhatsApp
          </a>
        )}
        {sitio.contacto.correo && (
          <p className="mt-4">
            <a className="text-brand-sky-text" href={`mailto:${sitio.contacto.correo}`}>
              {sitio.contacto.correo}
            </a>
          </p>
        )}
        {!whatsapp && (
          <p className="mt-4 text-sm text-brand-ink/60">
            WhatsApp estará disponible cuando se configure el número de contacto.
          </p>
        )}
        <Contacto />
      </section>
    </div>
  );
}
