import type {CatalogoServicios} from '@/domain/types/catalogo';
import EntradaScroll from '../EntradaScroll/EntradaScroll';

export interface AlcanceCatalogoProps {
  titulo: string;
  alcance: CatalogoServicios['alcance'];
}

export default function AlcanceCatalogo({titulo, alcance}: AlcanceCatalogoProps) {
  return (
    <EntradaScroll
      id="alcance"
      aria-labelledby="alcance-titulo"
      className="scroll-mt-28 rounded-2xl border border-brand-ink/10 bg-white p-6 sm:p-8"
    >
      <h2 id="alcance-titulo" data-entrada-elemento="titulo" className="text-2xl font-bold">
        {titulo}
      </h2>
      <p data-entrada-elemento="texto" className="mt-4 leading-relaxed text-brand-ink/70">
        {alcance.introduccion}
      </p>
      <ul
        data-entrada-elemento="texto"
        className="mt-4 list-disc space-y-3 pl-5 leading-relaxed text-brand-ink/70"
      >
        {alcance.condiciones.map((condicion) => (
          <li key={condicion}>{condicion}</li>
        ))}
      </ul>
    </EntradaScroll>
  );
}
