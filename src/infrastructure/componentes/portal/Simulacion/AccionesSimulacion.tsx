import Link from 'next/link';
import {Play} from 'lucide-react';
import {urlSimulacion} from '@/infrastructure/handlers/simulacion';
import type {ConfigSimulacion} from '@/infrastructure/handlers/simulacion';
import {clasesBoton} from '../../boveda/Base/Boton/estilos';

export default function AccionesSimulacion({config}: {config: ConfigSimulacion}) {
  return (
    <div className="flex flex-wrap items-center gap-4 border-t border-brand-sky/30 pt-6">
      <Link
        href={urlSimulacion(config, true)}
        replace
        className={clasesBoton('sky', '!rounded-none')}
      >
        <Play size={18} aria-hidden="true" /> Simular
      </Link>
      <p className="text-sm text-brand-light/80">
        La simulación se abre en esta pestaña y conserva la configuración completa. Muestra los
        componentes reales con contenido de ejemplo.
      </p>
    </div>
  );
}
