import MarcoSeccion from '../../base/MarcoSeccion/MarcoSeccion';
import TarjetaPersona from './TarjetaPersona';
import type {EquipoProps} from './tipos';
export default function Equipo({personas = [], ...cabecera}: EquipoProps) {
  return (
    <MarcoSeccion {...cabecera} tono="suave">
      <ul className="grid gap-6 md:grid-cols-3">
        {personas.map((persona) => (
          <TarjetaPersona key={persona.id} {...persona} />
        ))}
      </ul>
    </MarcoSeccion>
  );
}
