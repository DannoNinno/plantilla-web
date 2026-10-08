import type {Metadata} from 'next';
import Link from 'next/link';
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
import {getPerfil} from '@/infrastructure/handlers/datos';
import {CONTACT_EMAIL} from '@/domain/configuracion/contacto';
import {enlaceCorreo} from '@/domain/servicios/contacto';
import {clasesBoton} from '@/infrastructure/componentes/Boton/estilos';

const perfil = getPerfil();

export const metadata: Metadata = {
  title: 'Perfil y portafolio',
  description: `${perfil.nombre}, ${perfil.cargo}. Arquitectura, integraciones y desarrollo de soluciones mantenibles. Conoce mis capacidades, experiencia y proyectos.`,
};

const iconos: Partial<Record<string, typeof Layers3>> = {
  arquitectura: Layers3,
  backend: Braces,
  frontend: PanelsTopLeft,
  datos: Database,
  infraestructura: Boxes,
  herramientas: Sparkles,
};

export default function PerfilPage() {
  return (
    <div>
      <section className="bg-brand-ink bg-perfil-hero text-white" aria-labelledby="perfil-titulo">
        <div className="mx-auto grid max-w-6xl gap-12 px-6 py-16 sm:py-20 lg:grid-cols-[1.35fr_1fr] lg:items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-sky">
              Portafolio / {perfil.cabecera.nombre}
            </p>
            <p className="mt-8 flex items-center gap-2 text-sm text-white/75">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-coral" aria-hidden="true" />
              {perfil.cargo}
            </p>
            <h1
              id="perfil-titulo"
              className="group/titulo mt-3 text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl"
            >
              <span className="block motion-safe:fine-pointer:group-hover/titulo:animate-perfil-titulo">
                {perfil.cabecera.nombre}
              </span>
              <span className="block text-brand-sky motion-safe:fine-pointer:group-hover/titulo:animate-perfil-titulo">
                {perfil.cabecera.apellido}
              </span>
            </h1>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-white/80 sm:text-lg">
              {perfil.presentacion}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#capacidades" className={clasesBoton('sky')}>
                Explorar capacidades <ArrowDown size={18} aria-hidden="true" />
              </a>
              <a href="#contacto" className={clasesBoton('bordeOscuro')}>
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
                {perfil.cabecera.iniciales} / 01
              </span>
            </div>
            <div className="p-6 sm:p-8">
              <div className="flex items-center gap-4">
                <span
                  className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl border border-brand-sky/30 bg-brand-sky/10 font-mono text-2xl text-brand-sky"
                  aria-hidden="true"
                >
                  {perfil.cabecera.iniciales}
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
                  <dd>{perfil.cabecera.formacion}</dd>
                </div>
                <div className="grid grid-cols-[6rem_1fr] gap-3">
                  <dt className="text-white/60">Idioma</dt>
                  <dd>{perfil.cabecera.idioma}</dd>
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
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-sky-profile">
                01 / Capacidades
              </p>
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
              className="w-full table-fixed text-left text-sm"
              aria-describedby="capacidades-nota"
            >
              <caption className="sr-only">
                Tabla de capacidades, tecnologías y contexto profesional de {perfil.nombre}
              </caption>
              <thead className="sr-only bg-brand-ink text-white/80 md:not-sr-only">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-4 text-xs font-semibold uppercase tracking-wider md:w-[26%]"
                  >
                    Capacidad
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-4 text-xs font-semibold uppercase tracking-wider md:w-[34%]"
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
              <tbody className="block md:table-row-group">
                {perfil.capacidades.map((capacidad, index) => {
                  const Icono = iconos[capacidad.id];
                  if (!Icono)
                    throw new Error(`No se definió un icono para la capacidad ${capacidad.id}.`);
                  return (
                    <tr
                      key={capacidad.id}
                      className="group/capacidad block border-t border-brand-ink/10 transition-colors duration-300 fine-pointer:hover:bg-brand-sky/[0.12] md:table-row"
                    >
                      <th
                        scope="row"
                        className="block w-auto px-6 py-6 align-top font-normal transition-shadow duration-300 fine-pointer:group-hover/capacidad:shadow-capacidad-acento md:table-cell"
                      >
                        <div className="flex items-start gap-3">
                          <span className="relative shrink-0 overflow-hidden rounded-lg bg-brand-sky/10 p-2.5 text-brand-sky-profile ring-1 ring-transparent transition-[color,background-color,box-shadow,transform] duration-300 fine-pointer:group-hover/capacidad:bg-brand-sky-text fine-pointer:group-hover/capacidad:text-white fine-pointer:group-hover/capacidad:shadow-capacidad-icono fine-pointer:group-hover/capacidad:ring-brand-sky/30 motion-safe:fine-pointer:group-hover/capacidad:-translate-y-0.5">
                            <span
                              aria-hidden="true"
                              className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/2 bg-gradient-to-r from-transparent via-white/50 to-transparent opacity-0 motion-safe:fine-pointer:group-hover/capacidad:animate-capacidad-brillo"
                            />
                            <Icono
                              size={20}
                              strokeWidth={1.5}
                              aria-hidden="true"
                              className="relative motion-safe:fine-pointer:group-hover/capacidad:animate-perfil-icono motion-safe:fine-pointer:group-hover/capacidad:[&>*]:animate-capacidad-trazo motion-safe:fine-pointer:group-hover/capacidad:[&>*]:[stroke-dasharray:80]"
                            />
                          </span>
                          <div>
                            <span
                              className="font-mono text-xs text-brand-ink/60"
                              aria-hidden="true"
                            >
                              STAT / {String(index + 1).padStart(2, '0')}
                            </span>
                            <p className="mt-1 font-semibold text-brand-ink transition-colors duration-300 fine-pointer:group-hover/capacidad:text-brand-sky-profile">
                              {capacidad.nombre}
                            </p>
                            <p className="mt-1 text-xs leading-relaxed text-brand-ink/65">
                              {capacidad.enfoque}
                            </p>
                          </div>
                        </div>
                      </th>
                      <td className="block w-auto px-6 pb-6 pt-0 align-top md:table-cell md:pt-6">
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
                              className="rounded-md border border-brand-ink/10 bg-brand-light px-2.5 py-1.5 text-xs text-brand-ink transition-colors duration-300 fine-pointer:group-hover/capacidad:border-brand-sky/30 fine-pointer:group-hover/capacidad:bg-white"
                            >
                              {tecnologia}
                            </li>
                          ))}
                        </ul>
                      </td>
                      <td className="block w-auto px-6 pb-6 pt-0 align-top leading-relaxed text-brand-ink/75 md:table-cell md:pt-6">
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
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-sky-profile">
            02 / Trayectoria
          </p>
          <h2 id="experiencia-titulo" className="mt-3 text-3xl font-bold sm:text-4xl">
            Experiencia en terreno.
          </h2>
          <ol className="mt-8 space-y-5">
            {perfil.experiencia.map((experiencia) => (
              <li
                key={experiencia.empresa}
                className="grid gap-6 rounded-2xl border border-brand-ink/10 bg-white p-6 sm:p-8 lg:grid-cols-[15rem_1fr]"
              >
                <div>
                  <p className="font-mono text-xs text-brand-ink/65">{experiencia.periodo}</p>
                  <h3 className="mt-3 text-xl font-bold">{experiencia.empresa}</h3>
                  <p className="mt-2 text-sm text-brand-sky-profile">{experiencia.cargo}</p>
                  {experiencia.actual && (
                    <span className="mt-4 inline-flex rounded-full bg-brand-sky/10 px-3 py-1 text-xs font-semibold text-brand-sky-profile">
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
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-sky-profile">
            03 / Casos destacados
          </p>
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
                className="flex flex-col rounded-2xl border border-brand-ink/10 border-t-4 border-t-brand-sky bg-white p-6 even:border-t-brand-coral sm:p-8"
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
                    className={clasesBoton('borde', 'mt-5')}
                  >
                    Ver proyecto <ArrowUpRight size={18} aria-hidden="true" />
                  </a>
                )}
              </article>
            ))}
          </div>
        </section>

        <section aria-labelledby="formacion-titulo" className="mt-20">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-sky-profile">
            04 / Formación e idiomas
          </p>
          <h2 id="formacion-titulo" className="mt-3 text-3xl font-bold sm:text-4xl">
            Aprendizaje como base.
          </h2>
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            <article className="group/formacion rounded-2xl border border-brand-ink/10 bg-white p-6 transition-[border-color,background-color,box-shadow] duration-300 fine-pointer:hover:border-brand-sky/30 fine-pointer:hover:bg-brand-sky/[0.12] fine-pointer:hover:shadow-capacidad-acento sm:p-8">
              <GraduationCap
                size={28}
                strokeWidth={1.5}
                className="text-brand-sky-profile motion-safe:fine-pointer:group-hover/formacion:animate-perfil-icono"
                aria-hidden="true"
              />
              <h3 className="mt-4 text-xl font-bold">{perfil.formacion.titulo}</h3>
              <p className="mt-2 text-sm text-brand-ink/75">{perfil.formacion.institucion}</p>
              <p className="mt-4 font-mono text-xs text-brand-ink/65">{perfil.formacion.periodo}</p>
            </article>
            {perfil.idiomas.map((idioma) => (
              <article
                key={idioma.nombre}
                className="group/idioma rounded-2xl border border-brand-ink/10 bg-white p-6 transition-[border-color,background-color,box-shadow] duration-300 fine-pointer:hover:border-brand-sky/30 fine-pointer:hover:bg-brand-sky/[0.12] fine-pointer:hover:shadow-capacidad-acento sm:p-8"
              >
                <Languages
                  size={28}
                  strokeWidth={1.5}
                  className="text-brand-sky-profile motion-safe:fine-pointer:group-hover/idioma:animate-perfil-icono"
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
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-sky-profile">
            05 / Contacto
          </p>
          <h2 id="contacto-titulo" className="mt-3 text-3xl font-bold sm:text-4xl">
            Conversemos sobre tu próximo desafío.
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-brand-ink/75">
            ¿Un proyecto, una integración o una oportunidad profesional? Cuéntame lo que tienes en
            mente desde mi página de contacto.
          </p>
          <a
            href={enlaceCorreo(CONTACT_EMAIL)}
            className="mt-6 inline-flex max-w-full items-start gap-3 text-sm font-semibold text-brand-sky-profile underline-offset-4 hover:underline"
          >
            <Mail size={20} className="shrink-0" aria-hidden="true" />
            <span className="break-all">{CONTACT_EMAIL}</span>
          </a>
          <div className="mt-6">
            <Link href="/contacto" className={clasesBoton('coral')}>
              Ir al formulario de contacto <ArrowUpRight size={18} aria-hidden="true" />
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
