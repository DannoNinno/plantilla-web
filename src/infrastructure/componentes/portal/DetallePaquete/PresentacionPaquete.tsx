import Link from 'next/link';

export interface PresentacionPaqueteProps {
  nombre: string;
  volver: string;
}

export default function PresentacionPaquete({nombre, volver}: PresentacionPaqueteProps) {
  return (
    <section aria-labelledby="paquete-titulo">
      <Link
        href="/catalogo"
        className="text-sm text-brand-sky-text underline-offset-4 transition-colors duration-200 focus-visible:text-brand-ink focus-visible:underline fine-pointer:hover:text-brand-ink fine-pointer:hover:underline"
      >
        {volver}
      </Link>
      <h1 id="paquete-titulo" className="mt-6 text-4xl font-bold">
        {nombre}
      </h1>
    </section>
  );
}
