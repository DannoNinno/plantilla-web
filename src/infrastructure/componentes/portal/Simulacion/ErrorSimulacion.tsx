import Link from 'next/link';
import {rutaSimulacion} from '@/infrastructure/handlers/simulacion';

export default function ErrorSimulacion({mensaje}: {mensaje: string}) {
  return (
    <section className="mx-auto max-w-xl space-y-5 border border-brand-coral bg-brand-ink p-6 text-brand-light">
      <h1 className="text-2xl font-bold">No pude cargar la simulación</h1>
      <p role="alert">{mensaje}</p>
      <Link href={rutaSimulacion} className="inline-block text-brand-sky underline">
        Volver al armador con una configuración nueva
      </Link>
    </section>
  );
}
