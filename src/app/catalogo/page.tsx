import Link from 'next/link';
import {ArrowUpRight} from 'lucide-react';
import {getPaquetes} from '@/plataforma/datos/paquetes';

export const metadata = {title: 'Catálogo'};

export default function CatalogoPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-12 sm:py-20">
      <p className="etiqueta">Tu negocio, tu sitio</p>
      <h1 className="mt-4 max-w-3xl text-4xl font-bold sm:text-5xl">
        Elige el punto de partida. Hagámoslo tuyo.
      </h1>
      <p className="mt-6 max-w-2xl text-lg leading-relaxed text-brand-ink/70">
        Recibes tu sitio funcionando, en una instancia propia y sin servicios externos obligatorios.
        Puedes administrarlo sin depender de mí. La mantención se contrata solo si la necesitas.
      </p>
      <div className="mt-10 grid gap-6 md:grid-cols-2">
        {getPaquetes().map((paquete, index) => (
          <article key={paquete.id} className="tarjeta flex flex-col">
            <span className="etiqueta">0{index + 1} / Paquete</span>
            <h2 className="mt-5 text-3xl font-bold">{paquete.nombre}</h2>
            <p className="mt-3 text-lg">{paquete.resumen}</p>
            <p className="mt-4 flex-1 leading-relaxed text-brand-ink/70">{paquete.descripcion}</p>
            <p className="mt-6 border-t border-brand-ink/10 pt-5 text-sm">
              {paquete.administracion}
            </p>
            <Link href={`/catalogo/${paquete.id}`} className="boton mt-6 bg-brand-ink text-white">
              Explorar {paquete.nombre} <ArrowUpRight size={18} aria-hidden="true" />
            </Link>
          </article>
        ))}
      </div>
      <p className="mt-8 text-sm text-brand-ink/65">
        Cotizamos según lo que necesita tu negocio. No hay pagos ni compras en este sitio.
      </p>
    </div>
  );
}
