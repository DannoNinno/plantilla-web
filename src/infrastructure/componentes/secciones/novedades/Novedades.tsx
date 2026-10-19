import MarcoSeccion from '../../base/MarcoSeccion/MarcoSeccion';
import TarjetaNovedad from './TarjetaNovedad';
import type {NovedadesProps} from './tipos';
export default function Novedades({elementos = [], ...cabecera}: NovedadesProps) {
  return (
    <MarcoSeccion {...cabecera} tono="suave">
      <ul className="grid gap-6 md:grid-cols-2">
        {elementos.map((item) => (
          <TarjetaNovedad key={item.id} {...item} />
        ))}
      </ul>
    </MarcoSeccion>
  );
}
