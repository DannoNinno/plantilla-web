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
      className="mt-10 overflow-hidden rounded-2xl border border-brand-ink/15 bg-gradient-to-br from-white via-brand-sky/5 to-brand-coral/10 shadow-[0_14px_34px_-24px_rgba(4,24,47,0.45)]"
    >
      <FilosofiaCatalogo filosofia={catalogo.filosofia} />
      <div className="grid gap-8 p-6 sm:p-8 lg:grid-cols-2 lg:gap-12">
        <AlcanceCatalogo titulo={catalogo.textos.alcance} alcance={catalogo.alcance} />
        <PrincipiosCatalogo titulo={catalogo.textos.principios} principios={catalogo.principios} />
      </div>
    </EntradaScroll>
  );
}
