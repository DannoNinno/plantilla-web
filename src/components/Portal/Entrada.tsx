import Link from 'next/link';
import {ArrowDown, ArrowUpRight} from 'lucide-react';
import {sitio} from '@/configuracion/sitio';

export default function Entrada() {
  return (
    <>
      <section className="intro relative flex min-h-[75svh] items-center bg-brand-ink text-white">
        <div className="relative mx-auto w-full max-w-6xl px-6 py-16 sm:py-24">
          <p className="intro-line mb-6 text-sm font-medium uppercase tracking-[0.2em] text-brand-sky">
            {sitio.persona} / {sitio.nombre}
          </p>
          <h1 className="intro-line max-w-4xl text-4xl font-bold leading-tight sm:text-6xl lg:text-7xl">
            Un sitio para tu negocio.
            <span className="block text-brand-sky">El control, en tus manos.</span>
          </h1>
          <p className="intro-line mt-6 max-w-xl text-lg leading-relaxed text-white/75">
            {sitio.descripcion} Te lo entrego funcionando. Tú lo administras y decides si necesitas
            mantención.
          </p>
          <a href="#entradas" className="boton mt-8 bg-brand-coral text-brand-ink">
            Explorar el sitio <ArrowDown size={18} aria-hidden="true" />
          </a>
          <a
            href="#entradas"
            className="absolute right-6 top-5 text-sm text-white/70 underline underline-offset-4"
          >
            Saltar presentación
          </a>
        </div>
      </section>
      <section id="entradas" className="scroll-mt-28">
        <div className="grid md:grid-cols-2">
          <Link href="/catalogo" className="puerta group bg-brand-light text-brand-ink">
            <span className="etiqueta">01 / Para tu negocio</span>
            <h2 className="mt-10 text-4xl font-bold sm:text-5xl">Catálogo</h2>
            <p className="mt-4 max-w-sm text-lg leading-relaxed">
              Conoce Landing y Portal. Explora lo que recibes y prepara tu cotización.
            </p>
            <span className="mt-10 flex items-center gap-3 font-semibold text-brand-sky-text">
              Conocer los paquetes <ArrowUpRight aria-hidden="true" />
            </span>
          </Link>
          <Link href="/perfil" className="puerta group bg-brand-ink text-white">
            <span className="etiqueta text-brand-sky">02 / Conoce a quien lo construye</span>
            <h2 className="mt-10 text-4xl font-bold sm:text-5xl">Perfil</h2>
            <p className="mt-4 max-w-sm text-lg leading-relaxed text-white/75">
              Soy {sitio.persona}. Este es el espacio para conocer mi trabajo y conversar.
            </p>
            <span className="mt-10 flex items-center gap-3 font-semibold text-brand-sky">
              Conocer a Daniel <ArrowUpRight aria-hidden="true" />
            </span>
          </Link>
        </div>
      </section>
    </>
  );
}
