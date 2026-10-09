import type {CatalogoServicios} from '@/domain/types/catalogo';
import EntradaScroll from '../EntradaScroll/EntradaScroll';

export interface FilosofiaCatalogoProps {
  filosofia: CatalogoServicios['filosofia'];
}

export default function FilosofiaCatalogo({filosofia}: FilosofiaCatalogoProps) {
  return (
    <EntradaScroll
      aria-labelledby="filosofia-titulo"
      className="mt-10 rounded-2xl bg-brand-ink p-6 text-white sm:p-8"
    >
      <h2 id="filosofia-titulo" data-entrada-elemento="titulo" className="text-2xl font-bold">
        {filosofia.titulo}
      </h2>
      <p data-entrada-elemento="texto" className="mt-4 text-white/80">
        {filosofia.introduccion}
      </p>
      <ul
        data-entrada-elemento="texto"
        className="mt-4 grid list-disc gap-3 pl-5 text-white/80 sm:grid-cols-2"
      >
        {filosofia.objetivos.map((objetivo) => (
          <li key={objetivo}>{objetivo}</li>
        ))}
      </ul>
      <p data-entrada-elemento="texto" className="mt-6 max-w-3xl leading-relaxed">
        {filosofia.conclusion}
      </p>
    </EntradaScroll>
  );
}
