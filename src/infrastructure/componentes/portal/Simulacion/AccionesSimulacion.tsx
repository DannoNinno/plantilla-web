import {ExternalLink} from 'lucide-react';
import {urlSimulacion} from '@/infrastructure/handlers/simulacion';
import type {ConfigSimulacion} from '@/infrastructure/handlers/simulacion';
import {clasesBoton} from '../../boveda/Base/Boton/estilos';

export default function AccionesSimulacion({config}: {config: ConfigSimulacion}) {
  return (
    <div className="flex flex-wrap items-center gap-4 border-t border-brand-sky/30 pt-6">
      <a
        href={urlSimulacion(config, true)}
        target="_blank"
        rel="noopener noreferrer"
        className={clasesBoton('sky', '!rounded-none')}
      >
        <ExternalLink size={18} aria-hidden="true" /> Simular{' '}
        <span className="sr-only">(pestaña nueva)</span>
      </a>
      <p className="text-sm text-brand-light/80">
        El enlace conserva la configuración completa. Solo se emulan cajas, no los componentes
        reales.
      </p>
    </div>
  );
}
