import type {FormularioCotizacionProps} from './tipos';
export interface SelectorServicioProps {
  campo: FormularioCotizacionProps['campos']['servicio'];
  id: string;
  avisoId: string;
  valor: string;
  error?: string;
  cambiar: (valor: string) => void;
}
export default function SelectorServicio({
  campo,
  id,
  avisoId,
  valor,
  error,
  cambiar,
}: SelectorServicioProps) {
  return (
    <div>
      <label htmlFor={id} className="block break-words font-semibold">
        {campo.etiqueta}
      </label>
      <select
        id={id}
        name="servicio"
        required
        value={valor}
        onChange={(evento) => cambiar(evento.target.value)}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${avisoId} ${id}-error` : avisoId}
        className="mt-2 block min-h-12 w-full min-w-0 rounded-xl border border-seccion-tinta/40 bg-white px-4 py-3 focus-visible:outline focus-visible:outline-foco focus-visible:outline-offset-4 focus-visible:outline-seccion-acento"
      >
        <option value="">{campo.placeholder}</option>
        {campo.opciones.map((opcion) => (
          <option key={opcion.id} value={opcion.id}>
            {opcion.texto}
          </option>
        ))}
      </select>
      {error && (
        <p id={`${id}-error`} className="mt-2 break-words font-semibold">
          {error}
        </p>
      )}
    </div>
  );
}
