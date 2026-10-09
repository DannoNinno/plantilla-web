import MarcoSeccion from '../../base/MarcoSeccion/MarcoSeccion';
import TarjetaSede from './TarjetaSede';
import type {SedesProps} from './tipos';
export default function Sedes({
  sedes = [],
  etiquetaDireccion,
  etiquetaHorarios,
  ...cabecera
}: SedesProps) {
  return (
    <MarcoSeccion {...cabecera} tono="suave">
      <ul className="grid gap-6 md:grid-cols-2">
        {sedes.map((sede) => (
          <TarjetaSede
            key={sede.id}
            sede={sede}
            etiquetaDireccion={etiquetaDireccion}
            etiquetaHorarios={etiquetaHorarios}
          />
        ))}
      </ul>
    </MarcoSeccion>
  );
}
