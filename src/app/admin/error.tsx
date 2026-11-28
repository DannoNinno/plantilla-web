'use client';

import {useEffect} from 'react';

export default function ErrorAdmin({error, reset}: {error: Error; reset: () => void}) {
  useEffect(() => console.error('No se pudo cargar el panel de solicitudes.', error), [error]);
  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-bold">No se pudo cargar el panel</h1>
      <p role="alert">
        Revisa la configuración y las migraciones de D1 en los registros del servidor.
      </p>
      <button onClick={reset} className="underline">
        Intentar nuevamente
      </button>
    </section>
  );
}
