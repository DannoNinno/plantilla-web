import type {Paquete} from '@/domain/types/paquete';
import type {CatalogoServicios} from '@/domain/types/catalogo';
import type {ComponenteVitrina} from '@/domain/types/componentes';
import {seleccionarComponentes} from '../../../../domain/casos-de-uso/componentes/seleccion';
import BloqueComponentes from './BloqueComponentes';
import DetallePaquete from './DetallePaquete';
import PresentacionPaquete from './PresentacionPaquete';
import EnlacesPaquete from './EnlacesPaquete';
import ConsultaPaquete from './ConsultaPaquete';

export interface PaginaPaqueteProps {
  paquete: Paquete;
  paquetes: Paquete[];
  componentes: ComponenteVitrina[];
  catalogo: CatalogoServicios;
}

export default function PaginaPaquete({
  paquete,
  paquetes,
  componentes,
  catalogo,
}: PaginaPaqueteProps) {
  const {incluidos} = seleccionarComponentes(componentes, paquete.id, paquetes);
  return (
    <div className="mx-auto max-w-6xl px-6 py-12 sm:py-20">
      <PresentacionPaquete nombre={paquete.nombre} volver={catalogo.textos.volver} />
      <BloqueComponentes
        componentes={incluidos}
        vitrina={catalogo.vitrina}
        alcanceInicial={catalogo.textos.alcanceInicial}
      />
      <DetallePaquete paquete={paquete} />
      <EnlacesPaquete textos={catalogo.textos} incluyeBase={paquete.id === 'portal'} />
      <ConsultaPaquete paquete={paquete} paquetes={paquetes} titulo={catalogo.textos.consulta} />
    </div>
  );
}
