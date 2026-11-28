import {
  anclaSeccion,
  getSeccionSimulacion,
  irASeccion,
  seccionesNavegables,
} from '@/infrastructure/handlers/simulacion';
import type {ConfigSimulacion} from '@/infrastructure/handlers/simulacion';

export default function EnlacesEmulados({
  config,
  activa,
  oscuro,
  cerrar,
  keys = config.secciones,
  vertical = false,
}: {
  config: ConfigSimulacion;
  activa: string;
  oscuro: boolean;
  cerrar?: () => void;
  keys?: string[];
  vertical?: boolean;
}) {
  const enlaces = seccionesNavegables(keys);
  if (enlaces.length === 0) return null;
  return (
    <nav
      aria-label="Secciones de la página"
      className={
        vertical
          ? 'flex min-w-0 flex-col gap-2'
          : 'flex min-w-0 flex-1 items-center justify-end gap-2'
      }
    >
      {enlaces.map((key) => {
        const nombre = getSeccionSimulacion(key)?.nombre ?? `Sección no encontrada: ${key}`;
        const seleccionada = config.pagina.seccionActiva && activa === key;
        return (
          <a
            key={key}
            href={`#${anclaSeccion(key)}`}
            title={nombre}
            aria-current={seleccionada ? 'location' : undefined}
            onClick={(evento) => {
              evento.preventDefault();
              irASeccion(key, config);
              cerrar?.();
            }}
            className={`min-w-0 px-3 py-3 text-sm font-semibold focus-visible:outline-brand-coral ${vertical ? 'block' : 'max-w-28 flex-1 truncate text-center'} ${
              seleccionada
                ? oscuro
                  ? 'bg-brand-sky text-brand-ink'
                  : 'bg-brand-ink text-brand-light'
                : oscuro
                  ? 'text-brand-light hover:bg-brand-sky/15'
                  : 'text-brand-ink hover:bg-brand-sky/20'
            }`}
          >
            {nombre}
          </a>
        );
      })}
    </nav>
  );
}
