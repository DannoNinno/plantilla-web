import type {ContactoProps} from '../../../../domain/types/ui';
import Contacto from './Contacto';
import PlazoRespuesta from './PlazoRespuesta';

export default function PaginaContacto(props: ContactoProps) {
  return (
    <div className="mx-auto max-w-2xl px-6 py-12 sm:py-20">
      <h1 className="text-4xl font-bold">Conversemos sobre tu proyecto</h1>
      <PlazoRespuesta className="mt-4 text-brand-ink/70" />
      <Contacto {...props} />
    </div>
  );
}
