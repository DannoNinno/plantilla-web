import type {CatalogoServicios} from '@/domain/types/catalogo';
import type {ConfiguracionSitio} from '@/domain/types/sitio';
import type {Paquete} from '@/domain/types/paquete';
import PresentacionCatalogo from './PresentacionCatalogo';
import FilosofiaCatalogo from './FilosofiaCatalogo';
import ExploracionCatalogo from './ExploracionCatalogo';
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
    <div className="mx-auto max-w-6xl px-6 py-12 sm:py-20">
      <PresentacionCatalogo textos={catalogo.textos} sitio={sitio} />
      <FilosofiaCatalogo filosofia={catalogo.filosofia} />
      <ExploracionCatalogo textos={catalogo.exploracion} />
      <PlanesCatalogo paquetes={paquetes} textos={catalogo.textos} />
      <CondicionesCatalogo catalogo={catalogo} />
      <AdicionalesCatalogo catalogo={catalogo} />
    </div>
  );
}
