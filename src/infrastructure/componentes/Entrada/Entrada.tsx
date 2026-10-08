import Link from 'next/link';
import {
  ArrowDown,
  ArrowUpRight,
  LockKeyhole,
  PanelsTopLeft,
  Sparkles,
  UserRound,
} from 'lucide-react';
import {getSitio} from '../../handlers/datos';
import {precioDesdeCLP} from '../../../domain/servicios/precio';
import {clasesBoton} from '../Boton/estilos';
import EntradaScroll from '../EntradaScroll/EntradaScroll';
import IlustracionServicio from './IlustracionServicio';

const sitio = getSitio();

export default function Entrada() {
  const tarjetaCatalogo = (
    <>
      <span className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-sky-text group-focus-visible:text-white fine-pointer:group-hover:text-white">
        01 / Para tu negocio
      </span>
      <div className="mt-10">
        <span className="mb-6 inline-flex rounded-2xl bg-brand-sky/10 p-4 text-brand-sky-text group-focus-visible:text-white fine-pointer:group-hover:text-white">
          <PanelsTopLeft
            data-entrada-elemento="ilustracion"
            size={48}
            strokeWidth={1.5}
            aria-hidden="true"
          />
        </span>
        <h3 className="text-4xl font-bold sm:text-5xl">Catálogo</h3>
        <p className="mt-4 max-w-sm text-lg leading-relaxed text-brand-ink/75 group-focus-visible:text-white fine-pointer:group-hover:text-white">
          {sitio.catalogoHabilitado
            ? 'Conoce mis cuatro planes de servicios y encuentra un punto de partida para tu negocio.'
            : 'Estoy preparando mis planes de servicios. Este espacio todavía no está disponible.'}
        </p>
      </div>
      {sitio.catalogoHabilitado ? (
        <span className="mt-10 flex items-center gap-3 font-semibold text-brand-sky-text group-focus-visible:text-white fine-pointer:group-hover:text-white">
          Conocer los planes <ArrowUpRight size={20} aria-hidden="true" />
        </span>
      ) : (
        <span className="mt-8 inline-flex w-fit items-center gap-2 rounded-full border border-brand-ink/20 bg-brand-ink/5 px-4 py-2 text-sm font-semibold text-brand-ink/65">
          <LockKeyhole size={16} aria-hidden="true" /> Próximamente
        </span>
      )}
    </>
  );

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
        </div>
      </section>
      <EntradaScroll
        id="que-hago"
        aria-labelledby="que-hago-titulo"
        className="flex min-h-[70vh] items-center bg-brand-light px-6 py-16 sm:py-20"
      >
        <div className="mx-auto grid w-full max-w-6xl items-center gap-10 md:grid-cols-2 md:gap-16">
          <div data-entrada-elemento="ilustracion" className="md:order-2">
            <IlustracionServicio servicio="sitio" />
          </div>
          <div className="md:order-1">
            <h2
              id="que-hago-titulo"
              data-entrada-elemento="titulo"
              className="text-3xl font-bold sm:text-5xl"
            >
              Qué hago y para quién
            </h2>
            <div data-entrada-elemento="texto">
              <p className="mt-6 max-w-lg text-lg leading-relaxed text-brand-ink/75">
                Te ayudo a mostrar tu pyme en internet, conseguir clientes y simplificar tu día a
                día.
              </p>
              <p className="mt-4 text-lg font-semibold text-brand-sky-text">
                Sitios {precioDesdeCLP(150000).replace('Desde', 'desde')}.
              </p>
            </div>
          </div>
        </div>
      </EntradaScroll>
      <EntradaScroll
        aria-labelledby="por-que-titulo"
        className="flex min-h-[70vh] items-center bg-white px-6 py-16 sm:py-20"
      >
        <div className="mx-auto grid w-full max-w-6xl items-center gap-10 md:grid-cols-2 md:gap-16">
          <div data-entrada-elemento="ilustracion">
            <IlustracionServicio servicio="trato" />
          </div>
          <div>
            <h2
              id="por-que-titulo"
              data-entrada-elemento="titulo"
              className="text-3xl font-bold sm:text-5xl"
            >
              Por qué conmigo
            </h2>
            <p
              data-entrada-elemento="texto"
              className="mt-6 max-w-lg text-lg leading-relaxed text-brand-ink/75"
            >
              Hablas conmigo y yo lo construyo. Te lo entrego sin mantención obligatoria, con el
              dominio y los activos a tu nombre.
            </p>
          </div>
        </div>
      </EntradaScroll>
      <EntradaScroll
        aria-labelledby="como-trabajo-titulo"
        className="flex min-h-[70vh] items-center bg-brand-light px-6 py-16 sm:py-20"
      >
        <div className="mx-auto grid w-full max-w-6xl items-center gap-10 md:grid-cols-2 md:gap-16">
          <div data-entrada-elemento="ilustracion" className="md:order-2">
            <IlustracionServicio servicio="proceso" />
          </div>
          <div className="md:order-1">
            <h2
              id="como-trabajo-titulo"
              data-entrada-elemento="titulo"
              className="text-3xl font-bold sm:text-5xl"
            >
              Cómo trabajo
            </h2>
            <p
              data-entrada-elemento="texto"
              className="mt-6 max-w-lg text-lg leading-relaxed text-brand-ink/75"
            >
              Voy contigo paso a paso, desde la primera conversación hasta la entrega.
            </p>
            <ol className="mt-8 space-y-4">
              {[
                {titulo: 'Te escucho', texto: 'Me cuentas de tu negocio y lo que necesitas.'},
                {
                  titulo: 'Lo dejamos claro',
                  texto: 'Defino contigo qué hacer, el precio y los plazos.',
                },
                {titulo: 'Lo construyo', texto: 'Doy forma a tu idea y la reviso contigo.'},
                {titulo: 'Te lo entrego', texto: 'Te explico cómo usarlo y queda en tus manos.'},
              ].map((paso, index) => (
                <li key={paso.titulo} data-entrada-paso={index} className="flex gap-4">
                  <span
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-sky/10 text-sm font-semibold text-brand-sky-text"
                    aria-hidden="true"
                  >
                    {index + 1}
                  </span>
                  <div>
                    <h3 className="font-semibold">{paso.titulo}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-brand-ink/70">{paso.texto}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </EntradaScroll>
      <EntradaScroll
        id="entradas"
        aria-labelledby="entradas-titulo"
        className="flex min-h-[70vh] scroll-mt-28 flex-col border-t border-brand-ink/10 bg-brand-light"
      >
        <div className="flex w-full items-center justify-center gap-3 border-b border-brand-ink/10 bg-brand-sky/10 px-6 py-6 text-center text-brand-ink sm:py-8">
          <Sparkles size={20} className="shrink-0 text-brand-sky-text" aria-hidden="true" />
          <h2
            id="entradas-titulo"
            data-entrada-elemento="titulo"
            className="text-lg font-semibold sm:text-xl"
          >
            Elige tu próximo paso.
          </h2>
        </div>
        <div
          data-entrada-elemento="texto"
          className="isolate grid flex-1 bg-entradas md:grid-cols-2"
        >
          {sitio.catalogoHabilitado ? (
            <Link
              href="/catalogo"
              className="group flex min-h-puerta min-w-0 flex-col justify-center bg-white/[0.65] px-6 py-16 text-brand-ink backdrop-blur-lg transition-colors duration-puerta ease-out focus-visible:bg-brand-catalogo-active focus-visible:text-white focus-visible:outline-brand-sky focus-visible:-outline-offset-4 fine-pointer:hover:bg-brand-catalogo-active fine-pointer:hover:text-white sm:px-12 lg:px-20"
            >
              {tarjetaCatalogo}
            </Link>
          ) : (
            <div
              aria-disabled="true"
              className="flex min-h-puerta min-w-0 cursor-not-allowed flex-col justify-center bg-brand-ink/5 px-6 py-16 text-brand-ink/45 grayscale [&_h3]:text-brand-ink/45 [&_p]:text-brand-ink/50 [&_span]:text-brand-ink/50 sm:px-12 lg:px-20"
            >
              {tarjetaCatalogo}
            </div>
          )}
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
                <UserRound
                  data-entrada-elemento="ilustracion"
                  size={48}
                  strokeWidth={1.5}
                  aria-hidden="true"
                />
              </span>
              <h3 className="text-4xl font-bold sm:text-5xl">Perfil</h3>
              <p
                id="perfil-descripcion"
                className="mt-4 max-w-sm text-lg leading-relaxed text-brand-ink/75 transition-[opacity,color] duration-puerta ease-out group-focus-visible:text-white group-focus-visible:opacity-100 fine-pointer:opacity-0 fine-pointer:group-hover:text-white fine-pointer:group-hover:opacity-100"
              >
                Soy {sitio.persona}. Conoce un poco de mí y de cómo puedo ayudarte con tu negocio.
              </p>
            </div>
            <span className="mt-10 flex items-center gap-3 font-semibold text-brand-ink transition-colors duration-puerta ease-out group-focus-visible:text-white fine-pointer:group-hover:text-white">
              Conocer a Daniel <ArrowUpRight size={20} aria-hidden="true" />
            </span>
          </Link>
        </div>
      </EntradaScroll>
    </>
  );
}
