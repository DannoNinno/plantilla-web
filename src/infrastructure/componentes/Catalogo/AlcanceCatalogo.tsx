import type {CatalogoServicios} from '@/domain/types/catalogo';

export interface AlcanceCatalogoProps {
  titulo: string;
  alcance: CatalogoServicios['alcance'];
}

export default function AlcanceCatalogo({titulo, alcance}: AlcanceCatalogoProps) {
  return (
    <div
      id="alcance"
      tabIndex={-1}
      aria-labelledby="alcance-titulo"
      className="min-w-0 scroll-mt-28"
    >
      <h3 id="alcance-titulo" data-entrada-elemento="titulo" className="text-lg font-bold">
        {titulo}
      </h3>
      <p data-entrada-elemento="texto" className="mt-3 text-sm leading-relaxed text-brand-ink/70">
        {alcance.introduccion}
      </p>
      <ul
        data-entrada-elemento="texto"
        className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-brand-ink/70"
      >
        {alcance.condiciones.map((condicion) => (
          <li key={condicion}>{condicion}</li>
        ))}
      </ul>
    </div>
  );
}
