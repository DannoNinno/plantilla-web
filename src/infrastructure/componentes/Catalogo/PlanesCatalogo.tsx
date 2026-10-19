import type {Paquete} from '@/domain/types/paquete';
import type {CatalogoServicios} from '@/domain/types/catalogo';
import EntradaScroll from '../EntradaScroll/EntradaScroll';
import TarjetaPlan from './TarjetaPlan';
import CoverflowCarousel from '../Carousel/CoverflowCarousel';
import Link from 'next/link';

export interface PlanesCatalogoProps {
  paquetes: Paquete[];
  catalogo: CatalogoServicios;
}

export default function PlanesCatalogo({paquetes, catalogo}: PlanesCatalogoProps) {
  const {textos, comparacion, vitrina} = catalogo;
  return (
    <EntradaScroll
      id="planes"
      aria-labelledby="planes-titulo"
      className="-mx-6 mt-12 scroll-mt-28 border-y-2 border-b-brand-coral/50 border-t-brand-sky-text/40 bg-gradient-to-br from-brand-sky/40 via-white/60 to-brand-coral/35 px-6 py-10 sm:py-12"
    >
      <h2 id="planes-titulo" data-entrada-elemento="titulo" className="text-2xl font-bold">
        {textos.planes}
      </h2>
      <p data-entrada-elemento="texto" className="mt-3 max-w-2xl leading-relaxed text-brand-ink/70">
        {textos.precios}
      </p>
      <CoverflowCarousel
        labels={{
          title: comparacion.titulo,
          carousel: comparacion.carrusel,
          slide: comparacion.diapositiva,
          previous: comparacion.anterior,
          next: comparacion.siguiente,
          help: comparacion.ayudaCarrusel,
          selection: comparacion.irAlPlan,
          position: comparacion.posicion,
        }}
        items={paquetes.map((paquete, index) => ({
          id: paquete.id,
          label: paquete.nombre,
          content: (
            <TarjetaPlan
              paquete={paquete}
              numero={index + 1}
              textos={textos}
              comparacion={comparacion}
            />
          ),
        }))}
      />
      <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
        <p className="max-w-2xl text-sm text-brand-ink/65">{textos.cotizacion}</p>
        <Link
          href="/componentes"
          className="rounded text-sm text-brand-sky-text underline underline-offset-4"
        >
          {vitrina.verTodos}
        </Link>
      </div>
    </EntradaScroll>
  );
}
