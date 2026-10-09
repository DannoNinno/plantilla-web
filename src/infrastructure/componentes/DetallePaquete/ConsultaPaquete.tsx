import type {Paquete} from '@/domain/types/paquete';
import type {DefinicionComponente} from '@/domain/types/componentes';
import Configurador from '../Configurador/Configurador';
import Contacto from '../Contacto/Contacto';
import EntradaScroll from '../EntradaScroll/EntradaScroll';

export interface ConsultaPaqueteProps {
  paquete: Paquete;
  paquetes: Paquete[];
  componentes: DefinicionComponente[];
  nombreSitio: string;
  titulo: string;
}

export default function ConsultaPaquete({
  paquete,
  paquetes,
  componentes,
  nombreSitio,
  titulo,
}: ConsultaPaqueteProps) {
  return componentes.length > 0 ? (
    <EntradaScroll aria-label={titulo}>
      <Configurador
        key={paquete.id}
        paquete={paquete}
        definiciones={componentes}
        paquetes={paquetes}
        nombreSitio={nombreSitio}
      />
    </EntradaScroll>
  ) : (
    <EntradaScroll id="consulta" className="mt-12 scroll-mt-28 border-t border-brand-ink/10 pt-8">
      <h2 className="text-2xl font-bold">{titulo}</h2>
      <Contacto key={paquete.id} paquetes={paquetes} paqueteInicial={paquete.id} />
    </EntradaScroll>
  );
}
