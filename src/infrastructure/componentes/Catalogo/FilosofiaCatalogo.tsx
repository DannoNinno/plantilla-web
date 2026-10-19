import type {CatalogoServicios} from '@/domain/types/catalogo';

export interface FilosofiaCatalogoProps {
  filosofia: CatalogoServicios['filosofia'];
}

export default function FilosofiaCatalogo({filosofia}: FilosofiaCatalogoProps) {
  return (
    <div className="grid gap-6 bg-brand-ink p-6 text-white sm:p-8 lg:grid-cols-2 lg:gap-12">
      <div>
        <h2 id="filosofia-titulo" data-entrada-elemento="titulo" className="text-2xl font-bold">
          {filosofia.titulo}
        </h2>
        <p data-entrada-elemento="texto" className="mt-3 text-sm leading-relaxed text-white/80">
          {filosofia.conclusion}
        </p>
      </div>
      <div>
        <p data-entrada-elemento="texto" className="text-sm font-semibold">
          {filosofia.introduccion}
        </p>
        <ul
          data-entrada-elemento="texto"
          className="mt-3 grid list-disc gap-x-6 gap-y-2 pl-5 text-sm leading-relaxed text-white/80 sm:grid-cols-2"
        >
          {filosofia.objetivos.map((objetivo) => (
            <li key={objetivo}>{objetivo}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
