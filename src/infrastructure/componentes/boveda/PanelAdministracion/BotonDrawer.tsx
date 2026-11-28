import {Menu, X} from 'lucide-react';

export default function BotonDrawer({
  abierto,
  alternar,
  idPanel,
}: {
  abierto: boolean;
  alternar: () => void;
  idPanel: string;
}) {
  return (
    <button
      type="button"
      onClick={alternar}
      aria-expanded={abierto}
      aria-controls={idPanel}
      aria-label={abierto ? 'Cerrar navegación' : 'Abrir navegación'}
      className="grid h-10 w-10 shrink-0 place-items-center border border-brand-sky/60 text-brand-sky hover:bg-brand-sky/15 focus-visible:outline-brand-sky"
    >
      {abierto ? <X size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}
    </button>
  );
}
