import type {Paquete} from '@/domain/types/paquete';
import type {CatalogoServicios} from '@/domain/types/catalogo';
import EntradaScroll from '../EntradaScroll/EntradaScroll';
import TarjetaPlan from './TarjetaPlan';

export interface PlanesCatalogoProps {
  paquetes: Paquete[];
  textos: CatalogoServicios['textos'];
}

export default function PlanesCatalogo({paquetes, textos}: PlanesCatalogoProps) {
  return (
    <EntradaScroll id="planes" aria-labelledby="planes-titulo" className="mt-12 scroll-mt-28">
      <h2 id="planes-titulo" data-entrada-elemento="titulo" className="text-2xl font-bold">
        {textos.planes}
      </h2>
      <p data-entrada-elemento="texto" className="mt-3 max-w-2xl leading-relaxed text-brand-ink/70">
        {textos.precios}
      </p>
      <div data-entrada-elemento="texto" className="mt-6 grid gap-6 md:grid-cols-2">
        {paquetes.map((paquete, index) => (
          <TarjetaPlan key={paquete.id} paquete={paquete} numero={index + 1} textos={textos} />
        ))}
      </div>
      <p className="mt-8 text-sm text-brand-ink/65">{textos.cotizacion}</p>
    </EntradaScroll>
  );
}
