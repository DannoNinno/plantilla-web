import type {CatalogoServicios} from '@/domain/types/catalogo';
import type {ConfiguracionSitio} from '@/domain/types/sitio';
import type {Paquete} from '@/domain/types/paquete';
import PresentacionCatalogo from './PresentacionCatalogo';
import PlanesCatalogo from './PlanesCatalogo';
import CondicionesCatalogo from './CondicionesCatalogo';
import AdicionalesCatalogo from './AdicionalesCatalogo';

export interface PaginaCatalogoProps {
  catalogo: CatalogoServicios;
  sitio: ConfiguracionSitio;
  paquetes: Paquete[];
}

export default function PaginaCatalogo({catalogo, sitio, paquetes}: PaginaCatalogoProps) {
  return (
    <div className="py-12 sm:py-20">
      <div className="mx-auto max-w-6xl px-6">
        <PresentacionCatalogo textos={catalogo.textos} sitio={sitio} />
      </div>
      <PlanesCatalogo paquetes={paquetes} catalogo={catalogo} />
      <div className="mx-auto max-w-6xl px-6">
        <CondicionesCatalogo catalogo={catalogo} />
        <AdicionalesCatalogo catalogo={catalogo} />
      </div>
    </div>
  );
}
