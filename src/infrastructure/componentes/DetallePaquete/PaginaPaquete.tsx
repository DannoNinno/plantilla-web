import type {Paquete} from '@/domain/types/paquete';
import type {CatalogoServicios} from '@/domain/types/catalogo';
import type {DefinicionComponente} from '@/domain/types/componentes';
import type {PlanDemo} from '@/demo/planes';
import DetallePaquete from './DetallePaquete';
import PresentacionPaquete from './PresentacionPaquete';
import EnlacesPaquete from './EnlacesPaquete';
import ConsultaPaquete from './ConsultaPaquete';
import ExploracionCatalogo from '../Catalogo/ExploracionCatalogo';

export interface PaginaPaqueteProps {
  paquete: Paquete;
  paquetes: Paquete[];
  componentes: DefinicionComponente[];
  nombreSitio: string;
  catalogo: CatalogoServicios;
  demo?: PlanDemo;
}

export default function PaginaPaquete({
  paquete,
  paquetes,
  componentes,
  nombreSitio,
  catalogo,
  demo,
}: PaginaPaqueteProps) {
  return (
    <div className="mx-auto max-w-6xl px-6 py-12 sm:py-20">
      <PresentacionPaquete paquete={paquete} volver={catalogo.textos.volver} />
      {demo && <ExploracionCatalogo textos={catalogo.exploracion} demo={demo} />}
      <DetallePaquete paquete={paquete} />
      <EnlacesPaquete textos={catalogo.textos} incluyeBase={paquete.id === 'portal'} />
      <ConsultaPaquete
        paquete={paquete}
        paquetes={paquetes}
        componentes={componentes}
        nombreSitio={nombreSitio}
        titulo={catalogo.textos.consulta}
      />
    </div>
  );
}
