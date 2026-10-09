import type {CatalogoServicios} from '@/domain/types/catalogo';
import EntradaScroll from '../EntradaScroll/EntradaScroll';

export interface AdicionalesCatalogoProps {
  catalogo: CatalogoServicios;
}

export default function AdicionalesCatalogo({catalogo}: AdicionalesCatalogoProps) {
  return (
    <EntradaScroll
      id="adicionales"
      aria-labelledby="adicionales-titulo"
      className="mt-12 scroll-mt-28 rounded-2xl border border-brand-ink/10 bg-white p-6 sm:p-8"
    >
      <h2 id="adicionales-titulo" data-entrada-elemento="titulo" className="text-2xl font-bold">
        {catalogo.textos.adicionales}
      </h2>
      <p data-entrada-elemento="texto" className="mt-3 max-w-2xl leading-relaxed text-brand-ink/70">
        {catalogo.textos.detalleAdicionales}
      </p>
      <dl data-entrada-elemento="texto" className="mt-6 grid gap-6 sm:grid-cols-2">
        {catalogo.adicionales.map((adicional) => (
          <div key={adicional.nombre} className="border-t border-brand-ink/10 pt-5">
            <dt className="font-semibold">{adicional.nombre}</dt>
            <dd className="mt-2 text-lg text-brand-sky-text">{adicional.costo}</dd>
          </div>
        ))}
      </dl>
    </EntradaScroll>
  );
}
