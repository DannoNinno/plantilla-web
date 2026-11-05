import {opcionesSeleccion, opcionesSwitch} from '@/infrastructure/handlers/simulacion';
import type {ConfigSimulacion, PaginaSimulacion} from '@/infrastructure/handlers/simulacion';

export default function OpcionesPagina({
  config,
  opcion,
}: {
  config: ConfigSimulacion;
  opcion: (key: keyof PaginaSimulacion, valor: unknown) => void;
}) {
  const clase =
    'mt-2 min-h-12 w-full border border-brand-sky/50 bg-brand-ink px-3 text-brand-light focus-visible:outline-brand-sky';
  return (
    <section
      className="space-y-5 border-t border-brand-sky/30 pt-6"
      aria-labelledby="opciones-titulo"
    >
      <h2 id="opciones-titulo" className="text-xl font-bold">
        Opciones de página
      </h2>
      <div className="grid gap-4 sm:grid-cols-2">
        {opcionesSeleccion.map(({key, nombre, valores}) => (
          <label key={key} className="block text-sm">
            {nombre}
            <select
              value={config.pagina[key]}
              onChange={(e) => opcion(key, e.target.value)}
              className={clase}
            >
              {valores.map((valor) => (
                <option key={valor} value={valor}>
                  {valor.replaceAll('-', ' ')}
                </option>
              ))}
            </select>
          </label>
        ))}
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {opcionesSwitch.map(({key, nombre}) => (
          <label key={key} className="flex min-h-12 cursor-pointer items-center gap-3 text-sm">
            <input
              type="checkbox"
              role="switch"
              checked={config.pagina[key]}
              onChange={(e) => opcion(key, e.target.checked)}
              className="h-5 w-5 shrink-0 accent-brand-sky"
            />
            {nombre}
          </label>
        ))}
      </div>
    </section>
  );
}
