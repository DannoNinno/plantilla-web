import Contenedor from '../../base/Contenedor/Contenedor';
import type {PiePaginaProps} from './tipos';

export default function PiePagina({
  nombre,
  descripcion,
  copyright,
  textoVolver,
  hrefVolver,
}: PiePaginaProps) {
  return (
    <footer className="border-t border-seccion-fondo/20 bg-seccion-tinta py-10 text-seccion-fondo">
      <Contenedor>
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div className="min-w-0 max-w-xl">
            <p className="break-words text-2xl font-bold">{nombre}</p>
            {descripcion && <p className="mt-3 break-words leading-relaxed">{descripcion}</p>}
          </div>
          {textoVolver && hrefVolver && (
            <a
              href={hrefVolver}
              className="inline-flex min-h-12 items-center rounded-lg px-3 font-semibold underline underline-offset-4 focus-visible:outline focus-visible:outline-foco focus-visible:outline-offset-4 focus-visible:outline-brand-light"
            >
              {textoVolver}
            </a>
          )}
        </div>
        <p className="mt-8 break-words text-sm leading-relaxed">{copyright}</p>
      </Contenedor>
    </footer>
  );
}
