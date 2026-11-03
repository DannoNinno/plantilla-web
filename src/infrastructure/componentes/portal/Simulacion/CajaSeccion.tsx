'use client';

import Image from 'next/image';
import {useMemo} from 'react';
import {
  anclaSeccion,
  getSeccionSimulacion,
  renderizarSeccionSimulacion,
} from '@/infrastructure/handlers/simulacion';

export default function CajaSeccion({keySeccion, landing}: {keySeccion: string; landing: boolean}) {
  const seccion = getSeccionSimulacion(keySeccion);
  const contenido = useMemo(() => renderizarSeccionSimulacion(keySeccion), [keySeccion]);
  return (
    <section
      id={anclaSeccion(keySeccion)}
      data-seccion={keySeccion}
      aria-label={seccion?.nombre ?? `Sección no encontrada: ${keySeccion}`}
      className={`relative isolate w-full scroll-mt-panel-header bg-brand-simulacion
      [&_.max-w-6xl]:!max-w-none [&_.bg-seccion-fondo]:!bg-brand-simulacion
      [&_[data-tono=suave]]:!bg-brand-simulacion-suave [&_.bg-seccion-suave]:!bg-brand-simulacion-suave
      [&_.bg-seccion-tinta]:!bg-brand-ink [&_.text-seccion-fondo]:!text-brand-light
      [&_.bg-seccion-acento]:!bg-brand-sky-text [&_.text-seccion-acento]:!text-brand-sky-text
      [&_[class*='text-seccion-tinta']]:!text-brand-ink [&_[class*='border-seccion-tinta']]:!border-brand-ink/20
      [&_.bg-white]:!bg-brand-light [&_img[alt=DannoTech]]:!w-28 [&_input]:placeholder:!text-brand-ink/60 [&_textarea]:placeholder:!text-brand-ink/60
      [&>section>div]:relative [&>section>div]:z-20 [&>nav>div]:relative [&>nav>div]:z-20
      ${landing ? 'min-h-dvh [&>section]:min-h-dvh' : ''}`}
    >
      {seccion ? (
        contenido
      ) : (
        <h2 className="p-8 text-xl font-bold" role="status">
          Sección no encontrada: {keySeccion}
        </h2>
      )}
      <div
        aria-hidden="true"
        data-testid="marca-agua"
        className="pointer-events-none absolute inset-0 z-10 grid select-none place-items-center overflow-hidden"
      >
        <Image
          src="/dannotech-kit/svg/dannotech-isotipo-fondo-claro.svg"
          alt=""
          width={102}
          height={88}
          className="h-auto w-56 opacity-20 blur-sm sm:w-80"
        />
      </div>
    </section>
  );
}
