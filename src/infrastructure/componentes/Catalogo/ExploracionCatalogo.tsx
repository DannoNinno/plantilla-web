import Link from 'next/link';
import {PanelsTopLeft, Blocks} from 'lucide-react';
import type {CatalogoServicios} from '@/domain/types/catalogo';
import type {PlanDemo} from '@/demo/planes';
import {clasesBoton} from '../Boton/estilos';
import EntradaScroll from '../EntradaScroll/EntradaScroll';

export interface ExploracionCatalogoProps {
  textos: CatalogoServicios['exploracion'];
  demo?: PlanDemo;
}

export default function ExploracionCatalogo({textos, demo}: ExploracionCatalogoProps) {
  return (
    <EntradaScroll
      aria-labelledby="exploracion-titulo"
      className="mt-12 rounded-2xl border border-brand-ink/10 bg-white p-6 sm:p-8"
    >
      <h2 id="exploracion-titulo" data-entrada-elemento="titulo" className="text-2xl font-bold">
        {textos.titulo}
      </h2>
      <p data-entrada-elemento="texto" className="mt-3 max-w-3xl leading-relaxed text-brand-ink/70">
        {demo ? textos.detallePlan : textos.descripcion}
      </p>
      <div data-entrada-elemento="texto" className="mt-6 grid gap-6 md:grid-cols-2">
        <div className="min-w-0">
          <h3 className="flex items-center gap-2 text-lg font-semibold">
            <PanelsTopLeft size={20} aria-hidden="true" />
            {textos.sitio}
          </h3>
          <p className="mt-2 leading-relaxed text-brand-ink/70">
            {demo ? demo.nombre : textos.detalleSitio}
          </p>
          <Link href={demo?.href ?? '#planes'} className={clasesBoton('ink', 'mt-4')}>
            {demo ? textos.verDemo : textos.verPlanes}
          </Link>
        </div>
        <div className="min-w-0">
          <h3 className="flex items-center gap-2 text-lg font-semibold">
            <Blocks size={20} aria-hidden="true" />
            {textos.componentes}
          </h3>
          <p className="mt-2 leading-relaxed text-brand-ink/70">{textos.detalleComponentes}</p>
          <Link href={textos.componentesHref} className={clasesBoton('borde', 'mt-4')}>
            {textos.verComponentes}
          </Link>
        </div>
      </div>
      <p className="mt-6 text-sm leading-relaxed text-brand-ink/70">{textos.fase}</p>
    </EntradaScroll>
  );
}
