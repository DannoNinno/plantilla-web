import type {Paquete} from '../../../domain/types/paquete';
import EntradaScroll from '../EntradaScroll/EntradaScroll';

export default function DetallePaquete({paquete}: {paquete: Paquete}) {
  return (
    <div className="mt-10 grid items-stretch gap-6 md:grid-cols-2">
      {paquete.secciones.map((seccion) => (
        <EntradaScroll
          key={seccion.titulo}
          className="rounded-2xl border border-brand-ink/15 bg-white bg-gradient-to-br from-brand-coral/15 via-brand-coral/[0.07] via-70% to-brand-sky/10 p-6 shadow-[0_14px_34px_-24px_rgba(4,24,47,0.45)] sm:p-8"
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
