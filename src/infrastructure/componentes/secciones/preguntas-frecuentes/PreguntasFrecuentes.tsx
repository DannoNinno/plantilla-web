import MarcoSeccion from '../../base/MarcoSeccion/MarcoSeccion';
import PreguntaFrecuente from './PreguntaFrecuente';
import type {PreguntasFrecuentesProps} from './tipos';

export default function PreguntasFrecuentes({
  elementos = [],
  ...cabecera
}: PreguntasFrecuentesProps) {
  return (
    <MarcoSeccion {...cabecera}>
      <ul className="max-w-3xl space-y-4">
        {elementos.map((pregunta) => (
          <PreguntaFrecuente key={pregunta.id} {...pregunta} />
        ))}
      </ul>
    </MarcoSeccion>
  );
}
