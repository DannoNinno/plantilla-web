'use client';

import {useId, useState} from 'react';
import type {ConfiguracionConsulta} from '../../../../domain/types/consulta';
import AvisoConsulta from './AvisoConsulta';

export default function ConsentimientoConsulta({
  config,
  error,
  disabled,
}: {
  config: ConfiguracionConsulta;
  error?: string;
  disabled: boolean;
}) {
  const id = useId();
  const [abierto, setAbierto] = useState(false);
  return (
    <div className="space-y-3">
      <label className="flex items-start gap-3 text-sm leading-relaxed">
        <input
          type="checkbox"
          name="consentimiento"
          required
          disabled={disabled}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : undefined}
          className="mt-1 h-5 w-5 shrink-0"
        />
        <span>
          He leído y acepto que {config.negocio} use mis datos de contacto solo para responder esta
          consulta y que los elimine en un plazo máximo de {config.mesesConservacion} meses si no
          avanzamos. Declaro que los datos que entrego son míos o que tengo autorización para
          compartirlos.
        </span>
      </label>
      {error && (
        <p id={`${id}-error`} className="text-sm text-brand-coral-dark">
          {error}
        </p>
      )}
      <button
        type="button"
        aria-expanded={abierto}
        aria-controls={`${id}-aviso`}
        onClick={() => setAbierto(!abierto)}
        className="min-h-12 rounded px-2 text-sm underline"
      >
        {abierto ? 'Ver menos' : 'Ver más'}
      </button>
      <div
        id={`${id}-aviso`}
        hidden={!abierto}
        className="rounded-xl border border-brand-ink/20 p-5"
      >
        <AvisoConsulta config={config} />
      </div>
    </div>
  );
}
