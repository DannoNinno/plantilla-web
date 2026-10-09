import MarcoSeccion from '../../base/MarcoSeccion/MarcoSeccion';
import TarjetaTestimonio from './TarjetaTestimonio';
import type {TestimoniosProps} from './tipos';

export default function Testimonios({elementos = [], ...cabecera}: TestimoniosProps) {
  return (
    <MarcoSeccion {...cabecera} tono="suave">
      <ul className="grid gap-6 md:grid-cols-3">
        {elementos.map((testimonio) => (
          <TarjetaTestimonio key={testimonio.id} {...testimonio} />
        ))}
      </ul>
    </MarcoSeccion>
  );
}
