import MarcoSeccion from '../../base/MarcoSeccion/MarcoSeccion';
import ImagenGaleria from './ImagenGaleria';
import type {GaleriaProps} from './tipos';

export default function Galeria({imagenes = [], ...cabecera}: GaleriaProps) {
  return (
    <MarcoSeccion {...cabecera} tono="suave">
      <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {imagenes.map((imagen) => (
          <ImagenGaleria key={imagen.id} {...imagen} />
        ))}
      </ul>
    </MarcoSeccion>
  );
}
