import {getCatalogo, getPaquetes} from '@/infrastructure/handlers/datos';
import ComparacionPlanes from '@/infrastructure/componentes/Catalogo/ComparacionPlanes';

export const metadata = {title: 'Catálogo'};

export default function CatalogoPage() {
  const catalogo = getCatalogo();

  return (
    <div className="mx-auto max-w-6xl px-6 py-12 sm:py-20">
      <h1 className="text-4xl font-bold sm:text-5xl">{catalogo.comparacion.titulo}</h1>
      <ComparacionPlanes paquetes={getPaquetes()} textos={catalogo.comparacion} />
      <section
        id="adicionales"
        aria-labelledby="adicionales-titulo"
        className="mt-12 scroll-mt-28 rounded-2xl border border-brand-ink/10 bg-white p-6 sm:p-8"
      >
        <h2 id="adicionales-titulo" className="text-2xl font-bold">
          {catalogo.tituloAdicionales}
        </h2>
        <dl className="mt-6 grid gap-6 sm:grid-cols-2">
          {catalogo.adicionales.map((adicional) => (
            <div key={adicional.nombre} className="border-t border-brand-ink/10 pt-5">
              <dt className="font-semibold">{adicional.nombre}</dt>
              <dd className="mt-2 text-lg text-brand-sky-text">{adicional.costo}</dd>
            </div>
          ))}
        </dl>
      </section>
    </div>
  );
}
