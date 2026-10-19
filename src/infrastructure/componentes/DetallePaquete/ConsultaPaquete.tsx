import type {Paquete} from '@/domain/types/paquete';
import Contacto from '../Contacto/Contacto';
import EntradaScroll from '../EntradaScroll/EntradaScroll';

export interface ConsultaPaqueteProps {
  paquete: Paquete;
  paquetes: Paquete[];
  titulo: string;
}

export default function ConsultaPaquete({paquete, paquetes, titulo}: ConsultaPaqueteProps) {
  return (
    <EntradaScroll id="consulta" className="mt-12 scroll-mt-28 border-t border-brand-ink/10 pt-8">
      <h2 className="text-2xl font-bold">{titulo}</h2>
      <Contacto key={paquete.id} paquetes={paquetes} paqueteInicial={paquete.id} />
    </EntradaScroll>
  );
}
