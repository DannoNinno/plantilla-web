import MarcoSeccion from '../../base/MarcoSeccion/MarcoSeccion';
import TarjetaServicio from './TarjetaServicio';
import type {ServiciosProps} from './tipos';

export default function Servicios({elementos = [], ...cabecera}: ServiciosProps) {
  return (
    <MarcoSeccion {...cabecera} tono="suave">
      <ul className="grid gap-6 md:grid-cols-3">
        {elementos.map((servicio) => (
          <TarjetaServicio key={servicio.id} {...servicio} />
        ))}
      </ul>
    </MarcoSeccion>
  );
}
