'use client';

import type {ContactoProps} from '../../../domain/types/ui';

export default function Contacto({
  resumen,
  mensajeEtiqueta = 'Cuéntame sobre tu negocio',
}: ContactoProps) {
  return (
    <form onSubmit={(event) => event.preventDefault()} className="mt-6 max-w-2xl space-y-5">
      {resumen && <p className="whitespace-pre-line rounded-xl bg-white p-4 text-sm">{resumen}</p>}
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block text-sm">
          Tu nombre
          <input
            name="nombre"
            autoComplete="name"
            required
            maxLength={100}
            className="mt-2 w-full rounded-xl border border-brand-ink/20 bg-white px-4 py-3 text-brand-ink"
          />
        </label>
        <label className="block text-sm">
          Tu correo
          <input
            name="correo"
            type="email"
            autoComplete="email"
            required
            maxLength={254}
            className="mt-2 w-full rounded-xl border border-brand-ink/20 bg-white px-4 py-3 text-brand-ink"
          />
        </label>
      </div>
      <label className="block text-sm">
        {mensajeEtiqueta}
        <textarea
          name="mensaje"
          required
          minLength={10}
          maxLength={3000}
          rows={5}
          className="mt-2 w-full rounded-xl border border-brand-ink/20 bg-white px-4 py-3 text-brand-ink"
        />
      </label>
      <button
        type="submit"
        disabled
        className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-brand-coral px-5 py-3 text-sm font-semibold text-brand-ink transition-colors disabled:cursor-not-allowed"
      >
        Enviar consulta
      </button>
    </form>
  );
}
