import type {CatalogoServicios} from '@/domain/types/catalogo';
import AlcanceCatalogo from './AlcanceCatalogo';
import PrincipiosCatalogo from './PrincipiosCatalogo';
import FilosofiaCatalogo from './FilosofiaCatalogo';
import EntradaScroll from '../EntradaScroll/EntradaScroll';

export interface CondicionesCatalogoProps {
  catalogo: CatalogoServicios;
}

export default function CondicionesCatalogo({catalogo}: CondicionesCatalogoProps) {
  return (
    <EntradaScroll
      aria-labelledby="filosofia-titulo"
      className="mt-10 overflow-hidden rounded-2xl border border-brand-ink/10 bg-white"
    >
      <FilosofiaCatalogo filosofia={catalogo.filosofia} />
      <div className="grid gap-8 p-6 sm:p-8 lg:grid-cols-2 lg:gap-12">
        <AlcanceCatalogo titulo={catalogo.textos.alcance} alcance={catalogo.alcance} />
        <PrincipiosCatalogo titulo={catalogo.textos.principios} principios={catalogo.principios} />
      </div>
    </EntradaScroll>
  );
}
