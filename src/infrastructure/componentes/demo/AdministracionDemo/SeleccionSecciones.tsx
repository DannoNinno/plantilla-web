import type useAdministracion from './useAdministracion';
import type {TextosAdministracion} from '../../../../demo/administracion';
export interface SeleccionSeccionesProps {
  estado: ReturnType<typeof useAdministracion>;
  textos: TextosAdministracion;
  limite: number;
}
export default function SeleccionSecciones({estado, textos, limite}: SeleccionSeccionesProps) {
  return (
    <fieldset className="min-w-0 rounded-2xl border border-brand-ink/20 p-5">
      <legend className="px-2 text-xl font-bold">{textos.secciones}</legend>
      <p className="break-words font-semibold">
        {textos.seleccion
          .replace('{actual}', String(estado.seleccion.length))
          .replace('{limite}', String(limite))}
      </p>
      <p className="mt-2 break-words text-sm">{textos.fijas}</p>
      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {estado.disponibles.map((item) => (
          <label
            key={item.slug}
            className="flex min-h-12 items-center gap-3 rounded-xl bg-brand-light px-3 py-2"
          >
            <input
              type="checkbox"
              checked={estado.seleccion.includes(item.slug)}
              disabled={estado.fijas.includes(item.slug)}
              onChange={() => estado.alternar(item.slug)}
              className="h-5 w-5 shrink-0 accent-brand-sky-text focus-visible:outline focus-visible:outline-foco focus-visible:outline-offset-2 focus-visible:outline-brand-sky-text"
            />
            <span className="min-w-0 break-words text-sm font-semibold">{item.nombre}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
