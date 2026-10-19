import type {ElementoVitrina, TextosTarjetaComponente} from '../../../domain/types/componentes';
import TarjetaComponente from './TarjetaComponente';

interface GrillaComponentesProps {
  componentes: ElementoVitrina[];
  textos: TextosTarjetaComponente;
}

export default function GrillaComponentes({componentes, textos}: GrillaComponentesProps) {
  return (
    <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {componentes.map((elemento) => (
        <TarjetaComponente key={elemento.componente.id} {...elemento} textos={textos} />
      ))}
    </div>
  );
}
