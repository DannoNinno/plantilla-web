import type {CatalogoServicios} from '@/domain/types/catalogo';
import type {ConfiguracionSitio} from '@/domain/types/sitio';
import type {Paquete} from '@/domain/types/paquete';
import PresentacionCatalogo from './PresentacionCatalogo';
import FilosofiaCatalogo from './FilosofiaCatalogo';
import Link from 'next/link';
import EntradaScroll from '../EntradaScroll/EntradaScroll';
import ComparacionPlanes from './ComparacionPlanes';
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
      <PlanesCatalogo paquetes={paquetes} textos={catalogo.textos} />
      <EntradaScroll aria-labelledby="comparacion-titulo" className="mt-12">
        <h2 id="comparacion-titulo" data-entrada-elemento="titulo" className="text-2xl font-bold">
          {catalogo.comparacion.titulo}
        </h2>
        <ComparacionPlanes paquetes={paquetes} textos={catalogo.comparacion} />
        <Link
          href="/componentes"
          className="mt-6 inline-flex rounded text-brand-sky-text underline underline-offset-4"
        >
          {catalogo.vitrina.verTodos}
        </Link>
      </EntradaScroll>
      <FilosofiaCatalogo filosofia={catalogo.filosofia} />
      <CondicionesCatalogo catalogo={catalogo} />
      <AdicionalesCatalogo catalogo={catalogo} />
    </div>
  );
}
