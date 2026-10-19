import type {Paquete} from '../../../domain/types/paquete';
import EntradaScroll from '../EntradaScroll/EntradaScroll';

export default function DetallePaquete({paquete}: {paquete: Paquete}) {
  return (
    <div className="mt-10 grid items-start gap-6 md:grid-cols-2">
      {paquete.secciones.map((seccion) => (
        <EntradaScroll
          key={seccion.titulo}
          className="rounded-2xl border border-brand-ink/10 bg-white p-6 sm:p-8"
        >
          <h2 data-entrada-elemento="titulo" className="text-xl font-bold">
            {seccion.titulo}
          </h2>
          {seccion.descripcion && (
            <p data-entrada-elemento="texto" className="mt-4 leading-relaxed text-brand-ink/70">
              {seccion.descripcion}
            </p>
          )}
          {seccion.elementos && (
            <ul
              data-entrada-elemento="texto"
              className="mt-4 list-disc space-y-3 pl-5 leading-relaxed text-brand-ink/70"
            >
              {seccion.elementos.map((elemento) => (
                <li key={elemento}>{elemento}</li>
              ))}
            </ul>
          )}
        </EntradaScroll>
      ))}
    </div>
  );
}
