import type {Paquete} from '@/domain/types/paquete';
import type {CatalogoServicios} from '@/domain/types/catalogo';
import TarjetaPlan from './TarjetaPlan';
import CoverflowCarousel from '../../boveda/Carousel/CoverflowCarousel';

export interface PlanesCatalogoProps {
  paquetes: Paquete[];
  catalogo: CatalogoServicios;
}

export default function PlanesCatalogo({paquetes, catalogo}: PlanesCatalogoProps) {
  const {textos, comparacion} = catalogo;
  return (
    <section
      id="planes"
      aria-labelledby="planes-titulo"
      className="mt-12 scroll-mt-28 bg-gradient-to-br from-brand-sky/50 via-brand-sky/25 via-35% to-brand-coral py-10 focus:outline-none sm:py-12"
    >
      <div className="mx-auto max-w-6xl px-6">
        <h2 id="planes-titulo" className="text-2xl font-bold">
          {textos.planes}
        </h2>
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
          items={paquetes.map((paquete) => ({
            id: paquete.id,
            label: paquete.nombre,
            content: <TarjetaPlan paquete={paquete} textos={textos} />,
          }))}
        />
        <p className="mt-6 max-w-2xl text-sm text-brand-ink/65">{textos.cotizacion}</p>
      </div>
    </section>
  );
}
