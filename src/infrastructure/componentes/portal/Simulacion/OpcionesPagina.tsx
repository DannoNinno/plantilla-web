import {opcionesSeleccion, opcionesSwitch} from '@/infrastructure/handlers/simulacion';
import type {ConfigSimulacion, PaginaSimulacion} from '@/infrastructure/handlers/simulacion';

export default function OpcionesPagina({
  config,
  opcion,
  plan,
}: {
  config: ConfigSimulacion;
  opcion: (key: keyof PaginaSimulacion, valor: unknown) => void;
  plan: (valor: string) => void;
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
      <label className="block text-sm">
        Plan
        <select value={config.plan} onChange={(e) => plan(e.target.value)} className={clase}>
          <option value="presencia-digital">Presencia Digital</option>
          <option value="captacion-clientes">Captación de Clientes</option>
        </select>
      </label>
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
        <label className="flex min-h-12 cursor-pointer items-center gap-3 text-sm">
          <input
            type="checkbox"
            role="switch"
            checked={config.pagina.menuMovil === 'drawer'}
            onChange={(e) => opcion('menuMovil', e.target.checked ? 'drawer' : 'hamburguesa')}
            className="h-5 w-5 shrink-0 accent-brand-sky"
          />
          Menú móvil tipo drawer
        </label>
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
      <p className="text-xs text-brand-light/80">
        La navegación y el pie siempre son oscuros, con el logo a la izquierda. La muestra usa todo
        el ancho disponible. La transparencia solo aplica al navbar sobre PORTADA en vista landing.
        Nada se guarda en la base de datos.
      </p>
    </section>
  );
}
