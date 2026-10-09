import Link from 'next/link';
import type {EntradaBoveda} from '../../boveda/registro';
import Contenedor from '../../base/Contenedor/Contenedor';

export interface MuestraComponenteProps {
  entrada: EntradaBoveda;
  textoVer: string;
}

export default function MuestraComponente({entrada, textoVer}: MuestraComponenteProps) {
  return (
    <article aria-labelledby={`pieza-${entrada.slug}`} className="min-w-0">
      <Contenedor>
        <h2 id={`pieza-${entrada.slug}`} className="break-words text-2xl font-bold">
          {entrada.nombre}
        </h2>
        <p className="mt-3 max-w-3xl break-words leading-relaxed">{entrada.descripcionCorta}</p>
      </Contenedor>
      <div className="mt-6">{entrada.renderizar(true)}</div>
      <Contenedor>
        <Link
          href={`/componentes/${entrada.slug}`}
          className="mt-4 inline-flex min-h-12 items-center font-semibold underline underline-offset-4"
        >
          {textoVer}
        </Link>
      </Contenedor>
    </article>
  );
}
