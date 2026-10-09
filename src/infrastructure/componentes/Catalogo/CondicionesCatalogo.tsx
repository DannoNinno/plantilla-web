import type {CatalogoServicios} from '@/domain/types/catalogo';
import AlcanceCatalogo from './AlcanceCatalogo';
import PrincipiosCatalogo from './PrincipiosCatalogo';

export interface CondicionesCatalogoProps {
  catalogo: CatalogoServicios;
}

export default function CondicionesCatalogo({catalogo}: CondicionesCatalogoProps) {
  return (
    <div className="mt-12 grid gap-6 md:grid-cols-2">
      <AlcanceCatalogo titulo={catalogo.textos.alcance} alcance={catalogo.alcance} />
      <PrincipiosCatalogo titulo={catalogo.textos.principios} principios={catalogo.principios} />
    </div>
  );
}
