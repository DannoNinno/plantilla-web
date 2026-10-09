import {Eye, Settings2} from 'lucide-react';
export interface ControlVistaProps {
  administrador: boolean;
  texto: string;
  textoCorto: string;
  alternar: () => void;
}
export default function ControlVista({
  administrador,
  texto,
  textoCorto,
  alternar,
}: ControlVistaProps) {
  const Icono = administrador ? Eye : Settings2;
  return (
    <button
      type="button"
      aria-label={texto}
      title={texto}
      aria-pressed={administrador}
      aria-controls={administrador ? 'administracion-demo' : undefined}
      onClick={alternar}
      className="flex min-h-12 w-12 shrink-0 flex-col items-center justify-center gap-1 rounded-xl border border-brand-sky/30 bg-brand-sky/10 px-1 py-1 text-brand-light transition duration-150 focus-visible:outline focus-visible:outline-foco focus-visible:outline-offset-2 focus-visible:outline-brand-sky fine-pointer:hover:bg-brand-sky/20 motion-safe:fine-pointer:hover:scale-105 motion-safe:focus-visible:scale-105 motion-reduce:transform-none motion-reduce:transition-none sm:w-16"
    >
      <Icono size={20} aria-hidden="true" className="text-brand-sky" />
      <span className="max-w-full break-words text-center text-xs font-semibold">{textoCorto}</span>
    </button>
  );
}
