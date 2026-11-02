import {useId} from 'react';

export interface CampoConsultaProps {
  nombre: string;
  etiqueta: string;
  tipo?: 'text' | 'tel' | 'email' | 'select' | 'textarea';
  requerido?: boolean;
  disabled: boolean;
  error?: string;
  opciones?: readonly {id: string; nombre: string}[];
  valorInicial?: string;
  onTexto?: (valor: string) => void;
}

export default function CampoConsulta({
  nombre,
  etiqueta,
  tipo = 'text',
  requerido,
  disabled,
  error,
  opciones,
  valorInicial = '',
  onTexto,
}: CampoConsultaProps) {
  const id = useId();
  const props = {
    id,
    name: nombre,
    required: requerido,
    disabled,
    'aria-invalid': Boolean(error),
    'aria-describedby': error ? `${id}-error` : undefined,
    className:
      'mt-2 w-full rounded-xl border border-brand-ink/20 bg-white px-4 py-3 text-brand-ink',
  };
  return (
    <div className="text-sm">
      <label htmlFor={id}>{etiqueta}</label>
      {tipo === 'select' ? (
        <select {...props} defaultValue={valorInicial}>
          {opciones?.map((opcion) => (
            <option key={opcion.id} value={opcion.id}>
              {opcion.nombre}
            </option>
          ))}
        </select>
      ) : tipo === 'textarea' ? (
        <textarea
          {...props}
          rows={5}
          minLength={10}
          maxLength={10000}
          onChange={(evento) => onTexto?.(evento.target.value)}
        />
      ) : (
        <input
          {...props}
          type={tipo}
          maxLength={tipo === 'tel' ? 30 : tipo === 'email' ? 254 : 100}
          autoComplete={tipo === 'tel' ? 'tel' : tipo === 'email' ? 'email' : 'name'}
        />
      )}
      {error && (
        <p id={`${id}-error`} className="mt-1 text-brand-coral-dark">
          {error}
        </p>
      )}
    </div>
  );
}
