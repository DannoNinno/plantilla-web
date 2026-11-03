import {LoaderCircle} from 'lucide-react';

export default function CargandoVista() {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex min-h-64 items-center justify-center gap-3 bg-brand-ink p-8 text-brand-light"
    >
      <LoaderCircle
        aria-hidden="true"
        size={26}
        className="animate-spin text-brand-sky motion-reduce:animate-none"
      />
      <span>Cargando vista…</span>
    </div>
  );
}
