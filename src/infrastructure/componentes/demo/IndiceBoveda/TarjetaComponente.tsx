import Link from 'next/link';
import type {EntradaBoveda} from '../../boveda/registro';

export interface TarjetaComponenteProps {
  entrada: EntradaBoveda;
  plan: string;
  textoVer: string;
  textoCuenta: string;
}

export default function TarjetaComponente({
  entrada,
  plan,
  textoVer,
  textoCuenta,
}: TarjetaComponenteProps) {
  return (
    <article className="flex min-w-0 flex-col rounded-2xl border border-brand-ink/15 bg-white p-6">
      <p className="text-xs font-semibold uppercase tracking-wide text-brand-ink">{plan}</p>
      <h3 className="mt-4 break-words text-2xl font-bold">{entrada.nombre}</h3>
      <p className="mt-3 flex-1 break-words leading-relaxed">{entrada.descripcionCorta}</p>
      <p className="mt-4 text-sm">{textoCuenta}</p>
      <Link
        href={`/componentes/${entrada.slug}`}
        className="mt-6 inline-flex min-h-12 items-center font-semibold text-brand-ink underline underline-offset-4"
      >
        {textoVer}
      </Link>
    </article>
  );
}
