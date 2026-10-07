import type {Metadata} from 'next';
import {
  ArrowDown,
  ArrowUpRight,
  Boxes,
  Braces,
  Database,
  GraduationCap,
  Languages,
  Layers3,
  Mail,
  PanelsTopLeft,
  Sparkles,
} from 'lucide-react';
import {perfil, type Capacidad} from '@/configuracion/perfil';
import Contacto from '@/components/Portal/Contacto';

export const metadata: Metadata = {
  title: 'Perfil y portafolio',
  description: `${perfil.nombre}, ${perfil.cargo}. Arquitectura, integraciones y desarrollo de soluciones mantenibles. Conoce mis capacidades, experiencia y proyectos.`,
};

const iconos: Record<Capacidad['id'], typeof Layers3> = {
  arquitectura: Layers3,
  backend: Braces,
  frontend: PanelsTopLeft,
  datos: Database,
  infraestructura: Boxes,
  herramientas: Sparkles,
};

export default function PerfilPage() {
  return (
    <div className="perfil-portafolio">
      <section className="perfil-hero bg-brand-ink text-white" aria-labelledby="perfil-titulo">
        <div className="mx-auto grid max-w-6xl gap-12 px-6 py-16 sm:py-20 lg:grid-cols-[1.35fr_1fr] lg:items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-sky">
              Portafolio / Daniel Salamanca
            </p>
            <p className="mt-8 flex items-center gap-2 text-sm text-white/75">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-coral" aria-hidden="true" />
              {perfil.cargo}
            </p>
            <h1
              id="perfil-titulo"
              className="mt-3 text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl"
            >
              Daniel Salamanca <span className="block text-brand-sky">Jorquera.</span>
            </h1>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-white/80 sm:text-lg">
              {perfil.presentacion}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#capacidades" className="boton bg-brand-sky text-brand-ink">
                Explorar capacidades <ArrowDown size={18} aria-hidden="true" />
              </a>
              <a
                href="#contacto"
                className="boton border border-white/25 text-white hover:bg-white/10"
              >
                Hablemos <ArrowUpRight size={18} aria-hidden="true" />
              </a>
            </div>
          </div>
          <aside
            aria-labelledby="ficha-titulo"
            className="overflow-hidden rounded-2xl border border-white/15 bg-white/5"
          >
            <div className="flex items-center justify-between border-b border-white/15 px-6 py-4">
              <h2
                id="ficha-titulo"
                className="text-xs font-semibold uppercase tracking-[0.16em] text-white/80"
              >
                Ficha profesional
              </h2>
              <span className="font-mono text-xs text-brand-sky" aria-hidden="true">
                DS / 01
              </span>
            </div>
            <div className="p-6 sm:p-8">
              <div className="flex items-center gap-4">
                <span
                  className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl border border-brand-sky/30 bg-brand-sky/10 font-mono text-2xl text-brand-sky"
                  aria-hidden="true"
                >
                  DS
                </span>
                <div>
                  <p className="text-lg font-semibold">{perfil.cargo}</p>
                  <p className="mt-1 text-sm text-white/65">{perfil.especialidad}</p>
                </div>
              </div>
              <dl className="mt-7 space-y-4 text-sm">
                <div className="grid grid-cols-[6rem_1fr] gap-3 border-b border-white/10 pb-4">
                  <dt className="text-white/60">Especialidad</dt>
                  <dd>{perfil.especialidad}</dd>
                </div>
                <div className="grid grid-cols-[6rem_1fr] gap-3 border-b border-white/10 pb-4">
                  <dt className="text-white/60">Formación</dt>
                  <dd>Analista Programador</dd>
                </div>
                <div className="grid grid-cols-[6rem_1fr] gap-3">
                  <dt className="text-white/60">Idioma</dt>
                  <dd>Inglés avanzado</dd>
                </div>
              </dl>
              <p className="mt-7 border-l-2 border-brand-coral pl-4 text-sm leading-relaxed text-white/80">
                {perfil.principio}
              </p>
            </div>
          </aside>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-6 py-14 sm:py-20">
        <section id="capacidades" aria-labelledby="capacidades-titulo" className="scroll-mt-28">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="etiqueta">01 / Capacidades</p>
              <h2 id="capacidades-titulo" className="mt-3 text-3xl font-bold sm:text-4xl">
                Mi inventario técnico.
              </h2>
            </div>
            <span className="rounded-full border border-brand-ink/15 px-4 py-2 font-mono text-xs text-brand-ink/70">
              {String(perfil.capacidades.length).padStart(2, '0')} áreas de trabajo
            </span>
          </div>
          <p
            id="capacidades-nota"
            className="mt-4 max-w-2xl text-sm leading-relaxed text-brand-ink/70"
          >
            Tecnologías, conocimientos y experiencia, organizados por área de trabajo.
          </p>
          <div className="mt-8 overflow-hidden rounded-2xl border border-brand-ink/15 bg-white">
            <table
              className="perfil-stats w-full text-left text-sm"
              aria-describedby="capacidades-nota"
            >
              <caption className="sr-only">
                Tabla de capacidades, tecnologías y contexto profesional de {perfil.nombre}
              </caption>
              <thead className="bg-brand-ink text-white/80">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-4 text-xs font-semibold uppercase tracking-wider"
                  >
                    Capacidad
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-4 text-xs font-semibold uppercase tracking-wider"
                  >
                    Tecnologías / Recursos
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-4 text-xs font-semibold uppercase tracking-wider"
                  >
                    Contexto profesional
                  </th>
                </tr>
              </thead>
              <tbody>
                {perfil.capacidades.map((capacidad, index) => {
                  const Icono = iconos[capacidad.id];
                  return (
                    <tr
                      key={capacidad.id}
                      className="border-t border-brand-ink/10 transition-colors hover:bg-brand-sky/5"
                    >
                      <th scope="row" className="px-6 py-6 align-top font-normal">
                        <div className="flex items-start gap-3">
                          <span className="rounded-lg bg-brand-sky/10 p-2.5 text-brand-sky-text">
                            <Icono size={20} strokeWidth={1.5} aria-hidden="true" />
                          </span>
                          <div>
                            <span
                              className="font-mono text-xs text-brand-ink/60"
                              aria-hidden="true"
                            >
                              STAT / {String(index + 1).padStart(2, '0')}
                            </span>
                            <p className="mt-1 font-semibold text-brand-ink">{capacidad.nombre}</p>
                            <p className="mt-1 text-xs leading-relaxed text-brand-ink/65">
                              {capacidad.enfoque}
                            </p>
                          </div>
                        </div>
                      </th>
                      <td className="px-6 py-6 align-top">
                        <span
                          className="mb-3 block text-xs font-semibold uppercase tracking-wider text-brand-ink/60 md:hidden"
                          aria-hidden="true"
                        >
                          Tecnologías / Recursos
                        </span>
                        <ul className="flex flex-wrap gap-2">
                          {capacidad.tecnologias.map((tecnologia) => (
                            <li
                              key={tecnologia}
                              className="rounded-md border border-brand-ink/10 bg-brand-light px-2.5 py-1.5 text-xs text-brand-ink"
                            >
                              {tecnologia}
                            </li>
                          ))}
                        </ul>
                      </td>
                      <td className="px-6 py-6 align-top leading-relaxed text-brand-ink/75">
                        <span
                          className="mb-2 block text-xs font-semibold uppercase tracking-wider text-brand-ink/60 md:hidden"
                          aria-hidden="true"
                        >
                          Contexto profesional
                        </span>
                        {capacidad.contexto}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="mt-6 rounded-xl border-l-2 border-brand-coral bg-white px-6 py-5">
            <h3 className="text-sm font-semibold">Cómo trabajo</h3>
            <ul className="mt-3 flex flex-wrap gap-x-6 gap-y-3 text-sm text-brand-ink/75">
              {perfil.competencias.map((competencia) => (
                <li key={competencia} className="flex items-center gap-2">
                  <span
                    className="h-1 w-1 shrink-0 rounded-full bg-brand-coral"
                    aria-hidden="true"
                  />
                  {competencia}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section aria-labelledby="experiencia-titulo" className="mt-20">
          <p className="etiqueta">02 / Trayectoria</p>
          <h2 id="experiencia-titulo" className="mt-3 text-3xl font-bold sm:text-4xl">
            Experiencia en terreno.
          </h2>
          <ol className="mt-8 space-y-5">
            {perfil.experiencia.map((experiencia) => (
              <li key={experiencia.empresa} className="tarjeta grid gap-6 lg:grid-cols-[15rem_1fr]">
                <div>
                  <p className="font-mono text-xs text-brand-ink/65">{experiencia.periodo}</p>
                  <h3 className="mt-3 text-xl font-bold">{experiencia.empresa}</h3>
                  <p className="mt-2 text-sm text-brand-sky-text">{experiencia.cargo}</p>
                  {experiencia.actual && (
                    <span className="mt-4 inline-flex rounded-full bg-brand-sky/10 px-3 py-1 text-xs font-semibold text-brand-sky-text">
                      Rol actual
                    </span>
                  )}
                </div>
                <div className="lg:border-l lg:border-brand-ink/10 lg:pl-8">
                  <p className="text-sm leading-relaxed text-brand-ink/80">
                    {experiencia.descripcion}
                  </p>
                  <ul className="mt-4 space-y-3">
                    {experiencia.aportes.map((aporte) => (
                      <li
                        key={aporte}
                        className="flex gap-3 text-sm leading-relaxed text-brand-ink/75"
                      >
                        <span
                          className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-coral"
                          aria-hidden="true"
                        />
                        {aporte}
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section aria-labelledby="proyectos-titulo" className="mt-20">
          <p className="etiqueta">03 / Casos destacados</p>
          <h2 id="proyectos-titulo" className="mt-3 text-3xl font-bold sm:text-4xl">
            Del desafío a la solución.
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-brand-ink/70">
            Una selección de trabajo descrito en mi currículum. Estos casos no cuentan con una demo
            pública enlazada.
          </p>
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {perfil.proyectos.map((proyecto, index) => (
              <article
                key={proyecto.id}
                className="tarjeta flex flex-col border-t-4 border-t-brand-sky even:border-t-brand-coral"
              >
                <p className="font-mono text-xs text-brand-ink/65">
                  CASO / {String(index + 1).padStart(2, '0')}
                </p>
                <h3 className="mt-4 text-2xl font-bold">{proyecto.nombre}</h3>
                <p className="mt-2 text-sm text-brand-ink/65">{proyecto.contexto}</p>
                <dl className="mt-6 space-y-5 text-sm">
                  {[
                    {titulo: 'El desafío', detalle: proyecto.problema},
                    {titulo: 'Mi aporte', detalle: proyecto.solucion},
                    {titulo: 'El resultado', detalle: proyecto.resultado},
                  ].map((item) => (
                    <div key={item.titulo}>
                      <dt className="font-semibold">{item.titulo}</dt>
                      <dd className="mt-2 leading-relaxed text-brand-ink/75">{item.detalle}</dd>
                    </div>
                  ))}
                </dl>
                <ul className="mt-6 flex flex-wrap gap-2 border-t border-brand-ink/10 pt-5">
                  {proyecto.tecnologias.map((tecnologia) => (
                    <li key={tecnologia} className="rounded-md bg-brand-light px-3 py-1.5 text-xs">
                      {tecnologia}
                    </li>
                  ))}
                </ul>
                {proyecto.enlace && (
                  <a
                    href={proyecto.enlace}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="boton mt-5 border border-brand-ink/20"
                  >
                    Ver proyecto <ArrowUpRight size={18} aria-hidden="true" />
                  </a>
                )}
              </article>
            ))}
          </div>
        </section>

        <section aria-labelledby="formacion-titulo" className="mt-20">
          <p className="etiqueta">04 / Formación e idiomas</p>
          <h2 id="formacion-titulo" className="mt-3 text-3xl font-bold sm:text-4xl">
            Aprendizaje como base.
          </h2>
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            <article className="tarjeta">
              <GraduationCap
                size={28}
                strokeWidth={1.5}
                className="text-brand-sky-text"
                aria-hidden="true"
              />
              <h3 className="mt-4 text-xl font-bold">{perfil.formacion.titulo}</h3>
              <p className="mt-2 text-sm text-brand-ink/75">{perfil.formacion.institucion}</p>
              <p className="mt-4 font-mono text-xs text-brand-ink/65">{perfil.formacion.periodo}</p>
            </article>
            {perfil.idiomas.map((idioma) => (
              <article key={idioma.nombre} className="tarjeta">
                <Languages
                  size={28}
                  strokeWidth={1.5}
                  className="text-brand-sky-text"
                  aria-hidden="true"
                />
                <h3 className="mt-4 text-xl font-bold">
                  {idioma.nombre} · {idioma.nivel}
                </h3>
                <p className="mt-2 text-sm text-brand-ink/75">{idioma.certificacion}</p>
              </article>
            ))}
          </div>
        </section>

        <section
          id="contacto"
          aria-labelledby="contacto-titulo"
          className="mt-20 scroll-mt-28 border-t border-brand-ink/15 pt-12"
        >
          <p className="etiqueta">05 / Contacto</p>
          <h2 id="contacto-titulo" className="mt-3 text-3xl font-bold sm:text-4xl">
            Conversemos sobre tu próximo desafío.
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-brand-ink/75">
            ¿Un proyecto, una integración o una oportunidad profesional? Escríbeme directamente o
            deja tu mensaje aquí.
          </p>
          <a
            href={`mailto:${perfil.correo}`}
            className="mt-6 inline-flex max-w-full items-start gap-3 text-sm font-semibold text-brand-sky-text underline-offset-4 hover:underline"
          >
            <Mail size={20} className="shrink-0" aria-hidden="true" />
            <span className="break-all">{perfil.correo}</span>
          </a>
          <Contacto mensajeEtiqueta="Cuéntame sobre tu proyecto u oportunidad" />
        </section>
      </div>
    </div>
  );
}
