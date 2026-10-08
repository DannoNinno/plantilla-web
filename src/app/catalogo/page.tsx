import Link from 'next/link';
import {ArrowUpRight} from 'lucide-react';
import {getCatalogo, getPaquetes, getSitio} from '@/infrastructure/handlers/datos';
import {precioDesdeCLP} from '@/domain/servicios/precio';
import {clasesBoton} from '@/infrastructure/componentes/Boton/estilos';
import EntradaScroll from '@/infrastructure/componentes/EntradaScroll/EntradaScroll';

export const metadata = {title: 'Catálogo'};

export default function CatalogoPage() {
  const catalogo = getCatalogo();
  const sitio = getSitio();

  return (
    <div className="mx-auto max-w-6xl px-6 py-12 sm:py-20">
      <EntradaScroll aria-labelledby="catalogo-titulo">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-sky-text">
          Mis servicios
        </p>
        <h1
          id="catalogo-titulo"
          data-entrada-elemento="titulo"
          className="mt-4 max-w-3xl text-4xl font-bold sm:text-5xl"
        >
          Te ayudo a hacer crecer tu negocio.
        </h1>
        <p
          data-entrada-elemento="texto"
          className="mt-6 max-w-2xl text-lg leading-relaxed text-brand-ink/70"
        >
          Soy {sitio.persona}, y {sitio.nombre} es mi marca personal. Trabajo directamente contigo
          para mejorar tu presencia digital, captar clientes, automatizar procesos o llevar tus
          productos a una tienda online.
        </p>
      </EntradaScroll>
      <EntradaScroll
        aria-labelledby="filosofia-titulo"
        className="mt-10 rounded-2xl bg-brand-ink p-6 text-white sm:p-8"
      >
        <h2 id="filosofia-titulo" data-entrada-elemento="titulo" className="text-2xl font-bold">
          {catalogo.filosofia.titulo}
        </h2>
        <p data-entrada-elemento="texto" className="mt-4 text-white/80">
          {catalogo.filosofia.introduccion}
        </p>
        <ul
          data-entrada-elemento="texto"
          className="mt-4 grid list-disc gap-3 pl-5 text-white/80 sm:grid-cols-2"
        >
          {catalogo.filosofia.objetivos.map((objetivo) => (
            <li key={objetivo}>{objetivo}</li>
          ))}
        </ul>
        <p data-entrada-elemento="texto" className="mt-6 max-w-3xl leading-relaxed">
          {catalogo.filosofia.conclusion}
        </p>
      </EntradaScroll>
      <EntradaScroll aria-labelledby="planes-titulo" className="mt-12">
        <h2 id="planes-titulo" data-entrada-elemento="titulo" className="text-2xl font-bold">
          Elige tu punto de partida
        </h2>
        <p
          data-entrada-elemento="texto"
          className="mt-3 max-w-2xl leading-relaxed text-brand-ink/70"
        >
          Los valores son precios desde. Defino contigo el alcance y preparo tu cotización antes de
          comenzar.
        </p>
        <div data-entrada-elemento="texto" className="mt-6 grid gap-6 md:grid-cols-2">
          {getPaquetes().map((paquete, index) => (
            <article
              key={paquete.id}
              className="flex flex-col rounded-2xl border border-brand-ink/10 bg-white p-6 sm:p-8"
            >
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-sky-text">
                Plan {index + 1}
              </span>
              <h3 className="mt-5 text-2xl font-bold">{paquete.nombre}</h3>
              <p className="mt-3 text-xl font-semibold text-brand-sky-text">
                {precioDesdeCLP(paquete.precioDesde)}
              </p>
              <p className="mt-4 flex-1 leading-relaxed text-brand-ink/70">{paquete.resumen}</p>
              <Link href={`/catalogo/${paquete.id}`} className={clasesBoton('ink', 'mt-6')}>
                Ver detalle de {paquete.nombre} <ArrowUpRight size={18} aria-hidden="true" />
              </Link>
            </article>
          ))}
        </div>
      </EntradaScroll>
      <p className="mt-8 text-sm text-brand-ink/65">
        Cotizo según lo que necesita tu negocio. No hay pagos ni compras en este sitio.
      </p>
      <div className="mt-12 grid gap-6 md:grid-cols-2">
        <EntradaScroll
          id="alcance"
          aria-labelledby="alcance-titulo"
          className="scroll-mt-28 rounded-2xl border border-brand-ink/10 bg-white p-6 sm:p-8"
        >
          <h2 id="alcance-titulo" data-entrada-elemento="titulo" className="text-2xl font-bold">
            Gestión de alcance
          </h2>
          <p data-entrada-elemento="texto" className="mt-4 leading-relaxed text-brand-ink/70">
            {catalogo.alcance.introduccion}
          </p>
          <ul
            data-entrada-elemento="texto"
            className="mt-4 list-disc space-y-3 pl-5 leading-relaxed text-brand-ink/70"
          >
            {catalogo.alcance.condiciones.map((condicion) => (
              <li key={condicion}>{condicion}</li>
            ))}
          </ul>
        </EntradaScroll>
        <EntradaScroll
          aria-labelledby="principios-titulo"
          className="rounded-2xl border border-brand-ink/10 bg-white p-6 sm:p-8"
        >
          <h2 id="principios-titulo" data-entrada-elemento="titulo" className="text-2xl font-bold">
            Mis compromisos contigo
          </h2>
          <ul
            data-entrada-elemento="texto"
            className="mt-4 list-disc space-y-3 pl-5 leading-relaxed text-brand-ink/70"
          >
            {catalogo.principios.map((principio) => (
              <li key={principio}>{principio}</li>
            ))}
          </ul>
        </EntradaScroll>
      </div>
      <EntradaScroll
        id="adicionales"
        aria-labelledby="adicionales-titulo"
        className="mt-12 scroll-mt-28 rounded-2xl border border-brand-ink/10 bg-white p-6 sm:p-8"
      >
        <h2 id="adicionales-titulo" data-entrada-elemento="titulo" className="text-2xl font-bold">
          Servicios y costos adicionales
        </h2>
        <p
          data-entrada-elemento="texto"
          className="mt-3 max-w-2xl leading-relaxed text-brand-ink/70"
        >
          Si necesitas horas adicionales o soporte fuera de lo contratado, te explico el costo y
          espero tu aprobación antes de avanzar.
        </p>
        <dl data-entrada-elemento="texto" className="mt-6 grid gap-6 sm:grid-cols-2">
          {catalogo.adicionales.map((adicional) => (
            <div key={adicional.nombre} className="border-t border-brand-ink/10 pt-5">
              <dt className="font-semibold">{adicional.nombre}</dt>
              <dd className="mt-2 text-lg text-brand-sky-text">{adicional.costo}</dd>
            </div>
          ))}
        </dl>
      </EntradaScroll>
    </div>
  );
}
