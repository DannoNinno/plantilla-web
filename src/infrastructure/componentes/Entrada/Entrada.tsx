import Link from 'next/link';
import {ArrowDown, ArrowUpRight, PanelsTopLeft, Sparkles, UserRound} from 'lucide-react';
import {getSitio} from '../../handlers/datos';
import {clasesBoton} from '../Boton/estilos';

const sitio = getSitio();

export default function Entrada() {
  return (
    <>
      <section className="relative flex min-h-intro flex-col bg-brand-ink bg-intro text-white sm:min-h-intro-lg">
        <div className="relative mx-auto flex w-full max-w-6xl flex-1 flex-col items-start justify-center px-6 py-16 sm:py-20">
          <p className="mb-6 animate-intro text-sm font-medium uppercase tracking-[0.2em] text-brand-sky">
            {sitio.persona} / {sitio.nombre}
          </p>
          <h1 className="max-w-4xl animate-intro text-4xl font-bold leading-tight [animation-delay:100ms] sm:text-6xl lg:text-7xl">
            Tu negocio, mi experiencia.
            <span className="block text-brand-sky">Tecnología para avanzar.</span>
          </h1>
          <p className="mt-6 max-w-xl animate-intro text-lg leading-relaxed text-white/75 [animation-delay:200ms]">
            Soy {sitio.persona}, y {sitio.nombre} es mi marca personal. {sitio.descripcion}
          </p>
          <a href="#entradas" className={clasesBoton('coral', 'mt-8')}>
            Explorar el sitio <ArrowDown size={18} aria-hidden="true" />
          </a>
          <a
            href="#entradas"
            className="absolute right-6 top-5 text-sm text-white/70 underline underline-offset-4"
          >
            Saltar presentación
          </a>
        </div>
      </section>
      <section
        id="entradas"
        aria-labelledby="entradas-titulo"
        className="scroll-mt-28 border-t border-brand-ink/10 bg-brand-light"
      >
        <div className="flex w-full items-center justify-center gap-3 border-b border-brand-ink/10 bg-brand-sky/10 px-6 py-6 text-center text-brand-ink sm:py-8">
          <Sparkles size={20} className="shrink-0 text-brand-sky-text" aria-hidden="true" />
          <h2 id="entradas-titulo" className="text-lg font-semibold sm:text-xl">
            Elige tu próximo paso.
          </h2>
        </div>
        <div className="isolate grid bg-entradas md:grid-cols-2">
          <Link
            href="/catalogo"
            className="group flex min-h-puerta min-w-0 flex-col justify-center bg-white/[0.65] px-6 py-16 text-brand-ink backdrop-blur-lg transition-colors duration-puerta ease-out focus-visible:bg-brand-catalogo-active focus-visible:text-white focus-visible:outline-brand-sky focus-visible:-outline-offset-4 fine-pointer:hover:bg-brand-catalogo-active fine-pointer:hover:text-white sm:px-12 lg:px-20"
            aria-describedby="catalogo-descripcion"
          >
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-sky-text transition-colors duration-puerta ease-out group-focus-visible:text-white fine-pointer:group-hover:text-white">
              01 / Para tu negocio
            </span>
            <div className="mt-10">
              <span className="mb-6 inline-flex rounded-2xl bg-brand-sky/10 p-4 text-brand-sky-text transition-[transform,background-color,color] duration-puerta-icono ease-out group-focus-visible:-translate-y-2 group-focus-visible:bg-white/[0.12] group-focus-visible:text-white fine-pointer:group-hover:-translate-y-2 fine-pointer:group-hover:bg-white/[0.12] fine-pointer:group-hover:text-white motion-reduce:!transform-none">
                <PanelsTopLeft size={48} strokeWidth={1.5} aria-hidden="true" />
              </span>
              <h3 className="text-4xl font-bold sm:text-5xl">Catálogo</h3>
              <p
                id="catalogo-descripcion"
                className="mt-4 max-w-sm text-lg leading-relaxed text-brand-ink/75 transition-[opacity,color] duration-puerta ease-out group-focus-visible:text-white group-focus-visible:opacity-100 fine-pointer:opacity-0 fine-pointer:group-hover:text-white fine-pointer:group-hover:opacity-100"
              >
                Conoce mis cuatro planes de servicios. Revisa sus alcances y conversemos sobre lo
                que necesita tu negocio.
              </p>
            </div>
            <span className="mt-10 flex items-center gap-3 font-semibold text-brand-sky-text transition-colors duration-puerta ease-out group-focus-visible:text-white fine-pointer:group-hover:text-white">
              Conocer los planes <ArrowUpRight size={20} aria-hidden="true" />
            </span>
          </Link>
          <Link
            href="/perfil"
            className="group flex min-h-puerta min-w-0 flex-col justify-center border-t border-brand-ink/[0.08] bg-white/[0.65] px-6 py-16 text-brand-ink backdrop-blur-lg transition-colors duration-puerta ease-out focus-visible:bg-brand-perfil-active focus-visible:text-white focus-visible:outline-brand-coral focus-visible:-outline-offset-4 fine-pointer:hover:bg-brand-perfil-active fine-pointer:hover:text-white sm:px-12 md:border-l md:border-t-0 lg:px-20"
            aria-describedby="perfil-descripcion"
          >
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-sky-text transition-colors duration-puerta ease-out group-focus-visible:text-white fine-pointer:group-hover:text-white">
              02 / Conoce a quien lo construye
            </span>
            <div className="mt-10">
              <span className="mb-6 inline-flex rounded-2xl bg-brand-coral/10 p-4 text-brand-coral-dark transition-[transform,background-color,color] duration-puerta-icono ease-out group-focus-visible:-translate-y-2 group-focus-visible:bg-white/[0.12] group-focus-visible:text-white fine-pointer:group-hover:-translate-y-2 fine-pointer:group-hover:bg-white/[0.12] fine-pointer:group-hover:text-white motion-reduce:!transform-none">
                <UserRound size={48} strokeWidth={1.5} aria-hidden="true" />
              </span>
              <h3 className="text-4xl font-bold sm:text-5xl">Perfil</h3>
              <p
                id="perfil-descripcion"
                className="mt-4 max-w-sm text-lg leading-relaxed text-brand-ink/75 transition-[opacity,color] duration-puerta ease-out group-focus-visible:text-white group-focus-visible:opacity-100 fine-pointer:opacity-0 fine-pointer:group-hover:text-white fine-pointer:group-hover:opacity-100"
              >
                Soy {sitio.persona}. Este es el espacio para conocer mi trabajo y conversar.
              </p>
            </div>
            <span className="mt-10 flex items-center gap-3 font-semibold text-brand-ink transition-colors duration-puerta ease-out group-focus-visible:text-white fine-pointer:group-hover:text-white">
              Conocer a Daniel <ArrowUpRight size={20} aria-hidden="true" />
            </span>
          </Link>
        </div>
      </section>
    </>
  );
}
