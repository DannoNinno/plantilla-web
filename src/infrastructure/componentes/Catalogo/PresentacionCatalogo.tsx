import type {CatalogoServicios} from '@/domain/types/catalogo';
import type {ConfiguracionSitio} from '@/domain/types/sitio';
import EntradaScroll from '../EntradaScroll/EntradaScroll';

export interface PresentacionCatalogoProps {
  textos: CatalogoServicios['textos'];
  sitio: ConfiguracionSitio;
}

export default function PresentacionCatalogo({textos, sitio}: PresentacionCatalogoProps) {
  return (
    <EntradaScroll aria-labelledby="catalogo-titulo">
      <p className="text-xs font-semibold uppercase tracking-widest text-brand-sky-text">
        {textos.etiqueta}
      </p>
      <h1
        id="catalogo-titulo"
        data-entrada-elemento="titulo"
        className="mt-4 max-w-3xl text-4xl font-bold sm:text-5xl"
      >
        {textos.titulo}
      </h1>
      <p
        data-entrada-elemento="texto"
        className="mt-6 max-w-2xl text-lg leading-relaxed text-brand-ink/70"
      >
        {textos.identidad.replace('{persona}', sitio.persona).replace('{marca}', sitio.nombre)}{' '}
        {textos.presentacion}
      </p>
    </EntradaScroll>
  );
}
