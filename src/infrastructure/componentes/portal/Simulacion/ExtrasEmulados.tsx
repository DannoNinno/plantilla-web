import {ArrowUp, MessageCircle} from 'lucide-react';
import {volverArriba} from '@/infrastructure/handlers/simulacion';
import type {ConfigSimulacion} from '@/infrastructure/handlers/simulacion';

export default function ExtrasEmulados({config}: {config: ConfigSimulacion}) {
  return (
    <>
      {config.pagina.whatsapp !== 'ninguno' && (
        <span
          role="img"
          aria-label="WhatsApp (solo visual)"
          className={`fixed bottom-28 z-20 grid h-12 w-12 place-items-center rounded-full bg-canal-whatsapp text-brand-ink shadow-lg ${config.pagina.whatsapp === 'abajo-derecha' ? 'right-4' : 'left-4'}`}
        >
          <MessageCircle size={25} aria-hidden="true" />
        </span>
      )}
      {config.pagina.volverArriba && (
        <button
          type="button"
          aria-label="Volver arriba"
          onClick={() => volverArriba(config)}
          className={`fixed bottom-28 z-20 grid h-12 w-12 place-items-center border border-brand-sky bg-brand-ink text-brand-light shadow-lg focus-visible:outline-brand-coral ${config.pagina.whatsapp === 'abajo-derecha' ? 'left-4' : 'right-4'}`}
        >
          <ArrowUp size={22} aria-hidden="true" />
        </button>
      )}
    </>
  );
}
